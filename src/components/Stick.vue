<template>
  <div>
    <div class="stick"></div>
    <div class="stick-holder"></div>
  </div>
</template>

<script>
export default {
  name: "Stick",
};
</script>

<style scoped>
.stick {
  width: 1000px;
  height: 20px;
  background: rgb(129, 35, 11);
  margin: auto;
  left: 0;
  right: 0;
  position: absolute;
  bottom: 14.6%;
  transition: .3s ease all;
}

.stick-holder {
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
  border-bottom: 120px solid rgb(129, 35, 11);
  margin: auto;
  left: 0;
  right: 0;
  position: absolute;
  bottom: 3.1%;
}
</style>