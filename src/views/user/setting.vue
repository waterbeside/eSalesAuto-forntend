<template>
<div>
  <div class="app-container">
    

  </div>
</div>
</template>
<script>
  export default {
    name: 'user_setting',

    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>