<template>
  <div>
    <div style="padding-bottom: 20px;">
      <el-button type="primary" @click="addItem">添加记录</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="addItem1">添加记录</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="addItem2">添加记录</el-button>
    </div>
    <div class="bor">
      <el-table :data="tData" style="width: 20%" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="yarnlong3" label="PD 平均纱长+3MM">
          <template slot-scope="scope">
            <el-input v-model="scope.row.yarnlong3" placeholder="请输入" type="number" @keyup.enter.native="pd3Change(scope)" @blur="pd3Change(scope)" @change="pd3Change(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-button type="danger" @click="delItem1(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="qData" style="width: 20%" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="yarnlong2" label="YD/HT 平均纱长+2MM">
          <template slot-scope="scope">
            <el-input v-model="scope.row.yarnlong2" placeholder="请输入" type="number" @keyup.enter.native="pd2Change(scope)" @blur="pd2Change(scope)" @change="pd2Change(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-button type="danger" @click="delItem2(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="wData" style="width: 20%" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="yarnlong5" label="纯化纤平均纱长+5MM">
          <template slot-scope="scope">
            <el-input v-model="scope.row.yarnlong5" placeholder="请输入" type="number" @keyup.enter.native="pd5Change(scope)" @blur="pd5Change(scope)" @change="pd5Change(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-button type="danger" @click="delItem3(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bor">
      <div class="footer-field">总　　 数: {{pd3}}</div>
      <div class="footer-field"> {{pd2}} </div>
      <div class="footer-field"> {{pd5}}</div>
    </div>
    <div class="bor">
      <div class="footer-field">A/F平均值:{{yarnlong3af}}</div>
      <div class="footer-field">{{yarnlong2af}}</div>
      <div class="footer-field">{{yarnlong5af}}</div>
    </div>
    <div class="bor">
      <div class="footer-field">B/F平均值:{{yarnlong3bf}}</div>
      <div class="footer-field">{{yarnlong2bf}}</div>
      <div class="footer-field">{{yarnlong5bf}}</div>
    </div>
    <div style="padding-bottom: 20px;">
      <el-button type="primary" @click="addItem3">添加记录</el-button>
      <el-table :data="kData" style="width: 50%" border>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="weigth" label="克重法算纱比(克重)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" placeholder="请输入" type="number" @keyup.enter.native="weightChange(scope)" @blur="weightChange(scope)" @change="weightChange(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="yarncount" label="纱比%">
          <template slot-scope="scope">
            <el-input v-model="scope.row.yarncount" placeholder="请输入" type="number" @keyup.enter.native="yarncountChange(scope)" @blur="yarncountChange(scope)" @change="yarncountChange(scope)"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-button type="danger" @click="delItem(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bor">
        <div class="footer-field">&nbsp;&nbsp;&nbsp;合计: {{weightSum}}</div>
        <div class="footer-field">{{yarncountSum}}</div>
        <div class="footer-field"></div>
        <div class="footer-field"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDelAction: false,
      yarnlong3af: 0,
      yarnlong3bf: 0,
      yarnlong2af: 0,
      yarnlong2bf: 0,
      yarnlong5af: 0,
      yarnlong5bf: 0,
      modcountSum: 0,
      tData: [],
      qData: [],
      wData: [],
      kData: [],
      pd3: 0,
      pd2: 0,
      pd5: 0,
      weightSum: 0,
      yarncountSum: 0,
    }
  },
  methods: {
    addItem() {
      const objData = {
        yarnlong3: 0,
      }
      this.tData.push(Object.assign({}, objData))
      this.pd3 = this.tData.length
    },
    delItem(scope) {
      this.kData.splice([scope.$index], 1)
      this.yarncountChange(scope)
    },
    delItem1(scope) {
      this.tData.splice([scope.$index], 1)
      this.pd3Change(scope)
    },
    delItem2(scope) {
      this.qData.splice([scope.$index], 1)
      this.pd2Change(scope)
    },
    delItem3(scope) {
      this.wData.splice([scope.$index], 1)
      this.pd5Change(scope)
    },
    addItem1() {
      const objData = {
        yarnlong2: 0,
      }
      this.qData.push(Object.assign({}, objData))
      this.pd2 = this.qData.length
    },
    addItem2() {
      const objData = {
        yarnlong5: 0,
      }
      this.wData.push(Object.assign({}, objData))
      this.pd5 = this.wData.length
    },

    addItem3() {
      const objData = {
        weight: 0,
        yarncount: 0,
      }
      this.kData.push(Object.assign({}, objData))
    },
    pd3Change(scope) {
      this.pd3 = this.tData.length
      let tmpArr = []
      this.tData.forEach(row => {
        tmpArr.push(parseFloat(row.yarnlong3))
      })
      this.yarnlong3af = (eval(tmpArr.join('+'))) / this.pd3
      this.yarnlong3af = Math.round(this.yarnlong3af)
      this.yarnlong3bf = this.yarnlong3af + 3
    },

    pd2Change(scope) {
      this.pd2 = this.qData.length
      let tmpArr = []
      this.qData.forEach(row => {
        tmpArr.push(parseFloat(row.yarnlong2))
      })
      this.yarnlong2af = (eval(tmpArr.join('+'))) / this.pd2
      this.yarnlong2af = Math.round(this.yarnlong2af)
      this.yarnlong2bf = this.yarnlong2af + 2
    },

    pd5Change(scope) {
      this.pd5 = this.wData.length
      let tmpArr = []
      this.wData.forEach(row => {
        tmpArr.push(parseFloat(row.yarnlong5))
      })
      this.yarnlong5af = (eval(tmpArr.join('+'))) / this.pd5
      this.yarnlong5af = Math.round(this.yarnlong5af)
      this.yarnlong5bf = this.yarnlong5af + 5
    },
    weightChange(scope) {
      this.yarncountChange(scope)
    },
    yarncountChange(scope) {
      let tmpArr = []
      this.kData.forEach(row => {
        tmpArr.push(parseFloat(row.weight))
      })
      this.weightSum = eval(tmpArr.join('+'))

      this.kData.forEach(item => {
        item.yarncount = (item.weight / this.weightSum * 100).toFixed(2)
      })

      let tmpArr1 = []
      this.kData.forEach(row => {
        tmpArr1.push(parseFloat(row.yarncount))
      })
      this.yarncountSum = eval(tmpArr1.join('+'))
      this.yarncountSum = Math.round(this.yarncountSum) + '%'
    }
  }
}
</script>

<style scoped>
.bor {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.footer-field {
  align-items: center;
  padding: 10px;
  font-size: 16px;
  color: black;
}
</style>