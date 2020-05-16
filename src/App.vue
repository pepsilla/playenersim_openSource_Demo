<template>
  <v-app>
    <v-app-bar clipped-left class="cabecera_logo" elevation="4" color="#03331e" app>
      <div class="logo_sitio">
        <img src="img/enersim2020.png" width="40px" />
      </div>
      <v-toolbar-title>{{ configuracion_simulador.models[indice_seleccion_modelo].tittle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      playEnersim [ <reloj-digital></reloj-digital> ]
      <v-menu open-on-hover v-if="hay_grupos">
        <template v-slot:activator="{on}">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Menú principal</v-card-title>
          <v-spacer></v-spacer>
          <v-card-subtitle>Mostrar/Ocultar:</v-card-subtitle>
          <v-switch
            v-for="(grupo,indice) in grupos"
            :key="indice"
            color="red"
            flat
            class="ma-2"
            v-model="grupo.enabled"
            :label="grupo.label"
            @change="actualizar_visibilidad_grupos(indice)"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-card-subtitle>Modelo:</v-card-subtitle>
          <v-radio-group
            v-if="configuracion_simulador.models.length > 0"
            v-model="indice_seleccion_modelo"
            @change="seleccion_modelo()"
          >
            <v-radio
              v-for="(modelo, indice) in configuracion_simulador.models"
              :key="indice"
              :label="modelo.label"
              :value="indice"
            ></v-radio>
          </v-radio-group>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-content fill-height width="100%">
      <v-alert v-if="presenta_modelo_visual" border="top" colored-border type="info" elevation="2">
        <v-btn @click="fin_copiar_a_portapapeles">Cerrar</v-btn>
        <v-btn v-if="!copiado_modelo_visual" @click="copia_modelo_visual_a_portapapeles">Copiar</v-btn>
        {{estado_copia_portapapeles}}
      </v-alert>
      <simulador></simulador>
    </v-content>

    <v-footer color="#03331e" app id="pie_sitio">
      <div class="derechos_deberes"></div>
      <div class="scroll_pie">
        <proceso-mando></proceso-mando>
      </div>
      <div class="responsable_privacidad">
        <v-tooltip left>
          <template v-slot:activator="{on}">
            <v-icon small v-on="on">mdi-account-off</v-icon>
          </template>
          <span>Identidad no verificada</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-icon small v-on="on">{{icono_raton}}</v-icon>
          </template>
          <span>Ratón en zona de juegos</span>
        </v-tooltip>
      </div>
      <v-speed-dial
        v-model="fab"
        bottom
        right
        direction="top"
        open-on-hover
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" dark fab>
            <v-avatar v-if="fab">
              <img alt="playEnersim_adif" src="img/icons/mstile-150x150.png" />
            </v-avatar>
            <v-avatar v-else>
              <img alt="versión 110520201111" src="img/enersim2020.png" />
            </v-avatar>
          </v-btn>
        </template>
        <v-btn @click="centrar_escenario" fab dark small color="primary">
          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-icon v-on="on">mdi-image-filter-center-focus</v-icon>
            </template>
            <span>Restaurar esquema</span>
          </v-tooltip>
        </v-btn>
      </v-speed-dial>
    </v-footer>
  </v-app>
</template>

<script>

import ProcesoMando from "./components/proceso_mando";
import RelojDigital from "./components/reloj_digital";
import Simulador from "./views/Simulador";
import * as types from "./store/types";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    ProcesoMando,
    RelojDigital,
    Simulador //,
    //VideoPlayer
  },
  data() {
    return {
      fab: false,
      right: true,
      title: " Circuito demo Open Source -LIBRE-",
      fondo_logo: "/imagenes/fondo.jpg",
      mensajes: [
        "Cargando escenario",
        "Identificando objetos",
        "Estableciendo relaciones",
        "Todo listo."
      ],
      numero_mensaje: 0,
      svg_optimizado: false,
      contenido_esquemario: "",
      vista_subestaciones: true,
      vista_circuitos_lac: true,
      estado_elementos_corte: false,
      estado_conductores: false,
      componente_en_escenario: "simulador",
      presenta_modelo_visual: false,
      copiado_modelo_visual: false,
      grupos: [],
      indice_seleccion_modelo: 0
    };
  },
  computed: {
    //
    ...mapGetters({
      raton_en_escenario: types.OBTENER_ENTRADA_ESCENARIO,
      modelo_datos: types.OBTENER_MODELO_DATOS,
      configuracion_simulador: types.OBTENER_CONFIGURACION
    }),
    icono_raton() {
      return this.raton_en_escenario ? "mdi-eye" : "mdi-eye-off";
    },
    hay_grupos() {
      return this.grupos.length > 0 ? true : false;
    }
  },
  watch: {
    configuracion_simulador(valor) {
      while (this.grupos.length > 0) this.grupos.pop();
      valor.groups.forEach(grupo => {
        this.grupos.push({ label: grupo.label, enabled: grupo.enabled });
      });
    }
  },
  methods: {
    ...mapActions({
      solicitar_escenario_centrado: types.SOLICITAR_CENTRAR_ESCENARIO,
      cargar_configuracion: types.CARGA_CONFIGURACION_SIMULADOR,
      seleccion_modelo_simulacion: types.CARGA_MODELO
    }),
    ...mapMutations({
      establecer_estado_elemento: types.ESTABLECER_ESTADO_ELEMENTO_CORTE
    }),
    actualizar_visibilidad_grupos(indice) {
      let key = this.configuracion_simulador.groups[indice].key;
      let grupos_documento = document.getElementsByTagName("g");
      grupos_documento.forEach(grupo => {
        if (grupo.id && grupo.id.indexOf(":") === -1) {
          if (grupo.id.indexOf(key) === 0) {
            if (this.grupos[indice].enabled) {
              grupo.classList.remove("ocultar_subestaciones");
              grupo.classList.add("mostrar_subestaciones");
            } else {
              grupo.classList.remove("mostrar_subestaciones");
              grupo.classList.add("ocultar_subestaciones");
            }
          }
        }
      });
    },
    centrar_escenario() {
      this.solicitar_escenario_centrado();
    },
    obtener_modelo_visual() {
      this.presenta_modelo_visual = true;
    },
    seleccion_modelo() {
      this.seleccion_modelo_simulacion(this.indice_seleccion_modelo);
    }
  },
  mounted() {
    this.cargar_configuracion();
  }
};
</script>
<style scoped>
#app {
  overflow-y: hidden;
}
.cabecera_logo {
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  background-color: #095735;
}

#pie_sitio .v-speed-dial {
  position: absolute;
}

#pie_sitio .v-btn--floating {
  position: relative;
}
.derechos_deberes {
  justify-content: left;
  width: 25%;
}
.scroll_pie {
  width: 50%;
}
.responsable_privacidad {
  display: flex;
  width: 25%;
  justify-content: center;
}
.logo_sitio {
  width: 80px;
  height: 36px;
  margin-right: 20px;
}
</style>
