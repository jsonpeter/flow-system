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
      <el-table-column align="center" label="登录名" width="110" >
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="商户名"  align="center">
        <template slot-scope="scope">
          {{ scope.row.company }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status===1?'启用':'停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="添加时间" width="200">
        <template slot-scope="scope">
          {{ dateFormat(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="上次登录" width="200" align="center">
        <template slot-scope="scope">
          {{ dateFormat(scope.row.lastTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

          <el-button type="success" plain size="small" @click="()=>{showMoreInfo(scope.row)}">查看详情</el-button>
          <el-button type="warning" plain size="small" @click="()=>{changePwd(scope.row.id)}">重置密码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="管理" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="info" plain size="small" @click="()=>{showStore('list',scope.row.id)}">门店管理</el-button>
          <el-button type="primary" plain size="small" @click="()=>{showStore('add',scope.row.id)}">添加门店</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="商户详情" :visible.sync="showDialog">
      <div class="app-container">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商户名称">
            <el-input v-model="form.company"></el-input>
          </el-form-item>
          <el-form-item label="登录名" class="btn-form">
            <el-input v-model="form.username" style="width: 62%"></el-input>
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
          <el-form-item label="是否生效">
            <el-switch v-model="status"></el-switch>
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
          <el-form-item  align="center">
            <el-button type="primary" @click="onSubmit">修改</el-button>
            <el-button @click="()=>{ showDialog=false }">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import {getlastYear,dateFormat} from '@/utils/index'
import $http from '@/utils/request'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger'
      }
      return statusMap[status+'']
    }
  },
  data() {
    return {
      showDialog:false,
      dateFormat:dateFormat,
      list: null,
      listLoading: true,
      startEndTime:[],
      status:false,
      form: {
        name: '',
        username:'',
        address:'',
        tel:'',
        company:'',
        auth_list:[''],
        status:false,
        desc: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showStore(type,id){
      let _name=type==='list'?'store_list':'store_add';
      this.$router.push({name:_name,query: { id: id }})
    },
    check_name(){
      $http.get('/check_name',{params:{username:this.form.username}}).then(res=>{
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
    },
    fetchData() {
      this.listLoading = true
      $http.get('/auth/list').then(response => {
        this.list = response.data.data;
        this.listLoading = false
      })
    },
    changePwd(id){
      $http.post('/auth/update_pwd',{id:id}).then(res=>{
        if(res.data.code===0&&res.data.data){
          Message({
            message: '密码重置成功',
            type: 'success'
          });
        }else{
          Message({
            message: '密码重置失败',
            type: 'error'
          });
        }
      })
    },
    onSubmit() {
      this.form.start_time=dateFormat(this.startEndTime[0]);
      this.form.end_time=dateFormat(this.startEndTime[1]);
      this.form.status=~~this.status;
      console.log(this.form)
      $http.post('/auth/update',this.form).then(res=>{
        if(res.data.code===0&&res.data.data){
          this.fetchData();
          Message({
            message: '修改成功',
            type: 'success'
          });
          this.showDialog=false;
        }else{
          Message({
            message: '修改失败',
            type: 'error'
          });
        }
      })
    },
    showMoreInfo(item){
      console.log(item);
      this.form=item;
      this.status=!!item.status;
      this.startEndTime=[item.start_time||new Date(),item.end_time||new Date()]
     this.showDialog=true;
    }
  }
}
</script>
