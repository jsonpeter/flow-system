<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="60" >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备名称" width="110" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="设备类型"  align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="添加时间" width="200">
        <template slot-scope="scope">
          {{ dateFormat(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="danger" plain size="small" @click="()=>{deleteData(scope.row.id)}">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  <div style="margin-top: 20px;text-align: center">
    <el-button type="primary" plain size="small" @click="deviceAdd">设备添加</el-button>
    <el-button @click="()=>{ $router.push({ path: '/list' })}">取消</el-button>

  </div>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import {getlastYear,dateFormat} from '@/utils/index'
import $http from '@/utils/request'
export default {
  data() {
    return {
      showDialog:false,
      dateFormat:dateFormat,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      $http.get('/auth/device_list',{
        params:{
          storeId:this.$route.query.storeId
        }
      }).then(response => {
        this.list = response.data.data;
        this.listLoading = false
      })
    },
    deviceAdd(){
      this.$router.push({path:'/device/add',query: this.$route.query})
    },
    deleteData(id){
      this.listLoading = true;
      $http.delete('/auth/device_del',{
        params:{
          id:id
        }
      }).then(res => {
        if(res.data.code===0){
          this.fetchData();
          Message({
            message: '删除成功',
            type: 'success'
          });
        }else{
          Message({
            message: '删除失败',
            type: 'error'
          });
        }
      })
    }
  }
}
</script>
