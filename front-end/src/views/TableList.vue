<template>
  <v-container
          style="padding: 0 24px"
    fluid
    grid-list-xl
  >
    <core-loading :show="loading" />
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        md12
      >
        <material-card
          :color="color"
          full-width
          title="到店顾客列表"
        >
          <v-progress-linear :color="color" height="2" :indeterminate="loading"></v-progress-linear>
          <v-data-table
            :headers="headers"
            :items="tableData"
          >
            <template
              slot="headerCell"
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
              <td><img :src="baseURL+item.faceId+'.jpg'"  v-on:error.once="moveErrorImg($event)"  class="img" v-cloak></td>
              <td>{{ item.age }}</td>
              <td>{{ item.glasses==='none'?'否':'是' }}</td>
              <td :class="item.gender">{{ item.gender==='male'?'男':'女' }}</td>
              <td v-html="utilService.checkPersonDate(item.firstTime,item.lastTime)?' 否':'<b class=text-red>是</b>'"></td>
              <td>{{utilService.dateFormat(item.lastTime,1)}}</td>
              <td>
                <v-btn :color="color" slot="activator" @click="()=>{showMoreInfo(item)}" dark>详情查看</v-btn>
              </td>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination v-model="page"  :total-visible="10" :length="totals"></v-pagination>
          </div>
        </material-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog"  max-width="600px">
      <v-card v-if="dialog">
        <v-card-text>
          <v-container style="padding: 0 10px;" grid-list-md>
            <h3 class="v-title">到店详情
              <v-btn icon dark @click.stop="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </h3>
            <v-layout wrap>
              <v-flex xs3>
                <v-badge left>
                  <span slot="badge">{{utilService.checkPersonDate(personInfo.firstTime,personInfo.lastTime)?'新顾客':'老顾客'}}</span>
                  <img :src="baseURL+personInfo.faceId+'.jpg'"  v-on:error="moveErrorImg($event)"  class="img-more" v-cloak>
                </v-badge>

              </v-flex>
              <v-flex xs5>
                <v-text-field
                        :value="utilService.dateFormat(personInfo.firstTime,1)"
                        label="第一次到店时间"
                        disabled
                ></v-text-field>
                <v-text-field
                        :value="utilService.formatTime(personInfo.lastTime,'{y}-{m}-{d} {h}:{i}:{s}')"
                        label="上次到店时间"
                        disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field
                        :value="personInfo.age"
                        label="年龄"
                        disabled
                ></v-text-field>
                <v-text-field
                        :value="personInfo.storeId"
                        label="门店"
                        disabled
                ></v-text-field>

              </v-flex>
              <v-flex xs2>
                <v-text-field
                        :value="personInfo.gender==='male'?'男':'女'"
                        label="性别"
                        disabled
                ></v-text-field>
                <v-text-field
                        :value="personInfo.glasses==='none'?'否':'是'"
                        label="戴眼镜"
                        disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-radio-group  label="标注为：" v-model="personInfo.type" row>
                  <v-radio

                          label="黑名单"
                          value="black"
                  ></v-radio>
                  <v-radio

                          label="VIP"
                          value="vip"
                  ></v-radio>
                  <v-radio

                          label="普通"
                          value="normal"
                  ></v-radio>
                </v-radio-group>

              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-flex  xs12 text-xs-right  >
            <v-btn :color="color"
                   :loading="loading"
                   :disabled="loading"
                   @click="save">确 定</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
<style scoped>
  .v-title{position: relative;}
  .v-title .v-btn{position: absolute; right: -20px;top:-20px;}
  .v-datatable .v-datatable__actions{
    display: none;
  }
</style>
<script>
import { mapMutations,  mapState  } from 'vuex'
import $http from  '../plugins/axios'
import * as _utilService from "../utils";

export default {
    data: () => ({
        alertMessage:'信息修改成功！',
        alertColor:'success',
        snackbar:false,
        page:1,
        loading:true,
        utilService:_utilService,
        baseURL: $http.defaults.staticURL+'/images/'+sessionStorage.getItem('storeId')+'/',
        tableData: [],
        personInfo:{},
        pagination: { size:5,storeId:1},
        totals:0,
        headers: [
            {sortable: false,
                text: 'ID',
                value: 'id'
            },
            {
                sortable: false,
                text: '照片',
                value: 'faceId'
            },
            {sortable: false,
                text: '年龄',
                value: 'age'
            },
            {sortable: false,
                text: '戴眼睛',
                value: 'glasses'
            },
            {sortable: false,
                text: '性别',
                value: 'gender'
            },
            {sortable: false,
                text: '老顾客',
                value: 'dateTime'
            },
            {sortable: false,
                text: '到店时间',
                value: 'lastTime'
            },
            {sortable: false,
                text: '操作'
            }
        ],
        dialog: false
    }),
    watch: {
        page: {
            handler(newName, oldName) {
                console.log('obj.a changed',this.page);
                this.getPageData()
            }
        }
    },
    computed: {
        color() {
            return this.$store.state.app.color
        }
    },
    mounted() {
        this.getPageData()
    },
    methods: {
        moveErrorImg(event){
            event.target.src = "../../img/noimg.png";
            console.log(event.target.src)
        },
        showMoreInfo(info) {
            this.personInfo=info;
            this.dialog=true;
        },
        save(){
            this.loading=true;
            let {type,id}=this.personInfo;

            $http.post('/auth/update_user_type',{
                type:type,
                id:id
            }).then(res=>{
                if(res.code!==0){
                    return
                }
                this.dialog=false;
                this.snackbar=true;
                this.getPageData();
            });
        },
        async getPageData() {
            this.loading=true;
            $http.get('/auth/select',{
                params: {
                    ...this.pagination,
                    page:this.page,
                    type: 'all'
                }
            }).then(res=>{
                if(res.code!==0){
                    return
                }
                this.tableData=res.data.list;
                this.totals= Math.ceil(res.data.totals/this.pagination.size);
                this.loading=false;
            }).catch(()=>{
                this.loading=false;
            });
        },
    }
}
</script>
