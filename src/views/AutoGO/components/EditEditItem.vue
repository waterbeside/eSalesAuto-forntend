<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose"   width="65%" ref="editDialog" :close-on-click-modal="false" >

    <el-form label-width="180px" :rules="itemRule" :model="editingRow" ref="editForm">
       

      <el-form-item label="SKU"  prop="sku">
        {{sku}}
      </el-form-item>
      <el-form-item label="Combo"  prop="combo">
        <el-input v-model="editingRow.combo"></el-input>
      </el-form-item>
      <el-form-item label="BPO_Date"  prop="bpo_date">
            <el-date-picker type="date" placeholder="BPO_Date" v-model="editingRow.bpo_date" 
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="Warehouse" prop="warehouse">
        <el-select v-model="editingRow.warehouse" filterable placeholder="Warehouse">
            <el-option
              v-for="item in selectBoxData.warehouse"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
      </el-form-item>
      
      <el-form-item label="BPO_NO" prop="bpo_no">
        <el-input v-model="editingRow.bpo_no"></el-input>
      </el-form-item>

     
       <el-form-item v-for="item in sizeFields" :key="item.name" :label="item.label"  :prop="item.name">
        <el-input-number v-model="editingRow.sizes[item.name]"   :min="0"  label=""></el-input-number>
      </el-form-item>
      

      <el-form-item label="Total_Qty"  prop="total_qty">
        {{total_qty}}
        <!-- <el-input v-model="editingRow.total_qty" disabled></el-input> -->
      </el-form-item>

    
      
    </el-form>
    <div  slot="footer"  class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleOK">OK</el-button>
    </div>
  </el-dialog>

  
</template>

<script>
import { myCache } from '@/utils/common';
import { checkGoCombo } from '@/utils/validate'
import {sppoAPI,assistAPI} from '@/api';
import moment from 'moment'
import { parse } from 'path';

export default {
  props: {
    data:null,
    index:null,
    extraData:null,
    visible:false,
  },
  data() {
    var validate_Combo = (rule, value, callback) => {
      checkGoCombo(value,(res)=>{
        if(res.code === 0){
          callback();
        }else{
          callback(new Error(res.msg));
        }
      })
    };
    
    return {
      editingRow: this.data,
      editingIndex: this.index,
      goExtraData: this.extraData,
      open: false,
      selectBoxData:{
        warehouse: [],
      },
      
      itemRule : {
        style_no: [
            { required: true, message: '请输入 Style_No', trigger: 'blur' }
        ],
        season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
       
        combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' },
            { validator: validate_Combo, trigger: 'blur' }
        ],
      
        bpo_no: [
            { required: true, message: '请输入 BPO_NO', trigger: 'blur' }
        ],
        warehouse: [
            { required: true, message: '请输入 Warehouse', trigger: 'channge' }
        ],
        fds_no: [
            { required: true, message: '请输入 FDS_No', trigger: 'blur' }
        ],

       
       
      },
      sizeFields:[]
    }
  },
  computed:{
    total_qty(){
      let total_qty = 0;
      this.sizeFields.forEach(el => {
        if(typeof(this.editingRow.sizes[el.name]) != 'undefined'){
          let valFormat = parseInt(this.editingRow.sizes[el.name]);
          total_qty += valFormat;
        }
      });
      return total_qty;
    },
    sku(){
      let style_no = this.goExtraData.Style_No;
      let combo = this.editingRow.combo;
      let sku = this.editingRow.sku;
      if(typeof(combo)!='undefined' && combo.length > 3){
         let combo_no = combo.substring(0,2);
         if(parseInt(combo_no)>0){
           sku = style_no + '-' + parseInt(combo_no);
         }
      }
      return sku;
    },
    color_code(){
      let color_code = this.editingRow.color_code;
      let combo = this.editingRow.combo;
      if(typeof(combo)!='undefined' && combo.length > 3){
        color_code = combo.substring(0,2);
      }
      return color_code;
    }
    
  },
  watch: {
    visible(val) {
      if (val) {
        console.log('open edit');
        this.open = true;
        this.$emit('open');
        this.init();
      } else {
        if (!this.open) this.$emit('close');
      }
    },
    data:{
      handler(val) {
        if (val) {
          for(let size in val.sizes){
            // val.sizes[size] = parseInt(val.sizes[size]);
          }
          this.editingRow = val;
        }
      },
      deep: true
    },
    
    index(val) {
      this.editingIndex = val;
    },
    extraData:{
      handler(val) {
        this.goExtraData = val;
      },
      deep: true
    }    
  },
  methods: {
    init(){
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      this.scrollToTop();
      this.getSizes();
      this.getMarkets();
        console.log('this.goExtraData')
        console.log(this.goExtraData)

    },
    /** 
     * 取得尺寸字段列表
     */
    getSizes(){
      this.sizeFields = this.extraData.sizeFields.map(o=>{
        return {
          label:o.toUpperCase(),
          name:o,
        }
      });
    },
    /** 
     * 取得市场warehouse列表
     */
    getMarkets(){
      myCache.do('getMarkets',[assistAPI.getMarkets,null,'data.list'],60*60).then(res=>{
        console.log(res);
        let warehouse = [];
        res.forEach(item => {
          warehouse.push({
            label:item.Warehouse,
            value:item.Warehouse,
          })
        });
        this.selectBoxData.warehouse = warehouse;
      }).catch(error=>{
        console.log(error)
      });
    },
    
    scrollToTop(){
      // this.$refs.editDialog.$el.scrollTop = 0;
    },
    handleClose:function(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.$refs['editForm'].validate((valid,res) => {
        if (valid) {
          this.editingRow.pdo_date = moment(this.editingRow.pdo_date).format('YYYY-MM-DD');
          this.editingRow.total_qty = this.total_qty;
          this.editingRow.sku = this.sku;
          this.editingRow.color_code = this.color_code;
          let hasError = 0;

          let color_code_list = this.extraData.color_code_list;
        
          console.log('ok color_code_list');
          console.log(color_code_list);
          for(let i in color_code_list){
            let el = color_code_list[i];
            console.log(el);
            console.log(this.editingRow);
            console.log(this.editingIndex);
            if(this.editingIndex != el.index && el.color_code == this.color_code && el.bpo_no == this.editingRow.bpo_no ){
              hasError = 1 
            }
          }
          if(hasError){
            this.$message.error('相同的BPO_NO下已经有相同的SKU，请重新检查');
            return false;
          }
      
          console.log(this.editingRow.pdo_date)
          this.$emit('OK',this.editingRow);
          this.handleClose();
        }else{
          let errorMsg = '填写有误，请检查后再保存';
          for(let k in res){
           this.$message.error(res[k][0].message);
           this.scrollToTop()
           break;
          }
        }
      })
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
   
  },
  activated() {
   
  },


}
</script>
