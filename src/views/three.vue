<template>
  <div>
    <div style="padding-bottom: 20px;">
      <el-button :span="6" type="primary" @click="addItem">添加记录</el-button>
    </div>

    <el-table :data="tData" style="width: 60%" border>
      <el-table-column label="序号" type="index" align="center"></el-table-column>

      <el-table-column prop="jsy" label="JSY">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jsy" placeholder="请输入" type="number" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="pq" label="PQ">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pq" placeholder="请输入" type="number" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="jacq1" label="JACQ1">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jacq1" placeholder="请输入" type="number" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="jacq2" label="JACQ2">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jacq2" placeholder="请输入" type="number" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="80">
        <template slot-scope="scope">
          <el-button type="danger" @click="delItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </br>
    <div class="bor">
      <div class="bor">输入CPI:</div>
      <el-input v-model="cpi1" placeholder="请输入CPI" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="cpi2" placeholder="请输入CPI" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="cpi3" placeholder="请输入CPI" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="cpi4" placeholder="请输入CPI" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
    </div>
    <div class="bor">
      <div class="bor">理论克重:</div>
      <el-input v-model="weight1" placeholder="请输入理论克重" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="weight2" placeholder="请输入理论克重" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="weight3" placeholder="请输入理论克重" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
      <el-input v-model="weight4" placeholder="请输入理论克重" @keyup.enter.native="Change(scope)" @blur="Change(scope)" @change="Change(scope)"></el-input>
    </div>
    </br>
    <div class="bor1">
      <div class="bor"></div>
      <div class="bor">JSY</div>
      <div class="bor">PQ</div>
      <div class="bor">JACQ</div>
      <div class="bor">JACQ1</div>
      <div class="bor">SUM</div>
    </div>

    <div class="bor1">
      <div class="bor">累计模数:</div>
      <el-input v-model="JSYSum" :readonly="true"></el-input>
      <el-input v-model="PQSum" :readonly="true"></el-input>
      <el-input v-model="JACQ1Sum" :readonly="true"></el-input>
      <el-input v-model="JACQ2Sum" :readonly="true"></el-input>
      <el-input v-model="mSum" :readonly="true"></el-input>
    </div>

    <div class="bor1">
      <div class="bor">模数比例:</div>
      <el-input v-model="JSYp" :readonly="true"></el-input>
      <el-input v-model="PQp" :readonly="true"></el-input>
      <el-input v-model="JACQ1p" :readonly="true"></el-input>
      <el-input v-model="JACQ2p" :readonly="true"></el-input>
      <el-input v-model="pSum" :readonly="true"></el-input>
    </div>

    <div class="bor1">
      <div class="bor">累计循环:</div>
      <el-input v-model="jsyc" :readonly="true"></el-input>
      <el-input v-model="pqc" :readonly="true"></el-input>
      <el-input v-model="jacq1c" :readonly="true"></el-input>
      <el-input v-model="jacq2c" :readonly="true"></el-input>
      <el-input v-model="cSum" :readonly="true"></el-input>
    </div>

    <div class="bor1">
      <div class="bor">循环比例:</div>
      <el-input v-model="jsycp" :readonly="true"></el-input>
      <el-input v-model="pqcp" :readonly="true"></el-input>
      <el-input v-model="jacq1cp" :readonly="true"></el-input>
      <el-input v-model="jacq2cp" :readonly="true"></el-input>
      <el-input v-model="cpSum" :readonly="true"></el-input>
    </div>

    <div class="bor1">
      <div class="bor">克重标准:</div>
      <el-input v-model="jsystandard" :readonly="true"></el-input>
      <el-input v-model="pqstandard" :readonly="true"></el-input>
      <el-input v-model="jacq1standard" :readonly="true"></el-input>
      <el-input v-model="jacq2standard" :readonly="true"></el-input>
      <el-input v-model="sSum" :readonly="true"></el-input>
    </div>

    <div class="footer-field">
      <span>CM: {{cm}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDelAction: false,
      JSYSum: 0, PQSum: 0, JACQ1Sum: 0, JACQ2Sum: 0, mSum: 0,
      JSYp: 0, PQp: 0, JACQ1p: 0, JACQ2p: 0, pSum: 0,
      jsyc: 0, pqc: 0, jacq1c: 0, jacq2c: 0, cSum: 0,
      jsycp: 0, pqcp: 0, jacq1cp: 0, jacq2cp: 0, cpSum: 0,
      jsystandard: 0, pqstandard: 0, jacq1standard: 0, jacq2standard: 0, sSum: 0,
      cpi1: 1, cpi2: 1, cpi3: 1, cpi4: 1,
      weight1: '', weight2: '', weight3: '', weight4: '',




      tData: [],
    }
  },
  methods: {
    addItem() {
      const objData = {
        jsy: 0,
        pq: 0,
        jacq1: 0,
        jacq2: 0,
        cm: 0,
      }
      this.tData.push(Object.assign({}, objData))
    },
    delItem(scope) {
      this.tData.splice([scope.$index], 1)
      this.Change(scope)
    },
    Change(scope) {
      let tmpArr = []
      this.tData.forEach(row => {
        tmpArr.push(parseFloat(row.jsy))
      })
      this.JSYSum = eval(tmpArr.join('+'))

      this.JSYp = (this.JSYSum / this.mSum).toFixed(2)
      this.jsyc = (this.JSYSum / this.cpi1).toFixed(2)
      this.jsycp = (this.jsyc / this.cSum).toFixed(3)
      this.jsystandard = (this.jsycp * this.weight1).toFixed(2)

      let tmpArr1 = []
      this.tData.forEach(row => {
        tmpArr1.push(parseFloat(row.jacq1))
      })
      this.JACQ1Sum = eval(tmpArr1.join('+'))
      this.JACQ1p = (this.JACQ1Sum / this.mSum).toFixed(2)
      this.jacq1c = (this.JACQ1Sum / this.cpi3).toFixed(2)
      this.jacq1cp = (this.jacq1c / this.cSum).toFixed(3)
      this.jacq1standard = (this.jacq1cp * this.weight3).toFixed(2)

      let tmpArr2 = []
      this.tData.forEach(row => {
        tmpArr2.push(parseFloat(row.pq))
      })
      this.PQSum = eval(tmpArr2.join('+'))
      this.PQp = (this.PQSum / this.mSum).toFixed(2)
      this.pqc = (this.PQSum / this.cpi2).toFixed(2)
      this.pqcp = (this.pqc / this.cSum).toFixed(3)
      this.pqstandard = (this.pqcp * this.weight2).toFixed(2)

      let tmpArr3 = []
      this.tData.forEach(row => {
        tmpArr3.push(parseFloat(row.jacq2))
      })
      this.JACQ2Sum = eval(tmpArr3.join('+'))
      this.JACQ2p = (this.JACQ2Sum / this.mSum).toFixed(2)
      this.jacq2c = (this.JACQ2Sum / this.cpi4).toFixed(2)
      this.jacq2cp = (this.jacq2c / this.cSum).toFixed(3)
      this.jacq2standard = (this.jacq2cp * this.weight4).toFixed(2)


      this.mSum = this.PQSum + this.JSYSum + this.JACQ1Sum + this.JACQ2Sum
      this.pSum = Number(this.PQp) + Number(this.JSYp) + Number(this.JACQ1p) + Number(this.JACQ2p)
      this.cSum = Number(this.jsyc) + Number(this.pqc) + Number(this.jacq1c) + Number(this.jacq2c)
      this.cpSum = (Number(this.jsycp) + Number(this.pqcp) + Number(this.jacq1cp) + Number(this.jacq2cp)).toFixed(2)
      this.sSum = (Number(this.jsystandard) + Number(this.pqstandard) + Number(this.jacq1standard) + Number(this.jacq2standard)).toFixed(1)
      this.pSum = Math.round(this.pSum)
      this.cpSum = Math.round(this.cpSum)
      this.cm = (this.cSum * 2.54).toFixed(2)
    },
  }
}
</script>

<style scoped>
.footer-field {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 16px;
  color: #464646;
}

.bor {
  width: 60%;
  display: flex;
  justify-content: space-between;
}

.bor1 {
  width: 60%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #464646;
}
</style>