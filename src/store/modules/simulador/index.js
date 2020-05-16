import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
    state:{
        config:{
            info:{
                player:"110520201111"
            },
            models:[
                {
                    tittle:"Circuito demo Open Source -LIBRE-",
                    label:"Demo",
                    visual:"models/visualModel.svg",
                    data:"models/dataModel.json"
                }
            ],
            groups:[
                {
                    label:"S/E",
                    key: "_esquemaSE",
                    enabled: true
                },
                {
                    label: "L.A.C.",
                    key: "_esquemaLAC",
                    enabled: true
                }
            ],
            "user":"demo",
            "local": true
        },
        indice_modelo: 0,
        solicitud_carga_modelo_visual: false,
        modelo_de_datos_cargado: false,
        modelo_de_datos: {},
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
    getters,
    mutations,
    actions
}