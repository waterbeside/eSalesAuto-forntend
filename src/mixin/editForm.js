export default {
  data() {
    return {
      formData:{},
      errorFields:{},
      is_loading: false,
      is_submiting: false,
    };
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
  methods: {
    init(){
      if(this.id > 0){
        this.getDetail()
      }
    },
    /**
     * 取得详情
     */
    getDetail() {
      return false;
    },
    /**
     * 警告后并闭
     * @param {string} msg 警告语
     * @param {string} type 警告类型
     */
    alertClose(msg,type='warning'){
      this.$alert(msg, {confirmButtonText: 'OK',
        type,
        callback:()=>{
          this.$emit('close');
        }
      })
    },
    /**
     * 关闭对话框
     */
    handleClose(){
      this.$emit('close');
    },
    /**
     * 点击完成按钮
     */
    handleOK(){
      let $form = this.$refs.detailForm;
      $form.validate((valid) => {
        console.log($form.fields);
        if (valid) {
          this.errorFields = {};
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
    /**
     * 执行提交
     * @param {*} data 提交的数据
     */
    doSubmit(data){
      return false;
    }
  },
  activated() {
  }
};
