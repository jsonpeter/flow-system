<template>
<div class="app-container" style="width: 800px; margin: 10px auto">
  <el-form :model="form" label-width="80px">
  <el-form-item label="商户名称">
    <el-input v-model="form.company"></el-input>
  </el-form-item>
  <el-form-item label="登录名" class="btn-form">
    <el-input v-model="form.username"></el-input>
    <el-button type="primary" @click="check_name">检查登录名</el-button>
  </el-form-item>
  </el-form>
<el-form :inline="true" :model="form" label-width="80px">
  <el-form-item label="联系人">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="联系电话">
    <el-input v-model="form.tel"></el-input>
  </el-form-item>
</el-form>
  <el-form ref="form"  :model="form" label-width="80px">
    <el-form-item label="联系地址">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
  <el-form-item label="是否生效">
    <el-switch v-model="form.status"></el-switch>
  </el-form-item>
  <el-form-item label="权限分配">
    <el-checkbox-group>
      <el-checkbox label="报表展示" name="type" disabled></el-checkbox>
      <el-checkbox label="考勤管理" name="type" disabled></el-checkbox>
      <el-checkbox label="数据分析" name="type" disabled></el-checkbox>
      <el-checkbox label="预警管理" name="type" disabled></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="其他说明">
    <el-input type="textarea" v-model="form.desc"></el-input>
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
        form: {
          name: '',
          username:'',
          address:'',
          tel:'',
          company:'',
          auth_list:['报表展示'],
          status:true,
          desc: ''
        }
      }
    },
    mounted(){
      console.log(getlastYear)
    },
    methods: {
      onSubmit() {
        this.form.auth_list=this.form.auth_list.join(';');
        this.form.status=~~this.form.status;
        $http.post('/auth/add',this.form).then(res=>{
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
      },
      check_name(){
        $http.get('/auth/check_name',{params:{username:this.form.username}}).then(res=>{
          console.log(res.data.data)
          if(res.data.data.length>0&&res.data.data[0].num===0){
            Message({
              message: '登录名可用',
              type: 'success'
            });
          }else{
            Message({
              message: '登录名已存在',
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>
<style>
  .btn-form .el-input{
    width: 50%;
  }
</style>
