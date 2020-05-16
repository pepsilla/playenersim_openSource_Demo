import * as types from '../../types'
export default {
  [types.ESTABLECER_API_ESTADO]: (state, win) => {
    state.api_win = win
    state.api_status = true
  },
  [types.ESTABLECER_API_CONECTADO]: (state, valor) => {
    state.api_connected = valor
  }
}