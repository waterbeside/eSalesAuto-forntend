<template>
<div>
  <div style="padding-bottom: 20px;">
      <el-input :span="6" v-model="input" placeholder="请输入单号" style="width:160px;margin-right:10px"></el-input>
      <!-- &nbsp;&nbsp; -->
      <el-button type="primary" style:="display: inline-block">Search</el-button>
    </div>
  <el-steps :space="200" :active="1" finish-status="success">
  <el-step title="收单"></el-step>
  <el-step title="车缝"></el-step>
  <el-step title="熨烫"></el-step>
  <el-step title="Fitting"></el-step>
  <el-step title="包装"></el-step>
  <el-step title="出货"></el-step>
</el-steps>
</div>
</template>

<script>
  export default {
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    },
  }
</script>