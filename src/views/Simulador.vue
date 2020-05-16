<template>
  <div class="text-center fill-height" style="background-color: black;" @mousemove="testxy">
    <seleccion-mando id="entrada_mando_usuario" @arrastrando="arrastre_marco_seleccion"></seleccion-mando>
    <modelo-visual 
      @mando="procesar_peticion_mando" 
      @mando_ejecutado="procesar_mando_ejecutado">
    </modelo-visual>
  </div>
</template>

<script>
import ModeloVisual from "./ModeloVisual";
import SeleccionMando from "../components/seleccion_mando";

import * as types from "../store/types";

import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "Simulador",
  components: {
    ModeloVisual,
    SeleccionMando
  },
  watch: {
    datos_listos(value) {
      if (value) {
        let modelo_configurado = this.objetos_modelo;
        modelo_configurado.elementos_corte.forEach(elemento_corte => {
          let enEscenario = document.getElementById(elemento_corte.id);
          if (enEscenario) {
            let referencia = enEscenario.href;
            if (referencia) {
              let estado = referencia.baseVal.lastIndexOf("_");
              elemento_corte.estado = referencia.baseVal.substr(estado + 1);
            }
          }
        });
        this.modelo_datos_runtime = modelo_configurado;
      }
    },
    solicitud_mando(value) {
      if (value) {
        this.autoriza_maniobra(true);
      }
    }
  },
  computed: {
    ...mapGetters({
      datos_listos: types.OBTENER_MODELO_DATOS_CARGADO,
      objetos_modelo: types.OBTENER_MODELO_DATOS,
      solicitud_mando: types.OBTENER_MANDO_SOLICITADO,
      elemento_mando: types.OBTENER_ELEMENTO_SELECCIONADO,
      mando_tipo: types.OBTENER_TIPO_MANDO
    }),
    esquema() {
      if (this.elemento_seleccionado) {
        let esquema = this.elemento_seleccionado.substr(
          8,
          this.elemento_seleccionado.indexOf(":") - 8
        );
        return esquema;
      }
      return "";
    },
    mando() {
      if (this.elemento_seleccionado) {
        let indice_inicial = this.elemento_seleccionado.indexOf(":");
        let indice_final = this.elemento_seleccionado.indexOf("_c");
        let mando = this.elemento_seleccionado.substr(
          indice_inicial + 2,
          indice_final - indice_inicial - 2
        );
        mando = mando.charAt(0).toUpperCase() + mando.substr(1);
        return mando;
      }
      return "";
    }
  },
  data() {
    return {
      arrastre_en_marco_seleccion: false,
      posicion_x_marco_seleccion: 0,
      posicion_y_marco_seleccion: 0,
      modelo_datos_runtime: null,
      elementos_corte: [],
      elementos_conductor: [],
      mostrar: false
    };
  },
  methods: {
    ...mapMutations({
      //establecer_mando: types.ESTABLECER_TIPO_MANDO,
      selecciona_elemento: types.SELECCIONAR_ELEMENTO,
      autoriza_maniobra: types.ESTABLECER_MANDO_AUTORIZADO
      //anular_mando: types.FINALIZAR_MANDO
    }),
    ...mapActions({
      finalizar_mando: types.MANDO_EJECUTADO,
      actualiza_elementos_corte: types.ACTUALIZAR_ELEMENTOS_CORTE
    }),
    procesar_mando_ejecutado(mando_ejecutado) {
      // Reseteamos conductores a no tensión
      let indice = this.modelo_datos_runtime.elementos_corte.findIndex(
        elemento => elemento.id === mando_ejecutado.elemento
      );
      if (indice !== -1) {
        this.modelo_datos_runtime.elementos_corte[indice].estado =
          mando_ejecutado.mando === "abrir" ? "open" : "closed";
        
        // Vaciar elementos corte
        while (this.elementos_corte.length > 0) this.elementos_corte.pop();
          //Llenarlo con el modelo de datos en tiempo real.
          this.modelo_datos_runtime.elementos_corte.forEach(elecorte => {
          this.elementos_corte.push(elecorte);
        });
        // Establecer el modelo rt del conductor y sus elementos de corte asociados.
        this.elementos_conductor = this.modelo_datos_runtime.elementos_conductor.map(
          conductor => {
            return {
              id: conductor.id,
              tipo: conductor.tipo,
              calse_tension: "",
              conexiones: []
            };
          }
        );
        this.elementos_conductor.forEach(conductor => {
          conductor.conexiones = this.busca_elementos_corte_asociados(
            conductor.id
          );
        });
      }
      // -----------------------------------------------------------
       
      this.resetear_tensiones();
      // Partiendo del conductor conectado a la fuente,
      // obtiene el resto de conductores conectados a través,
      // de los elementos de corte.
      this.modelo_datos_runtime.fuentes_tension.forEach(fuente => {
        let conductor = fuente.conecta;
        let conductores_asociados = [];
        let elemento_conductor = this.elementos_conductor.find(
          elemento => elemento.id === conductor
        );
        if (elemento_conductor) {
          conductores_asociados.push(elemento_conductor.id);
          this.analiza_asociaciones(elemento_conductor.id, conductores_asociados);
        }
        this.energizar_asociados(conductores_asociados, fuente.tension);
      });

      // Una vez recorridas todas las fuentes i energizados todos los conductores.
      // Iniciamos otra ronda a través de fuentes transferidas:
      // Implican una transformación en la fuente de tensión presente en un conductor
      // energizado desde su fuente a su correspondiente transformada en otro conductor
      // Puede ser reversible o no.
      this.modelo_datos_runtime.fuentes_portico.forEach(fuente => {
        let origen = this.elementos_conductor.find(
          conductor => conductor.id === fuente.entrada.conecta
        );
        if (origen !== undefined) {
          let clase = document.getElementById(origen.id).classList[0];
          if (clase === fuente.entrada.tension) {
            let conductores_asociados = [];
            conductores_asociados.push(fuente.salida.conecta);
            this.analiza_asociaciones(
              fuente.salida.conecta,
              conductores_asociados
            );
            this.energizar_asociados(
              conductores_asociados,
              fuente.salida.tension
            );
          }
        }
      });

      this.modelo_datos_runtime.fuentes_transferidas.forEach(fuente => {
        let origen = this.elementos_conductor.find(
          conductor => conductor.id === fuente.entrada.conecta
        );
        if (origen !== undefined) {
          let clase = document.getElementById(origen.id).classList[0];
          if (clase === fuente.entrada.tension) {
            let conductores_asociados = [];
            conductores_asociados.push(fuente.salida.conecta);
            this.analiza_asociaciones(
              fuente.salida.conecta,
              conductores_asociados
            );
            this.energizar_asociados(
              conductores_asociados,
              fuente.salida.tension
            );
          }
        }
      });

      //Ahora toca revisar las transferidas reversibles:
  
      let reversibles = this.modelo_datos_runtime.fuentes_transferidas.filter(fuente=>fuente.reversible).reverse()
      reversibles.forEach(fuente => {
        let origen = this.elementos_conductor.find(
          conductor => conductor.id === fuente.salida.conecta
        );
        if (origen !== undefined) {
          let clase = document.getElementById(origen.id).classList[0];
          if (clase === fuente.salida.tension) {
            let conductores_asociados = [];
            conductores_asociados.push(fuente.entrada.conecta);
            this.analiza_asociaciones(
              fuente.entrada.conecta,
              conductores_asociados
            );
            this.energizar_asociados(
              conductores_asociados,
              fuente.entrada.tension
            );
          }
        }
      });

      this.modelo_datos_runtime.fuentes_transferidas.forEach(fuente => {
        let origen = this.elementos_conductor.find(
          conductor => conductor.id === fuente.entrada.conecta
        );
        if (origen !== undefined) {
          let clase = document.getElementById(origen.id).classList[0];
          if (clase === fuente.entrada.tension) {
            let conductores_asociados = [];
            conductores_asociados.push(fuente.salida.conecta);
            this.analiza_asociaciones(
              fuente.salida.conecta,
              conductores_asociados
            );
            this.energizar_asociados(
              conductores_asociados,
              fuente.salida.tension
            );
          }
        }
      });

      reversibles.forEach(fuente => {
        let origen = this.elementos_conductor.find(
          conductor => conductor.id === fuente.salida.conecta
        );
        if (origen !== undefined) {
          let clase = document.getElementById(origen.id).classList[0];
          if (clase === fuente.salida.tension) {
            let conductores_asociados = [];
            conductores_asociados.push(fuente.entrada.conecta);
            this.analiza_asociaciones(
              fuente.entrada.conecta,
              conductores_asociados
            );
            this.energizar_asociados(
              conductores_asociados,
              fuente.entrada.tension
            );
          }
        }
      });
      // Hasta la próxima =8-)
      this.finalizar_mando();
    },
    analiza_asociaciones(conexion, conexiones_asociadas) {
      let elemento_conductor = this.elementos_conductor.find(
        elemento => elemento.id === conexion
      );
      if (elemento_conductor) {
        elemento_conductor.conexiones.forEach(elecorte => {
          let elemento_corte = this.elementos_corte.find(
            elemento => elemento.id === elecorte
          );
          if (elemento_corte && elemento_corte.estado === "closed") {
            elemento_corte.conexiones.forEach(conector => {
              if (
                conexiones_asociadas.find(elemento => elemento === conector) ===
                undefined
              ) {
                conexiones_asociadas.push(conector);
                this.analiza_asociaciones(conector, conexiones_asociadas);
              }
            });
          }
        });
      }
    },
    busca_elementos_corte_asociados(conductor_id) {
      let busqueda = this.elementos_corte.filter(elecorte =>
        elecorte.conexiones.find(conexion => conexion === conductor_id)
      );
      return busqueda.map(elemento => {
        return elemento.id;
      });
    },
    resetear_tensiones() {
      this.modelo_datos_runtime.elementos_conductor.forEach(conductor => {
        let elemento = document.getElementById(conductor.id);
        if(elemento){
          elemento.classList.forEach(color => {
          elemento.classList.remove(color);
          });
          elemento.classList.add("conductor_no_tension");
        }
      });
    },
    energizar_asociados(conductores, clase) {
      conductores.forEach(conductor => {
        let elemento = document.getElementById(conductor);
        elemento.classList.forEach(color => {
          elemento.classList.remove(color);
        });
        elemento.classList.add(clase);
      });
    },
    procesar_peticion_mando(valor) {
      this.selecciona_elemento(valor);
    }
  }
};
</script>

<style></style>
