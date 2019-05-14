<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" >

    <el-form label-width="180px" :rules="itemRule" :model="editingRow" ref="editForm">
      <el-form-item label="Style_No" prop="style_no">
        <el-input v-model="editingRow.style_no"></el-input>
      </el-form-item>

      <el-form-item label="Season"  prop="season">
        <el-input v-model="editingRow.season"></el-input>
      </el-form-item>
      <el-form-item label="Garment_Wash" prop="garment_wash">
      <el-select v-model="editingRow.garment_wash" filterable placeholder="Garment_Wash">
        <el-option
          v-for="item in selectBoxData.garment_wash"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </el-form-item>


      <!-- <el-form-item label="Garment_Wash"  prop="garment_wash">
        <el-input v-model="editingRow.garment_wash"></el-input>
      </el-form-item> -->
      <el-form-item label="Garment_Part"  prop="garment_part">
        <el-input v-model="editingRow.garment_part"></el-input>
      </el-form-item>
      <el-form-item label="Color_Combo"  prop="color_combo">
        <el-input v-model="editingRow.color_combo"></el-input>
      </el-form-item>
      <el-form-item label="Customer_Fab_Code"  prop="customer_fab_code">
        <el-input v-model="editingRow.customer_fab_code" ></el-input>
      </el-form-item>
      <el-form-item label="Collar_Cuff_Size"  prop="collar_cuff_size">
        <el-input v-model="editingRow.collar_cuff_size"></el-input>
      </el-form-item>
        <el-form-item label="Remark" prop="remark">
        <el-input v-model="editingRow.remark"></el-input>
      </el-form-item>
      
    </el-form>
    <div  slot="footer"  class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleOK">OK</el-button>
    </div>
  </el-dialog>

  
</template>

<script>
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
      selectBoxData:{
        garment_wash:[],
      },
      itemRule : {
        style_no: [
            { required: true, message: '请输入 Style_No', trigger: 'blur' }
        ],
        season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        garment_wash: [
            { required: true, message: '请选择 Garment_Wash', trigger: 'change' }
        ],
        garment_part: [
            { required: true, message: '请输入 Garment_Part', trigger: 'blur' },
            { validator: validate_Garment_Part, trigger: 'blur' }
        ],
        color_combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' },
            { validator: validate_Color_Combo, trigger: 'blur' }
        ],
        customer_fab_code: [
            { required: true, message: '请输入 Customer_Fab_Code', trigger: 'blur' },
            { validator: validate_Customer_Fab_Code, trigger: 'blur' }
        ],
        Collar_Cuff_Size: [
            { validator: validate_Collar_Cuff_Size, trigger: 'blur' }            
        ],
       
      },
      
    }
  },
  computed:{
   
  },
  watch: {
    visible(val) {
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
      this.getWashTypes();
    },
    handleClose:function(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.$emit('OK',this.editingRow);
      this.handleClose();
    },
    //关闭对话框
    handleCancel(){
      this.$emit('cancel',this.editingRow);
      this.handleClose();
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
  },
  created () {
    this.init();
  },
  activated() {
    console.log(this.visible);
    console.log(this.visible);
  },


}
</script>
