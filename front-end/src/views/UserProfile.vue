<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <core-loading :show="loading" />
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        xs12
      >
        <material-card
          :color="color"
          title="商户信息"
        >
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                          label="店铺"
                          :value="infoData.company"
                          disabled/>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                          label="登录名"
                          :value="infoData.username"
                          disabled/>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                          label="联系人"
                          v-model="infoData.name"
                          :value="infoData.name"
                          />
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                          label="电话"
                          v-model="infoData.tel"
                          :value="infoData.tel"
                          />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                          label="地址"
                          v-model="infoData.address"
                          :value="infoData.address"
                          />
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                          label="有效期"
                          :value="utilService.dateFormat(infoData.end_time)"
                          disabled/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                          label="上次登录"
                          :value="utilService.dateFormat(infoData.lastTime)"
                          disabled/>
                </v-flex>
                <v-flex
                  xs12
                  text-xs-right
                >
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    @click="update"
                  >
                    确认更新
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
    <v-snackbar
            :color="alertColor"
            top
            v-model="snackbar"
            dark
    >
      <v-icon
              color="white"
              class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      <div>{{alertMessage}}</div>
      <v-icon
              size="16"
              @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
    import $http from  '../plugins/axios'
    import * as _utilService from "../utils";
export default {
    data: () => ({
        loading:true,
        alertMessage:'信息修改成功！',
        alertColor:'success',
        snackbar:false,
        utilService:_utilService,
        infoData:{}
    }),
    computed: {
        color() {
            return this.$store.state.app.color
        }
    },
    mounted(){
        this.getInfo()
    },
    methods:{
        update(){
            this.loading=true;
            $http.post('/auth/update_info',this.infoData).then(res=>{
                this.loading=false;
                if(res.code!==0){
                    this.alertMessage='修改失败，稍后再试！';
                    this.alertColor='error';
                }
                this.snackbar=true;
            });
        },
        getInfo(){
            $http.get('/auth/userinfo').then(res=>{
                this.loading=false;
                if(res.code!==0){
                    return
                }
                this.infoData=res.data[0];
            });
        }
    }
}
</script>
