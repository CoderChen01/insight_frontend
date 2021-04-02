<template>
  <div class="bg main">
    <slot name="content"></slot>
  </div>
</template>


<script>
  export default {
    name: "backgroundBlueStyle"
  }
</script>


<style scoped>
  .bg {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
     flex-direction: column;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-image: url(~assets/img/login/background.jpg);
    background-repeat: no-repeat;
    background-color: #b8e5f8;
    background-size: cover;
    width: 100%;
    height: 100vh;
    overflow: auto
  }
</style>