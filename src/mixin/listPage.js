export default {
  data() {
    return {
      page: parseInt(this.$route.query.page) ? parseInt(this.$route.query.page) : 1,
      list: [],
      listSelection: [], //列表选中列
      pagesize:20,
      dataTotal:0,
      dataPK:'id',
      listLoading:false,
      is_showEditBox:false,
      editing_id: 0,
      deleteFun: ()=>{},
    };
  },
  watch: {
    page(val,oval) {
      const query = { cid: this.cid, page: val };
      this.scrollToTop();
      console.log(val)
      this.getList();
    },
    is_showEditBox(val){
      if(val){
        if(typeof(this.$refs.formBox)=='object' && typeof(this.$refs.formBox.init)=='function'){
          this.$refs.formBox.init();
        }
      }
    },
  },
  methods: {
    scrollToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    //改变选择
    listSelectionChange: function(val) {
      this.listSelection = val;
      console.log('this.listSelection') ;
      console.log(this.listSelection) ;
    },
    getList() {
      //TODO: get list;
    },
    /**
     * 删除
     */
    handleDel(id) {
      console.log('id');
      console.log(id);
      const idsArray = typeof id === 'string' ? id.split(',') : 1;
      const confirmMsg = idsArray.length > 1 ? '确认要删除选中的数据吗？' : '确认删除该条数据吗？';
      this.$confirm(confirmMsg, "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        let datas = {id};
        if (typeof this.deleteFun === 'function') {
          (this.deleteFun)(datas).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.getList();
          }).catch((err) => {
              this.listLoading = false;
          });
        } else {
          this.listLoading = false;
        }
      })
    },
    //批量删除
    handleBatchDelete(){
      var ids = this.listSelection.map(item => item[this.dataPK]).toString();
      this.handleDel(ids);
    },
    //点击翻页
    handlePageChange(val) {

    },
    /***  编辑  ****/
    handleAdd(){
      this.editing_id = 0;
      this.is_showEditBox = true;
    },
    handleEdit(id){
      this.editing_id = id;
      this.is_showEditBox = true;
    },
    handleCloseEditDialog(){
      this.is_showEditBox = false;
    },
    handleEditSuccess(){
      if(this.editing_id > 0){
        this.editing_id = 0;
      }else{
        this.page = 1;
        for (const key in this.filters) {
          const item = this.filters[key];
          if (typeof item === 'number') {
            this.filters[key] = 0;
          }
          if (typeof item === 'string') {
            this.filters[key] = '';
          }
          if (typeof item === 'object') {
            this.filters[key] = [];
          }
        }
      }
      this.getList();
      this.is_showEditBox = false;
    },
  },
  activated() {
    // this.page = parseInt(this.$route.query.page) ? parseInt(this.$route.query.page) : 1;
  }
};
