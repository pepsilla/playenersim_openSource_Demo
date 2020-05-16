<template>
  <div class="reloj_digital">
      <p class="fecha">{{fecha}}</p>
      <p class="hora">{{hora}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {
            fecha: '',
            hora: '',
            dia_de_la_semana: ['DOM','LUN','MAR','MIE','JUE','VIE','SAB']
        }
        
    },
    methods:{
        ahora_actualizar(){
            let ahora_local = new Date()
            this.fecha = `${this.dia_de_la_semana[ahora_local.getDay()]} ${this.redondea_dos(ahora_local.getDate())}-${this.redondea_dos(ahora_local.getMonth()+1)}-${ahora_local.getFullYear()}`
            this.hora = `${this.redondea_dos(ahora_local.getHours())}:${this.redondea_dos(ahora_local.getMinutes())}:${this.redondea_dos(ahora_local.getSeconds())}`
            //this.hora = `${ahora_local.getHours()}:${ahora_local.getMinutes()}:${ahora_local.getSeconds()}`
        },
        redondea_dos(valor) {
           if (valor > 9) return valor
           return `0${valor}`
        }
    },
    created(){
        this.ahora_actualizar()
        setInterval(()=>{
            this.ahora_actualizar()
        },1000)
    }
}
</script>

<style scoped>
.reloj_digital{
    font-family: 'Roboto', monospace;
    background-color: #03331e;
    max-width: 100px;
    margin: 0;
    padding: 0;
    color: #ffffff;
    text-align: center;
    color: #daf6ff;
}
.fecha{
    padding: 0;
    margin: 0;
    font-size: 8px;
}
.hora{
    padding: 0;
    margin: 0;
    font-size: 12px;
}
</style>
