<template>
<div>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="">
          <el-input placeholder="Name of keyword" v-model="filters.keyword"></el-input>
        </el-form-item>
        <el-form-item label="加入日期">
            <el-date-picker
              v-model="filters.date_range"
              type="daterange"
              align="center"
              unlink-panels
              start-placeholder="开始日"
              end-placeholder="结束日"
            ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='getList' icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" class="toolbar" style="text-align:right;">
      <el-button type="success" @click="handleAdd" icon="el-icon-plus">新增</el-button>
    </el-col>

    <!--列表-->
    <el-table highlight-current-row style="width: 100%;"
		:data="listData" 
    v-loading="listLoading"
    @selection-change="handleSelectionChange"
    v-if="!is_refresh"
     stripe
    style:="width: 100%">
		  <el-table-column type="selection" width="50" fixed></el-table-column>
      <el-table-column prop="id" label="#" width="50"></el-table-column>
      <el-table-column prop="username" label="账号名" min-width="100">
         <div slot-scope="scope"  >
            {{scope.row['username']}}
          </div>
        
      </el-table-column>
      <el-table-column prop="FullName" label="名称" width="140"></el-table-column>
	    <el-table-column prop="roles" label="角色" width="100"></el-table-column>
      <el-table-column prop="sales_team" label="Salses Team"  width="120"></el-table-column>
		  <el-table-column prop="last_login_time" label="最后登入" width="140"></el-table-column>
		  <el-table-column prop="create_time" label="创建时间" width="140"></el-table-column>
      <el-table-column  label="操作"  width='100px' fixed="right">
        <template scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row.id)" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条:页码-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="this.multipleSelection.length === 0" icon="el-icon-delete" plain>批量删除</el-button>

      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pagination.pagesize"
        :pager-count="5"
        :current-page.sync="page"
        :total="pagination.total"
        style="float:right;"
      ></el-pagination>
    </el-col>

  

    <!--新增界面-->
		<el-dialog :title="form_dialogTitle"  :visible.sync="is_showEditBox"    :close-on-click-modal="false" >
      <user-form ref="editUserForm" @OK="handleEditSuccess"  @close="handleCloseEditDialog" :id="editing_id"  v-if="is_showEditBox"/>
    </el-dialog>

    

  </div>
</div>
</template>
<script>
  import moment from 'moment'
  import NProgress from 'nprogress'
  import { getList,userDelete } from '@/api/user'
  import UserForm from './components/Form'

  export default {
    name: 'userList',
    components: { UserForm},
    data() {
      return {
        filters: {
          keyword: "",
          date_range:[],
        },
        pagination:{
          total:0,
          pagesize:20,
        },
        page: 1,
        listLoading: false,
        multipleSelection: [], //列表选中列
      
        is_refresh:false,
        is_showEditBox:false,
        listData: [],

        editing_id: 0,
        form_is_edit: false,
    

      };
    },
    computed: {
      form_dialogTitle(){
        return this.editing_id > 0 ? '编辑用户' : '新增用户';
      }
    },
    watch:{
      is_showEditBox(val){
        if(val){
          if(typeof(this.$refs.editUserForm)=='object' && typeof(this.$refs.editUserForm.init)=='function'){
            // this.$refs.editUserForm.init();
          }
        }
      },
     


    },
    methods: {
      //点击翻页
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getList();
      },
    
      //改变选择
      handleSelectionChange: function(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection );
      },
      //获取列表内容
      getList() {
        let param = {
          page: this.page,
          keyword: this.filters.keyword,
        };
        //处理时间
        let date_range = this.filters.date_range;
        
        param.date_start = date_range && typeof(date_range[0])!="undefined" && date_range[0] ? moment(date_range[0]).valueOf() : 0 ;
        param.date_end   = date_range && typeof(date_range[1])!="undefined" && date_range[1] ? moment(date_range[1]).valueOf() : 0 ;
        if(this.listLoading){
          return false;
        }
        this.listLoading = true;
        NProgress.start();
        getList(param).then(res=>{
          let data = res.data;
          this.listData = data.list.map((item,index)=>{
            item.create_time = item.create_time ? moment(item.create_time).format('YYYY-MM-DD HH:mm'): '-';
            item.last_login_time =item.last_login_time ?  moment(item.last_login_time).format('YYYY-MM-DD HH:mm') : '-';
            return item
          });
          this.pagination.pagesize= data.pagination.pagesize;
          this.pagination.total= data.pagination.total;
          this.page= data.pagination.page;
          this.$message({
            message: "加载成功",
            type: "success"
          });
          this.listLoading = false;
          NProgress.done();
        }).catch(error=>{
          NProgress.done();
          this.listLoading = false;
        })
        // this.is_refresh = true;
        // this.is_refresh = false;

      },
      //删除
      handleDel(index, row) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let datas = { id: row.ID };
          userDelete(datas).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.getList();
          }).catch((err) => {
              this.listLoading = false;
          });
        })
          
      },
      //批量删除
      handleBatchDelete(){
        var ids = this.multipleSelection.map(item => item.ID).toString();
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let datas = { id: ids };
          userDelete(datas).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.getList();
          }).catch((err) => {
              this.listLoading = false;
          });
        })
      },

     
      /***  编辑  ****/
      handleAdd(){
        this.editing_id = 0;
        this.is_showEditBox = true;
      },
      handleEdit(id){
        this.editing_id = id;
        this.is_showEditBox = true;
      },
      handleCloseEditDialog(){
        this.is_showEditBox = false;
      },
      handleEditSuccess(){

      },


      
    },
    mounted() {
    },
    created () {
      this.getList();
    },
    activated() {
    },
  };
</script>