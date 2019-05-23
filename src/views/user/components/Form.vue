<template>
  <div>
    <el-form :model="formData" label-width="100px"  ref="userForm" :rules="rules" v-loading="is_loading">
      <el-form-item label="角色" prop="role">
         <el-select v-model="formData.role" placeholder="角色">
          <el-option
            v-for="item in selectBoxData.roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号名" prop="username" :error="errorFields.username">
        <el-input type="text" v-model="formData.username" placeholder="用于登入时输入的账号名" autocomplete="off" :disabled="id>0"></el-input>
      </el-form-item>
      <el-form-item label="显示名" prop="FullName" :error="errorFields.FullName">
        <el-input type="text" v-model="formData.FullName" placeholder="用户的显示名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Sales Team" prop="sales_team">
         <el-select v-model="formData.sales_team" placeholder="Sales Team">
          <el-option
            v-for="item in selectBoxData.sales_team"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
       <!-- <el-form-item label="Email" prop="email" :error="typeof(errorFields['email'])!='undefined' ? errorFields['email'] : ''">
        <el-input type="text" v-model="formData.email" placeholder="用户邮箱" autocomplete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="Email" prop="email" :error="errorFields.email">
        <el-input type="text" v-model="formData.email" placeholder="用户邮箱" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="启用" prop="status">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          >
        </el-switch>
      </el-form-item>

      

      <el-alert type="warning" style="margin-bottom:12px" show-icon :closable="false" title="如果不修改密码，则请不要填写密码" v-if="id > 0"> </el-alert>
     
      <el-form-item label="密码" prop="pass" :error="errorFields.pass">
        
        <el-input type="password" v-model="formData.pass" placeholder="" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="formData.checkPass" placeholder="" autocomplete="off"></el-input>
      </el-form-item>
      
      <dialog-foot-btns class="mt" @cancel="handleClose" @ok="handleOK" :submiting='is_submiting'></dialog-foot-btns>
    </el-form>
  </div>
</template>



<script>

// const _ = require('lodash');
import _  from  'lodash'
import md5 from 'js-md5'
import {myCache} from '@/utils/common'
import {validNoSpaces,validNoSpecialBut_,validEmail} from '@/utils/validate'

import { getRoleSelects } from '@/api/role'
import { userDetail,checkUserUnique,userCreate,userUpdate } from '@/api/user'
import DialogFootBtns from '@/components/DialogFootBtns'

export default {
  components: { DialogFootBtns},
  props: {
    id:0,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if ( value === '') {
        if(this.id > 0 ){
            callback();
        }else{
          callback(new Error('密码不能为空'));
        }
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
      if(this.id > 0 && this.formData.pass!==''){
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
    var validateEmail = (rule, value, callback) => {
      value = _.trim(value);
      this.formData.email = value;
      if (value === '') {
        callback();
      } else if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确!'));
      } else {
        callback();
      }
      
    };
    var validateUsername = (rule, value, callback) => {
      let trimVal = _.trim(value);
      this.formData.username = trimVal;
      console.log(trimVal);
      if(this.id>0){
        callback();return;
      }
      if (!validNoSpaces(trimVal)) {    
        callback(new Error('用户名不能有空格'));
      } else if (!validNoSpecialBut_(trimVal)) {
        console.log(trimVal.length);
        callback(new Error('用户名只允许由字母数字和下划线组成'));
      }else{
        checkUserUnique({username:value,id:this.id}).then(res=>{
          if(res.data.isUnique){
            callback();
          }else{
            callback(new Error('用户名已被占用'));            
          }
        }).catch(err=>{
          callback(new Error('验证用户名重复时网络出错，请稍候再试'));
        })
        
      }
    };
    
    return {
      formData:{
        role:'general',
        sales_team:'F01',
        pass:'',
        checkPass:'',
        FullName:'',
        username:'',
        email:'',
        status:0,
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
        username: [
            { required: true, message: '请输入账号名', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
        ],
        FullName: [
            { required: true, message: '请输入显示名', trigger: 'blur' },
        ],
        email: [
            { validator: validateEmail, trigger: 'blur' }
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
    id(val){
      
    }
  },
  computed: {
   
  },


  methods: {
    init(){
      console.log('id')
      console.log(this.id)
      this.getRoleSelects();
      if(this.id > 0){
        this.getDetail()
      }
    },
    getRoleSelects(){
      myCache.do('role:selects',[getRoleSelects,null,'data.list'],600).then(res=>{
        let roles = [];
        res.forEach(item => {
          roles.push({
            label:item.title,
            value:item.name,
          })
        });
        this.selectBoxData.roles = roles;
      }).catch(error=>{
        console.log(error)
      });
    },


    getDetail(){
      this.is_loading = true;
      userDetail(this.id).then(res=>{
        if(res.code == '20002'){
          this.alertClose('用户不存在或已被删除');
          return false;
        }
        if(res.data.id === 1){
          this.alertClose('创始管理员不允许被编辑');
          return false;
        }
        this.formData = Object.assign(this.formData,res.data);
        this.formData.role = res.data.roles.split(',')[0]
        setTimeout(()=>{this.is_loading = false},500);
      }).catch(error=>{
        this.handleClose()
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
      let $form = this.$refs['userForm'];
      $form.validate((valid) => {
        console.log($form.fields);
        if (valid) {
          this.errorFields = [];
          let formData = this.formData;
          let data = {
            username: formData.username,
            sales_team: formData.sales_team,
            role: formData.role,
            FullName: formData.FullName,
            email: formData.email,
            status: formData.status,
          }
          if(formData.pass){
            let pass = md5(formData.pass)
            data.pass = pass;
          }
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
        return userUpdate(this.id,data);
      }else{
        return userCreate(data);
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
