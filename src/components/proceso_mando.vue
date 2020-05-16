<template>
  <div>
    <v-chip v-if="seleccion_elemento" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>EL
    </v-chip>
    <v-chip v-if="seleccion_mando" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>ML
    </v-chip>
    <v-chip v-if="solicitud_de_mando" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>Autorizando
    </v-chip>
    <v-chip v-if="mando_autorizado" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>Autorizado
    </v-chip>
    <v-chip v-if="mando_en_proceso" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>Enviado
    </v-chip>
    
    <v-chip v-if="mando_ejecutado" x-small>
      <v-avatar left>
        <v-icon x-small>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>Ejecutado!!!
    </v-chip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as types from '../store/types'
export default {
  name: "proceso_mando",
  data() {
    return {
      //
    };
  },
  watch: {
    mando_autorizado(value){
      if(value)this.enviar_mando()
    }
  },
  computed: {
    ...mapGetters({
      mando_autorizado: types.OBTENER_AUTORIZACION_MANDO,
      solicitud_de_mando: types.OBTENER_MANDO_SOLICITADO,
      mando_en_proceso: types.OBTENER_MANDO_ENVIADO,
      mando_ejecutado: types.OBTENER_MANDO_EJECUTADO,
      seleccion_elemento: types.OBTENER_SELECCION_ELEMENTO,
      seleccion_mando: types.OBTENER_MANDO_SELECCIONADO
    })
  },
  methods:{
    ...mapActions({
      enviar_mando: types.ENVIAR_MANDO,
      ejecutar_mando: types.MANDO_EJECUTADO
    })
  }
};
</script>

<style>
</style>