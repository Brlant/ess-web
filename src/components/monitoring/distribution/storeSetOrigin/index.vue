<template>
  <div class="container">
    <warehouse-part class="w-part" ref="warehouse"></warehouse-part>
  </div>
</template>
<script>
    import WarehousePart from './warehouse/index';

    export default {
        components: {WarehousePart}
    };
</script>
<style>
  .container{ width:100%; box-sizing:border-box; }
</style>