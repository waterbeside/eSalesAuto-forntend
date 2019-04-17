<template>
  <div>
    <div style="padding-bottom: 20px;">
      <el-button type="primary" @click="addItem">添加记录</el-button>
    </div>

    <el-table :data="tData" style="width: 100%" border>
      <el-table-column type="index" width="50" label="模数">
      </el-table-column>

      <el-table-column prop="needle" label="B/W 高度()">
        <template slot-scope="scope">
          <el-input v-model="scope.row.needle" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="width" label="A/W 高度()">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="yarnlong" label="模数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.yarnlong" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="yarn" label="英寸">
        <template slot-scope="scope">
          <el-input v-model="scope.row.yarn" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="cpi" label="实际模数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cpi" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="pull" label="转数(开48F)">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pull" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="80">
        <template slot-scope="scope">
          <el-button type="danger" @click="delItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tData: [],
    }
  },
  methods: {
    addItem() {
      const objData = {
        sum: '',
        needle: '',
        width: '',
        yarnlong: '',
        yarn: '',
        cpi: '',
        pull: '',
        wpi: '',
        weight: '',
        eng: '',
      }
      this.tData.push(Object.assign({}, objData))
    },
    delItem(scope) {
      this.tData.splice([scope.$index], 1)
    },

  }
}
</script>

<style scoped>

</style>