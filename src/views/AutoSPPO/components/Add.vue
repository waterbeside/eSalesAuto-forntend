<template>
  <div>
    <el-form :model="formData" label-width="80px" :rules="addFormRules" ref="addForm">

      <div class="toolbar">
        <el-select v-model="formData.customer_code" placeholder="Customer Code">
          <el-option
            v-for="item in selectBoxData.customer_code"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
        <el-select v-model="formData.brand" placeholder="Brand">
          <el-option
            v-for="item in selectBoxData.brand"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>

        <el-select v-model="formData.garment_fty" placeholder="Garment Fty">
          <el-option
            v-for="item in selectBoxData.garment_fty"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
      
     

      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" v-show="!is_hasUploadExcel" class="upload-box" />

      <el-col :span="24" class="toolbar"  v-show="is_hasUploadExcel">
        <el-button type="info">检查格式</el-button>
      </el-col>
      <el-alert :title="'本次上传Excel的时间为:'+uploadExcelTime"  type="success" :closable="false" v-show="is_hasUploadExcel">  </el-alert>
      
      <el-table v-loading="is_listLoading" :data="tableData" border style:="width: 100%" v-show="is_hasUploadExcel"  @sort-change="sortChange">
        <!-- style_no -->
        <el-table-column prop="style_no" label="Style_No" width="120" fixed  > </el-table-column>
        <!-- season -->
        <el-table-column prop="season" label="Season" width="90" ></el-table-column>
        <el-table-column prop="garment_wash" label="Garment_Wash" width="120"></el-table-column>
        <el-table-column prop="garment_part" label="Garment_Part" width="120" ></el-table-column>
        <el-table-column prop="color_combo" label="Color_Combo" width="120"></el-table-column>
        <el-table-column prop="customer_fab_code" label="Customer_Fab_Code" width="150"></el-table-column>
        <el-table-column prop="collar_cuff_size" label="Collar_Cuff_Size" width="120"></el-table-column>
        <el-table-column prop="remark" label="Remark" width="120"></el-table-column>
        <el-table-column   label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.$index === editingRow_index">
              <!-- <el-button v-if="scope.row.edit" type="success" size="mini" icon="el-icon-circle-check-outline" @click="handleConfirmEdit(scope.row)">
                确定
              </el-button>
              <el-button class="cancel-btn" size="mini" icon="el-icon-refresh" type="warning" @click="handleCancelEdit(scope.row)">
                取消
              </el-button> -->
              正在编辑...
            </template>
            <template v-else>
              <el-button @click="handleEditTableItem(scope)" type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button @click="handleCheckTableItem(scope.row)" type="text" size="small"><svg-icon icon-class="checkit"  class="font-icon" :disabled="!is_hasUploadExcel" /> 检验</el-button>
            </template>
            
          </template>
        </el-table-column>
      </el-table>	
    </el-form>

    
    <!-- 底部按钮 -->
    <div  class="fixed-footer-bar" >
      <div>
        <el-button @click.native="handleCloseDialog"><i class="el-icon-back"></i></el-button>
        <el-button @click.native="handleClearTableData" v-show="is_hasUploadExcel"><i class="el-icon-upload2"></i> 清除数据(重新上传)</el-button>
        
      </div>
      <div>
          <el-button type="danger" plain> <svg-icon icon-class="checkit"  class="font-icon" :disabled="!is_hasUploadExcel" /> 检查格式</el-button>
         <el-button type="primary" @click.native="addSubmit" :loading="is_submiting" :disabled="!is_allowSubmit"><i class="el-icon-check"></i> 提交</el-button>
      </div>
    </div>


    <!--编辑单项界面-->
    <edit-excel-item @close="handleCancelEdit" @OK="handleConfirmEdit" :data="editingRow"  :visible.sync="is_showEditItem" />
    
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {changeCaseJsonKey} from '@/utils/common'
import moment from 'moment'
import EditExcelItem from './EditExcelItem'


export default {
  name: 'RightPanel',
  components: { UploadExcelComponent,EditExcelItem },
  props: {
   
  },
  data() {
    return {
      is_submiting: false,
      is_allowSubmit: false,
      is_hasUploadExcel:false,
      is_showEditItem : false,
      is_listLoading: false,
      uploadExcelTime : '',
      
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      formData:{
        customer_code:'',
        brand:'',
        garment_fty:'',
      },
      selectBoxData:{
        customer_code: [
          {
            value: '16761',
            label: '16761'
          }, {
            value: '20491',
            label: '20491',
            disabled: true
          }],
        brand: [
          {
            value: 'FLA',
            label: 'FLA'
          }, {
            value: 'ANT',
            label: 'ANT',
          }],
        garment_fty: [
          {
            value: 'TDC',
            label: 'TDC'
          }, {
            value: 'YMG',
            label: 'YMG',
          }, {
            value: 'GEG',
            label: 'GEG',
          }]
      },
      // tableData_o: null,
      tableData: null,
      editingRow : { },
      editingRow_index : null,
      // editingRowData : null,
      
    }
  },
  watch:{
    is_showEditItem (a,b){
      console.log(a)
      console.log(b)
    },
  },
  computed: {
   
  },
  watch: {
    
  },
  mounted() {

  },
  beforeDestroy() {
   
  },
  methods: {
    //
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      this.is_listLoading = true;
      if (isLt1M) {
        this.is_listLoading = false;
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      this.is_listLoading = false;
      return false
    },
    handleSuccess({ results, header }) {
      let tableData = [];
      let tableHeader = [];
      results.forEach(function(value, index, array) {
        value.id = index+1;
        value.edit = false;
        tableData.push(changeCaseJsonKey(array[index]));
      });
      for(var i=0;i<header.length;i++){
        tableHeader.push(header[i].toLowerCase());
      }
      // this.tableData_o = [...tableData]
      this.tableData = tableData;
      this.tableHeader = tableHeader
      this.is_hasUploadExcel = true;
      console.log(tableData);
      this.uploadExcelTime = moment().format('YYYY-MM-DD HH:mm:ss');
    },
    //关闭对话框
    handleCloseDialog(){
      this.$emit('close')
    },
    handleClearTableData(){
      this.tableData = null;
      this.is_hasUploadExcel = false;

    },
    //编辑
    handleEditTableItem(scope){
      let row = scope.row;
      row.edit = true;
      this.editingRow       = Object.assign({},row);
      this.editingRow_index = scope.$index;
      this.is_showEditItem = true;
      // delete row.oValue;
      // row.oValue = Object.assign({},row);
      // row.edit = true;
    },
    //关闭编辑窗口
    handleCancelEdit(row){
      this.is_showEditItem = false;
      if(this.editingRow_index !== null){
        this.tableData[this.editingRow_index].edit = false;
        this.editingRow_index = null;
      }
    },
    handleConfirmEdit(row){
      console.log(row);
      console.log(row.$index);
       this.$set(this.tableData,this.editingRow_index,row);
    },
    

    //排序
    sortChange(data) {
      const { prop, order } = data
      console.log(data);
      this.sortByField(prop,order)
    },
    sortByField(field,order) {
      if (order === 'descending') {
        this.tableData.sort((a,b)=>{
          return b[field].localeCompare(a[field]);
        })
      } else {
        this.tableData.sort((a,b)=>{
          return a[field].localeCompare(b[field]);
        })
      }
      
    },
  }
}
</script>

<style lang="scss" scope>
.upload-box { margin-bottom : 12px;}
</style>
