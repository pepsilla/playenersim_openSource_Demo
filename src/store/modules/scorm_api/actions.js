
import * as types from '../../types.js'

const maxFindAPITries = 7
const MAX_TIME_OUT = 3000

const findAPI = new Promise ((resolve,reject,win) =>{
  if (win == null) {
    reject(null)
  }
  let findAPITries = 0
  while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
    findAPITries++
    if (findAPITries > maxFindAPITries) {
      reject(null)
    }
    win = win.parent;
  }
  resolve(win.API)
  setTimeout(()=>{
    reject(null)
  },MAX_TIME_OUT)
})

export default {
  [types.BUSCAR_API_SCORM]: ({commit}, win) => {
      findAPI(win)
        .then(api =>{
          commit('types.ESTABLECER_API_ESTADO', api)
        })
        .catch(error =>{
          // Se produce un error
          console.log('Error busqueda api scorm', error)
        })
        .finally(()=>{
          console.log('Fin buscar Api')
        })
  }
}