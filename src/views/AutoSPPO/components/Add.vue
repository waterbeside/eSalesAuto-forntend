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
      <el-table v-loading="is_listLoading" :data="tableData" border style:="width: 100%" v-show="is_hasUploadExcel"  @sort-change="sortChange">
        <el-table-column v-for="fieldItem of tableFields" 
          :key="fieldItem.name" 
          :prop="fieldItem.name" 
          :label="fieldItem.label"  
          :width="fieldItem.width" 
          :min-width="fieldItem.minWidth"
          :fixed="fieldItem.fixed ? fieldItem.fixed : false"  >
          <div slot-scope="scope" :class="scope.row.error.includes(fieldItem.name) ? 'column-error':''" >
            <el-tooltip class="item" effect="dark" placement="top" 
              :content="typeof(errorMsg[scope.$index][fieldItem.name])!='undefined' ? errorMsg[scope.$index][fieldItem.name] : '格式不正确'" 
              v-show="scope.row.error.includes(fieldItem.name) ? true : false">
              <i class="el-icon-warning" />
            </el-tooltip>
            {{scope.row[fieldItem.name]}}
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
import {changeCaseJsonKey,asyncForEach,myCache} from '@/utils/common'
import moment from 'moment'
import EditExcelItem from './EditExcelItem'
import { mapGetters } from 'vuex'

