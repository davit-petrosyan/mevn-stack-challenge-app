<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view/>
    <notifications
        group="success"
        classes="success notification"
        position="bottom-left"
    />
    <notifications
        group="error"
        classes="error notification"
        position="bottom-left"
    />
  </div>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img{
  max-height: 50px;
}
.notification{
  padding: 10px;
  margin: 8px;
  border: 1px solid transparent;
  border-radius: 5px;
}
.success{
  color: #155724;
  background-color: #d4edda !important;
  border-color: #c3e6cb;
}
.error{
  color: #721c24;
  background-color: #f8d7da !important;
  border-color: #f5c6cb;
}
.vue-notification-group{
  left: 5px;
  bottom: 5px;
}
</style>
