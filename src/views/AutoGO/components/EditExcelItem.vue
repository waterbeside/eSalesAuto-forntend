<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" ref="editDialog">

    <el-form label-width="180px" :rules="itemRule" :model="editingRow" ref="editForm">
      <el-form-item label="Season"  prop="season">
        <el-input v-model="editingRow.season"></el-input>
      </el-form-item>

      <el-form-item label="GMT_FTY" prop="gmt_fty">
      <el-select v-model="editingRow.gmt_fty" filterable placeholder="gmt_fty">
          <el-option
            v-for="item in selectBoxData.gmt_fty"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="OutSource" prop="outsource">
        <el-radio v-model="editingRow.outsource" label="Y">Y</el-radio>
        <el-radio v-model="editingRow.outsource" label="N">N</el-radio>
      </el-form-item>
      
      
      <el-form-item label="Style_No" prop="style_no">
        <el-input v-model="editingRow.style_no"></el-input>
      </el-form-item>

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

      <el-form-item v-for="item in sizeFields" :key="item.name" :label="item.label"  :prop="item.name">
        <el-input-number v-model="editingRow[item.name]"   :min="0"  label=""></el-input-number>
      </el-form-item>

      <el-form-item label="Total_Qty"  prop="total_qty">
        {{total_qty}}
        <!-- <el-input v-model="editingRow.total_qty" disabled></el-input> -->
      </el-form-item>

      <el-form-item label="Category" prop="category">
        <el-input v-model="editingRow.category"></el-input>
      </el-form-item>

      <el-form-item label="BPO_NO" prop="bpo_no">
        <el-input v-model="editingRow.bpo_no"></el-input>
      </el-form-item>

      <el-form-item label="Warehouse" prop="warehouse">
        <el-input v-model="editingRow.warehouse"></el-input>
      </el-form-item>

      <el-form-item label="FDS_No" prop="fds_no">
        <el-input v-model="editingRow.fds_no"></el-input>
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
    visible:false,
    customerCode:'',
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
      open: false,
      customer_code:  this.customerCode,
      selectBoxData:{
        gmt_fty: [
          {
            value: 'TDC',
            label: 'TDC'
          }]
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
        category: [
            { required: true, message: '请输入 Category', trigger: 'blur' }
        ],
        bpo_no: [
            { required: true, message: '请输入 BPO_NO', trigger: 'blur' }
        ],
        warehouse: [
            { required: true, message: '请输入 Warehouse', trigger: 'blur' }
        ],
        fds_no: [
            { required: true, message: '请输入 FDS_No', trigger: 'blur' }
        ],

       
       
      },
      
      sizeFields:[
        {name:'xs',label:'XS'},
        {name:'s',label:'S'},
        {name:'m',label:'M'},
        {name:'l',label:'L'},
        {name:'xl',label:'XL'},
        {name:'xxl',label:'XXL'},
        {name:'3xl',label:'3XL'},
        {name:'4xl',label:'4XL'},
        {name:'5xl',label:'5XL'},
        {name:'6xl',label:'6XL'},
        {name:'7xl',label:'7XL'},
        {name:'8xl',label:'8XL'},
      ]
    }
  },
  computed:{
    total_qty(){
      let total_qty = 0;
      this.sizeFields.forEach(el => {
        if(typeof(this.editingRow[el.name]) != 'undefined'){
          let valFormat = parseInt(this.editingRow[el.name]);
          total_qty += valFormat;
        }
      });
      return total_qty;
    },
    sku(){
      let style_no = this.editingRow.style_no;
      let combo = this.editingRow.combo;
      let sku = this.editingRow.sku;
      if(typeof(combo)!='undefined' && combo.length > 3){
         let combo_no = combo.substring(0,2);
         if(parseInt(combo_no)>0){
           sku = style_no + '-' + parseInt(combo_no);
         }
      }
      return sku;
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
    data(val) {
      if (val) {
        this.editingRow = val;
      }
    },
    customerCode(val){
      if (val) {
        this.customer_code = val;
      }
    },
    customerCode(val){
      if (val) {
        this.customer_code = val;
      }
    },
  },
  methods: {
    init(){
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      this.getFactory();
      this.scrollToTop();
      this.getSizes();
    },
    /** 
     * 取得尺寸字段列表
     */
    getSizes(){
      let customer_code = this.customer_code;
      myCache.do('getSizes:'+customer_code,[assistAPI.getSizes,{customer_code}],600).then(res=>{
        let sizeFields = [];
        for(let i in res){
          let newItem = {
            name  :res[i].toLowerCase(),
            label :res[i].toUpperCase(),
          }
          sizeFields.push(newItem)
        }
        this.sizeFields = sizeFields;
      }).catch(error=>{
        console.log(error)
      });
    },
    scrollToTop(){
      this.$refs.editDialog.$el.scrollTop = 0;
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
          this.selectBoxData.gmt_fty = factory_selector_list;
      }).catch((error) => {
        console.log(error)
      })
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
