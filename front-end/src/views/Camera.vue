<style lang="scss">
    #core-view {
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <v-container
            fill-height
            fluid
            grid-list-xl
    >
        <core-loading :show="loading" />
        <v-layout wrap>
            <v-flex>
                <video id="my-video" ref="myVideo" class="video-js" poster="videojs/eguidlogo.png" width="800" height="600">
                    <source src='rtmp://106.13.93.109/hls/dz001' type='rtmp/flv'/>
                </video>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        components: {

        },
        data() {
            return {
                loading:true
            }
        },
        mounted(){
           console.log(this.$refs.myVideo)
            var options = {
                techOrder: ['flash'],
                autoplay:true,
                language: "zh-CN",
                controls: false,
                bigPlayButton: true
            };
           const that=this;
            videojs('my-video', options, function onPlayerReady() {
                videojs.log('Your player is ready!');
                that.loading=false
                // In this context, `this` is the player that was created by Video.js.
                this.play();

                // How about an event listener?
                this.on('ended', function() {
                    videojs.log('Awww...over so soon?!');
                });
            });
        }
    }
</script>

