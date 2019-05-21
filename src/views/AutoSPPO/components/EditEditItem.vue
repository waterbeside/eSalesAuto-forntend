<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" :close-on-click-modal="false" >

    <el-form label-width="180px" :rules="itemRule" :model="editingRow" ref="editForm">
      <el-form-item label="Garment_Part" prop="Garment_Part">
        <el-select v-model="editingRow.Garment_Part" filterable placeholder="Garment_Part">
          <el-option
            v-for="item in selectBoxData.garment_part"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Customer_Fab_Code" prop="Customer_Fab_Code">
        <el-select v-model="editingRow.Customer_Fab_Code" filterable placeholder="Customer_Fab_Code">
          <el-option
            v-for="item in selectBoxData.customer_fab_code"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
     
     
      <el-form-item label="Color_Combo"  prop="Color_Combo">
        <el-input v-model="editingRow.Color_Combo"></el-input>
      </el-form-item>
      <el-form-item label="LD_STD"  prop="LD_STD">
        <el-input v-model="editingRow.LD_STD"></el-input>
      </el-form-item>
      <el-form-item label="Collar_Cuff_Size"  prop="Collar_Cuff_Size" v-show="isShowCCS">
        <el-col :span="8">
          <el-input v-model="ccs_1" type="number"></el-input>
        </el-col>
        <el-col  :span="2" style="text-align:center;font-size:20px">*</el-col>
        <el-col :span="8">
          <el-input v-model="ccs_2"  type="number"></el-input>
        </el-col>
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
      let hasError = 0;
      let errorMsg = '';
      let Customer_Fab_Code = this.editingRow.Customer_Fab_Code;
      for(let i in this.selectBoxData.customer_fab_code){
        let item = this.selectBoxData.customer_fab_code[i];
        if( Customer_Fab_Code == item.value && item.disabled ){
          hasError = 1;
          errorMsg = '当Garment_Part为'+this.editingRow.Garment_Part+'时，'+Customer_Fab_Code+'不可选';
          break;
        }
      }
      if(hasError){
        callback(new Error(errorMsg));
      }else{
        callback();
      }
    };
    var validate_Collar_Cuff_Size = (rule, value, callback) => {
      if(this.isShowCCS){
        if(this.ccs_1 < 1  || this.ccs_2 < 1){
          callback(new Error("'collar_cuff_size'格式必须为:数字*数字，并必须大于0"));       
        }
      }
      callback();
      
    };
    return {
      editingRow: this.data,
      open: false,
      selectBoxData:{
        customer_fab_code:[],
        garment_part:[]
      },
      ccs_1:0,
      ccs_2:0,
      itemRule : {
        Garment_Part: [
            { required: true, message: '请输入 Garment_Part', trigger: 'change' },
            // { validator: validate_Customer_Fab_Code, trigger: 'change' }
            // { validator: validate_Garment_Part, trigger: 'blur' }
        ],
        Customer_Fab_Code: [
            { required: true, message: '请输入 Customer_Fab_Code', trigger: 'change' },
            { validator: validate_Customer_Fab_Code, trigger: 'change' }
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
    isShowCCS(){
     let Garment_Part = typeof(this.editingRow.Garment_Part)!="undefined" && this.editingRow.Garment_Part ? this.editingRow.Garment_Part.toLowerCase() : '';
     if(['f','o'].includes(Garment_Part)){
        return true;
      }else{
        return false;
      }
    }
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
    isShowCCS(val){
      if(val){
        this.selectBoxData.customer_fab_code.forEach(el=>{
          el.disabled = el.from == 'collar_cuff' ? false :true ;
          return el;
        })
      }else{
        this.selectBoxData.customer_fab_code.forEach(el=>{
          el.disabled = el.from == 'collar_cuff' ? true :false ;
          return el
        })
      }
    }
  },
  methods: {
    init(){
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      this.getCustomerFabCodes();
      this.getGarmentParts();
      if(this.isShowCCS){
        let ccs_arr = this.editingRow.Collar_Cuff_Size.split('*');
        this.ccs_1 = parseInt(ccs_arr[0]) ?  parseInt(ccs_arr[0]) : 0;
        this.ccs_2 = typeof(ccs_arr[1])!='undefined' ? parseInt(ccs_arr[1]) : 0 ;
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
          if(this.isShowCCS){
            this.editingRow.Collar_Cuff_Size = this.ccs_1 + "*" + this.ccs_2
          }else{
            this.editingRow.Collar_Cuff_Size = '';
          }
          this.$emit('OK',this.editingRow);
          this.handleClose();
        } else {
          return false;
        }
      });
      
    },
    //关闭对话框
    handleCancel(){
      this.$emit('cancel',this.editingRow);
      this.handleClose();
    },
    /** 
     * getCustomerFabCodes
     */
    getCustomerFabCodes(){
      myCache.do('getCustomerFabCodes',[sppoAPI.getCustomerFabCodes,null,'data.list'],60*60).then(res=>{
        console.log(res);
        let customer_fab_code = [];
        res.forEach(item => {
          customer_fab_code.push({
            label:item.customer_fab_code,
            value:item.customer_fab_code,
            from:item.from,
            disabled: this.isShowCCS  ?  (item.from == 'collar_cuff' ? false :true ) : (item.from == 'collar_cuff' ? true :false ),
          })
        });
        this.selectBoxData.customer_fab_code = customer_fab_code;
      }).catch(error=>{
        console.log(error)
      });
    },

    /** 
     * getGarmentParts
     */
    getGarmentParts(){
      myCache.do('getGarmentParts',[assistAPI.getGarmentParts,null,'data.list'],60*60).then(res=>{
        console.log(res);
        let garment_part = [];
        res.forEach(item => {
          garment_part.push({
            label:item,
            value:item,
          })
        });
        this.selectBoxData.garment_part = garment_part;
      }).catch(error=>{
        console.log(error)
      });
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
