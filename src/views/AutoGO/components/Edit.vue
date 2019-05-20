<template>

<div v-loading="is_loadingData">

  <el-form :inline="true"   label-width="128px"  :model="formData" :rules="rules"  ref="editForm" >
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item label="GO_NO" prop="GO_NO">
          <el-input placeholder="GO_NO"  v-model="formData.GO_NO" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Style_No" prop="Style_No">
          <el-input placeholder="Style_No"  v-model="formData.Style_No" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Season"  prop="Season" >
          <el-input placeholder="Season" v-model="formData.Season"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="FDS_NO"  prop="FDS_No" >
          <el-input placeholder="FDS_NO" v-model="formData.FDS_No"></el-input>
        </el-form-item>
      </el-col>
       <el-col :span="12">
        <el-form-item label="GMT_FTY" prop="GMT_FTY">
          <el-select v-model="formData.GMT_FTY" filterable placeholder="GMT_FTY">
              <el-option
                v-for="item in selectBoxData.GMT_FTY"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="OutSource" prop="OutSource">
          <el-select v-model="formData.OutSource" filterable placeholder="OutSource">
            <el-option   label="Y"   :value="1">Y</el-option>
            <el-option   label="N"   :value="0">N </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="12">
        <el-form-item label="Category"  prop="category" >
          <el-input placeholder="Category" v-model="formData.category"></el-input>
        </el-form-item>
      </el-col> -->
  
     
  
    </el-row>
        <!--  -->
    <el-divider></el-divider>
        
        
       
        
        <!-- table列表 -->
    <el-table  :data="tableData" border style:="width: 100%" ref="editTable"   v-if="!is_loadingData">
      <el-table-column v-for="fieldItem of tableFields_1" 
        :key="fieldItem.name" 
        :prop="fieldItem.name" 
        :label="fieldItem.label"  
        :width="fieldItem.width" 
        :min-width="fieldItem.minWidth"
        :fixed="fieldItem.fixed ? fieldItem.fixed : false"  >
        <div slot-scope="scope"   >
          {{scope.row[fieldItem.name]}}
        </div>
      </el-table-column>
      <el-table-column v-for="fieldItem of tableFields_size" 
        :key="fieldItem.name" 
        :label="fieldItem.label"  
        :width="fieldItem.width" 
        :min-width="fieldItem.minWidth"
        :fixed="fieldItem.fixed ? fieldItem.fixed : false"  >
        <div slot-scope="scope"   >
          {{scope.row['sizes'][fieldItem.name]}}
        </div>
      </el-table-column>
      <el-table-column v-for="fieldItem of tableFields_2" 
        :key="fieldItem.name" 
        :prop="fieldItem.name" 
        :label="fieldItem.label"  
        :width="fieldItem.width" 
        :min-width="fieldItem.minWidth"
        :fixed="fieldItem.fixed ? fieldItem.fixed : false"  >
        <div slot-scope="scope"   >
          {{scope.row[fieldItem.name]}}
        </div>
      </el-table-column>

      <el-table-column   label="操作" width="50" fixed="right"  >
        <div slot-scope="scope" >
            <el-button @click="handleEditTableItem(scope)" :type="errorIndex.includes(scope.$index) ? 'danger' : 'primary'" size="mini" icon="el-icon-edit" circle></el-button>
        </div>
      </el-table-column>
    </el-table>	

      
  </el-form>

  <div  class="dialog-footer" style="text-align:right; margin-top:40px;">
    <el-button @click="handleCloseDialog">取消</el-button>
    <el-button @click="handleOK" type="primary"   :loading="is_submiting" :disabled="is_submiting" >提交</el-button>
  </div>
  <!--编辑单项界面-->
  <edit-edit-item @close="handleCancelTableEdit" @OK="handleConfirmTableEdit" :data="editingRow" :extraData="extraData" :index="editingRow_index"  :visible.sync="is_showEditItem" />

</div>


