import moment from 'moment';
import {changeCaseJsonKey,asyncForEach,myCache} from '@/utils/common';

export default {
  data() {
    return {
      tableData: null,
      tableHeader: null,
      is_hasUploadExcel:false,
      uploadExcelTime : '',
      
      tableFields : [
        {name:'season', name_ch:'季节名称', label:'Season',width:120, required:true},
        {name:'style_no', name_ch:'设计编号', label:'Style_No',width:120, required:true},
        {name:'garment_qty', name_ch:'garment_qty', label:'Garment_Qty',width:140, default: 20},
        {name:'sex', name_ch:'性别',label:'Sex',width:60},
        {name:'size', name_ch:'尺码',label:'Size',width:80},
        {name:'garment_wash', name_ch:'garment_wash', label:'Garment_Wash',width:140,  default: 'Non-Wash'},
        {name:'garment_part', name_ch:'garment_part', label:'Garment_Part',width:140, required:true},
        {name:'garment_component', name_ch:'组件或位置', label:'Garment_Component',width:140, required:true},
        // {name:'color_code',label:'Color_Code',minWidth:150},
        {name:'color', name_ch:'色系名称',label:'Color', minWidth:150, required:true},
        // {name:'color_name', name_ch:'颜色', minWidth:150},
        {name:'customer_fab_code', name_ch:'供应商材料参考号码（一般）',  label:'Customer_Fab_Code',width:170, required:true},
        {name:'print',name_ch:'print', label:'Print',width:80, default: 'Y'},
        {name:'remark',name_ch:'remark', label:'Remark',width:140}
      ],
    };
  },
  watch: {
  },
  methods: {
    formatExcelHeader(header) {
      const tableHeader = [];
      let hasError = false;
      for(const i in this.tableFields) {
        const fieldSetting = this.tableFields[i];
        if (typeof fieldSetting.required !=="undefined" && fieldSetting.required && !header.includes(fieldSetting.name) && !header.includes(fieldSetting.name_ch)) {
          this.hasError = true;
          break;
        }
        tableHeader.push(fieldSetting.name);
      }
      if (hasError) {
        this.showExcelError();
        return false;
      }
      return tableHeader;
    },
    formatExcelField(itemData) {
      itemData = changeCaseJsonKey(Object.assign({},itemData))
      const newData = {};
      for(const i in this.tableFields) {
        const fieldSetting = this.tableFields[i];
        if (typeof itemData[fieldSetting.name] !== "undefined") {
          newData[fieldSetting.name] = itemData[fieldSetting.name];
        } else if (typeof itemData[fieldSetting.name_ch] !== "undefined") {
          newData[fieldSetting.name] = itemData[fieldSetting.name_ch];
        // } else if (fieldSetting.required) {
        //   return false;
        } else {
          newData[fieldSetting.name] = '';
        }
        newData[fieldSetting.name] = newData[fieldSetting.name] || (fieldSetting.default || '');
      }
      return newData;
    },
    showExcelError(msg) {
      msg = msg || '你上我传的表格似乎不太符合规范格式，请检查后重新上传';
      this.$message({
        message: msg,
        type: 'warning'
      })
    },
    /**
     * 表格载入成功后处理
     */
    loadExcelSuccess({ results, header ,error }) {
      let tableData = [];
      let tableHeader = [];
      console.log(header);
      if(error){
        console.log(error.message)
        this.showExcelError();
        return false;
      }
      console.log()

      tableData = results.map((value, index, array)=>{
        let newItem = this.formatExcelField(value);
        console.log(newItem);
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
      
      tableHeader = this.formatExcelHeader(header);
      if(!tableHeader) {
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