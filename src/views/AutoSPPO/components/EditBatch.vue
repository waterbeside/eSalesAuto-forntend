<template>
<div>
  <el-form  label-width="180px" :model="formData" >

    <el-alert title="提示"  type="warning" :closable="false" show-icon style="margin-bottom:20px;"> 
        你正在批量修改 PPO_No 为 <b>{{PPO_No_string}}</b> 的数据。
    </el-alert>
    
    <el-form-item label="Season"  >
      <el-input placeholder="Season" v-model="formData.season"></el-input>
    </el-form-item>
    
    <el-form-item label="Garment_Wash">

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


    
    <el-form-item label="Delivery" >
        <el-date-picker type="date" placeholder="交期" v-model="formData.delivery"></el-date-picker>
    </el-form-item>

    <el-form-item label="Destination">
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
    <el-button @click="handleOK" type="primary"   :loading="is_submiting">提交</el-button>
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
      open: false,
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
      PPO_No_string:'',
  
      
      
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
      this.PPO_No_string = this.dataList.map(item => item.Style_No).join('、');
 
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

      this.$confirm('是否确定修改？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '取消'
      }).then(()=>{
       console.log(this.formData)
       let data = {
         ...formData
       }
       sppoAPI.batchEdit().then(res=>{
          console.log(res);
       })
      }).catch(action=>{
       console.log(action)
      })
      // this.$emit('OK',this.formData);
      // this.handleCloseDialog();
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
