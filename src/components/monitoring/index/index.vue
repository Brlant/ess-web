<template>
    <div>
        <warehouse-part v-if="mode===2" class="w-part" ref="warehouse"></warehouse-part>
        <vehicle v-if="mode===1"></vehicle>
    </div>
</template>
<script>
import WarehousePart from "./warehouse/index";
import vehicle from "./vehicle/index";

export default {
    components: {WarehousePart, vehicle},
    data: function () {
        return {
            mode: this.$route.meta.type - 0
        }
    },
    watch: {
        '$route': function () {
            if (this.$route.name === "scene-static") {
                this.mode = 2;
            } else if (this.$route.name === "scene-dynamic") {
                this.mode = 1;
            }
        },
    },
};
</script>
