<template>
	<el-dialog title="编辑 "  :visible.sync="open"  append-to-body :before-close="handleClose" >

    <el-form label-width="180px" :rules="itemRule" :model="editingRow">
      <el-form-item label="Style_No" prop="style_no">
        <el-input v-model="editingRow.style_no"></el-input>
      </el-form-item>

      <el-form-item label="Season"  prop="season">
        <el-input v-model="editingRow.season"></el-input>
      </el-form-item>
      <el-form-item label="Garment_Wash"  prop="garment_wash">
        <el-input v-model="editingRow.garment_wash"></el-input>
      </el-form-item>
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
// import errGif from '@/assets/401_images/401.gif'

export default {
  props: {
    data:null,
    visible:false,
  },
  data() {
    return {
      editingRow: this.data,
      open: false,
      itemRule : {
        style_no: [
            { required: true, message: '请输入 Style_No', trigger: 'blur' }
        ],
        season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        garment_wash: [
            { required: true, message: '请输入 Garment_Wash', trigger: 'blur' }
        ],
        garment_part: [
            { required: true, message: '请输入 Garment_Part', trigger: 'blur' }
        ],
        color_combo: [
            { required: true, message: '请输入 Color_Combo', trigger: 'blur' }
        ],
        customer_fab_code: [
            { required: true, message: '请输入 Customer_Fab_Code', trigger: 'blur' }
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
          this.editingRow = val;
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
      this.$emit('OK',this.editingRow);
      this.handleClose();
    },
    //关闭对话框
    handleCancel(){
      this.$emit('cancel',this.editingRow);
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
