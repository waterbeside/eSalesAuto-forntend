<template>
  <div>
    <el-form :model="formData" label-width="184px"  ref="detailForm" :rules="rules" v-loading="is_loading">
      
      
      <el-form-item v-for="(item, index) in fields" :key="index" :label="item.field" :prop="item.field" :error="errorFields[item.field]">
        <el-input 
          v-model="formData[item.field]" 
          :type="item.type ? item.type : 'text'" 
          :placeholder="item.field" 
          :maxlength="item.maxlength ? item.maxlength : null"
          :minlength="item.minlength ? item.minlength : null"
          show-word-limit
          clearable
          autocomplete="off"  ></el-input>
      </el-form-item>
      

      <dialog-foot-btns class="mt" @cancel="handleClose" @ok="handleOK" :submiting='is_submiting'></dialog-foot-btns>
    </el-form>
  </div>
</template>



<script>


import * as fabApi from '@/api/masterFabricationLN'
import DialogFootBtns from '@/components/DialogFootBtns'

export default {
  components: { DialogFootBtns},
  props: {
    id:0,
  },
  data() {
    const fields = [
      {field: 'Customer_Fab_Code', rule:['required'], maxlength: 50},
      {field: 'Refer_PPO_Usage', rule:['required'], maxlength: 20},
      {field: 'Dye_Method', rule:['required'], maxlength: 20},
      {field: 'Fab_Desc', rule:['required'], type: 'textarea'},
      {field: 'Fab_Pattern', rule:['required']},
      {field: 'Fab_Type', rule:['required'], maxlength: 50},
      {field: 'Fab_Width', rrule:['required'], maxlength: 10},
      {field: 'Fab_Remark', rule:[], type: 'textarea'},
      {field: 'Finishing', rule:['required'], type: 'textarea'},
      {field: 'Shrinkage', rule:['required'], maxlength: 10},
      {field: 'Shrinkage_Test_Method', rule:['required'], maxlength: 20},
      {field: 'Weight_AW', rule:['required'], type: 'number'},
      {field: 'Weight_BW', rule:['required'], type: 'number'},
      {field: 'Yarn_Type', rule:['required']},
      {field: 'Yarn_Strands', rule:['required'], maxlength: 10},
      {field: 'Yarn_Ratio', rule:['required'], maxlength: 300},
      {field: 'Yarn_Count', rule:['required'], maxlength: 50},
    ];
    const rules = {};
    for (const i in fields) {
      const item = fields[i];
      if (item.rule) {
        rules[item.field] = [];
        item.rule.forEach((rItem, index)=>{
          if (rItem === 'required') {
            rules[item.field].push({required: true, message: `请输入${item.field}`,  trigger: 'blur'});
          }
        })
      }
    }
    return {
      formData:{},
      errorFields:[],
      selectBoxData:{},
      is_loading: false,
      is_submiting: false,
      fields,
      rules,
    }
  },
  watch:{
    is_submiting(val){
      if(val){
        this.loadingObj = this.$loading()
      }else{
        this.loadingObj.close();
      }
    },
    id(val){
      
    }
  },
  computed: {

  },


  methods: {
    init(){
      console.log('id')
      console.log(this.id);
      if(this.id > 0){
        this.getDetail()
      }
    },

    getDetail(){
      this.is_loading = true;
      fabApi.getDetail(this.id).then(res=>{
        if(res.code == '20002'){
          this.alertClose('数据不存在或已经被删除');
          return false;
        }
        this.formData = res.data;
        setTimeout(()=>{this.is_loading = false},500);
      }).catch(error=>{
        // this.handleClose()
        this.alertClose('查询失败');
        this.is_loading = false;
      })
    },

    alertClose(msg,type='warning'){
      this.$alert(msg, {confirmButtonText: 'OK',
        type,
        callback:()=>{
          this.$emit('close');
        }
      })
    },

    handleClose(){
      this.$emit('close');
    },
    handleOK(){
      let $form = this.$refs.detailForm;
      $form.validate((valid) => {
        console.log($form.fields);
        if (valid) {
          this.errorFields = [];
          let formData = this.formData;
          let data = formData
          this.is_submiting = true;
          this.doSubmit(data).then(res=>{
            if(res.code === 0 ){
              this.$alert('保存成功', {confirmButtonText: 'OK',
                type:'success',
                callback:()=>{
                  this.$emit('ok');
                }
              })
            }
            this.is_submiting = false;
          }).catch(err=>{
            $form.clearValidate();
            this.is_submiting = false;
            if(typeof(err.data)!="undefined" && typeof(err.data.errorFields)!="undefined" && _.isObject(err.data.errorFields)){
              this.errorFields = err.data.errorFields;
            }
          })
          

        }
      })
    },
    doSubmit(data){
      if(this.id > 0){
        return fabApi.updateItem(this.id,data);
      }else{
        return fabApi.createItem(data);
      }
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {

  },
    
}
</script>

<style lang="scss" scope>

</style>
