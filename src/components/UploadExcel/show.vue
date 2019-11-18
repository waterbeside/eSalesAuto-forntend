<template>
  <div>

    <el-table :data="tableData" border style="width: 100%" >
        <el-table-column v-for="fieldItem of fields" 
          :key="fieldItem.name" 
          :prop="fieldItem.name" 
          :label="fieldItem.label"  
          :width="fieldItem.width" 
          :min-width="fieldItem.minWidth"
          :fixed="fieldItem.fixed ? fieldItem.fixed : false" 
          >
          <div slot-scope="scope" :class="scope.row.error.includes(fieldItem.name) ? 'column-error':''" :title="fieldItem.label">
            <el-tooltip class="item" effect="dark" placement="top" 
              :content="typeof(errorMsg[scope.$index][fieldItem.name])!='undefined' ? errorMsg[scope.$index][fieldItem.name] : '格式不正确'" 
              v-show="scope.row.error.includes(fieldItem.name) ? true : false">
              <i class="el-icon-warning" />
            </el-tooltip>
            <el-tooltip  effect="dark" placement="top"  :content="typeof(errorMsg[scope.$index][fieldItem.name])!='undefined' ? errorMsg[scope.$index][fieldItem.name] : fieldItem.label" v-show="true">
              <span>{{scope.row[fieldItem.name]}}</span>
            </el-tooltip>
            
          </div>
        </el-table-column>

        <el-table-column   label="操作" width="170" fixed="right" v-if="is_showOption" >
          <div slot-scope="scope" >
            <template v-if="scope.$index === editingRowIndex">
              正在编辑...
            </template>
            <template v-else-if="scope.row.uploadSuccess">
              <span style="color:#30B08F"><i class="el-icon-check"></i> 上传成功</span>
            </template>
            <template v-else>
              <el-button @click="editTableItem(scope)" type="primary" size="mini" icon="el-icon-edit"></el-button>
              <template v-if="checkingRow.has(scope.$index)">
                <el-button  :disabled="true" size="mini" plain 
                  :type="checkBtnStyle[2] ? checkBtnStyle[2] : 'default'" 
                  :loading="true" 
                  :icon="checkBtnIcon[2] ? checkBtnIcon[2] : ''" >
                  检验
                </el-button>
              </template>
              <template v-else>
                <el-button @click="checkTableItem(scope.row,scope.$index)" size="mini" plain 
                  :type="checkBtnStyle[scope.row.check] ? checkBtnStyle[scope.row.check] : 'default'" 
                  :loading="scope.row.check === 2 || checkingRow.has(scope.$index)" 
                  :icon="checkBtnIcon[scope.row.check] ? checkBtnIcon[scope.row.check] : ''" >
                  检验
                </el-button>
              </template>
            </template>
            
          </div>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>

export default {
  props: {
    fields: Array,
    data: Array,
    checkingRow:Set,
    errorMsg:Array,
    editingRowIndex: {
      defautlt:-1
    },
    is_showOption: {
      defautlt:false
    },
  },
  data() {
    return {
      checkBtnStyle:['danger','default','default','success'],
      checkBtnIcon:['el-icon-close','el-icon-reading','','el-icon-check'],
      tableData: [
        {style_no: "STH20021740"}
      ],
    };
  },
  watch:{
    data:{
      handler(val,val_o){
        this.tableData  = val ? val : [];
      },
      immediate:true,
      deep:true,
    },
    checkingRow:{
      handler(val,val_o){
        console.log(val);
      },
      immediate:true,
      deep:true,
    },
    errorMsg:{
      handler(val,val_o){
        console.log(val);
      },
      immediate:true,
      deep:true,
    }
  },
  methods: {
    checkTableItem(row,index,type){
      this.$emit('checkTableItem',row,index,type);
    },
    editTableItem(row){
      this.$emit('editTableItem',row);
    }
  },
  created() {
    this.tableData = this.data;
  },
};
</script>

<style scoped>

</style>
