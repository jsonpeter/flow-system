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
      <el-table-column align="center" label="门店名称" width="110" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="门店地址"  align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="添加时间" width="200">
        <template slot-scope="scope">
          {{ dateFormat(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="()=>{showMoreInfo(scope.row)}">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

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
      console.log(this.$route)
      $http.get('/auth/store_list',{
        params:{
          id:this.$route.query.id
        }
      }).then(response => {
        this.list = response.data.data;
        this.listLoading = false
      })
    }
  }
}
</script>
