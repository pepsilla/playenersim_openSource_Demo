import * as types from '../../types'
export default {
  [types.OBTENER_MODELO_DATOS]: state => {return state.modelo_de_datos},
  [types.OBTENER_ELEMENTOS_CORTE]: state => {return state.modelo_de_datos.elementos_corte},
  [types.OBTENER_SELECCION_ELEMENTO]: state => {return state.seleccion_elemento},
  [types.OBTENER_MANDO_SELECCIONADO]: state => {return state.seleccion_mando},
  [types.OBTENER_ELEMENTO_SELECCIONADO]: state => {return state.elemento_seleccionado},
  [types.OBTENER_TIPO_MANDO]: state => {return state.tipo_mando},
  [types.OBTENER_AUTORIZACION_MANDO]: state => {return state.mando_autorizado},
  [types.OBTENER_MANDO_ENVIADO]: state => {return state.mando_en_proceso},
  [types.OBTENER_MANDO_SOLICITADO]: state => {return state.solicitud_de_mando},
  [types.OBTENER_MANDO_EJECUTADO]: state => {return state.mando_ejecutado},
  [types.OBTENER_MANDO_EN_PROCESO]: state =>{ return (
      state.solicitud_de_mando ||
      state.mando_autorizado ||
      state.mando_en_proceso ||
      state.mando_ejecutado
    )},
  [types.OBTENER_ESCENARIO_CENTRADO]: state => { return state.centrar_escenario },
  [types.OBTENER_MODELO_DATOS_CARGADO]: state => { return state.modelo_de_datos_cargado },
  [types.OBTENER_ENTRADA_ESCENARIO]: state => {return state.vigilar_movimientos},
  [types.OBTENER_CONFIGURACION]: state => {return state.config},
  [types.OBTENER_PETICION_CARGA_MODELO_VISUAL]: state => {return state.solicitud_carga_modelo_visual},
  [types.OBTENER_INDICE_MODELO]: state => {return state.indice_modelo}
}