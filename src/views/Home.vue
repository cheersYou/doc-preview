<!--
 * @Author: weicong
 * @Date: 2021-03-10 10:30:02
 * @LastEditTime: 2021-03-10 16:49:59
 * @LastEditors: weicong
 * @Description: 
-->
<template>
  <div class="home">
    <Preview msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Preview from "@/components/Preview.vue";

export default {
  name: "Home",
  components: {
    Preview,
  },
};
</script>
