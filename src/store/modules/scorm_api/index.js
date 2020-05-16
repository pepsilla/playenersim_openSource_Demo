import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
    state:{
        api_win: null,
        api_status: false,
        api_connected: false,
        user: {
            name: '',
            surname: '',
            id: ''
        },
        activity: {
            data: '',
            status:'',
            id: ''
        },
        pending_commits: false
    },
    getters,
    mutations,
    actions
}