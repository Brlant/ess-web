<style>
  .print-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
  }
</style>
<template>
  <div :element-loading-text="print.text" class="print-dialog" v-if="print.isPrinting"
       v-loading="print.isPrinting"></div>
</template>
<script>
    export default {
        computed: {
            print() {
                return this.$store.state.print;
            }
        }
    };
</script>
