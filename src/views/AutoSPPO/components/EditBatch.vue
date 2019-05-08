<template>
<div>
  <el-form  label-width="180px" :model="formData" >

    <el-alert title="提示"  type="warning" show-icon style="margin-bottom:20px;"> 
        你正在批量修改
    </el-alert>
    
    <el-form-item label="Season"  >
      <el-input placeholder="Season"></el-input>
    </el-form-item>
    
    <el-form-item label="Garment_Wash">

      <el-select v-model="formData.garment_wash" placeholder="Garment_Wash">
        <el-option
          v-for="item in selectBoxData.garment_wash"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </el-form-item>


    
    <el-form-item label="Delivery" >
        <el-date-picker type="date" placeholder="交期" v-model="formData.delivery"></el-date-picker>
    </el-form-item>

    <el-form-item label="Destination">
       <el-select v-model="formData.destination" placeholder="Destination">
          <el-option
            v-for="item in selectBoxData.destination"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
    </el-form-item>
  </el-form>

  <div  class="dialog-footer" style="text-align:right; margin-top:40px;">
    <el-button @click.native="handleClose = false">取消</el-button>
    <el-button type="primary"   :loading="is_submiting">提交</el-button>
  </div>
</div>
	 

  
</template>

<script>
// import errGif from '@/assets/401_images/401.gif'

export default {
  props: {
    data:null,
    visible:false,
  },
  data() {
    return {
      open: false,
      dataList:[],
      formData:{},
      is_submiting:false,
      selectBoxData:{
        garment_wash:[],
        destination:[]
      }
      
      
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
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } else {
          if (!this.open) this.$emit('close');
        }
    },
    data(val) {
      console.log(val);
        if (val) {
          this.dataList = val;
        }
    },
  },
  methods: {
    handleClose:function(){
      this.open = false;
      this.$emit('update:visible',this.open);
    },
    //关闭对话框
    handleOK(){
      this.$emit('OK',this.formData);
      this.handleClose();
    },
    //关闭对话框
    handleCancel(){
      this.$emit('cancel',this.formData);
      this.handleClose();
    },
  },
  created () {

  },
  activated() {
    console.log(this.visible);
    console.log(this.visible);
  },


}
</script>
