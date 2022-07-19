<template>
    <div>
        <div class="box" v-if="emptyTip">
            <div class="left" v-loading="changeSceneLoading">
                <el-menu default-active="0" @select="handleSelect">
                    <el-menu-item
                        v-for="(item,index) in sceneList"
                        :index="''+index.toString()"
                        :key="index"
                        class="border-d"
                        style="padding: 0px;"
                    >
                        <span :title="item.scenesName" slot="title">{{item.scenesName}}</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="right">
                <amap-page ref="amapPage" @elements-change="elementsChange" :modeStyle="modeStyle" :sceneid="currentSceneId" :elementColumn="elementColumn"
                           :showMarkerIdList="showMarkerIdList" class="amap-container"></amap-page>
                <div class="tools">
                    <el-button type="info" @click="changeModeStyleFn">深浅切换</el-button>
                    <el-button type="info" icon="el-icon-rank" @click="openTab"></el-button>
                </div>
            </div>
        </div>
        <div class="none-scene-list " v-else>
            当前未配置您可以查看的场景
        </div>
    </div>
</template>
<script>

import AmapPage from './amap-page'
import {CcsScene} from "@/resources.js"
import https from "../../../../https";
import { mapState } from 'vuex'


export default {
    data() {
        return {
            modeStyle : JSON.parse(localStorage.getItem( 'mapMode' )),
            sceneList: [],  //场景列表
            currentSceneId: '',
            elementColumn: this.$store.state.elementColumn,
            emptyTip: true,
            changeSceneLoading: false,
            showMarkerIdList: []
        };
    },
    computed: {
    },
    watch: {
        currentSceneId(newValue) {
            this.setElementColumn()
        }
    },
    components: {
        AmapPage
    },
    destroyed(){
        window.removeEventListener( 'visibilitychange', this.visiblityChangeFn ) ;
    },
    mounted() {
        this.getSceneList();

        window.removeEventListener( 'visibilitychange', this.visiblityChangeFn ) ;
        window.addEventListener( 'visibilitychange', this.visiblityChangeFn, false ) ;

    },
    methods: {
        
        visiblityChangeFn( e ){
            if( document.visibilityState === 'visible' ){
                // DO SOMETHING...
                this.modeStyle = JSON.parse(localStorage.getItem( 'mapMode' )) ;

                this.$refs.amapPage && this.$refs.amapPage.getElements && this.$refs.amapPage.getElements( this.currentSceneId ) ;
            } else {
            }
        },

        changeModeStyleFn(){
            this.modeStyle = !this.modeStyle ;
            localStorage.setItem( 'mapMode', this.modeStyle ) ;
        },
        setElementColumn() {
            //如果localStorage保存过，直接使用localStorage中的数据
            let elementColumn = window.localStorage.getItem('elementColumn-' + this.currentSceneId)
            if (elementColumn) {
                elementColumn = JSON.parse(elementColumn);
                this.elementColumn = JSON.parse(JSON.stringify(elementColumn))
            }
        },
        //获取场景列表
        getSceneList() {
            let params = {
                pageNo: 1,
                pageSize: 20,
                activeFlag: 1,
                scenesType: 1,
                scenesName: ""
            };
            // CcsScene.query(params).then(res => {
            //     this.sceneList = res.data.currentList;
            //     //获取场景下所有对象
            //     if (this.sceneList.length > 0) {
            //         this.currentSceneId = this.sceneList[0].id;
            //     }
            // });

            // yxh 所有带 /scenes  改为 /ccsScenes
            // https.get("scenes/getScenesPageByUserRole", params).then(res => {
            https.get("ccsScenes/getScenesPageByUserRole", params).then(res => {
                this.sceneList = res.currentList;
                this.emptyTip = this.sceneList.length > 0 ? true : false
                //获取场景下所有对象
                if (this.sceneList.length > 0) {
                    this.currentSceneId = this.sceneList[0].id;
                }
            })
        },
        //打开全屏
        openTab() {
            let routeData = this.$router.resolve({
                name: 'dynamic-fullscreen',
                query: {scenesId: this.currentSceneId}
            });
            window.open(routeData.href, '_blank')
        },
        //菜单切换场景
        handleSelect(key, keyPath) {
            this.changeSceneLoading = true
            this.currentSceneId = this.sceneList[key].id;
            let event = setTimeout(() => {
                this.changeSceneLoading = false
                window.clearTimeout(event)
            }, 600)
        },
        //对象数组改变事件
        elementsChange(elements) {
            this.getLocalTreeCheckedKeys(elements)
        },

        getLocalTreeCheckedKeys(elements) {
            let checkedKeys = window.localStorage.getItem('treeData-' + this.currentSceneId)
            if (!checkedKeys) {
                if (elements.length > 0) {
                    checkedKeys = elements.map(item => {
                        return item.scenesElementId
                    })
                } else {
                    checkedKeys = []
                }
            } else {
                checkedKeys = JSON.parse(checkedKeys)
            }
            // let checkedKeys = elements.map(item => {
            //     return item.scenesElementId
            // })
            this.showMarkerIdList = checkedKeys
        },
    },

}
;
</script>
<style lang="scss" scoped>
    .box {
        display: flex;
        width: 100%;
        height: calc(100vh - 70px);
        position: relative;

        .left {
            background-color: #ffffff;
            width: 200px;
            height: 600px;
            padding: 10px;
            height: calc(100vh - 70px);
            overflow: auto;
        }

        .right {
            flex: 1;
            height: calc(100vh - 71px);
            box-sizing: border-box;
            display: flex;
            position: relative;

            .amap-container {
                flex: 1;
            }
        }
    }

    .el-menu {
        border: none;
    }

    ::v-deep .el-menu-item {
        padding: 0px;
    }

    .border-d {
        border-bottom: solid 1px #e6e6e6;
        padding: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tools {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;

        .full-btn {
            width: 100px;
            margin-right: 10px;
        }

        .refresh {
            width: 100px;
            background-color: white;
            margin-right: 10px;
        }

        .theme {
            width: 117px;
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

</style>

