<template>
  <div style="margin-top:10px;">
    <!-- <logsic-part @open="open" @queryScene="queryScene" ref="logsic"></logsic-part> -->
    <warehouse-part class="w-part" ref="warehouse"></warehouse-part>
  </div>
</template>
<script>
    // import LogsicPart from './logisticscenter/index';
    import WarehousePart from './warehouse/index';

    export default {
        components: {WarehousePart},
        // data() {
        //     return {
        //         showIndex: -1,
        //         form: {},
        //         type: ''
        //     };
        // },
        // methods: {
        //     resetRightBox() {
        //         this.showIndex = -1;
        //     },
        //     queryScene() {
        //         const that = this.$refs['warehouse'];
        //         that.queryScene(1);
        //     },
        //     open(form, type) {
        //         this.form = Object.assign({}, form);
        //         this.type = type;
        //         this.showIndex = 0;
        //     },
        //     replaceItem(ary, item) {
        //         let index = -1;
        //         ary.forEach((i, k) => {
        //             if (i.id === item.id) {
        //                 index = k;
        //             }
        //         });
        //         index !== -1 && ary.splice(index, 1, item);
        //     },
        //     deleteStore(item, type) {
        //         this.$confirmOpera(`是否删除"${item.warehouseCode}"`, () => {
        //             this.$httpRequestOpera(CcsWarehouse.delete(item.id), {
        //                 successTitle: '删除成功',
        //                 errorTitle: '删除失败',
        //                 success: () => {
        //                     const logsic = this.$refs['logsic'];
        //                     const warehouse = this.$refs['warehouse'];
        //                     type === '1' && warehouse.queryScene();
        //                     if (type === '0') {
        //                         logsic.getList();
        //                         logsic.currentItem = {};
        //                     }
        //                     if (type === '2') {
        //                         warehouse.queryArea();
        //                         warehouse.currentArea = {};
        //                     }
        //                 }
        //             });
        //         });
        //     },
        //     refresh(data, type, actionType) {
        //         const logsic = this.$refs['logsic'];
        //         const warehouse = this.$refs['warehouse'];
        //         if (type === '0') {
        //             if (actionType === 1) {
        //                 logsic.getList();
        //             } else {
        //                 this.replaceItem(logsic.logisticsCenterList, data);
        //                 logsic.currentItem = Object.assign({}, data);
        //             }
        //         } else if (type === '1') {
        //             if (actionType === 1) {
        //                 warehouse.queryScene();
        //             } else {
        //                 this.replaceItem(warehouse.warehouseList, data);
        //             }
        //         } else if (type === '2') {
        //             if (actionType === 1) {
        //                 warehouse.queryArea();
        //             } else {
        //                 this.replaceItem(warehouse.areaList, data);
        //                 warehouse.currentArea = Object.assign({}, data);
        //             }
        //         }
        //         this.resetRightBox();
        //     }
        // }
    };
</script>
