<template>
   <div id="loading" v-show="show">
       <div class="bgmask"></div>
       <v-progress-circular
               :size="70"
               :width="7"
               :color="color"
               indeterminate
       ></v-progress-circular>
   </div>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default:true
            }
        },
        computed: {
            color() {
                return this.$store.state.app.color
            }
        },
        create(){
          console.log('this.show',this.show)
        }
    }
</script>

<style lang="scss">
    #loading{
        position:absolute;
        width: 100%;height: 100%;
        .bgmask{
            z-index: 20;
            position: absolute;
            width: 100%;height: 100%;left:-1.5rem;top:0;
            background: rgba(0,0,0,.5);
        }
        .v-progress-circular{
            z-index: 99;
            position: absolute;
            left:0;top:0;right:0;bottom:0;margin: auto;
        }
    }
</style>
