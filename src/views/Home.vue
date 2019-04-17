<template>
  <div>
    <div style="padding-bottom: 20px;">
      <el-button type="primary" @click="addItem">添加记录</el-button>
    </div>

    <el-table :data="tData" style="width: 100%" border >
      <el-table-column prop="sum" label="总针数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sum" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)" ></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="needle" label="抽针数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.needle" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)" ></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="width" label="门幅">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width" placeholder="请输入" type="number"  @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="yarnlong" label="纱长MM">
        <template slot-scope="scope">
          <el-input v-model="scope.row.yarnlong" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="yarn" label="纱支S">
        <template slot-scope="scope">
          <el-input v-model="scope.row.yarn" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)" ></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="cpi" label="CPI">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cpi" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="pull" label="拉架比%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pull" placeholder="请输入" type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

            <el-table-column prop="wpi" label="理论WPI">
        <template slot-scope="scope">
          <el-input :readonly="true" v-model="scope.row.wpi"  type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

            <el-table-column prop="weight" label="理论克重">
        <template slot-scope="scope">
          <el-input :readonly="true" v-model="scope.row.weight"  type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
        </template>
      </el-table-column>

            <el-table-column prop="eng" label="ENG码重">
        <template slot-scope="scope">
          <el-input :readonly="true" v-model="scope.row.eng"  type="number" @keyup.enter.native="comwpi(scope)" @blur="comwpi(scope)" @change="comwpi(scope)"></el-input>
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
      a:0.00082,
      b:0.018367,
      c:0.98,
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
        pull: '0',
        wpi: '',
        weight: '',
        eng: '',
      }
      this.tData.push(Object.assign({}, objData))
    },
    delItem(scope) {
      this.tData.splice([scope.$index], 1)
    },
    comwpi (scope) {
        this.tData[scope.$index].wpi = ((this.tData[scope.$index].sum -  this.tData[scope.$index].needle) / this.tData[scope.$index].width ).toFixed(2)
        this.tData[scope.$index].weight = (this.tData[scope.$index].cpi * this.tData[scope.$index].wpi * this.tData[scope.$index].yarnlong * this.b / this.tData[scope.$index].yarn).toFixed(2)
        this.tData[scope.$index].eng =(this.tData[scope.$index].weight * this.tData[scope.$index].width * this.a * this.c *(100 + Number(this.tData[scope.$index].pull)) / 100 ).toFixed(3)
        
    },

    // renderHeader(h, { column, $index }) {
    // return h
    // } 
  }
}
</script>

<style scoped>
.footer-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  color: #464646;
}
</style>