</template>

<script>
import {goAPI,assistAPI} from '@/api'
import { changeCaseJsonKey,deepCopy } from '@/utils/common'
import { checkDelivery } from '@/utils/validate'
import moment from 'moment'
import EditEditItem from './EditEditItem'
import { setTimeout } from 'timers';

export default {
  components: { EditEditItem },
  props: {
    data:null,
    visible:false,
  },
  data() {
    
    return {
      is_loadingData:false,
      is_showEditItem:false,
      itemData:this.data,
      goData:null,
      formData:{
        Season:'',
        FDS_No:'',
        GMT_FTY:'',
        OutSource:'',
        // category:'',
      },
      is_submiting:false,
      selectBoxData:{
        GMT_FTY:[]
      },
      ppo_no_string:'',
      ppo_no_array:'',
      rules : {
        Season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        FDS_No: [
            { required: true, message: '请输入 FDS_NO', trigger: 'blur' }
        ],
        GMT_FTY: [
            { required: true, message: '请选择 destination', trigger: 'change' }
        ],
        OutSource: [
          { required: true, message: '请输入 OutSource', trigger: 'blur' }
        ],
        
      },
      tableFields_1 : [
        {name:'sku',label:'SKU',width:140},
        {name:'combo',label:'Combo',minWidth:150},
        {name:'bpo_date',label:'BPO_Date',width:100},
        {name:'bpo_no',label:'BPO_NO',width:120},
        {name:'warehouse',label:'Warehouse',width:100},
        
      ],
      tableFields_2:[
        {name:'total_qty',label:'Total_Qty',width:100},
      ],
      sizeFields:[],
      tableData:[],
      editingRow : { },
      editingRow_index : null,
      errorIndex : [],
      extraData:{},
      errorRow:[],
      

    }
  },
  computed:{
    tableFields_size(){
      let tableFields_size = [];
      this.sizeFields.forEach(item=>{
        let newItem = {
          name  :item.toLowerCase(),
          label :item.toUpperCase(),
          width:60,
        }
        tableFields_size.push(newItem);
      })
      return tableFields_size;
    },
    
   
   
  },
  watch: {
    data(val) {
      console.log('val')
      console.log(val.GO_NO)
      if (val) {
        this.itemData = val;
        this.getGoData();
      }
    },
    
    is_submiting(val){
      if(val){
        this.loadingObj = this.$loading()
      }else{
        this.loadingObj.close();
      }
    },
    formData: {
      handler(newValue, oldValue) {
          this.extraData = Object.assign(this.extraData,newValue)
      },
      deep: true
    },
 
  },
  methods: {
    init(){

      this.formData={
        Season:'',
        FDS_No:'',
        GMT_FTY:'',
        OutSource:'',
      };
      this.errorIndex = [],
      
      
      this.getFactory();
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      
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
          this.selectBoxData.GMT_FTY = factory_selector_list;
      }).catch((error) => {
        console.log(error)
      })
    },

    
    /**
     * 
     */
    getGoData(){
      return new Promise((resolve,reject)=>{
        this.is_loadingData = true,

        goAPI.getDetail({go_no:this.itemData.GO_NO}).then(res=>{
          this.is_loadingData = false
          if(res.code===0){
            let data = res.data
            this.formData = {
              GO_NO : data.goTitle.GO_NO,
              Style_No : data.goTitle.Style_No,
              Season : data.goTitle.Season,
              FDS_No : data.goTitle.FDS_No,
              GMT_FTY : data.goTitle.Factory,
              OutSource : data.goTitle.OutSource,
            }
           
            this.sizeFields = data.size_fields.map(el=>{
              return el.toLowerCase()
            });


            
         
            let color_code_list = [];
            this.tableData = data.itemList.map((item,index)=>{
              let sizes = {}
              for(let i in item.colorQtyList){
                let el = item.colorQtyList[i];
                sizes[el.Size.toLowerCase()] = el.Qty;
              }
              let newItem = {
                combo        : item.Color_Combo ? item.Color_Combo : '',
                color_code        : item.Color_Code ? item.Color_Code : '',
                bpo_date     : item.goLotInfo ? moment(item.goLotInfo.BPO_Date).format('YYYY-MM-DD') : '',
                bpo_no       : item.goLotInfo ? item.goLotInfo.BPO_NO : '',
                warehouse    : item.goLotInfo ? item.goLotInfo.Warehouse : '',
                total_qty    : _.sumBy(item.colorQtyList,o=>{return o.Qty}),
                sku          : data.goTitle.Style_No+"-"+parseInt(item.Color_Code),
                sizes,
              }
              color_code_list[index] = {
                [item.goLotInfo.BPO_NO] : newItem.color_code,
              }
              this.errorRow.push(index); //用于检查是否可按提交按钮
              return newItem;
            })
            this.extraData = {
              ...this.formData,
              titleData:data.goTitle,
              sizeFields:this.sizeFields,
            }
            this.setColorColdeList();
         
            if(typeof(this.$refs.editForm)!="undefined"){
              this.$refs.editForm.resetFields(); 
            }
            
          }else{

          }
          
          resolve(res)
        }).catch(error=>{
          this.is_loadingData = false,
          reject(error)
        })
      })
      
    },

    setColorColdeList(){
      let tableData = this.tableData;
      let cc_list = tableData.map((el,index)=>{
         return {
           index,
           color_code:el.color_code,
           bpo_no:el.bpo_no,
         }
      })
      this.extraData.color_code_list = cc_list;
      console.log('this.extraData')
      console.log(this.extraData)
    },

    //关闭对话框
    handleOK(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
            let formData = changeCaseJsonKey(Object.assign({},this.formData));
            this.is_submiting = true;
            let data = {
              ...formData,
              data:this.tableData,
            }
            //提交到API
            goAPI.edit(data).then(res=>{
                console.log(res);
                if(res.code===0){
                  this.successAction(data);
                }else{
                  this.$message.success(res.msg);
                }
                this.is_submiting = false;
            }).catch(error=>{ 
              if(typeof(error.code)!="undefined" && error.data && typeof(error.data.errorData)!="undefined"){
                  this.errorIndex = error.data.errorData.errorIndex;
              }
              console.log(error)
              this.is_submiting = false;
            })
             
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * 提交成功后
     */
    successAction(data){
      this.$alert('提交成功', {confirmButtonText: 'OK',
        type:'success',
        callback:()=>{
          this.$emit('OK',data);
          this.handleCloseDialog();
        }
      })
    },
    //关闭对话框
    handleCloseDialog(){
      this.$emit('close')
    },

     //编辑 table item
    handleEditTableItem(scope){
      console.log(scope);
      let row = scope.row;
      row.edit = true;
      this.editingRow       =  deepCopy(row);
      this.editingRow_index = scope.$index;
      this.is_showEditItem = true;
      // delete row.oValue;
      // row.oValue = Object.assign({},row);
      // row.edit = true;
    },
    //关闭编辑窗口
    handleCancelTableEdit(row){
      this.is_showEditItem = false;
      if(this.editingRow_index !== null){
        this.tableData[this.editingRow_index].edit = false;
        this.editingRow_index = null;
      }
    },
    /**
     * 表格编辑点击确认
     */
    handleConfirmTableEdit(row){
      row.check = 1;
      let newItem = Object.assign({},this.editingRow,row);
      this.$set(this.tableData,this.editingRow_index,newItem);
      console.log('confirm this.tableData');
      console.log(this.tableData);
      this.setColorColdeList();
      if(!this.errorRow.includes(this.editingRow_index)){
        this.errorRow.push(this.editingRow_index);
      }
    },
    
  },
  created () {
  },
  mounted() {
    this.init();
    this.getGoData()
  },
  
  activated() {
    
  },


}
</script>