import {sppoAPI,assistAPI} from '@/api'
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
        {name:'style_no',label:'Style_No',width:120,fixed:true},
        {name:'season',label:'Season',width:120},
        {name:'garment_wash',label:'Garment_Wash',width:140},
        {name:'garment_part',label:'Garment_Part',width:140},
        {name:'color_combo',label:'Color_Combo',minWidth:150},
        {name:'customer_fab_code',label:'Customer_Fab_Code',width:170},
        {name:'collar_cuff_size',label:'Collar_Cuff_Size',width:140},
        {name:'remark',label:'Remark',width:140}
      ],
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
        garment_fty:'',
      },
      // customer_code: [],
      selectBoxData:{
        customer_code:[],
        brand: [],
        garment_fty: [
          {
            value: 'TDC',
            label: 'TDC'
          }]
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
      let cacheList = this.$store.state.cacheData.factorys;
      if(cacheList && cacheList.length > 0){
        this.selectBoxData.garment_fty = cacheList;
        return ;
      }
      assistAPI.getFactoryIds().then((res)=>{
        let list = res.data.list;
        let factory_selector_list = [];
        list.forEach(item => {
            factory_selector_list.push({
              label:item,
              value:item,
            })
        });
        this.selectBoxData.garment_fty = factory_selector_list;
        this.$store.commit('cacheData/SET_FACTORYS',factory_selector_list);
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
      if(error){
        console.log(error.message)
        this.$message({
          message:'你上我传的表格似乎不太符合规范格式，请检查后重新上传',
          type: 'warning'
        })
        return false;
      }
      results.forEach((value, index, array)=>{
        value.id = index+1; 
        value.idx = index; 
        value.edit = false; //添加‘是否正在编辑’状态，
        value.check = 1; //查询是否已验证
        value.error = []; //放入检查不通过的字段名
        value.uploadSuccess = 0; //用于记录是否上传成功
        if(typeof(value.remark)=="undefined"){ 
          value.remark = '';
        }
        if(typeof(value.collar_cuff_size)=="undefined"){ 
          value.collar_cuff_size = '';
        }
        tableData.push(changeCaseJsonKey(array[index]));
        this.errorMsg[index] = {}; //用于检查后存放的错误信息
        this.errorRow.push(index); //用于检查是否可按提交按钮
      });
      
      for(var i=0;i<header.length;i++){
        tableHeader.push(header[i].toLowerCase());
      }
      console.log(tableData);
      if(!tableHeader.includes("season") || !tableHeader.includes('style_no') || !tableHeader.includes('garment_wash') ){
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
        errorMsg[index] = {}
        this.checkingRow.add(index);
        console.log('this.checkingRow');
        console.log(this.checkingRow);
        if(!this.errorRow.includes(index)){
         this.errorRow.push(index);
        }

        const checkEmptyField = [
          'style_no','season','garment_wash','garment_part','color_combo','customer_fab_code'
        ];
        let garment_wash = _.trim(row.garment_wash);
        let garment_part = _.trim(row.garment_part);
        let color_combo = _.trim(row.color_combo);
        let customer_fab_code = _.trim(row.customer_fab_code);
        let collar_cuff_size = _.trim(row.collar_cuff_size);
        
        row.check = 2; //状态进行中
        this.$set(this.tableData,index,row);
        row.error = [];


        checkEmptyField.forEach((item)=>{
          if( _.trim(row[item]) == ''){
            row.error.push(item);
            errorMsg[index][item] = "'"+item+"'不能为空";
            hasError = true;
          }
        })
        //color_combo 第三位必须为空格
        
        if(color_combo != ''  ){
          checkColorCombo(color_combo,(res)=>{
            if(res.code !== 0){
              errorMsg[index].color_combo = res.msg;
              row.error.push('color_combo');
              hasError = true;
            }
          })
        }

        //Customer_Fab_Code 相同Style_No, 相同Garment_Part, 只可以出现一个
        if(customer_fab_code != ''){
          let otherdRowIndex = this.tableData.findIndex(item=>{
            return (_.trim(item.style_no) == _.trim(row.style_no) && _.trim(item.garment_part) == _.trim(garment_part) && _.trim(item.customer_fab_code) != customer_fab_code &&  item.id != row.id);
          })
          if(otherdRowIndex != -1){
            errorMsg[index].customer_fab_code = "相同Style_No, 相同Garment_Part, 只可以出现一个Customer_Fab_Code";
            if(typeof(errorMsg[otherdRowIndex])=="undefined"){
              errorMsg[otherdRowIndex] = {};
            }
            errorMsg[otherdRowIndex].customer_fab_code = "相同Style_No, 相同Garment_Part, 只可以出现一个Customer_Fab_Code";
            row.error.push('customer_fab_code');
            hasError = true;
            let otherErrorRow = this.tableData[otherdRowIndex];
            otherErrorRow.error.push('customer_fab_code');
            this.$set(this.tableData,otherdRowIndex,otherErrorRow);
          }
          try {
            let checkFabCodeRes = await myCache.do('checkCustomerFabCodeExist:'+customer_fab_code,[assistAPI.checkCustomerFabCodeExist,{customer_fab_code}],600);

            if(checkFabCodeRes < 1){
              row.error.push('customer_fab_code');
              errorMsg[index]['customer_fab_code'] = "'customer_fab_code'不正确";
              hasError = true;
            }
          } catch (error) { 
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
        }

        //Collar_Cuff_Size 格式必须为【数字 * 数字】,比如39.5 * 5，并且Garment_Part是O或者F的时候必须要有值.否则红色标识出来.
        if(garment_part!='' && ['F','O','f','o'].includes(garment_part)){
          if( collar_cuff_size == ''){ //如果为空
            row.error.push('collar_cuff_size');
            errorMsg[index]['collar_cuff_size'] = "当Garment_Part是O或F时'collar_cuff_size'不能为空";
            hasError = true;
          }else{ 
            if(!checkCollarCuffSize(collar_cuff_size)){
              row.error.push('collar_cuff_size');
              errorMsg[index]['collar_cuff_size'] = "'collar_cuff_size'格式必须为:数字*数字";
              hasError = true;
            }
          }
        }


        // Garment_Wash 判断ESCM的数据库有无此洗水
        try {
          let checkWashTypeRes = await myCache.do('checkWashTypeExist:'+garment_wash,[assistAPI.checkWashTypeExist,{garment_wash}],600);
          if(checkWashTypeRes < 1){
            row.error.push('garment_wash');
            errorMsg[index]['garment_wash'] = "'garment_wash'不正确";
            hasError = true;
          }
        } catch (error) { 
          if(hasError){
            row.check = 0; //状态为不合格
          }else{ 
            row.check = 1;
          }
          this.$set(this.tableData,index,row);
          this.checkingRow.delete(index);
          return false;
        }

        try{
          let checkPartRes = await myCache.do('checkGarmentPartExist:'+garment_part,[assistAPI.checkFabricTypeExist,{garment_part}],600);
          if(checkPartRes < 1){
            row.error.push('garment_part');
            errorMsg[index]['garment_part'] = "'garment_part'不正确";
            hasError = true;
          }
        } catch (error){
          if(hasError){
            row.check = 0; //状态为不合格
          }else{ 
            row.check = 1;
          }
          this.$set(this.tableData,index,row);
          this.checkingRow.delete(index);
          return false;
        }
      
        
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
        },300)
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
      if(this.formData.garment_fty == ""){
        this.$message.error("请选择'Garment Fty'");
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
      sppoAPI.add(postData).then(res=>{
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
      this.$set(this.tableData,this.editingRow_index,row);
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
