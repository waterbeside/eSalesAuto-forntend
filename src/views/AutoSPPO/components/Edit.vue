<template>
<div>
  <el-form :inline="true" :model="filters">
        <el-form-item label="Style_No">
          <el-input placeholder="BB20011037"></el-input>
        </el-form-item>
        <el-form-item label="Season" style="margin-left:22px">
          <el-input placeholder="20Q1"></el-input>
        </el-form-item>
        <el-form-item label="Garment_Wash">
           <el-input placeholder="Non-Wash"></el-input>
        </el-form-item>
        <el-form-item label="Delivery" style="margin-left:5px">
           <el-date-picker type="date" placeholder="2019-03-28"></el-date-picker>
        </el-form-item>
        <el-form-item label="Destination">
           <el-dropdown>
                <el-button>TDC<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                   <el-dropdown-item>TDC</el-dropdown-item>
                   <el-dropdown-item>YMG</el-dropdown-item>
                   <el-dropdown-item>GEG</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
        </el-form-item>
        
        <!-- <el-table
          :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style:="width: 100%">
          <el-table-column prop="garment_part" label="Garment_Part"></el-table-column>
          <el-table-column prop="customer_Fab_Code" label="Customer_fab_code"></el-table-column>
          <el-table-column prop="color_Combo" label="Color_combo"></el-table-column>
          <el-table-column prop="ldstd" label="LD_STD"></el-table-column>
          <el-table-column prop="collar_Cuff_Size" label="Collar_cuff_size"></el-table-column>
          <el-table-column prop="quantity" label="Quantity"></el-table-column>
          <el-table-column prop="unit" label="Unit"></el-table-column>
          <el-table-column prop="remark" label="Remark"></el-table-column>
	     </el-table> -->
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
