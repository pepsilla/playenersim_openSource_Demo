import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const url_modelo_de_datos = 'models/data/dataModel.json'
const retardo_aleatorio = Math.floor(Math.random() * 3000) + 50 // retardo aleatorio

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    simulador: {
      seleccion_elemento: false,
      seleccion_mando: false,
      elemento_seleccionado:'',
      tipo_mando: 'none',
      solicitud_de_mando: false,
      mando_autorizado: false,
      mando_en_proceso: false,
      mando_ejecutado: false,
      mando_no_ejecutado: false,
      centrar_escenario: false,
      escenario_centrado: false,
      vigilar_movimientos: false
    },
    enersimRT: {
      modelo_de_datos: {},
      modelo_de_datos_cargado: false
    },
    loger: {
      actividad:[]
    }
  },
  getters: {
    seleccion_elemento: state => {return state.simulador.seleccion_elemento},
    seleccion_mando: state => {return state.simulador.seleccion_mando},
    elemento_seleccionado: state => {return state.simulador.elemento_seleccionado},
    tipo_mando: state => {return state.simulador.tipo_mando},
    mando_autorizado: state => {return state.simulador.mando_autorizado},
    mando_en_proceso: state => {return state.simulador.mando_en_proceso},
    solicitud_de_mando: state => {return state.simulador.solicitud_de_mando},
    mando_ejecutado: state => {return state.simulador.mando_ejecutado},
    proceso_mando: state =>{ return (
      state.simulador.solicitud_de_mando ||
      state.simulador.mando_autorizado ||
      state.simulador.mando_en_proceso ||
      state.simulador.mando_ejecutado
    )},
    escenario_centrado: state => { return state.simulador.centrar_escenario },
    modelo_de_datos_cargado: state => { return state.enersimRT.modelo_de_datos_cargado },
    raton_en_escenario: state => {return state.simulador.vigilar_movimientos}
  },
  mutations: {
    vigilar_movimientos(state,carga_util){
      state.simulador.vigilar_movimientos = typeof carga_util === 'boolean' ? carga_util : false
    },
    selecciona_elemento(state, elemento_id){
      state.simulador.seleccion_elemento = true
      state.simulador.elemento_seleccionado = elemento_id
    },
    establecer_mando(state, tipo_mando){
      state.simulador.seleccion_mando = true
      state.simulador.tipo_mando = tipo_mando
    },
    anular_mando(state){
      state.simulador.elemento_seleccionado = ''
      state.simulador.tipo_mando = 'none'
      state.simulador.seleccion_elemento = false
      state.simulador.seleccion_mando = false
      state.simulador.solicitud_de_mando = false
      state.simulador.mando_autorizado = false
      state.simulador.mando_en_proceso = false
      state.simulador.mando_ejecutado = false
      state.simulador.mando_no_ejecutado = false
    },
    autorizar_mando(state, valor){
      state.simulador.mando_autorizado = typeof valor === 'boolean' ? valor : false
    },
    solicitar_mando(state, valor){
      state.simulador.solicitud_de_mando = typeof valor === 'boolean' ? valor : false
    },
    enviar_mando(state, valor){
      state.simulador.mando_en_proceso = typeof valor === 'boolean' ? valor : false
    },
    mando_ejecutado(state, valor){
      state.simulador.mando_ejecutado = typeof valor === 'boolean' ? valor : false
    },
    centrar_escenario(state, valor){
      state.simulador.centrar_escenario = typeof valor === 'boolean' ? valor : false
    },
    cargar_modelo_de_datos(state, valor){
      state.simulador.cargar_modelo = typeof valor === 'boolean' ? valor : false
    },
    establecer_modelo_de_datos(state, valor){
      state.enersimRT.modelo_de_datos =  typeof valor==='object' ? valor: {}
      state.enersimRT.modelo_de_datos_cargado = true
    },
    entrada_log(state, valor){
      state.loger.actividad.push(valor)
    }

  },
  actions: {
    solicitar_ejecucion_de_mando: (contexto, carga_util) => {
      contexto.commit('solicitar_mando', true)
      let retardo_ms = typeof carga_util === 'number' ? carga_util : retardo_aleatorio
      setTimeout(() => {
        contexto.commit('solicitar_mando', false)
        contexto.commit('autorizar_mando', true)
        contexto.dispatch('enviar_mando', retardo_ms)
      },retardo_ms)
    },
    enviar_mando(contexto, carga_util){
      contexto.commit('autorizar_mando', false)
      contexto.commit('enviar_mando', true)
      let retardo_ms = typeof carga_util === 'number' ? carga_util : retardo_aleatorio
      setTimeout(() => {
        contexto.dispatch('mando_ejecutado', retardo_ms)
      },retardo_ms)
    },
    mando_ejecutado(contexto,carga_util){
      contexto.commit('enviar_mando', false)
      contexto.commit('mando_ejecutado', true)
      let retardo_ms = typeof carga_util === 'number' ? carga_util : retardo_aleatorio
      setTimeout(() => {
        contexto.commit('anular_mando')
      },retardo_ms)
    },
    solicitar_escenario_centrado: (contexto, carga_util) => {
      contexto.commit('centrar_escenario', true)
      let retardo_ms = typeof carga_util === 'number' ? carga_util : retardo_aleatorio
      setTimeout(() => {
        contexto.commit('centrar_escenario', false)
      },retardo_ms)
    },
    solicitar_carga_modelo_de_datos: (contexto, carga_util) => {
      let url_carga = typeof carga_util === 'string' ? carga_util:url_modelo_de_datos
      axios.get(url_carga).then((respuesta) => {
        contexto.commit('establecer_modelo_de_datos', respuesta.data)
      }).catch((error)=>{
        console.log('error en carga de datos', error)
      })
    },
    registro_en_log_de_actividad(contexto, carga_util) {
      let registro = typeof carga_util === 'string' ? carga_util:'actividad no identificada'
      contexto.commit('entrada_log', registro)
    }

  }
})
