<template>
    <div class="static-box">
        <div style="display: flex;" v-if="emptyTip">
            <div class="left">
                <el-collapse class="menu" v-model="activeNames" :accordion="true" @change="sceneChange"
                             v-loading="loading">
                    <el-collapse-item :title="item.scenesName" :name="item.id" v-for="(item,i1) in sceneList"
                                      :key="item.id">
                        <div class="element-item"
                             :class="i2==elementActiveIndex?'active':''"
                             @click="elementClick(i2,item2)"
                             v-for="(item2,i2) in elementList"
                             :key="item2.scenesElementId">
                            {{item2.scenesElementName}}
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="right">
                <div class="header">
                    <span style="width: 4px;background: #409EFF;display: block;height: 12px;margin-right: 8px;"></span>
                    {{clickElement.scenesElementName}}
                </div>
                <element-map
                    :element="clickElement"
                    :toolbar-top="-35"
                    :toolbar="true"
                    :elementColumn="elementColumn"
                    style="width: 100%;height: calc(100vh - 120px);"></element-map>
            </div>
        </div>
        <div v-else class="none-scene-list">
            当前未配置您可以查看的场景
        </div>
    </div>
</template>

<script>
import https from "../../../https";
import ElementMap from './element-map'

export default {
    name: "index",
    data() {
        return {
            activeNames: '0',
            sceneList: [],//场景列表
            elementList: [],//对象列表
            loading: false,
            elementActiveIndex: 0,
            pointList: [],
            clickElement: {},
            elementColumn: this.$store.state.elementColumn,
            emptyTip: true,
            depositoryCheckKeys: [],
        }
    },
    components: {
        ElementMap
    },
    watch: {
        clickElement(newValue) {
            //如果localStorage保存过，直接使用localStorage中的数据
            let elementColumn = window.localStorage.getItem('elementColumn-' + this.clickElement.scenesElementId)
            if (elementColumn) {
                elementColumn = JSON.parse(elementColumn);
                this.elementColumn = JSON.parse(JSON.stringify(elementColumn))
            }
            this.getLocalCheckedKeys(newValue)
            this.$nextTick(() => {
                this.showPointById()
            })
        }
    },
    methods: {
        showPointById() {
            let pointsDom = document.getElementsByClassName("point")
            for (let i = 0; i < pointsDom.length; i++) {
                if (this.depositoryCheckKeys.includes(parseInt(pointsDom[i].dataset.id))) {
                    pointsDom[i].style.display = 'block'
                } else {
                    pointsDom[i].style.display = 'none'
                }
            }
        },
        getLocalCheckedKeys(element) {
            //本地treeData
            let checkedKeys = window.localStorage.getItem('treeData-' + element.scenesElementId)
            if (!checkedKeys) {
                if (element.points.length > 0) {
                    checkedKeys = element.points.map(item => {
                        return item.ccsPointId
                    })
                } else {
                    checkedKeys = []
                }
            } else {
                checkedKeys = JSON.parse(checkedKeys)
            }
            this.depositoryCheckKeys = checkedKeys
        },
        //场景改变
        sceneChange(sceneId) {
            this.elementActiveIndex = 0;
            if (sceneId) {
                this.getSceneElementList(sceneId)
            }
        },

        //点击对象
        elementClick(elementActiveIndex, clickElement) {
            this.elementActiveIndex = elementActiveIndex;
            this.clickElement = clickElement
        },

        //获取场景下对象列表
        getSceneElementList(sceneId) {
            this.loading = true;
            this.elementList = []
            let params = {
                activeFlag: 1,
                scenesId: sceneId,
            }
            https.get('ccsScenesElement/getCcsScenesElementAllInfo', params).then(res => {
                this.elementList = res.data
                this.loading = false
                if (this.elementList.length > 0) {
                    this.elementClick('0', this.elementList[0])
                }
            })
        },
        //获取静态场景列表
        getSceneList() {
            let params = {
                pageNo: 1,
                pageSize: 200,
                activeFlag: 1,
                scenesType: 2,
                scenesName: '',
            }
            https.get("scenes/getScenesPageByUserRole", params).then(res => {
                this.sceneList = res.currentList
                this.emptyTip = this.sceneList.length > 0 ? true : false
                if (this.sceneList.length > 0) {
                    this.sceneChange(this.sceneList[0].id)
                    this.activeNames = this.sceneList[0].id
                }
            })
        }
    },
    mounted() {
        this.getSceneList()
    }
}
</script>
<!---->
<style lang="scss" scoped>


    .static-box {
        width: 100%;

        .left {
            width: 200px;
            height: calc(100vh - 70px);
            padding-left: 10px;
            padding-right: 10px;
            box-sizing: border-box;
            background-color: white;

            .element-item.active {
                background-color: #dfebf8;
            }

            .menu {
                overflow: auto;
                height: calc(100vh - 70px);
            }

            .element-item {
                height: 40px;
                display: flex;
                align-items: center;

                border-top: 1px #eaeaea solid;
                padding-left: 10px;
                cursor: pointer;
            }
        }

        .right {
            flex: 1;
            height: calc(100vh - 70px);
            box-sizing: border-box;
            padding-left: 10px;
            padding-right: 10px;
            background-color: white;

            .header {
                height: 50px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                color: black;
                font-weight: 500;
            }
        }
    }

    .none-scene-list {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 200px;
        font-size: 20px;
        color: #909399;
    }

    ::v-deep .el-collapse-item__header {
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        width: 180px !important;
        display: block
    }
</style>
