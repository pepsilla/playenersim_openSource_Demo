import * as types from '../../types'
export default {
    [types.ESTABLECER_ENTRADA_ESCENARIO]: (state,carga_util)=>{
        state.vigilar_movimientos = typeof carga_util === 'boolean' ? carga_util : false
      },
    [types.ESTABLECER_ELEMENTOS_CORTE]:(state, carga_util)=>{
      state.modelo_de_datos.elementos_corte = carga_util
    },
      [types.SELECCIONAR_ELEMENTO]: (state, elemento_id) => {
        state.seleccion_elemento = true
        state.elemento_seleccionado = elemento_id
      },
      [types.ESTABLECER_TIPO_MANDO]: (state, tipo_mando)=>{
        state.seleccion_mando = true
        state.tipo_mando = tipo_mando
      },
      [types.FINALIZAR_MANDO]: (state)=>{
        state.elemento_seleccionado = ''
        state.tipo_mando = 'none'
        state.seleccion_elemento = false
        state.seleccion_mando = false
        state.solicitud_de_mando = false
        state.mando_autorizado = false
        state.mando_en_proceso = false
        state.mando_ejecutado = false
        state.mando_no_ejecutado = false
      },
      [types.ESTABLECER_MANDO_AUTORIZADO]: (state, valor)=>{
        state.mando_autorizado = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_SOLICITUD_MANDO]: (state, valor)=>{
        state.solicitud_de_mando = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_MANDO_ENVIADO]: (state, valor)=>{
        state.mando_en_proceso = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_MANDO_EJECUTADO]: (state, valor)=>{
        state.mando_ejecutado = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_ESCENARIO_CENTRADO]: (state, valor)=>{
        state.centrar_escenario = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_MODELO_DATOS_CARGADO]: (state, valor)=>{
        state.cargar_modelo = typeof valor === 'boolean' ? valor : false
      },
      [types.ESTABLECER_MODELO_DATOS]: (state, valor)=>{
        state.modelo_de_datos =  typeof valor==='object' ? valor: {}
        state.modelo_de_datos_cargado = true
        state.solicitud_carga_modelo_visual = false
      },
      [types.ESTABLECER_ESTADO_ELEMENTO_CORTE]: (state, valor) => {
        if(typeof valor === 'object'){
          let elemento = state.modelo_de_datos.elementos_corte.find(element => element.id === valor.id)
          elemento.estado = valor.estado
        }
      },
      [types.ESTABLECER_CONFIGURACION]: (state, valor) =>{
        state.config = valor,
        state.indice_modelo = 0,
        state.solicitud_carga_modelo_visual = true
      },
      [types.ESTABLECER_INDICE_MODELO]: (state, valor) => {
        if(state.indice_modelo === valor) return
        state.indice_modelo = valor
        state.modelo_de_datos_cargado = false
        state.solicitud_carga_modelo_visual = true
      },
      [types.SOLICITAR_CARGA_MODELO_VISUAL]:(state,valor) =>{
        state.solicitud_carga_modelo_visual = valor
      }
}