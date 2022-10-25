<template>
  <div class="homeComponent">
    <client-component></client-component>
  </div>
</template>

<script>
import ClientComponent from "./ClientComponent";

export default {
  name: 'HomeComponent',
  components: {
    ClientComponent
  }
}
</script>