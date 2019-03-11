<template>
  <div class="app-container" style="width: 800px; margin: 10px auto">
    <el-form :model="device" label-width="80px">
      <el-form-item label="设备名称">
        <el-input v-model="device.name"></el-input>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="device.type"></el-input>
      </el-form-item>
      <el-form-item label="直播地址">
        <el-input v-model="device.hls"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message, MessageBox } from 'element-ui'
  import {getlastYear,dateFormat} from '@/utils/index'
  import $http from '@/utils/request'
  export default {
    data() {
      return {
        device: {
          storeId: this.$route.query.storeId,
          userId: this.$route.query.userId,
          id: '',
          name: '',
          hls: '',
          type: '',
          create_time:dateFormat(Date.now())
        }
      }
    },
    mounted(){
      let params=this.$route.params;
      if(params.hasOwnProperty('id')){
        this.device.id=params.id;
        this.device.name=params.name;
        this.device.hls=params.hls;
        this.device.type=params.type;
      }
    },
    methods: {
      goBack(){
        this.$router.push({ path: '/device/list',query:{...this.$route.query} })
      },
      onSubmit() {
        let url=this.device.id?'/auth/device_edit':'/auth/device_add';

        $http.post(url,this.device).then(res=>{
          if(res.data.code===0){
            Message({
              message: '操作成功',
              type: 'success'
            });
          this.goBack();
          }else{
            Message({
              message: '操作失败',
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>
