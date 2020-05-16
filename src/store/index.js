import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import simulador from './modules/simulador'
import unidad_didactica from './modules/unidad_didactica'
//import scorm_api from './modules/scorm_api'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    core_state:{
      run: false,
      stoped: true,
      alarm: {
        msg: 'Warning message',
        from: 'module_name',
        timeAt: null
      },
      error: {
        msg: 'Error_messaeg',
        from: 'module_name',
        timeAt: null
      }
    }
  },
  getters,
  mutations,
  actions,
  modules: {
    namespaced: true,
    simulador,
    unidad_didactica,
    //scorm_api
  }
})
