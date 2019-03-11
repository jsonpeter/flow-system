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
                    <source src='http://szpaasalihlsgw.lechange.cn:9001/LCO/4F07C7BPAGBAA7E/0/1/20190307213617/dev_20190307213617_kcznsfgk4xk2lpns.m3u8'  type="application/x-mpegURL"/>
                </video>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import 'video.js/dist/video-js.css'
    import videojs from 'video.js'
    import 'videojs-contrib-hls'
    import $http from  '../plugins/axios'
    export default {
        components: {

        },
        data() {
            return {
                loading:true
            }
        },
        mounted(){
            this.getLivePath();
        //    console.log(this.$refs.myVideo)
        //     var options = {
        //         techOrder: ['flash'],
        //         autoplay:true,
        //         language: "zh-CN",
        //         controls: false,
        //         bigPlayButton: true
        //     };
        //    const that=this;
        //     videojs('my-video', options, function onPlayerReady() {
        //         videojs.log('Your player is ready!');
        //         that.loading=false
        //         // In this context, `this` is the player that was created by Video.js.
        //         this.play();
        //
        //         // How about an event listener?
        //         this.on('ended', function() {
        //             videojs.log('Awww...over so soon?!');
        //         });
        //     });
            videojs('my-video', {
                bigPlayButton: false,
                textTrackDisplay: false,
                posterImage: true,
                errorDisplay: false,
                controlBar: true
            }, function () {
                this.play()
            })
         },
        methods:{
            getLivePath(){
                $http.get('/auth/rtmp').then(res=>{
                    console.log(res)
                })
            }
        }
    }
</script>

