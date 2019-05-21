<template>

<div v-loading="is_loadingData">

  <el-form :inline="true"   label-width="128px"  :model="formData" :rules="rules"  ref="editForm" >
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form-item label="PPO_NO" prop="PPO_NO">
          <el-input placeholder="PPO_NO"  v-model="formData.PPO_NO" :disabled="true"></el-input>
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
        <el-form-item label="Garment_Wash" prop="Garment_Wash">
          <el-select v-model="formData.Garment_Wash" filterable placeholder="Garment_Wash">
            <el-option
              v-for="item in selectBoxData.garment_wash"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
         <el-form-item label="Delivery" prop="Delivery" >
            <el-date-picker type="date" placeholder="交期" v-model="formData.Delivery"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Destination" prop="Destination">
          <el-select v-model="formData.Destination" filterable placeholder="Destination">
              <el-option
                v-for="item in selectBoxData.destination"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
        </el-form-item>
      </el-col>
  
    </el-row>
        <!--  -->
    <el-divider></el-divider>
        
        
       
        
        <!-- table列表 -->
    <el-table  :data="tableData" border style:="width: 100%" ref="editTable"   v-if="!is_loadingData">
      <el-table-column v-for="fieldItem of tableFields" 
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
  <edit-edit-item @close="handleCancelTableEdit" @OK="handleConfirmTableEdit" :data="editingRow"  :visible.sync="is_showEditItem" />

</div>


</template>

<script>
import {sppoAPI,assistAPI} from '@/api'
import { changeCaseJsonKey } from '@/utils/common'
import { checkDelivery } from '@/utils/validate'
import moment from 'moment'

import EditEditItem from './EditEditItem'

export default {
  components: { EditEditItem },
  props: {
    data:null,
    visible:false,
  },
  data() {
    var validate_Delivery =  (rule, value, callback) => {
       if(checkDelivery(value)){
         callback()
       }else{
         callback(new Error('Delivery 交期必须在今天之后'))
       }
    };
    return {
      is_loadingData:false,
      is_showEditItem:false,
      itemData:this.data,
      sppoData:null,
      formData:{
        Season:'',
        Garment_Wash:'',
        Delivery:null,
        Destination:'',
      },
      is_submiting:false,
      selectBoxData:{
        garment_wash:[],
        destination:[]
      },
      ppo_no_string:'',
      ppo_no_array:'',
      rules : {
        Season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        Garment_Wash: [
            { required: true, message: '请选择 Garment_Wash', trigger: 'change' }
        ],
        Delivery: [
            { required: true, message: '请选择日期', trigger: 'blur' },
            { validator: validate_Delivery, trigger: 'change' }
        ],
        Destination: [
            { required: true, message: '请选择 destination', trigger: 'change' }
        ],
      },
      tableFields : [
        {name:'Garment_Part',label:'Garment_Part',width:140},
        {name:'Customer_Fab_Code',label:'Customer_Fab_Code',width:170},
        {name:'Color_Combo',label:'Color_Combo',minWidth:150},
        {name:'LD_STD',label:'LD_STD',width:120},
        {name:'Collar_Cuff_Size',label:'Collar_Cuff_Size',width:140},
        {name:'Qty',label:'Quantity',width:140},
        {name:'Unit',label:'Unit',width:140},
        {name:'Remark',label:'Remark',width:140},
      ],
      tableData:[],
      editingRow : { },
      editingRow_index : null,
      errorIndex : [],
      errorRow:[],      

    }
  },
  computed:{
   
  },
  watch: {
    data(val) {
      console.log('val')
      console.log(val.PPO_NO)
      if (val) {
        this.itemData = val;
        this.getSppoData();
      }
    },
    
    is_submiting(val){
      if(val){
        this.loadingObj = this.$loading()
      }else{
        this.loadingObj.close();
      }
    },
    
  },
  methods: {
    init(){

      this.formData={
        Season:'',
        Garment_Wash:'',
        Delivery:null,
        Destination:'',
      };
      this.errorIndex = [],
      
      
      this.getFactory();
      this.getWashTypes();
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      
    },
    
    /** 
     * 取得分厂选择列表
     */
    getFactory(){
      this.$store.dispatch('cacheData/getFactorys', 0).then((res) => {
          let factory_selector_list = [];
          res.forEach(item => {
            factory_selector_list.push({
              label:item,
              value:item,
            })
          });
          this.selectBoxData.destination = factory_selector_list;
      }).catch((error) => {
        console.log(error)
      })
    },

     /** 
     * 取得garment_wash
     */
    getWashTypes(){
      let cacheList = this.$store.state.cacheData.washTypes;
      if(cacheList && cacheList.length > 0){
        this.selectBoxData.garment_wash = cacheList;
        return ;
      }
      assistAPI.getWashTypes().then((res)=>{
        let list = res.data.list;
        let washTypes_selector_list = [];
        list.forEach(item => {
            washTypes_selector_list.push({
              label:item,
              value:item,
            })
        });
        this.selectBoxData.garment_wash = washTypes_selector_list;
        this.$store.commit('cacheData/SET_WASH_TYPES',washTypes_selector_list);
      })
    },
    /**
     * 
     */
    getSppoData(){
      return new Promise((resolve,reject)=>{
        this.is_loadingData = true,

        sppoAPI.getDetail({ppo_no:this.itemData.PPO_NO}).then(res=>{
          this.is_loadingData = false
          if(res.code===0){
            let data = res.data
            this.formData = {
              PPO_NO : data.sppoTitle.PPO_NO,
              Style_No : data.sppoTitle.Style_No,
              Season : data.sppoTitle.Season,
              Garment_Wash : data.sppoTitle.Garment_Wash,
              Delivery : data.sppoGpDelDest[0].Delivery,
              Destination : data.sppoGpDelDest[0].Destination,
            }
            this.tableData = data.itemList.map((item,index)=>{
              
              let newItem = {
                Garment_Part      : item.sppoGpDelDest ? item.sppoGpDelDest.Garment_Part  : '' ,
                Customer_Fab_Code : item.sppoGpDelDest ? item.sppoGpDelDest.Customer_Fab_Code : '',
                Color_Combo       : item.sppoColorQty ? item.sppoColorQty.Color_Combo : '',
                LD_STD             : item.sppoColorQty ? item.sppoColorQty.LD_STD : '',
                Collar_Cuff_Size    : item.sppoCollarCuff ? item.sppoCollarCuff.Size : '',
                Qty            : item.sppoColorQty ? item.sppoColorQty.Qty : '',
                Unit            : item.sppoGpDelDest ? item.sppoGpDelDest.Unit : '',
                Remark            : item.sppoGpDelDest ? item.sppoGpDelDest.Remark : '',
              }
              return newItem;
            })
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
            sppoAPI.edit(data).then(res=>{
                console.log(res);
                if(res.code===0){
                  this.successAction(data);
                }else{
                  this.$message.success(res.msg);
                }
                this.is_submiting = false;
            }).catch(error=>{ 
              if(typeof(error.code)!="undefined" && typeof(error.data.errorData)!="undefined"){
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
      this.editingRow       = Object.assign({},row);
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
    handleConfirmTableEdit(row){
      row.check = 1;
      let newItem = Object.assign({},this.editingRow,row);
      this.$set(this.tableData,this.editingRow_index,newItem);
      if(!this.errorRow.includes(this.editingRow_index)){
        this.errorRow.push(this.editingRow_index);
      }
    },
  },
  created () {
  },
  mounted() {
    this.init();
    this.getSppoData()
  },
  
  activated() {
    
  },


}
</script>
