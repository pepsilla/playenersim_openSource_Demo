<template>
  <div>
    <esquemario
      @estado="acciones_segun_estado_carga_esquemario"
      @seleccion="acciones_segun_elemento_seleccionado"
    ></esquemario>
  </div>
</template>

<script>
import esquemario from "../components/esquemario";
import panzoom from "panzoom";
import { mapGetters, mapActions, mapMutations } from "vuex";
import * as types from "../store/types";

// Aplico espacio de nombres para creación de selectores en el escenario.
const SVG_NS = "http://www.w3.org/2000/svg";

export default {
  name: "ModeloVisual",
  components: {
    esquemario
  },
  watch: {
    mando_en_proceso() {
      this.resolver_maniobra();
    },
    seleccion_elemento(valor) {
      if (!valor) this.eliminar_seleccion_mando();
    },
    escenario_centrado(valor) {
      if (valor) {
        this.esquemario_panzoom.zoomAbs(0, 0, 1);
        this.esquemario_panzoom.moveTo(0, 0);
        this.centrado_ecenario(false);
      }
    }
  },
  computed: {
    ...mapGetters({
      seleccion_elemento: types.OBTENER_SELECCION_ELEMENTO,
      seleccion_mando: types.OBTENER_MANDO_SELECCIONADO,
      elemento_seleccionado: types.OBTENER_ELEMENTO_SELECCIONADO,
      tipo_mando: types.OBTENER_TIPO_MANDO,
      mando_en_proceso: types.OBTENER_MANDO_ENVIADO,
      mando_ejecutado: types.OBTENER_MANDO_EJECUTADO,
      escenario_centrado: types.OBTENER_ESCENARIO_CENTRADO,
      configuracion_simulador: types.OBTENER_CONFIGURACION,
      indice_modelo: types.OBTENER_INDICE_MODELO
    })
  },
  data() {
    return {
      esquemario_panzoom: null,
      selectores: [],
      objeto_mando_seleccionado: null
    };
  },
  methods: {
    ...mapMutations({
      anular_mando: types.FINALIZAR_MANDO,
      centrado_ecenario: types.ESTABLECER_ESCENARIO_CENTRADO
    }),
    ...mapActions({
      solicitar_carga_modelo_de_datos: types.CARGA_MODELO_DATOS,
      registro_en_log_de_actividad: types.INSERTAR_EVENTO_EN_REGISTRO
    }),
    acciones_segun_estado_carga_esquemario(estado) {
      if (estado === 1) {
        let zona_de_juegos = document.getElementById("esquemario");
        this.esquemario_panzoom = panzoom(zona_de_juegos, {
          minZoom: 1,
          maxZoom: 15
        });
        this.solicitar_carga_modelo_de_datos(this.configuracion_simulador.models[this.indice_modelo].data);
      }
    },
    acciones_segun_elemento_seleccionado(evento) {
      if (this.seleccion_mando === true) return;
      this.eliminar_seleccion_mando(evento);
      let selector = this.crear_selector(evento);
      if (selector) {
        this.$emit("mando", evento);
      }
    },
    crear_selector(objeto_id) {
      let objeto = document.getElementById(objeto_id);
      let pointerInEsquema = objeto_id.indexOf("_");
      if (pointerInEsquema === 0) {
        let pointerOutEsquema = objeto_id.indexOf(":");
        if (pointerOutEsquema > 7) {
          let id_esquema = objeto_id.substr(
            pointerInEsquema + 8,
            pointerOutEsquema - 8
          );
          let selector = document.createElementNS(SVG_NS, "rect");
          selector.setAttribute("id", `selector${this.selectores.length}_cs`);
          selector.setAttribute("x", `${objeto.getAttribute("x")}`);
          selector.setAttribute("y", `${objeto.getAttribute("y")}`);
          selector.setAttribute("width", 24);
          selector.setAttribute("height", 24);
          selector.setAttribute("fill", "#fff");
          selector.setAttribute("stroke", "#ff0");
          selector.setAttribute("fill-opacity", "0.8");
          selector.setAttribute("class", "selector_player");
          if (
            document
              .getElementById(`_esquema${id_esquema}`)
              .getAttribute("transform") !== null
          ) {
            selector.setAttribute(
              "transform",
              document
                .getElementById(`_esquema${id_esquema}`)
                .getAttribute("transform")
            );
          }

          let selectores = document.getElementById("_selectores");
          if (selectores) {
            selectores.appendChild(selector);
            let id_selector = `selector${this.selectores.length}_cs`;
            this.selectores.push(id_selector);
            return id_selector;
          }
        }
      }
      return "";
    },
    eliminar_seleccion_mando() {
      while (this.selectores.length) this.selectores.pop();
      let selectores = document.getElementById("_selectores");
      if (selectores.hasChildNodes()) {
        while (selectores.firstChild)
          selectores.removeChild(selectores.firstChild);
      }
    },
    resolver_maniobra() {
      if (this.mando_en_proceso) {
        this.indefinir_seleccion_mando();
      }
      if (this.mando_ejecutado) {
        switch (this.tipo_mando) {
          case "abrir":
            this.abrir_seleccion_mando();
            break;
          case "cerrar":
            this.cerrar_seleccion_mando();
            break;
        }
        // Para eliminar la selección del mando.
        this.eliminar_seleccion_mando();
        this.$emit("mando_ejecutado", {
          elemento: this.elemento_seleccionado,
          mando: this.tipo_mando
        });
      }
    },
    indefinir_seleccion_mando() {
      let elemento_corte = document.getElementById(this.elemento_seleccionado);
      if (elemento_corte) {
        let referencia = elemento_corte.href;
        if (referencia) {
          let estado = referencia.baseVal.lastIndexOf("_");
          referencia = elemento_corte.href.baseVal.substr(0, estado);
          referencia += "_undefined";
          elemento_corte.setAttribute("href", referencia);
        }
      }
    },
    abrir_seleccion_mando() {
      let elemento_corte = document.getElementById(this.elemento_seleccionado);
      if (elemento_corte) {
        let referencia = elemento_corte.href;
        if (referencia) {
          let estado = referencia.baseVal.lastIndexOf("_");
          referencia = elemento_corte.href.baseVal.substr(0, estado);
          referencia += "_open";
          elemento_corte.setAttribute("href", referencia);
        }
      }
    },
    cerrar_seleccion_mando() {
      let elemento_corte = document.getElementById(this.elemento_seleccionado);
      if (elemento_corte) {
        let referencia = elemento_corte.href;
        if (referencia) {
          let estado = referencia.baseVal.lastIndexOf("_");
          referencia = elemento_corte.href.baseVal.substr(0, estado);
          referencia += "_closed";
          elemento_corte.setAttribute("href", referencia);
        }
      }
    }
  }
};
</script>

<style>
</style>