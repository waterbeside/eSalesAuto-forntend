<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="序号"
      width="60">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.seq }}</span>
      </template>
    </el-table-column>
   <el-table-column prop="image" label="图片" width= "200">
        <!-- 图片的显示 -->
      <template slot-scope="scope">
        <!-- <img :src="scope.row.image" width="180" height="150"/> -->
        <el-popover trigger="hover" placement="top">
          <p>{{ scope.row.bodyfabquality }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{scope.row.style + " " + scope.row.stylesmall }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column label="操作" width="180">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="handleEdit(scope.$index,scope.row)">更改</el-button>

         <!--@click="dialogFormVisible = true" :model-append-to-body="true">更新信息</el-button>

      <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
             </el-form-item>
             <el-form-item label="活动区域" :label-width="formLabelWidth">
               <el-select v-model="form.region" placeholder="请选择活动区域">
                 <el-option label="区域一" value="shanghai"></el-option>
                 <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
    </el-dialog>-->


        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column
      label="设计编号"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.design }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="款式代码"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.style }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="运动项目"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.sportfunction }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="故事包"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.story }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="产品小类"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.stylesmall }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="色系名称"
      width="250">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.colorname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="主身布供应商编号"
      width="250">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.bodyfab }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="主身布种"
      width="150">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.bodyfabtype }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="主身质地"
      width="350">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.bodyfabquality }}</span>
      </template>
    </el-table-column>

    <!-- <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column> -->

  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          seq: "1",
          // image: require('../../image/1.jpg'),
          design: "WD1904406",
          style: "WD1904406",
          story: "韦德高端",
          stylesmall: "套头无帽卫衣",
          colorname: "01 11301标准黑/99401标准白-1",
          bodyfab: "KSF17EE0710201A-B",
          bodyfabtype: "双面布",
          bodyfabquality: "20S/1 COMB COTTON YARN(100%COTTON)(100.00%)  PIECE DYE  SOLID  DK INTERLOCK  B/W Weight:330.0GM/Q2",
          sportfunction: "韦德",
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          seq: "2",
          // image: require('../../image/1.jpg'),
          design: "WD1904406",
          style: "WD1904406",
          story: "韦德高端",
          stylesmall: "套头无帽卫衣",
          colorname: "01 11301标准黑/99401标准白-1",
          bodyfab: "KSF17EE0710201A-B",
          bodyfabtype: "双面布",
          bodyfabquality: "20S/1 COMB COTTON YARN(100%COTTON)(100.00%)  PIECE DYE  SOLID  DK INTERLOCK  B/W Weight:330.0GM/Q2",
          sportfunction: "韦德",
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          seq: "3 ",
          // image: require('../../image/1.jpg'),
          design: "WD1904406",
          style: "WD1904406",
          story: "韦德高端",
          stylesmall: "套头无帽卫衣",
          colorname: "01 11301标准黑/99401标准白-1",
          bodyfab: "KSF17EE0710201A-B",
          bodyfabtype: "双面布",
          bodyfabquality: "20S/1 COMB COTTON YARN(100%COTTON)(100.00%)  PIECE DYE  SOLID  DK INTERLOCK  B/W Weight:330.0GM/Q2",
          sportfunction: "韦德",
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
       ],
        search: '',
        dialogTableVisible: false,
      }
    },
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
