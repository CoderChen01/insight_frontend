<template>
  <div>
    <main id="login">
      <background-blue-style>
        <template v-slot:content>
          <login-panel class="login-main-layout"></login-panel>
          <footer class="insight-copyright">
            <div id="footer">
              Copyright © 2020 coderchen01 in AHPU
              <br><span id="poweredby">Powered by Vue and Django</span>
            </div>
          </footer>
        </template>
      </background-blue-style>
    </main>
  </div>
</template>

<script>
  import backgroundBlueStyle from 'components/common/backgroundBlueStyle'
  import loginPanel from 'components/content/login/loginPanel'

  export default {
    name: "login",
    components: {
      backgroundBlueStyle,
      loginPanel
    }
  }
</script>

<style scoped>
  .login-main-layout {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -290px;
    margin-left: -444px;
  }

  .insight-copyright {
    margin: auto auto 0 auto;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    color: rgb(55,55,55);
    padding-bottom: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }
</style>