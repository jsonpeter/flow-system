<template>
  <div class="app-container" style="width: 800px; margin: 10px auto">
    <el-form :model="store" label-width="80px">
      <el-form-item label="门店名称">
        <el-input v-model="store.name"></el-input>
      </el-form-item>
    </el-form>
    <el-form  :model="store" label-width="80px">
      <el-form-item label="门店地址">
        <el-input v-model="store.address"></el-input>
      </el-form-item>
      <el-form-item label="有效时间">
        <el-date-picker
          v-model="startEndTime"
          type="daterange"
          range-separator="~"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
        startEndTime:[dateFormat(new Date()), getlastYear()],
        store: {
          userId:this.$route.query.id,
          name: '',
          start_time:null,
          end_time:null,
          address:''
        }
      }
    },
    mounted(){

    },
    methods: {
      onSubmit() {
        this.store.start_time=this.startEndTime[0];
        this.store.end_time=this.startEndTime[1];
        $http.post('/auth/store_add',this.store).then(res=>{
          if(res.data.code===0){
            Message({
              message: '添加成功',
              type: 'success'
            });
            this.$router.push({ path: '/list' })
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
