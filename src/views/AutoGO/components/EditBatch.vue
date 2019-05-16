<template>
<div>
  <el-form  label-width="180px" :model="formData" :rules="rules"  ref="editForm" >

    <el-alert title="提示"  type="warning" :closable="false" show-icon style="margin-bottom:20px;"> 
        你正在批量修改 GO_NO 为 <b>{{go_no_string}}</b> 的数据。
    </el-alert>
    
    <el-form-item label="Season"  prop="season" >
      <el-input placeholder="Season" v-model="formData.season"></el-input>
    </el-form-item>
    
    <el-form-item label="GMT_FTY" prop="gmt_fty">
      <el-select v-model="formData.gmt_fty" filterable placeholder="GMT_FTY">
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
      <el-radio v-model="formData.outsource" label="Y" >Y</el-radio>
      <el-radio v-model="formData.outsource" label="N" >N</el-radio>
    </el-form-item>
  </el-form>

  <div  class="dialog-footer" style="text-align:right; margin-top:40px;">
    <el-button @click="handleCloseDialog">取消</el-button>
    <el-button @click="handleOK" type="primary"   :loading="is_submiting" :disabled="is_submiting" >提交</el-button>
  </div>
</div>
	 

  
</template>

<script>

import {goAPI,assistAPI} from '@/api'

export default {
  props: {
    data:null,
    visible:false,
  },
  data() {
    return {
      dataList:this.data,
      formData:{
        season:'',
        gmt_fty:'',
        outsource:'N',
      },
      is_submiting:false,
      selectBoxData:{
        gmt_fty:[],
      },
      go_no_string:'',
      go_no_array:'',
      rules : {
        season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        gmt_fty: [
            { required: true, message: '请选择 GMT_FTY', trigger: 'change' }
        ],
        outsource: [
            { required: true, message: '请选择 OutSource', trigger: 'change' }
        ],
        
      },
  
      
      
    }
  },
  computed:{
   
   
  },
  watch: {
    data(val) {
      if (val) {
        this.dataList = val;
      }
    },
    is_submiting(val){
      if(val){
        this.loadingObj = this.$loading()
      }else{
        this.loadingObj.close();
      }
    }
  },
  methods: {
    init(){
    
      this.formData={
        season:'',
        gmt_fty:'',
        outsource:'N',
      };
      this.getFactory();

      this.go_no_array = this.dataList.map(item => item.GO_NO);
      this.go_no_string = this.go_no_array.join('、');

      if(typeof(this.$refs.editForm)!="undefined"){
          this.$refs.editForm.resetFields(); 
      }
 
 
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

    
    //OK
    handleOK(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否确定修改？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '保存',
              cancelButtonText: '取消'
          }).then(()=>{
            this.is_submiting = true;
            let data = {
              ...this.formData,
              go_nos:this.go_no_array,
            }
            //提交到API
            goAPI.batchEdit(data).then(res=>{
                console.log(res);
                if(res.code===0){
                  this.$emit('OK',this.formData);
                  this.handleCloseDialog();
                }
                this.is_submiting = false;
            }).catch(error=>{ 
              this.is_submiting = false;
            })
          }).catch(action=>{ console.log(action) })
             
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    //关闭对话框
    handleCloseDialog(){
      this.$emit('close')
    },
   
  },
  mounted() {
    this.init();
  },
  created () {

  },
  activated() {
    console.log(this.visible);
    console.log(this.visible);
  },


}
</script>
