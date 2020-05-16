import * as types from '../../types'
export default { 
    [types.INSERTAR_ACTIVIDAD]: (state, valor) => {
        state.registro_actividad.push(valor)
      }
  
}