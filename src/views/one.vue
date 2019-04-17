<template>
<div>
  <el-upload
   class='image-uploader'
   :multiple='false'
   :auto-upload='true'
   list-type='text'
   accept=".xls,.xlsx"
   :show-file-list='true'
   :before-upload="beforeUpload"
   :drag='true'
   action=''
   :limit="1"
   :on-exceed="handleExceed"
   :http-request="uploadFile" >
   <i class="el-icon-upload"></i>
   <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
   <div class="el-upload__tip" slot="tip">一次只能上传一个文件，仅限Excel格式，单文件不超过2MB</div>
  </el-upload>
</div>
</template>

<script>
export default{

beforeUpload (file) {
      console.log('beforeUpload')
      console.log(file.type)
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      return (isText | isTextComputer)
    },
    // 上传文件个数超过定义的数量
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
    },
    // 上传文件
    uploadFile (item) {
      console.log(item)
      const fileObj = item.file
      // FormData 对象
      const form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      form.append('comId', this.comId)
      console.log(JSON.stringify(form))
      // let formTwo = JSON.stringify(form)
      EnterAPI.iExcel(form).then(response => {
        console.log('MediaAPI.upload')
        console.log(response)
        this.$message.info('文件：' + fileObj.name + '上传成功')
      })
}

}
</script>