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
                <v-flex xs3>
                  <v-text-field
                          label="名称"
                          :value="infoData.company"
                          disabled/>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                          label="登录名"
                          :value="infoData.username"
                          disabled/>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                          label="上次登录"
                          :value="utilService.dateFormat(infoData.lastTime,1)"
                          disabled/>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                          label="联系人"
                          v-model="infoData.name"
                          :value="infoData.name"
                          />
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                          label="电话"
                          v-model="infoData.tel"
                          :value="infoData.tel"
                          />
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                          label="地址"
                          v-model="infoData.address"
                          :value="infoData.address"
                          />
                </v-flex>
                <v-flex xs12>
                  <v-data-table
                          :headers="headers"
                          :items="storeList"
                  >
                    <template
                            slot-scope="{ header }"
                    >
              <span
                      class="subheading font-weight-light text--darken-3"
                      v-text="header.text"
              />
                    </template>
                    <template
                            slot="items"
                            slot-scope="{ item,index }" class="face-table">
                      <td>{{ index+1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.address }}</td>
                      <td>{{utilService.parseTime(item.start_time,'{y}-{m}-{d}')+' 至 '+utilService.parseTime(item.end_time,'{y}-{m}-{d}')}}</td>
                    </template>
                  </v-data-table>
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
        storeList:[],
        headers: [
            {sortable: false,
                text: 'ID',
                value: 'id'
            },
            {
                sortable: false,
                text: '店铺名',
                value: 'name'
            },
            {
                sortable: false,
                text: '地址',
                value: 'address'
            },
            {
                sortable: false,
                text: '有效期'
            }
        ],
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
        this.getStoreData()
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
        },
        getStoreData(){
            $http.get('/auth/store_list').then(res => {
                this.storeList=res.data;
            })
        }
    }
}
</script>
