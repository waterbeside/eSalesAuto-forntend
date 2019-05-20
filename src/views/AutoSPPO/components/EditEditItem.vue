<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" :close-on-click-modal="false" >

    <el-form label-width="180px" :rules="itemRule" :model="editingRow" ref="editForm">
      <el-form-item label="Garment_Part" prop="Garment_Part">
        <el-input v-model="editingRow.Garment_Part"></el-input>
      </el-form-item>
      <el-form-item label="Customer_Fab_Code"  prop="Customer_Fab_Code">
        <el-input v-model="editingRow.Customer_Fab_Code"></el-input>
      </el-form-item>
     
      <el-form-item label="Color_Combo"  prop="Color_Combo">
        <el-input v-model="editingRow.Color_Combo"></el-input>
      </el-form-item>
      <el-form-item label="LD_STD"  prop="LD_STD">
        <el-input v-model="editingRow.LD_STD"></el-input>
      </el-form-item>
      <el-form-item label="Collar_Cuff_Size"  prop="Collar_Cuff_Size">
        <el-input v-model="editingRow.Collar_Cuff_Size"></el-input>
      </el-form-item>
      <el-form-item label="Quantity"  prop="Qty">
        <el-input v-model.number="editingRow.Qty" ></el-input>
      </el-form-item>
       
      <el-form-item label="Remark" prop="Remark">
        <el-input v-model="editingRow.Remark"></el-input>
      </el-form-item>
      
    </el-form>
    <div  slot="footer"  class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleOK">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
const _ = require('lodash');
import { myCache } from '@/utils/common'
import { checkColorCombo,checkCollarCuffSize } from '@/utils/validate'
import {sppoAPI,assistAPI} from '@/api'

export default {
  props: {
    data:null,
    visible:false,
  },
  data() {
    var validate_Color_Combo = (rule, value, callback) => {
      checkColorCombo(value,(res)=>{
        if(res.code === 0){
          callback();
        }else{
          callback(new Error(res.msg));
        }
      })
    };
    var validate_Garment_Part = (rule, value, callback) => {
      myCache.do('checkGarmentPartExist:'+value,[assistAPI.checkFabricTypeExist,{garment_part:value}],600).then(res=>{
        if(res>0){
          callback();
        }else{
          callback(new Error('Garment_Part 不正确'));
        }
      })
    };
    var validate_Customer_Fab_Code = (rule, value, callback) => {
      myCache.do('checkCustomerFabCodeExist:'+value,[assistAPI.checkCustomerFabCodeExist,{customer_fab_code:value}],600).then(res=>{
        if(res>0){
          callback();
        }else{
          callback(new Error('Customer_Fab_Code 不正确'));
        }
      })
    };
    var validate_Collar_Cuff_Size = (rule, value, callback) => {
      if(['F','O','f','o'].includes(this.editingRow.Garment_Part)){
        if(_.trim(value)==''){
          callback(new Error('Collar_Cuff_Size 不能为空'));
        }
        if(!checkCollarCuffSize(value)){
          callback(new Error("'collar_cuff_size'格式必须为:数字*数字"));          
        }
        callback();
      }else{
        callback();
      }
      
    };
    return {
      editingRow: this.data,
      open: false,
      itemRule : {
        Garment_Part: [
            { required: true, message: '请输入 Garment_Part', trigger: 'blur' },
            { validator: validate_Garment_Part, trigger: 'blur' }
        ],
        Customer_Fab_Code: [
            { required: true, message: '请输入 Customer_Fab_Code', trigger: 'blur' },
            { validator: validate_Customer_Fab_Code, trigger: 'blur' }
        ],
        Color_Combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' },
            { validator: validate_Color_Combo, trigger: 'blur' }
        ],
        LD_STD: [
            { required: true, message: '请输入 LD_STD', trigger: 'blur' }
        ],
        Collar_Cuff_Size: [
            { validator: validate_Collar_Cuff_Size, trigger: 'blur' }            
        ],
        Qty: [
            {  required: true, message: '请输入 Quantity', trigger: 'blur' },
            {  type: 'number',  message: 'Quantity 必须为数字', trigger: 'blur' }
        ],
        
      },
      
    }
  },
  computed:{
   
  },
  watch: {
      visible(val) {
          console.log('visible');
          console.log(val);
        if (val) {
          this.open = true;
          this.$emit('open');
          this.init();
        } else {
          if (!this.open) this.$emit('close');
        }
    },
    
    data(val) {
      console.log(val);
        if (val) {
          this.editingRow = val;
        }
    },
  },
  methods: {
    init(){
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
    },
    handleClose(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$emit('OK',this.editingRow);
          this.handleClose();
             
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    //关闭对话框
    handleCancel(){
      this.$emit('cancel',this.editingRow);
      this.handleClose();
    },
  },
  created () {

  },
  mounted() {
    this.init();
  },
  activated() {
    console.log(this.visible);
    console.log(this.visible);
  },


}
</script>
