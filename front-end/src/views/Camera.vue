<style scoped lang="scss">
   .camera-video{
       .flex{ height: 50%;
        video{ width: 100%; height: 100%;}
           .video-js{ margin: 0 auto;}
       }
   }
</style>

<template>
    <v-container  fill-height  fluid  grid-list-xl>
        <core-loading :show="loading" />
        <v-layout wrap class="camera-video">
            <v-flex v-for="(item,idx) in videoData" :id="'video-box'+idx" :key="idx" md6 xs12>
                <video :id="'myvideo'+idx" poster="/img/noimg.png" class="video-js" controls>
                    <source :src='item.path'  type="application/x-mpegURL"/>
                </video>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import $http from  '../plugins/axios'
    import videojs from 'video.js'
    window.videojs=videojs;
    import 'videojs-contrib-hls'
    export default {
        components: {

        },
        data() {
            return {
                loading:false,
                videoData:[
                    {name:'测试视频地址1',path:'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'},
                    {name:'测试视频地址2',path:'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'},
                    {name:'测试视频地址3',path:'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'},
                    {name:'测试视频地址4',path:'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'}
                ]
            }
        },
        mounted(){
         //this.getLivePath();
            this.$nextTick(()=>{
                console.log('数据已经更新')
                this.livePlayer(this.videoData);
            })
        },
        methods:{
            getLivePath(){
                $http.get('/auth/rtmp').then(res=>{
                    console.log(res);
                    this.videoData=res;
                })
            },
            livePlayer(data){

                data.map((item,index)=>{
                    let elm='myvideo'+index;
                    let player = window.videojs(elm,{
                        autoplay:true,
                        loadingSpinner: true
                    },function () {
                        let sizeElm=document.getElementById('video-box'+index);
                        let _width=sizeElm.offsetWidth-24;
                        player.width(_width);
                        player.height(_width/2);
                        console.error('play',elm)
                        player.play();
                    });
                })
            }
        }
    }
</script>

