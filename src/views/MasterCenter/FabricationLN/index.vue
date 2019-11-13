<template>
<div>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item >
          <el-input placeholder="Customer Fab Code" v-model="filters.customer_fab_code"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="Refer PPO Usage" v-model="filters.refer_ppo_usage"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="Finishing" v-model="filters.finishing"></el-input>
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
		:data="list" 
    v-loading="listLoading"
    @selection-change="listSelectionChange"
    v-if="!is_refresh"
     stripe
    style:="width: 100%">
		  <el-table-column type="selection" width="50" fixed></el-table-column>
      <el-table-column prop="Customer_Fab_Code" label="Customer Fab Code" min-width="160" fixed>
        <div slot-scope="scope"  >
          {{scope.row['Customer_Fab_Code']}}
        </div>
      </el-table-column>
      <el-table-column prop="ID" label="#" width="50"></el-table-column>
      <el-table-column prop="Refer_PPO_Usage" label="Refer PPO Usage" width="160"></el-table-column>
      <el-table-column prop="Fab_Type" label="Fab_Type"  width="120"></el-table-column>
		  <el-table-column prop="Fab_Pattern" label="Fab_Pattern" width="110"></el-table-column>
	    <el-table-column prop="Finishing" label="Finishing" width="180"></el-table-column>
	    <el-table-column prop="Dye_Method" label="Dye Method" width="120"></el-table-column>
	    <el-table-column prop="Yarn_Count" label="Yarn_Count" width="120"></el-table-column>
	    <el-table-column prop="Yarn_Type" label="Yarn_Type" width="120"></el-table-column>
		  <el-table-column prop="Update_Time" label="更新时间" width="140"></el-table-column>
      <el-table-column  label="操作"  width='100px' fixed="right">
        <template scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row.ID)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row.ID)" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条:页码-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="this.listSelection.length === 0" icon="el-icon-delete" plain>批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        :page-size="pagesize"
        :pager-count="5"
        :current-page.sync="page"
        :total="dataTotal"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--新增和编辑界面-->
		<el-dialog :title="form_dialogTitle"  :visible.sync="is_showEditBox"    :close-on-click-modal="false" width="80%" >
      <form-box ref="formBox" @ok="handleEditSuccess"  @close="handleCloseEditDialog" :id="editing_id"  v-if="is_showEditBox"/>
    </el-dialog>


    

  </div>
</div>
</template>
<script>
  import moment from 'moment'
  import {myCache} from '@/utils/common'
  import listPage from '@/mixin/listPage';
  import * as fabApi from '@/api/masterFabricationLN'
  import FormBox from './components/Form'

  // import UserForm from './components/Form'

  export default {
    name: 'FabricationLN',
    components: {
      FormBox
    },
    mixins: [listPage],
    data() {
      return {
        filters: {
          refer_ppo_usage: '',
          customer_fab_code:'',
          finishing:''
        },
        dataPK:'ID',
        is_refresh:false,
        pagesize:10,
        deleteFun:fabApi.del,

      };
    },
    computed: {
      form_dialogTitle(){
        return this.editing_id > 0 ? '编辑Fabric' : '新增Fabric';
      }
    },
    watch:{
      

    },
    methods: {
      /**
       * 取得列表数据
       */
      getList() {
        let param = {
          page: this.page,
          filter: this.filters
        };
        if (this.pagesize > 0) {
          param.pagesize = this.pagesize;
        }
        
        if(this.listLoading){
          return false;
        }
        this.listLoading = true;
        fabApi.getList(param).then(res=>{
          let data = res.data;
          this.list = data.list.map((item,index)=>{
            item.Update_Time = item.Update_Time ? moment(item.Update_Time).format('YYYY-MM-DD HH:mm'): '-';
            item.Create_Time = item.Create_Time ?  moment(item.Create_Time).format('YYYY-MM-DD HH:mm') : '-';
            return item
          });
          this.pagesize= data.pagination.pagesize;
          this.dataTotal= data.pagination.total;
          this.page= data.pagination.page;
          this.$message({
            message: "加载成功",
            type: "success"
          });
          this.listLoading = false;
        }).catch(error=>{
          this.listLoading = false;
        })
        // this.is_refresh = true;
        // this.is_refresh = false;

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