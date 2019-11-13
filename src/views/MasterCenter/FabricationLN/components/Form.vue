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
import editForm from '@/mixin/editForm';

export default {
  components: { DialogFootBtns},
  mixins: [editForm],
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
      fields,
      rules,
    }
  },
  methods: {
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
