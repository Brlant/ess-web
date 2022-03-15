<template>
    <el-scrollbar :style="'padding-left:5px;padding-right:5px;height:'+bodyHeight" class="d-table-left_scroll"
                  tag="div">
        <div class="d-table-left_scroll_content">
            <div v-if="loadingDataScene">
                <oms-loading :loading="loadingDataScene"></oms-loading>
            </div>
            <div class="empty-info mini" v-else-if="sceneList.length===0">
                暂无信息
            </div>
            <div v-else>
                <el-collapse :key="index" @change="changeScene(item)" accordion
                             class="scene-tree" v-for="(item, index) in sceneList"
                             v-model="activeSceneId">
                    <el-collapse-item :name="item.id">
                        <template slot="title">
                            {{ item.scenesName }}
                            <el-tag type="success" v-show="item.scenesType+''=== '1'">动态</el-tag>
                            <el-tag type="info" v-show="item.scenesType+'' === '2'">静态</el-tag>
                        </template>
                        <div v-if="loadingDataSceneElement">
                            <oms-loading :loading="loadingDataSceneElement"></oms-loading>
                        </div>
                        <div class="empty-info mini" v-else-if="!elementList.length">
                            暂无场景对象信息
                        </div>
                        <ul class="show-list" v-else>
                            <li
                                :class="{'active':''===activeElementId}"
                                class="list-item" v-if="elementList.length > 0 && subItemAll"
                                @click="showSceneAll(item)">{{subItemAllText}}
                            </li>
                            <li :class="{'active':item.scenesElementId===activeElementId}" :key="index"
                                @click="showElementDetail(item)"
                                class="list-item" v-for="(item,index) in elementList">
                                {{ item.scenesElementName }}
                                <el-tag type="success" v-show="item.activeFlag === '1'">启用</el-tag>
                                <el-tag type="danger" v-show="item.activeFlag === '0'">停用</el-tag>
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import {CcsScene, CcsSceneElement} from '@/resources';

export default {
    props: {
        sceneType: {
            type: String | Number,
            default: ''
        },
        subItemAll: {
            type: Boolean,
            default: false
        },
        subItemAllText: {
            type: String,
            default: '全部对象'
        }
    },
    data: function () {
        return {
            loadingDataScene: false,
            loadingDataSceneElement: false,
            loadingPoint: false,
            sceneList: [],
            elementList: [],
            currentScene: {},
            currentElement: {},
            activeSceneId: '',
            activeElementId: '',
        };
    },
    computed: {
        bodyHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return (height - 20) + 'px';
        },
        tableHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return (height - 207);
        }
    },
    mounted() {
        this.queryScene();
    },
    methods: {
        showSceneAll(scene) {
            this.$emit('show-scene-all', scene);
        },
        queryScene: function () {
            let param = {
                activeFlag: '1',
                scenesType: this.sceneType
            };
            this.loadingDataScene = true;
            CcsScene.query(param).then(res => {
                this.currentElement = {};
                this.sceneList = res.data.currentList;
                this.elementList = [];
                // console.log(res);return;
                this.currentScene = this.sceneList.length ? this.sceneList[0] : {};
                this.activeSceneId = this.sceneList.length ? this.sceneList[0].id : '';
                this.loadingDataScene = false;
                this.$emit('scene-change', this.currentScene);
                if (this.subItemAll) {
                    //子菜单有全部选项，默认选中全部
                    this.activeElementId = '';
                    this.$emit('show-scene-all', this.currentScene);
                }
                this.sceneList.length && this.queryElement();
            });
        },
        queryElement: function () {
            let param = {
                page: 1,
                size: 1000,
                scenesId: this.currentScene.id,
                // sceneType: '2',
                activeFlag: '1'
            };
            this.loadingDataSceneElement = true;
            CcsSceneElement.query(param).then(res => {
                this.elementList = res.data.data.list;
                if (this.subItemAll) {
                    //子菜单有全部选项，默认选中全部
                    this.activeElementId = '';
                    this.currentElement = null;
                } else {
                    if (this.elementList.length) {
                        this.showElementDetail(this.elementList[0])
                    }
                }
                this.loadingDataSceneElement = false;
                // this.elementList.length && this.queryPoint(1);
            });
        },
        changeScene(item) {
            this.currentScene = item;
            this.$emit('scene-change', item);
            if (this.subItemAll) {
                //子菜单有全部选项，默认选中全部
                this.activeElementId = '';
                this.$emit('show-scene-all', this.currentScene);
            }
            this.queryElement();
        },
        showElementDetail(item) {
            if (item.scenesElementId == this.activeElementId) {
                return;
            }
            this.currentElement = item;
            this.activeElementId = this.currentElement.scenesElementId;
            this.$emit('scene-element-change', item, this.currentScene);
        }
    }
}
</script>
