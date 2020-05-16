import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#104F1A',
        accent: '#B99B2D',
        secondary: '#FFE18D',
        success: '#136A17',
        info: '#045B59',
        warning: '#B7AB12',
        error: '#A62323'
      },
      light: {
        primary: '#0C5315',
        accent: '#6B6C1A',
        secondary: '#1A4D5F',
        success: '#1B621E',
        info: '#675F1C',
        warning: '#1C1C02',
        error: '#CB0000'
      }
    }
  },
  icons: {
    iconfont: 'mdi'
  }
});
