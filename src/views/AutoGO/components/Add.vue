<template>
  <div>
    <el-form :model="formData" label-width="80px"  ref="addForm">

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

       
      </div>
      

      
     
      <!-- 上传excel -->
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" v-show="!is_hasUploadExcel" class="upload-box" />

      <!-- 提示 -->
      <el-alert   type="warning"  :closable="false" style="margin-bottom:12px;"> 
        <h3><i class="el-icon-warning"></i> 注意</h3>
        <div style="font-size:14px">
          <p >1、如果以前提交过相同的Style_NO数据，本次操作将会视作修改数据</p>
          <p >2、提交前请点击"检查格式"</p>
        </div>
      </el-alert>

      <!-- 提示：上传excel后 -->
      <el-alert :title="'本次上传Excel的时间为:'+uploadExcelTime"  type="success" :closable="false" v-show="is_hasUploadExcel" style="margin-bottom:4px">  </el-alert>
      
      <!-- 提示：检查数据 -->
      <el-alert  type="info"  v-show="is_showTips" :closable="false" style="margin-bottom:4px">
        <i class="el-icon-loading" v-show="is_checkingAll"></i> {{tips}}
      </el-alert>
      
      <!-- table列表 -->
      <el-table v-loading="is_listLoading" 
        :data="tableData" 
        style:="width: 100%" 
        v-show="is_hasUploadExcel"  
        @sort-change="sortChange"
        border stripe >
        <el-table-column v-for="fieldItem of tableFields" 
          :key="fieldItem.name" 
          :prop="fieldItem.name" 
          :label="fieldItem.label"  
          :width="fieldItem.width" 
          :min-width="fieldItem.minWidth"
          :fixed="fieldItem.fixed ? fieldItem.fixed : false"  >
          <div slot-scope="scope" :class="scope.row.error.includes(fieldItem.name) ? 'column-error':''" :title="fieldItem.label" >
            <el-tooltip   effect="dark" placement="top" 
              :content="typeof(errorMsg[scope.$index][fieldItem.name])!='undefined' ? errorMsg[scope.$index][fieldItem.name] : '格式不正确'" 
              v-show="scope.row.error.includes(fieldItem.name) ? true : false">
              <i class="el-icon-warning" />
            </el-tooltip>
            <el-tooltip  effect="dark" placement="top"  :content="typeof(errorMsg[scope.$index][fieldItem.name])!='undefined' ? errorMsg[scope.$index][fieldItem.name] : fieldItem.label" v-show="true">
              <span>{{scope.row[fieldItem.name] ? scope.row[fieldItem.name] : '&nbsp;&nbsp;'}}</span>
            </el-tooltip>

          </div>
        </el-table-column>

        <el-table-column   label="操作" width="160" fixed="right"  >
          <div slot-scope="scope" >
            <template v-if="scope.$index === editingRow_index">
              正在编辑...
            </template>
            <template v-else-if="scope.row.uploadSuccess">
              <span style="color:#30B08F"><i class="el-icon-check"></i> 上传成功</span>
            </template>
            <template v-else>
              <el-button @click="handleEditTableItem(scope)" type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button @click="checkTableItem(scope.row,scope.$index)" size="mini" plain 
                :type="checkBtnStyle[scope.row.check] ? checkBtnStyle[scope.row.check] : 'default'" 
                :loading="scope.row.check === 2 || checkingRow.has(scope.$index)" 
                :icon="checkBtnIcon[scope.row.check] ? checkBtnIcon[scope.row.check] : ''" >
                检验
              </el-button>
             


            </template>
            
          </div>
        </el-table-column>
      </el-table>	
    </el-form>

    <!-- 底部按钮 -->
    <div  class="fixed-footer-bar" >
      <div>
        <el-button @click.native="handleCloseDialog" :disabled="is_checkingAll"><i class="el-icon-back"></i></el-button>
        <el-button @click.native="handleClearTableData" v-show="is_hasUploadExcel" :disabled="is_checkingAll"><i class="el-icon-upload2"></i> 清除数据(重新上传)</el-button>
        
      </div>
      <div>
        <el-button type="primary" plain @click.native="handleCheckAll" :loading="is_checkingAll"  :disabled="!is_hasUploadExcel || is_checkingAll" icon="el-icon-reading">  检查格式</el-button>
        <el-button type="primary" @click.native="handleSaveAdd" :loading="is_submiting" :disabled="is_submiting || !is_checkAll || !is_hasUploadExcel"><i class="el-icon-check"></i> 提交</el-button>
      </div>
    </div>


    <!--编辑单项界面-->
    <edit-excel-item @close="handleCancelEdit" @OK="handleConfirmEdit" :data="editingRow"  :visible.sync="is_showEditItem" />
    
  </div>
