<template>
  <v-container
        id="esquemario"
        style="background-color: black;"
        v-html="visualModel"
        width="100%"
        height="50%"
        @click="tratar_eventos_raton"
        @touchstart="tratar_eventos_raton"
        @mouseenter="tratar_eventos_raton"
        @mouseleave="tratar_eventos_raton"
  >
  </v-container>
</template>
<script>
import axios from "axios";
import * as types from '../store/types' 
import {mapGetters, mapMutations} from 'vuex'


export default {
  name: "esquemario",
  data() {
    return {
      visualModel: "",
    };
  },
  computed: {
    ...mapGetters({
      raton_en_escenario:types.OBTENER_ENTRADA_ESCENARIO,
      cargar_escenario:types.OBTENER_PETICION_CARGA_MODELO_VISUAL,
      configuracion_simulador:types.OBTENER_CONFIGURACION,
      indice_modelo:types.OBTENER_INDICE_MODELO
    })
  },
  watch: {
    visualModel: function(value) {
      if (value !== "")
        setTimeout(() => {
          this.$emit("estado", 1); // La carga del escenario ha finalizado.
        }, 1000);
    },
    cargar_escenario: function(value) {
      if(value){
        this.carga_modelo_visual()
      }
    }
  },
  methods: {
    ...mapMutations({vigilar_movimientos: types.ESTABLECER_ENTRADA_ESCENARIO}),
    tratar_eventos_raton(evento) {
      switch (evento.type) {
        case "mouseenter":
          // permite eventos click de ratón
          this.vigilar_movimientos(true)
          break;
        case "mouseleave":
          // descarta posibles eventos click del ratón
          this.vigilar_movimientos(false)
          break;
        case "click":
          if (this.raton_en_escenario) {
            let elemento_simulador = this.es_elemento_simulador(
              evento.target.id
            );
            if (elemento_simulador) {
              this.$emit("seleccion", evento.target.id);
            } else {
              // Lo intentamos de nuevo con su elemento jerárquico superior
              elemento_simulador = this.es_elemento_simulador(
                evento.target.parentNode.id
              );
              if (elemento_simulador) {
                // Si está disponible delegamos
                this.$emit("seleccion", evento.target.parentNode.id);
              } else this.$emit("limpiar"); //  Si no limpiamos posibles seleccionees anteriores
            }
          }
          break;
        case "touchstart":
          // Permite la selección de elementos por eventos touch
          if (evento.touches.length === 1) {
            if (this.es_elemento_simulador(evento.target.id)) {
              this.$emit("seleccion", evento.target.id);
            }
          }
          break;
        default:
          return;
      }
    },
    es_elemento_simulador(idElemento) {
      if (!idElemento) return false;
      // Un elemento que tratará el simulador tiene que empezar por '_' y acabar por '_cx' donde x determina el tipo de energía.
      if(idElemento.indexOf("_") === 0 &&
        idElemento.lastIndexOf("_c") === idElemento.length - 3){
        //Para esta versión del player, solo necesitamos los elementos de corte.
        if(idElemento.substr(idElemento.indexOf(':')+1,1) === 'm') return true
      }
      return false
    },
    carga_modelo_visual(){
      let carga_escenario = new Promise((resolve, reject) => {
        axios
          .get(this.configuracion_simulador.models[this.indice_modelo].visual)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
      carga_escenario.then(modelo_visual => {
        this.visualModel = modelo_visual;
      });
    }
  }
};
</script>

