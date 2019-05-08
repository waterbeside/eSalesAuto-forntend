<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="PPO_NO">
          <el-input placeholder="PPO_NO" v-model="filters.ppo_no"></el-input>
        </el-form-item>
        <el-form-item label="Season">
          <el-input  placeholder="Season" v-model="filters.season"></el-input>
        </el-form-item>
        <el-form-item label="Order Create Date">
            <el-date-picker
              v-model="filters.date_range"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="〜"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
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
    style:="width: 100%">
		  <el-table-column type="selection" width="50" fixed></el-table-column>
      <el-table-column prop="PPO_NO" label="PPO_NO" min-width="150">
         <div slot-scope="scope"  >
            <a :href="'http://192.168.7.211/ReportServer/Pages/ReportViewer.aspx?%2fGEK%2fSales%2fSales+F01%2fSPPOReportFile%2fSPPOReport&ppo_no='+scope.row['PPO_NO']" target="_blank">{{scope.row['PPO_NO']}}</a>
          </div>
        
      </el-table-column>
      <el-table-column prop="Creater" label="Creater" width="120"></el-table-column>
	    <el-table-column prop="Season" label="Season" width="100"></el-table-column>
      <el-table-column prop="Style_No" label="Style_No"  width="120"></el-table-column>
		  <el-table-column prop="Garment_Wash" label="Garment_Wash" width="160"></el-table-column>
		  <el-table-column prop="Create_Time" label="创建时间" width="140"></el-table-column>
      <el-table-column  label="操作"  width='100px' fixed="right">
        <template scope="scope">
          <!-- <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button> -->
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete" circle plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条:页码-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="this.multipleSelection.length === 0" icon="el-icon-delete" plain>批量删除</el-button>
      <el-button type="primary"  size="small" @click="handleBatchEdit" :disabled="this.multipleSelection.length === 0" icon="el-icon-edit" plain>批量修改</el-button>

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

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <edit-view   ref="myEditBox"  />     
    </el-dialog>

    <!--新增界面-->
		<el-dialog title="添加SPPO"  :visible.sync="addFormVisible"  width="80%" :before-close="handleBeforeCloseAddDialog" :close-on-click-modal="false" >
      <add-view @close="handleCloseAddDialog" ref="myAddBox" @OK="handleAddSuccess"/>
    </el-dialog>

  
    <!-- 批量更新界面 -->
    <el-dialog title="批量编辑" :visible.sync="batcheditFormVisible" width="500" :close-on-click-modal="false">
      <edit-batch-view @close="handleCloseEditBatchDialog" ref="myBathEditBox" @OK="handleEditBathSuccess"/>
    </el-dialog>

  </div>
</template>

<script>
// import util from "../../common/js/util";
import moment from 'moment'
import NProgress from 'nprogress'
import {sppoAPI} from '@/api'
import AddView from './components/Add'
import EditView from './components/Edit'
import EditBatchView from './components/EditBatch'

export default {
  components: { AddView ,EditBatchView, EditView},

  data() {
    return {
      filters: {
        ppo_no: "",
        season: "",
        date_range:[],
      },
      pagination:{
        total:0,
        pagesize:20,
      },
      page: 1,
      listLoading: false,
      multipleSelection: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
     
      //编辑界面数据
      // editForm: {
      //   id: 0,
      //   name: "",
      //   sex: -1,
      //   age: 0,
      //   birth: "",
      //   addr: ""
      // },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      
      batcheditFormVisible: false,   //批量更新界面是否显示
      pickerOptions: {
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
			listData: [],
			search: ''
    };
  },
  watch:{
    addFormVisible(val){
      if(val){
        if(typeof(this.$refs.myAddBox)=='object' &&typeof(this.$refs.myAddBox.init)=='function'){
          this.$refs.myAddBox.init();
        }
      }
    }

  },
  
  methods: {
    //点击翻页
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
    //关闭添加窗口
    handleCloseAddDialog(){
      this.addFormVisible  = false;
    },
    handleBeforeCloseAddDialog(done){
      done() ;
    },
    //改变选择
    handleSelectionChange: function(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection );
    },
    //获取列表内容
    getList() {
      console.log(sppoAPI.getList);
      let param = {
        page: this.page,
        ppo_no: this.filters.ppo_no,
        season: this.filters.season,
      };
      //处理时间
      let date_range = this.filters.date_range;
      param.date_start = typeof(date_range[0])!="undefined" && date_range[0] ? moment(date_range[0]).valueOf() : 0 ;
      param.date_end = typeof(date_range[1])!="undefined" && date_range[1] ? moment(date_range[1]).valueOf() : 0 ;
      if(this.listLoading){
        return false;
      }
      // console.log(sppoGetList);return;
      this.listLoading = true;
      NProgress.start();
      sppoAPI.getList(param).then(res=>{
        let data = res.data;
        this.listData = data.list.map((item,index)=>{
          item.Create_Time = moment(item.Create_Time).format('YYYY-MM-DD HH:mm');
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

    },
    //删除
    handleDel(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let datas = { id: row.ID };
        sppoAPI.del(datas).then(res => {
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
        sppoAPI.del(datas).then(res => {
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
    //显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true;
      // this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
    },
    //提交成功
    handleAddSuccess(){
      this.page = 1;
      this.filters= {
        ppo_no: "",
        season: "",
        date_range:[],
      };
      this.getList();
    },

    //显示批量更新界面
    handleBatchEdit(){
       this.batcheditFormVisible = true;   
    },
    handleEditBathSuccess(){
      console.log(handleEditBathSuccess);
    },
    handleCloseEditBatchDialog(){
      this.batcheditFormVisible  = false;
    },

    //编辑
    editSubmit: function() {
      // this.$refs.editForm.validate(valid => {
      //   if (valid) {
      //     this.$confirm("确认提交吗？", "提示", {}).then(() => {
      //       this.editLoading = true;
      //       //NProgress.start();
      //     })
      //   }
      // });
    },
   
   
  },
  mounted() {
    console.log('mounted')

  },
  created () {
    console.log('created')
    this.getList();

  },
  activated() {
    console.log('activated')


    // console.log(this.visible);
    // console.log(this.visible);
  },
};
</script>

<style scoped>
</style>
