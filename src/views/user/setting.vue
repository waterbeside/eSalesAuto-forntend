<template>
  <div class="app-container" v-loading="is_loading">
   
    <el-row :gutter="10">
     
       <el-col :xs="24" :sm="20" >
        <el-alert type="info" show-icon :title="'Hello ' + userData.full_name"  :closable="false" style="margin-bottom:20px">
          你上次登入时间是: {{last_login_time}}
        </el-alert>
         
        
      </el-col>
      
      <el-col :xs="24" :sm="12" >
        <el-form :model="formData" label-width="100px"  ref="userForm" :rules="rules" >
        
          <el-form-item label="密码" prop="pass" :error="errorFields.pass">
            
            <el-input type="password" v-model="formData.pass" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="formData.checkPass" placeholder="" autocomplete="off"></el-input>
          </el-form-item>
          <div class="btns-bar">
            <el-button @click="handleOK" type="primary"   :loading="is_submiting" :disabled="is_submiting" >保存</el-button>
          </div>
        </el-form>
        
      </el-col>
    </el-row>

    
    

  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import md5 from 'js-md5'
import {myCache} from '@/utils/common'
import {validNoSpaces,validNoSpecialBut_} from '@/utils/validate'
import { changeMyPass } from '@/api/user'

export default {
  name: 'user_setting',


  data() {
    var validatePass = (rule, value, callback) => {
      if ( value === '') {
          callback(new Error('密码不能为空'));
      } else {
        if (!validNoSpaces(value)) {    
          callback(new Error('密码不能有空格'));
        }
        if(value.length < 8 ){
          callback(new Error('密码长度不能少于8位'));
        }
        if (this.formData.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if(this.formData.pass!==''){
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }else{
          callback();
      }
      
    };
    
    
    return {
      formData:{
        pass:'',
        checkPass:'',
      },
      errorFields:{},
      selectBoxData:{
        roles:[],
        sales_team:[
          {label:'F01',value:'F01'}
        ]
      },
      is_loading: false,
      is_submiting: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        
      }
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
   
  },
  computed: {
      ...mapGetters([
        'userData'
      ]),
      last_login_time(){
        return moment(this.userData.last_login_time).format('YYYY-MM-DD HH:mm:ss')
      }
  },
  methods: {
    handleOK(){
      let $form = this.$refs['userForm'];
      $form.validate((valid) => {
        console.log($form.fields);
        if (valid) {
          this.errorFields = [];
          let formData = this.formData;
          let data = {
            pass: md5(formData.pass),
          }
         
          this.is_submiting = true;
          changeMyPass(data).then(res=>{
            if(res.code === 0 ){
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              $form.resetFields();
            }else{
              $form.clearValidate();
            }
            this.is_submiting = false;
          }).catch(err=>{
            $form.clearValidate();
            this.is_submiting = false;
          })
          

        }
      })
    },

    
  }
};
</script>