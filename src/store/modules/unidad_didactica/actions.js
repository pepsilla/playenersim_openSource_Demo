import * as types from '../../types'
export default {
    [types.INSERTAR_EVENTO_EN_REGISTRO]: ({commit}, carga_util) => {
        let registro = typeof carga_util === 'string' ? carga_util:'actividad no identificada'
       commit(types.INSERTAR_ACTIVIDAD, registro)
    }
}