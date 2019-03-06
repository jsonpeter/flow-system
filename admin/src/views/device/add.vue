<template>
  <div class="app-container" style="width: 800px; margin: 10px auto">
    <el-form :model="device" label-width="80px">
      <el-form-item label="设备名称">
        <el-input v-model="device.name"></el-input>
      </el-form-item>
    </el-form>
    <el-form  :model="device" label-width="80px">
      <el-form-item label="设备型号">
        <el-input v-model="device.type"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="()=>{ $router.push({ path: '/list' })}">取消</el-button>
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
          storeId:this.$route.query.storeId,
          userId:this.$route.query.userId,
          name: '',
          type:''
        }
      }
    },
    mounted(){

    },
    methods: {
      onSubmit() {
        $http.post('/auth/device_add',this.device).then(res=>{
          if(res.data.code===0){
            Message({
              message: '添加成功',
              type: 'success'
            });
            this.$router.push({ path: '/device/list',query:this.$route.query })
          }else{
            Message({
              message: '添加失败',
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>
