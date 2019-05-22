<template>
  <div>
    <el-form :model="formData" label-width="80px"  ref="userForm" v-loading="is_loading">
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
      <el-form-item label="账号名" prop="username">
        <el-input type="text" v-model="formData.username" placeholder="用于登入时输入的账号名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="显示名" prop="FullName">
        <el-input type="text" v-model="formData.FullName" placeholder="用户的显示名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" placeholder="请输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="formData.checkPass" placeholder="请再次输入密码" autocomplete="off"></el-input>
      </el-form-item>
      
      <dialog-foot-btns class="mt" @cancel="handleClose" @ok="handleOK" :submiting='is_submiting'></dialog-foot-btns>
    </el-form>
  </div>
</template>



<script>

import md5 from 'js-md5'
import {myCache} from '@/utils/common'
import { getRoleSelects } from '@/api/role'
import { userDetail } from '@/api/user'
import DialogFootBtns from '@/components/DialogFootBtns'

export default {
  components: { DialogFootBtns},
  props: {
    id:0,
  },
  data() {
    return {
      formData:{
        role:'general'
      },
      selectBoxData:{
        roles:[]
      },
      is_loading: false,
      is_submiting: false,
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
        this.formData = {
          ...res.data,
        }
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
