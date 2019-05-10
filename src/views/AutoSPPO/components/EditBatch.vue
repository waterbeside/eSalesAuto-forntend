<template>
<div>
  <el-form  label-width="180px" :model="formData" :rules="rules"  ref="editForm" >

    <el-alert title="提示"  type="warning" :closable="false" show-icon style="margin-bottom:20px;"> 
        你正在批量修改 PPO_No 为 <b>{{ppo_no_string}}</b> 的数据。
    </el-alert>
    
    <el-form-item label="Season"  prop="season" >
      <el-input placeholder="Season" v-model="formData.season"></el-input>
    </el-form-item>
    
    <el-form-item label="Garment_Wash" prop="garment_wash">
      <el-select v-model="formData.garment_wash" filterable placeholder="Garment_Wash">
        <el-option
          v-for="item in selectBoxData.garment_wash"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </el-form-item>


    
    <el-form-item label="Delivery" prop="delivery" >
        <el-date-picker type="date" placeholder="交期" v-model="formData.delivery"></el-date-picker>
    </el-form-item>

    <el-form-item label="Destination" prop="destination">
       <el-select v-model="formData.destination" filterable placeholder="Destination">
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
    <el-button @click="handleCloseDialog">取消</el-button>
    <el-button @click="handleOK" type="primary"   :loading="is_submiting" :disabled="is_submiting" >提交</el-button>
  </div>
</div>
	 

  
</template>

<script>

import {sppoAPI,assistAPI} from '@/api'

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
        garment_wash:'',
        delivery:null,
        destination:'',
      },
      is_submiting:false,
      selectBoxData:{
        garment_wash:[],
        destination:[]
      },
      ppo_no_string:'',
      ppo_no_array:'',
      rules : {
        season: [
            { required: true, message: '请输入 Season', trigger: 'blur' }
        ],
        garment_wash: [
            { required: true, message: '请选择 Garment_Wash', trigger: 'change' }
        ],
        delivery: [
            { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        destination: [
            { required: true, message: '请选择 destination', trigger: 'change' }
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
        garment_wash:'',
        delivery:null,
        destination:'',
      };
      this.getFactory();
      this.getWashTypes();
      console.log(this.dataList);
      this.ppo_no_array = this.dataList.map(item => item.PPO_NO);
      this.ppo_no_string = this.ppo_no_array.join('、');
      this.$refs['editForm'].resetFields();
 
    },

    /** 
     * 取得分厂选择列表
     */
    getFactory(){
      let cacheList = this.$store.state.cacheData.factorys;
      if(cacheList && cacheList.length > 0){
        this.selectBoxData.destination = cacheList;
        return ;
      }
      assistAPI.getFactoryIds().then((res)=>{
        let list = res.data.list;
        let factory_selector_list = [];
        list.forEach(item => {
            factory_selector_list.push({
              label:item,
              value:item,
            })
        });
        this.selectBoxData.destination = factory_selector_list;
        this.$store.commit('cacheData/SET_FACTORYS',factory_selector_list);
      })
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
              ppo_nos:this.ppo_no_array,
            }
            //提交到API
            sppoAPI.batchEdit(data).then(res=>{
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
