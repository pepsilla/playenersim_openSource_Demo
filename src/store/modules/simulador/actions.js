
import * as types from '../../types.js'
import axios from 'axios'

const retardo_aleatorio = Math.floor(Math.random() * 3000) + 50 // retardo aleatorio

export default {
    [types.SOLICITAR_EJECUCION_MANDO]: ({commit}) => {
       commit(types.ESTABLECER_SOLICITUD_MANDO, true)
      },
    [types.ENVIAR_MANDO]:({commit}, carga_util)=>{
        commit(types.ESTABLECER_MANDO_AUTORIZADO, false)
        commit(types.ESTABLECER_MANDO_ENVIADO, true)
        let retardo_ms = typeof carga_util === 'number' ? carga_util : retardo_aleatorio
        setTimeout(() => {
          commit(types.ESTABLECER_MANDO_ENVIADO, false)
          commit(types.ESTABLECER_MANDO_EJECUTADO, true)
        },retardo_ms)
      },
    [types.MANDO_EJECUTADO]:({commit},carga_util)=>{
        commit(types.FINALIZAR_MANDO, carga_util)
      },
    [types.SOLICITAR_CENTRAR_ESCENARIO]: ({commit}) => {
      commit(types.ESTABLECER_ESCENARIO_CENTRADO, true)
    },
    [types.CARGA_MODELO_DATOS]: ({commit}, carga_util) => {
      axios.get(carga_util).then((respuesta) => {
        commit(types.ESTABLECER_MODELO_DATOS, respuesta.data)
      })
    },
    [types.ACTUALIZAR_ELEMENTOS_CORTE]: ({commit},valor) => {
      commit(types.ESTABLECER_ELEMENTOS_CORTE, valor)
    },
    [types.CARGA_CONFIGURACION_SIMULADOR]: ({commit}) => {
      let url_carga = 'models/config.json'
      axios.get(url_carga).then((respuesta) => {
        commit(types.ESTABLECER_CONFIGURACION, respuesta.data)
      }).finally(()=>commit(types.SOLICITAR_CARGA_MODELO_VISUAL,true))
    },
    [types.CARGA_MODELO]: ({commit},indice) =>{
      commit(types.ESTABLECER_INDICE_MODELO, indice)
    }

}