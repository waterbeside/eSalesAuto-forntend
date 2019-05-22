<template>
  <div  class="my-dialog-footer"  >
    <slot />
    <el-button @click="handleClose">{{cancelText}}</el-button>
    <el-button @click="handleOK" type="primary"   :loading="is_submiting" :disabled="is_submiting" >{{okText}}</el-button>
    <slot name="after"/>
  </div>
</template>

<script>


export default {
  props:{
    submiting:{
      default:false
    },
    cancelText:{ 
      default: '取消'
    },
    okText:{ 
      default: '提交'
    },
    
  },
  data() {
    return {
      levelList: null,
      is_submiting:this.submiting,
    }
  },
  watch:{
    submiting(val){
      this.is_submiting = val;
    },
  },
  
  methods: {
    
    handleClose() {
      this.$emit('cancel');
    },
    handleOK() {
      this.$emit('ok');
    },
    
  }
}
</script>

<style lang="scss" scoped>
.mt {
  margin-top:40px;
}
.my-dialog-footer {
 text-align:right; 
//  margin-top:40px;
}
</style>
