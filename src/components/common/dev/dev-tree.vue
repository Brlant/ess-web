<template>
    <div class="dev-tree">
        <div class="header">
            <el-checkbox v-model="checked" style="color:#F56C6C;font-weight:bolder">只显示已选中</el-checkbox>
        </div>
        <div class="body">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>

            <el-scrollbar :style="'height:'+bodyHeight" class="d-table-left_scroll" tag="div">
                <div v-if="loadingData">
                    <oms-loading :loading="loadingData"></oms-loading>
                </div>
                <el-tree
                    ref="tree"
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="default_expand_keys"
                    :default-checked-keys="default_checked_keys"
                    :filter-node-method="filterNode"
                    @check-change="sync"
                    @node-click="handleClick"
                    @check="handleClick"
                    :props="defaultProps">
                </el-tree>
            </el-scrollbar>

        </div>
    </div>

</template>

<script>

export default {
    model: {
        prop: 'checkedarr',
        event: 'update'
    },
    props: {
        'checkedarr': Array,
        'sceneid': {
            type: String,
            default: "0"
        },
        element: {
            type: Object,
            default: {},
        }
    },
    data() {
        return {
            filterText: '',
            loadingData: true,
            checked: false,
            data: [],
            default_expand_keys: [],
            default_checked_keys: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        };
    },
    methods: {
        handleClick(data) {
            // console.log(data)
            if (data.disabled) {
                // alert('catch')
                this.$refs['tree'].setChecked(data, false);
            }

        },
        in_array(search, array) {
            for (var i in array) {
                if (array[i] == search) {
                    return true;
                }
            }
            return false;
        },
        filterNode(value, data, node) {
            if (value) {
                if (data.name.indexOf(value) === -1)
                    return false;
            }
            if (!this.checked) return true;

            return node.checked
        },
        sync() {
            let c = this.$refs['tree'].getCheckedNodes();
            // console.log
            let t = [];
            for (var x in c) {
                t.push(c[x].id);
            }
            this.$emit("update", t);
        },
        tra(list, map) {
            if (typeof list !== 'object') return;

            //2021-1-9添加对树要排序
            list.sort((a, b) => {
                return a.name.localeCompare(b.name, "zh")
            });
            for (let x in list) {
                let node = list[x];
                map(node);
                this.tra(node.children, map);
            }
        },
    },
    watch: {
        filterText(val) {
            console.log('filterText')
            this.$refs.tree.filter(val);
        },
        checkedarr: function (va) {
            // console.log('watching',va)
            this.default_expand_keys = va;
            this.default_checked_keys = va;
            // this.$refs['choose-tree'].setCheckedKeys(va);
        },
        checked: function (v) {
            console.log("调用到这里")
            this.$refs.tree.filter();
        }
    },
    computed: {
        bodyHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return (height / 2) + 'px';
        },
    },
    mounted() {
        // console.log('mounted')
        // this.$http.get('/yhApi/getDevices').then(res => {
        this.$http.get('/ccsDevice/listDeviceGroups').then(res => {
            res.data.data = res.data.data.map(item => {
                item.id = item.productKey
                item.name = item.productName
                item.children = item.ccsDevList.map(item2 => {
                    item2.id = item2.ccsDevId
                    item2.name = item2.devName
                    item2.children = []
                    return item2
                })
                return item
            })

            this.default_expand_keys = this.checkedarr;
            this.default_checked_keys = this.checkedarr;
            this.tra(res.data.data, (data) => {
                data.disabled = false;
            });
            this.data = res.data.data;
            this.loadingData = false;
            // if (this.sceneid !== "0") return this.$http.get('/ccsScenes/getDeviceIdByScenesId', {
            //     params: {
            //         activeFlag: 1,
            //         scenesId: this.sceneid
            //     }
            // });

            //获取checkbox黑名单
            if (this.element.scenesElementId) {
                return this.$http.get('ccsScenesElement/getDeviceIdByScenesElementId', {
                    params: {
                        activeFlag: 1,
                        scenesElementId: this.element.scenesElementId
                    }
                })
            }
        }).then((res) => {
            if (!this.element.scenesElementId) return;
            //console.log(res);
            let black = res.data.data;
            let white = this.checkedarr;
            // console.log(black,white)
            this.tra(this.data, (data) => {
                if (this.in_array(data.id, black) && !this.in_array(data.id, white)) {
                    if (data.children.length == 0) {
                        // console.log(data.name,'disabled')
                        data.disabled = true;
                        // this.$set(data,"disabled",false)
                    }
                    // console.log(data)
                }
            })
        });
    }
};

</script>

<style scoped lang="scss">
.dev-tree {
    border: 2px solid #EBEBEB;
    padding: 0px;
    /* box-shadow: 1px 1px 5px #888888; */
    .header {
        padding: 5px;
        background: #F4F7FA;
    }

    .body {
        // padding: 5px;
    }
}
</style>
