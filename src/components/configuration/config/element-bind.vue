<style lang="scss" scoped>
@import "../../../assets/scss/mixins";

$leftWidth: 0px;

.el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
}

.el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
}

.content-part {

    .content-left {
        width: $leftWidth;
    }

    .content-right {
        > h3 {
            left: $leftWidth;
        }

        left: $leftWidth;
    }
}

::v-deep .el-card__header {
    background: #F4F7FA;
    padding: 10px 20px;
}

.el-tree::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

.el-tree::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    background: #909399;
}

.el-tree::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    border-radius: 2px;
    background: #ededed;
}
</style>
<template>
    <div>
        <div class="content-part">
            <div class="content-right min-gutter">
                <h3>场景对象绑定</h3>
                <el-form :model="form" ref="form" label-width="100px" style="padding-right: 20px">
                    <el-form-item label="场景名称">
                        {{ form.scenesName }}
                    </el-form-item>
                    <el-form-item label="对象" prop="devId">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <el-checkbox v-model="onlyShowChecked"><span
                                    style="color: rgb(245, 108, 108);">只显示已选中</span></el-checkbox>
                            </div>
                            <div>
                                <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                                </el-input>
                                <el-tree prop="scenesElementIds"
                                         v-loading="loading"
                                         ref="tree" node-key="id"
                                         :default-checked-keys="bindIds"
                                         @check-change="treeCheckChange"
                                         :filter-node-method="filterNode" :data="treeData" show-checkbox
                                         style="height: 500px;overflow: auto;"></el-tree>
                            </div>
                        </el-card>
                    </el-form-item>

                    <el-form-item>
                        <el-button :disabled="doing" @click="save('form')" type="primary">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';
import {CcsPointDevice} from '@/resources';
import DevTree from '@/components/common/dev/dev-tree';
import https from "@/https";

export default {
    name: 'element-bind',
    components: {DevTree},
    props: ['formItem', 'index', 'scene', 'element'],
    mixins: [methodsMixin],
    data() {
        return {
            bindIds: [],
            filterText: '',
            onlyShowChecked: false,
            form: {
                scenesElementIds: [],
                scenesId: '',
            },
            treeData: [],
            doing: false,
            loading: false,
        };
    },
    computed: {},
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        onlyShowChecked(val) {
            this.$refs.tree.filter(this.filterText);
        }
    },
    mounted() {
        this.loadTreeData(); //获取对象树
        // this.getBindIds();//获取选中的对象列表
    },
    methods: {
        filterNode(value, data, node) {
            if (this.onlyShowChecked) {
                return node.checked && this.filterByText(value, data, node)
            }
            return this.filterByText(value, data, node)
        },
        filterByText(value, data, node) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        loadTreeData() {
            this.loading = true
            this.form = Object.assign({}, this.formItem);

             this.loading = false
            https.get('/ccsScenes/ccsScenesElementDynamicOrStatic?activeFlag=1&scenesId=' + this.formItem.id)
            .then( data => {
                this.treeData = data.map(item => {
                    item.id = item.scenesElementId
                    item.label = item.scenesElementName
                    return item
                })

                this.getBindIds();//获取选中的对象列表
            } )
            .catch( err => {} ) ;
           
            /*
                yxh 之前逻辑
                let {
                    data,
                    code,
                    message
                } = await https.get('/ccsScenes/ccsScenesElementDynamicOrStatic?activeFlag=1&scenesId=' + this.formItem.id)
                this.loading = false
                if (code != 200) {
                    this.$notify.error({
                        message: message
                    })
                    return
                }
                this.treeData = data.map(item => {
                    item.id = item.scenesElementId
                    item.label = item.scenesElementName
                    return item
                })
            */
        },
        async treeCheckChange(item) {
            let ids = this.$refs.tree.getCheckedKeys()
            this.form.scenesElementIds = ids
        },
        getBindIds() {
            https.get("/ccsScenes/listScenesElementRelation?scenesId=" + this.form.id).then(res => {
                this.bindIds = res
            })
        },
        save(formName) {
            let params = {
                scenesElementIds: this.form.scenesElementIds ? this.form.scenesElementIds : [],
                scenesId: this.form.id,
            }
            this.doing = true
            https.post('/ccsScenes/saveScenesElementRelation', params).then(res => {
                this.$notify.success({
                    message: '绑定成功'
                });
                
                // yxh 添加逻辑
                this.$emit( 'refresh' ) ;
            }).finally(() => {
                this.doing = false
            })
        }
    }
};
</script>