</template>

<script>
const _ = require('lodash');
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {changeCaseJsonKey,myCache,formatDateFromExcel} from '@/utils/common'
import moment from 'moment'
import EditExcelItem from './EditExcelItem'
import { mapGetters } from 'vuex'

import {goAPI,assistAPI} from '@/api'
import { checkColorCombo,checkCollarCuffSize } from '@/utils/validate'


// import {getBrandCode} from '@/api/genBrand'
// import {getFactoryIds} from '@/api/genFactory'
// import {checkFabricTypeExist} from '@/api/fabFabric'
// import {checkWashTypeExist} from '@/api/genWash'



export default {
  name: 'RightPanel',
  components: { UploadExcelComponent,EditExcelItem },
  props: {
   
  },
  data() {
    return {
      is_submiting: false,
      is_hasUploadExcel:false,
      is_showEditItem : false,
      is_checkingAll:false,
      is_listLoading: false,
      is_showTips: false,
      tips:'',
      tableFields : [
        {name:'season',label:'Season',width:90},
        {name:'gmt_fty',label:'GMT_FTY',width:100},
        {name:'outsource',label:'OutSource',width:110},
        {name:'style_no',label:'Style_No',width:110},
        {name:'sku',label:'SKU',width:140},
        {name:'combo',label:'Combo',minWidth:150},
        {name:'bpo_date',label:'BPO_Date',width:100},
        {name:'xs',label:'XS',width:60},
        {name:'s',label:'S',width:60},
        {name:'m',label:'M',width:60},
        {name:'l',label:'L',width:60},
        {name:'xl',label:'XL',width:60},
        {name:'xxl',label:'XXL',width:60},
        {name:'3xl',label:'3XL',width:60},
        {name:'4xl',label:'4Xl',width:60},
        {name:'5xl',label:'5Xl',width:60},
        {name:'6xl',label:'6XL',width:60},
        {name:'7xl',label:'7XL',width:60},
        {name:'8xl',label:'8XL',width:60},
        {name:'total_qty',label:'Total_Qty',width:100},
        {name:'category',label:'Category',width:130},
        {name:'bpo_no',label:'BPO_NO',width:120},
        {name:'warehouse',label:'Warehouse',width:100},
        {name:'fds_no',label:'FDS_No',width:120},
      ],
      sizeFields:['xs','s','m','l','xl','xxl','3xl','4xl','5xl','6xl','7xl','8xl'],
      uploadExcelTime : '',
      
      checkBtnStyle:['danger','default','default','success'],
      checkBtnIcon:['el-icon-close','el-icon-reading','','el-icon-check'],
      errorMsg:[],
      errorRow:[],
      checkingRow:new Set(),
      // form_customer_code:'',
      formData:{
        customer_code:'',
        brand:'',
      },
      // customer_code: [],
      selectBoxData:{
        customer_code:[],
        brand: [],
      },
      // tableData_o: null,
      tableData: null,
      editingRow : { },
      editingRow_index : null,
      tempData:{}
      // editingRowData : null, 
    }
  },
  watch:{
    'formData.customer_code': {
        handler(newValue, oldValue) {
          if(oldValue !== newValue && newValue){
            this.getBrand();
          }
        },
        // deep: true
    },
    is_submiting(val){
      if(val){
        this.loadingObj = this.$loading()
      }else{
        this.loadingObj.close();
      }
    },
    // is_checkingAll(val){
    //   if(val){
    //     this.loadingObj = this.$loading({'text':"检查格式中"})
    //   }else{
    //     this.loadingObj.close();
    //   }
    // }
  },
  computed: {
    is_checkAll(){
      return this.errorRow.length > 0 ? false : true;
    }
  },

  mounted() {
    this.init();
  },
  beforeDestroy() {
   
  },
  methods: {
    init(){
      this.getCustomerCode();
      this.getBrand();
      this.getFactory();
    },
    getTempData(key){
      return typeof(this.tempData[key])!="undefined" ?  this.tempData[key] : null;
    },
    setTempData(key,value){
      this.tempData[key] = value;
    },
    /** 
     * 取得用户客户码选择列表
     */
    getCustomerCode(){
      let udata = this.$store.getters.userData;
      let customer_codes = udata.customer_code;
      let list = [];
      customer_codes.forEach(element => {
        list.push({
          value:element,label:element
        })
      });
      if(list.length === 1){
        this.formData.customer_code = list[0].value;
      }
      this.selectBoxData.customer_code = list;

    },
    /** 
     * 取得客户公司选择列表
     */
    getBrand(){
      let customer_code = this.formData.customer_code;
      assistAPI.getBrandCode({customer_code}).then((res)=>{
        let list = res.data.list;
        let brand_selector_list = [];
        list.forEach(item => {
            brand_selector_list.push({
              label:item.BRAND_CD,
              value:item.BRAND_CD,
            })
        });
        this.selectBoxData.brand = brand_selector_list;
        this.formData.brand = ''
        if(brand_selector_list.length == 1){
          this.formData.brand= brand_selector_list[0].value
        }
      })
    },
    /** 
     * 取得分厂选择列表
     */
    getFactory(){
      this.$store.dispatch('cacheData/getFactorys', 1).then((res) => {
          let factory_selector_list = [];
          res.forEach(item => {
            factory_selector_list.push({
              label:item,
              value:item,
            })
          });
          this.selectBoxData.garment_fty = factory_selector_list;
      }).catch((error) => {
        console.log(error)
      })
    },
    
    /** 
     * 上转表格
     */
    beforeUpload(file) {
      let isLt1M = file.size / 1024 / 1024 < 2 
      this.is_listLoading = true;
      if (isLt1M) {
        this.is_listLoading = false;
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 2m in size.',
        type: 'warning'
      })
      this.is_listLoading = false;
      return false
    },
    /**
     * 表格载入成功后处理
     */
    handleSuccess({ results, header ,error }) {
      let tableData = [];
      let tableHeader = [];
      let hasError = 0;
      
      if(error){
        console.log(error.message)
        this.$message({
          message:'你上我传的表格似乎不太符合规范格式，请检查后重新上传',
          type: 'warning'
        })
        return false;
      }

      tableData = results.map((value, index, array)=>{
        let newItem = changeCaseJsonKey(Object.assign({},value));
        newItem.id = index+1; 
        newItem.idx = index; 
        newItem.edit = false; //添加‘是否正在编辑’状态，
        newItem.check = 1; //查询是否已验证
        newItem.error = []; //放入检查不通过的字段名
        newItem.uploadSuccess = 0; //用于记录是否上传成功
        newItem.bpo_date = formatDateFromExcel(newItem.bpo_date);
        this.errorMsg[index] = {}; //用于检查后存放的错误信息
        this.errorRow.push(index); //用于检查是否可按提交按钮
        return newItem;
      });
      
      for(var i=0;i<header.length;i++){
        tableHeader.push(header[i].toLowerCase());
      }
      console.log(tableHeader);
      let checkEmptyField = ["season","style_no","gmt_fty","outsource"];
      for(let i in checkEmptyField){
        if(!tableHeader.includes(checkEmptyField[i])){
          hasError = 1;
          break;
        }
      }
      if(hasError){
        this.$message({
          message: '你上我传的表格似乎不太符合规范格式，请检查后重新上传',
          type: 'warning'
        })
        return false;
      }
    
      // this.tableData_o = [...tableData]
      this.tableData = tableData;
      this.tableHeader = tableHeader
      this.is_hasUploadExcel = true;
      // console.log(tableData);
      this.uploadExcelTime = moment().format('YYYY-MM-DD HH:mm:ss');
    },

    /**
     * 验证单条格式是否正确
     */
    async checkTableItem(row,index,type = 0){
        // console.log(Season)
        let hasError = false;
        let errorMsg = this.errorMsg;
        row.check = 2; //状态进行中
        this.$set(this.tableData,index,row);
        row.error = [];

        errorMsg[index] = {}
        this.checkingRow.add(index);

        if(!this.errorRow.includes(index)){
         this.errorRow.push(index);
        }

        

        //验证不能为空的字段
        const checkEmptyField = [
          'season','gmt_fty','outsource','style_no','sku','combo','category','bpo_no','warehouse','fds_no'
        ];
        checkEmptyField.forEach((item)=>{
          if( _.trim(row[item]) == ''){
            row.error.push(item);
            errorMsg[index][item] = "'"+item+"'不能为空";
            hasError = true;
          }
        })
        
        //验证必须为整数的字段
        const checkIntegerField = [
          'xs','s','m','l','xl','xxl','3xl','4xl','5xl','6xl','7xl','8xl','total_qty',
        ];
        let total_qty = 0;
        this.sizeFields.forEach(item=>{
          let valueFormat =  _.toInteger(row[item]);
          total_qty += valueFormat;
          if(_.trim(row[item])!='' && _.toInteger(row[item]) != row[item] ){
            row.error.push(item);
            errorMsg[index][item] = "'"+item+"'必须为整数";
            hasError = true;
          }
          
        })
        row.total_qty = total_qty;
        // this.$set(this.tableData,index,row);


        let combo = _.trim(row.combo);
        //color_combo 第三位必须为空格
        if(combo != ''  ){
          checkColorCombo(combo,(res)=>{
            if(res.code !== 0){
              errorMsg[index].combo = res.msg;
              row.error.push('combo');
              hasError = true;
            }
          })
        }

        if(!['y','n'].includes(_.trim(row.outsource).toLowerCase())){
          errorMsg[index].outsource = 'OutSource 必须为Y或者N';
          row.error.push('outsource');
          hasError = true;
        }
       
        //验证GMT_FTY;
        try{
          let factorysList = await this.$store.dispatch('cacheData/getFactorys', 1)
          if(!factorysList.includes(row.gmt_fty)){
            row.error.push('gmt_fty');
            errorMsg[index]['gmt_fty'] = "'GMT_FTY;'不正确";
            hasError = true;
          }
        }catch(error){
          console.log(error);
          if(hasError){
            row.check = 0; //状态为不合格
          }else{ 
            row.check = 1;
          }
          this.$set(this.tableData,index,row);
          this.checkingRow.delete(index);
          return false;
        }

        // console.log(row.error);
        
        if(hasError){
          row.check = 0; //状态为不合格
        }else{ 
          this.errorRow.splice(this.errorRow.findIndex(item => item === index), 1)
          row.check = 3;
        }

        setTimeout(async ()=>{
          this.$set(this.tableData,index,row);
          this.checkingRow.delete(index);
          return  hasError ? false : true
        },300)
        
        
        // resolve( hasError ? false : true)
      
    },

   

    /** 
     * 检查全部
     */
    async handleCheckAll(i){
      i = parseInt(i) || 0;
      console.log('i')
      console.log(i)
      this.is_checkingAll = true
      this.is_showTips = true
      if(this.tableData[i]){
        console.log('handleCheckAlli:'+i)
        this.tips =  "正在检查第 "+(i+1)+" 条数据";
        let res =  await this.checkTableItem(this.tableData[i],i);
        i++
        window.setTimeout(async ()=>{
          await this.handleCheckAll(i);
        },100)
        return true
      }else{
        this.tips =  "检查完成!";
        this.is_checkingAll = false;
        return false
      }
      
      // for(let i in this.tableData){
      //   this.tips =  "正在检查第 "+i+" 条数据";
      //   let res =  await this.checkTableItem(this.tableData[i],i);
      // }
      // this.tips =  "检查完成!";
      // this.is_checkingAll = false
      
    },

    /**
     * 点击提交
     */
    handleSaveAdd(){
      this.is_submiting = true;
      if(this.formData.customer_code == ""){
        this.$message.error("请选择'Customer Code'");
        this.is_submiting = false;
        return false;
      }
      if(this.formData.brand == ""){
        this.$message.error("请选择'Brand'");
        this.is_submiting = false;
        return false;
      }
   
      let data = [];
      this.tableData.forEach((item,index)=>{
        if(item.uploadSuccess !== 1){
          data.push(item);
        }
      })
      let postData = {
        ...this.formData,
        data
      }
      goAPI.add(postData).then(res=>{
        // console.log(res)
        if(res.code === 0 ){
          this.successAction();
          this.is_submiting = false;
          return false;
        }
        this.is_submiting = false;
      }).catch(error=>{
        this.is_submiting = false;
      })
    },

    successAction(){
      this.$alert('提交成功', {confirmButtonText: 'OK',
        type:'success',
        callback:()=>{
          this.handleCloseDialog();
          this.handleClearTableData();
          this.$emit('OK');
        }
      })
    },

    //关闭对话框
    handleCloseDialog(){
      this.$emit('close')
    },
    handleClearTableData(){
      this.tableData = null;
      this.errorMsg = [];
      this.errorRow = [];
      this.is_checkingAll = false;
      this.is_showTips = false;
      this.tips ='';
      this.is_hasUploadExcel = false;
      this.tempData = {};

    },
    //编辑
    handleEditTableItem(scope){
      console.log(scope);
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
      row.check = 1;
      let newItem = Object.assign({},this.editingRow,row);
      this.$set(this.tableData,this.editingRow_index,newItem);
      if(!this.errorRow.includes(this.editingRow_index)){
        this.errorRow.push(this.editingRow_index);
      }
    },


    //排序 （已取消此功能）
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
.column-error {
  color:red;
}
</style>
