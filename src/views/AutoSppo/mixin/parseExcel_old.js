import moment from 'moment';
import {changeCaseJsonKey,asyncForEach,myCache} from '@/utils/common';

export default {
  data() {
    return {
      tableData: null,
      tableHeader: '',
      is_hasUploadExcel:false,
      uploadExcelTime : '',
      
      tableFields : [
        {name:'season',label:'Season',width:120},
        {name:'style_no',label:'Style_No',width:120},
        {name:'garment_qty',label:'Garment_Qty',width:140},
        {name:'size',label:'Size',width:140},
        {name:'garment_wash',label:'Garment_Wash',width:140},
        {name:'garment_part',label:'Garment_Part',width:140},
        {name:'garment_component',label:'Garment_Component',width:140},
        {name:'color_code',label:'Color_Code',minWidth:150},
        {name:'color_name',label:'Color_Name',minWidth:150},
        {name:'customer_fab_code',label:'Customer_Fab_Code',width:170},
        {name:'print',label:'Print',width:80},
        {name:'remark',label:'Remark',width:140}
      ],
    };
  },
  watch: {
  },
  methods: {
    /**
     * 表格载入成功后处理
     */
    loadExcelSuccess({ results, header ,error }) {
      let tableData = [];
      let tableHeader = [];
      if(error){
        console.log(error.message)
        this.$message({
          message:'你上我传的表格似乎不太符合规范格式，请检查后重新上传',
          type: 'warning'
        })
        return false;
      }

      tableData = results.map((value, index, array)=>{
        let newItem = changeCaseJsonKey(Object.assign({},value));
        newItem.id = index+1; 
        newItem.idx = index; 
        newItem.edit = false; //添加‘是否正在编辑’状态，
        newItem.check = 1; //查询是否已验证
        newItem.error = []; //放入检查不通过的字段名
        newItem.uploadSuccess = 0; //用于记录是否上传成功
        if(typeof(newItem.remark)=="undefined"){ 
          newItem.remark = '';
        }
        if(typeof(newItem.size)=="undefined"){ 
          newItem.size = '';
        }
        this.errorMsg[index] = {}; //用于检查后存放的错误信息
        this.errorRow.push(index); //用于检查是否可按提交按钮
        return newItem;
      });
      
      for(var i=0;i<header.length;i++){
        tableHeader.push(header[i].toLowerCase());
      }
      // console.log(tableData);
      if(!tableHeader.includes("season") || !tableHeader.includes('style_no') || !tableHeader.includes('garment_wash') ){
        this.$message({
          message: '你上我传的表格似乎不太符合规范格式，请检查后重新上传',
          type: 'warning'
        })
        return false;
      }
      
      // this.tableData_o = [...tableData]
      this.tableData = tableData;
      this.tableHeader = tableHeader
      this.is_hasUploadExcel = true;
      // console.log(tableData);
      this.uploadExcelTime = moment().format('YYYY-MM-DD HH:mm:ss');
    },
  },
  activated() {}
};