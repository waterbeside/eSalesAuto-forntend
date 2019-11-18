<template>
	<el-dialog title="更正"  :visible.sync="open"  append-to-body :before-close="handleClose" :close-on-click-modal="false" >

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

      <el-form-item label="Garment_Part" prop="garment_part">
        <el-select v-model="editingRow.garment_part" filterable placeholder="Garment_Part">
          <el-option
            v-for="item in selectBoxData.garment_part"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Color_Combo"  prop="color_combo">
        <el-input v-model="editingRow.color_combo"></el-input>
      </el-form-item>


      <el-form-item label="Customer_Fab_Code" prop="customer_fab_code">
        <el-select v-model="editingRow.customer_fab_code" filterable placeholder="Customer_Fab_Code">
          <el-option
            v-for="item in selectBoxData.customer_fab_code"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="Collar_Cuff_Size"  prop="collar_cuff_size" v-show="isShowCCS">
        <el-col :span="8">
          <el-input v-model="ccs_1"  type="number"></el-input>
        </el-col>
        <el-col  :span="2" style="text-align:center;font-size:20px">*</el-col>
        <el-col :span="8">
          <el-input v-model="ccs_2"  type="number"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="Remark" prop="remark">
        <el-input v-model="editingRow.remark"></el-input>
      </el-form-item>
      
    </el-form>

    <dialog-foot-btns slot="footer"  class="dialog-footer"  @cancel="handleCancel" @ok="handleOK" okText="确定" ></dialog-foot-btns>

  </el-dialog>

  
</template>

<script>
import { myCache } from '@/utils/common'
import { checkColorCombo,checkCollarCuffSize } from '@/utils/validate'
import {sppoAPI,assistAPI} from '@/api'
import DialogFootBtns from '@/components/DialogFootBtns'

export default {
  components: { DialogFootBtns },
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
      // myCache.do('checkCustomerFabCodeExist:'+value,[assistAPI.checkCustomerFabCodeExist,{customer_fab_code:value}],600).then(res=>{
      //   if(res>0){
      //     callback();
      //   }else{
      //     callback(new Error('Customer_Fab_Code 不正确'));
      //   }
      // })
    };
    var validate_Collar_Cuff_Size = (rule, value, callback) => {
      if(this.isShowCCS){
        if(this.ccs_1 < 1  || this.ccs_2 < 1){
          callback(new Error("'collar_cuff_size'格式必须为:数字*数字，并必须大于0"));       
        }
      }
      callback();
      // if(['F','O','f','o'].includes(this.editingRow.Garment_Part)){
      //   if(_.trim(value)==''){
      //     callback(new Error('Collar_Cuff_Size 不能为空'));
      //   }
      //   if(!checkCollarCuffSize(value)){
      //     callback(new Error("'collar_cuff_size'格式必须为:数字*数字"));          
      //   }
      //   callback();
      // }else{
      //   callback();
      // }       
    };
    return {
      editingRow: this.data,
      open: false,
      selectBoxData:{
        garment_wash:[],
        garment_part:[],
        customer_fab_code:[],
      },
      ccs_1:0,
      ccs_2:0,
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
            { required: true, message: '请输入 Garment_Part', trigger: 'change' },
            // { validator: validate_Customer_Fab_Code, trigger: 'change' }
            // { validator: validate_Garment_Part, trigger: 'change' }
        ],
        color_combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' },
            { validator: validate_Color_Combo, trigger: 'blur' }
        ],
        customer_fab_code: [
            { required: true, message: '请输入 Customer_Fab_Code', trigger: 'change' },
            { validator: validate_Customer_Fab_Code, trigger: 'change' }
        ],
        collar_cuff_size: [
            { validator: validate_Collar_Cuff_Size, trigger: 'blur' }      
        ],
       
      },
      
    }
  },
  computed:{
    isShowCCS(){
     let Garment_Part = typeof(this.editingRow.garment_part)!="undefined" && this.editingRow.garment_part ? this.editingRow.garment_part.toLowerCase() : '';
     if(['f','o'].includes(Garment_Part)){
        return true;
      }else{
        return false;
      }
    }
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
    isShowCCS(val){
      if(val){
        this.selectBoxData.customer_fab_code.forEach(el=>{
          el.disabled = el.from == 'collar_cuff' ? false :true ;
          return el;
        })
      }else{
        this.selectBoxData.customer_fab_code.forEach(el=>{
          el.disabled = el.from == 'collar_cuff' ? true :false ;
          return el;
        })
      }
    }
  },
  methods: {
    init(){
      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
      this.getWashTypes();
      this.getCustomerFabCodes();
      this.getGarmentParts();
      if(this.isShowCCS){
        let ccs_arr = this.editingRow.collar_cuff_size.split('*');
        this.ccs_1 = parseInt(ccs_arr[0]) ?  parseInt(ccs_arr[0]) : 0;
        this.ccs_2 = typeof(ccs_arr[1])!='undefined' ? parseInt(ccs_arr[1]) : 0 ;
      }

    },
    handleClose:function(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if(this.isShowCCS){
            this.editingRow.collar_cuff_size = this.ccs_1 + "*" + this.ccs_2
          }else{
            this.editingRow.collar_cuff_size = '';
          }
          this.$emit('ok',this.editingRow);
          this.handleClose();
        }else{
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
    this.init();
  },
  activated() {
    console.log(this.visible);
    console.log(this.visible);
  },


}
</script>
