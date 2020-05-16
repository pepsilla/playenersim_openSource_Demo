<template>
  <v-card v-if="elemento_seleccionado" style="z-index:12;position:absolute;">
    <v-toolbar color="#0000ff">
      <v-toolbar-title class="title">{{ esquema }}:{{ mando }}</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer absolute hide-overlay clipped v-model="menu_edicion" bottom>
      <p>
        X:
        <v-btn icon x-small @click="decrementar_x">-</v-btn>
        {{ posicion_x_edicion }}
        <v-btn icon x-small @click="incrementar_x">+</v-btn>
      </p>

      <p>
        Y:
        <v-btn x-small @click="decrementar_y">-</v-btn>
        {{ posicion_y_edicion }}
        <v-btn x-small @click="incrementar_y">+</v-btn>
      </p>
    </v-navigation-drawer>
    <v-card-text>
      {{
      proceso_mando
      ? "Mando en proceso..."
      : "Selecciona el mando y activa el botón ENVIAR"
      }}
    </v-card-text>
    <v-card-actions v-if="!proceso_mando">
      <v-row>
        <v-col>
          <v-btn x-small color="green" @click="establecer_mando_abrir">
            <v-icon x-small v-if="mando_abrir">mdi-marker-check</v-icon>ABRIR
          </v-btn>
        </v-col>

        <v-col>
          <v-btn x-small color="red" @click="establecer_mando_cerrar">
            <v-icon x-small v-if="mando_cerrar">mdi-marker-check</v-icon>cerrar
          </v-btn>
        </v-col>

        <v-col>
          <v-btn x-small :disabled="enviar_no_permitido" @click="acciones_enviar_mando">enviar</v-btn>
        </v-col>

        <v-col>
          <v-btn x-small @click="acciones_cancelar_mando">cancelar</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from "../store/types";

import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "seleccion_mando",
  computed: {
    ...mapGetters({
      elemento_seleccionado: types.OBTENER_ELEMENTO_SELECCIONADO,
      proceso_mando: types.OBTENER_MANDO_EN_PROCESO
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
  watch: {
    elemento_seleccionado(value) {
      if (value) {
        this.posicion_x_edicion = document
          .getElementById(value)
          .getAttribute("x");
        this.posicion_y_edicion = document
          .getElementById(value)
          .getAttribute("y");
      }
    }
  },
  data() {
    return {
      mando_abrir: false,
      mando_cerrar: false,
      enviar_no_permitido: true,
      opciones_rotacion: [0, 45, 90, 135, 180],
      posicion_x_edicion: 0,
      posicion_y_edicion: 0,
      menu_edicion: false,
      accion_arrastre: false
    };
  },
  methods: {
    ...mapMutations({
      establecer_mando: types.ESTABLECER_TIPO_MANDO,
      selecciona_elemento: types.SELECCIONAR_ELEMENTO,
      anular_mando: types.FINALIZAR_MANDO
    }),
    ...mapActions({
      solicitar_ejecucion_de_mando: types.SOLICITAR_EJECUCION_MANDO
    }),
    establecer_mando_abrir() {
      this.mando_abrir = true;
      this.mando_cerrar = false;
      this.enviar_no_permitido = false;
      this.establecer_mando("abrir");
    },
    establecer_mando_cerrar() {
      //
      this.mando_cerrar = true;
      this.mando_abrir = false;
      this.enviar_no_permitido = false;
      this.establecer_mando("cerrar");
    },
    acciones_cancelar_mando() {
      //
      this.mando_abrir = false;
      this.mando_cerrar = false;
      this.enviar_no_permitido = true;
      this.anular_mando();
    },
    acciones_enviar_mando() {
      this.solicitar_ejecucion_de_mando();
      this.mando_abrir = false;
      this.mando_cerrar = false;
      this.enviar_no_permitido = true;
    }
  }
};
</script>

<style></style>
