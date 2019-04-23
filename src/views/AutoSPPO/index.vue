<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="PPO_NO">
          <el-input placeholder="ppo no"></el-input>
        </el-form-item>
        <el-form-item label="Season">
          <el-input  placeholder="season"></el-input>
        </el-form-item>
        <el-form-item label="Order Create Date">
            <el-date-picker
              v-model="value7"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="〜"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
            ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="handleBatchEdit" icon="el-icon-edit">批量修改</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table highlight-current-row style="width: 100%;"
		:data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style:="width: 100%">>
		  <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="ppo_no" label="PPO_NO"></el-table-column>
      <el-table-column prop="creater" label="Creater"></el-table-column>
	    <el-table-column prop="season" label="Season"></el-table-column>
      <el-table-column prop="style_no" label="Style_No"></el-table-column>
		  <el-table-column prop="garment_wash" label="Garment_Wash"></el-table-column>
      <el-table-column label="" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="filters">
        <el-form-item label="Style_No">
          <el-input placeholder="BB20011037"></el-input>
        </el-form-item>
        <el-form-item label="Season" style="margin-left:22px">
          <el-input placeholder="20Q1"></el-input>
        </el-form-item>
        <el-form-item label="Garment_Wash">
           <el-input placeholder="Non-Wash"></el-input>
        </el-form-item>
        <el-form-item label="Delivery" style="margin-left:5px">
           <el-date-picker type="date" placeholder="2019-03-28"></el-date-picker>
        </el-form-item>
        <el-form-item label="Destination">
           <el-dropdown>
                <el-button>TDC<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item>TDC</el-dropdown-item>
                   <el-dropdown-item>YMG</el-dropdown-item>
                   <el-dropdown-item>GEG</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
        </el-form-item>
        
        <el-table
          :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style:="width: 100%">
          <el-table-column prop="garment_part" label="Garment_Part"></el-table-column>
          <el-table-column prop="customer_Fab_Code" label="Customer_fab_code"></el-table-column>
          <el-table-column prop="color_Combo" label="Color_combo"></el-table-column>
          <el-table-column prop="ldstd" label="LD_STD"></el-table-column>
          <el-table-column prop="collar_Cuff_Size" label="Collar_cuff_size"></el-table-column>
          <el-table-column prop="quantity" label="Quantity"></el-table-column>
          <el-table-column prop="unit" label="Unit"></el-table-column>
          <el-table-column prop="remark" label="Remark"></el-table-column>
	     </el-table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>

    </el-dialog>

    <!--新增界面-->
		<el-dialog title="添加SPPO"  :visible.sync="addFormVisible"  width="80%" :before-close="handleBeforeCloseAddDialog">
      <add-view @close="handleCloseAddDialog" />
    </el-dialog>

  
    <!-- 批量更新界面 -->
    <el-dialog title="编辑" v-model="batcheditFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="filters">
        <el-form-item label="Season" style="margin-left:22px">
          <el-input placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="Garment_Wash">
           <el-dropdown>
                <el-button><i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item>Garment Wash</el-dropdown-item>
                   <el-dropdown-item>Non Wash</el-dropdown-item>
                   <el-dropdown-item>...</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
        </el-form-item>
        <el-form-item label="Delivery" style="margin-left:5px">
           <el-date-picker type="date" placeholder=""></el-date-picker>
        </el-form-item>
        <el-form-item label="Destination">
           <el-dropdown>
                <el-button><i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item>TDC</el-dropdown-item>
                   <el-dropdown-item>YMG</el-dropdown-item>
                   <el-dropdown-item>GEG</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
// import util from "../../common/js/util";
//import NProgress from 'nprogress'
// import {
//   getUserListPage,
//   removeUser,
//   batchRemoveUser,
//   editUser,
//   addUser
// // } from "../../api/api";

import AddView from './components/Add'

export default {
  components: { AddView },

  data() {
    return {
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      // addFormRules: {
      //   name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      // },
      // //新增界面数据
      // addForm: {
      //   name: "",
      //   sex: -1,
      //   age: 0,
      //   birth: "",
      //   addr: ""
      // },
      

      batcheditFormVisible: false,   //批量更新界面是否显示
      

      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
			},
			value6: "",
      value7: "",
			tableData: [{
          ppo_no:'KSF19FF0100001',
          creater:'Winson Qi',
          season: '20Q1',
          style_no: 'BB20011037',
          garment_wash: 'Non-Wash'
      }],
			search: ''
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      // this.getUsers();
    },
    //关闭添加窗口
    handleCloseAddDialog(){
      this.addFormVisible  = false;
    },
    handleBeforeCloseAddDialog(done){
      console.log(1)   
      done() ;
    },
    //获取用户列表
    getList() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      // getUserListPage(para).then(res => {
      //   this.total = res.data.total;
      //   this.users = res.data.users;
      //   this.listLoading = false;
      //   //NProgress.done();
      // });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            // this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      };
    },
    //显示批量更新界面
    handleBatchEdit:function(){
       this.batcheditFormVisible = true;   
    },

    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
          })
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            
            });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          
        })
        .catch(() => {});
    }
  },
  mounted() {
    // this.getUsers();
  }
};
</script>

<style scoped>
</style>
