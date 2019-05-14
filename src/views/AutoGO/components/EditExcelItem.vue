<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" >

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
        <el-input v-model="editingRow.sku"></el-input>
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
import { checkColorCombo,checkCollarCuffSize } from '@/utils/validate';
import {sppoAPI,assistAPI} from '@/api';
import moment from 'moment'
import { parse } from 'path';

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
    
    return {
      editingRow: this.data,
      open: false,
      
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
        sku: [
            { required: true, message: '请输入 SKU', trigger: 'blur' }
        ],
        
        combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' },
            { validator: validate_Color_Combo, trigger: 'blur' }
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
      this.getFactory();
    },
    handleClose:function(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.editingRow.pdo_date = moment(this.editingRow.pdo_date).format('YYYY-MM-DD');
      this.editingRow.total_qty = this.total_qty;
      console.log(this.editingRow.pdo_date)
      this.$emit('OK',this.editingRow);
      this.handleClose();
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
