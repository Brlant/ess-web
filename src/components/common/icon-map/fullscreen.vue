<template>
    <div class="box">
        <div class="header">
            <div class="left">
                <div>
                    <span class="scene-name">{{ element.scenesElementName }}</span>
                    <i class="el-icon-setting" style="margin-left: 20px;color: gray;cursor: pointer;font-size: 15px;"
                       @click="dialogVisible=true"></i>
                </div>
            </div>
            <div class="right">
                <div>
                    <el-autocomplete
                        prefix-icon="el-icon-search"
                        size="small"
                        ref="searchInput"
                        style="margin-right: 20px;width:200px;height: 32px;"
                        v-model="searchValue"
                        placeholder="请输入内容"
                        :clearable="true"
                        :fetch-suggestions="querySearchAsync"
                        @select="handleSelectElement"
                        @clear="clearSearch"
                    ></el-autocomplete>

                    <span class="username">{{ user.userName || '匿名用户' }}</span>
                    <span class="time">{{ now |time }}</span>
                </div>
            </div>
        </div>

        <element-map
            ref="divContainer"
            :element="element"
            :fullbtn="false"
            :elementColumn="elementColumn"
            :showUnit="showUnit"
            style="width: 100%;height: calc(100vh - 52px);"></element-map>


        <el-dialog :visible.sync="dialogVisible" width="460px">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="请选择要显示的对象" name="first">
                    <el-input placeholder="输入关键字进行过滤" size="small" v-model="depositoryFilterText"></el-input>
                    <el-tree
                        ref="depositoryTree"
                        @check="checkedkeys"
                        :filter-node-method="filterNode"
                        :data="depositoryTreeData"
                        :default-checked-keys="depositoryCheckKeys"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                    >
                    </el-tree>
                </el-tab-pane>
                <el-tab-pane label="请选择对象需要显示的字段" name="second">
                    <div style="display: flex;justify-content: center;">
                        <el-card shadow="hover">
                            <div>库区</div>
                            <div>
                                <el-select v-model="depository.first"
                                           placeholder="请选择"
                                           class="select-mt"
                                >
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                                <el-select v-model="depository.second"
                                           :disabled="depository.first==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="depository.third"
                                           :disabled="depository.second==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="depository.fourth"
                                           :disabled="depository.third==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </div>
                        </el-card>
                        <div>
                            <el-checkbox style="margin-left: 20px" v-model="showUnit">单位</el-checkbox>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
    import ElementMap from '../../monitoring/static/element-map';
    import https from "../../../https";

    export default {

    components: {
        ElementMap
    },
    data() {
        return {
            depositoryFilterText: '',
            depositoryTreeData: [],
            depositoryCheckKeys: [],
            activeName: 'first',

            elementId: '',
            element: {},
            scaleX: 1,
            scaleY: 1,
            div_origin_width: 1000,
            div_origin_height: 600,
            list: [],
            editable: this.editMode,
            imageUrl: 'https://iot-test.tracentsure.com/iotap/api//file/3a0d70cad50e41b3ac9681c225b5a42f.png',
            user: this.$store.state.user,
            now: '',//当前时间
            nowIntervalTask: null,//时间定时器
            getElementIntervalTask: null,//时间定时器
            searchValue: '',//搜索值

            dialogVisible: false,
            options: [],
            depository: this.$store.state.elementColumn.depository,
            company: this.$store.state.elementColumn.company,
            car: this.$store.state.elementColumn.car,
            order: this.$store.state.elementColumn.order,
            elementColumn: this.$store.state.elementColumn,
            showUnit:true,
        };
    },
    watch: {
        depositoryFilterText(val) {
            this.$refs.depositoryTree.filter(val);
        },
        depository: {
            handler: function (newValue) {
                if (newValue.first === '') {
                    this.depository.second = ''
                    this.depository.third = ''
                    this.depository.fourth = ''
                } else if (newValue.second === '') {
                    this.depository.third = ''
                    this.depository.fourth = ''
                } else if (newValue.third === '') {
                    this.depository.fourth = ''
                }

                this.saveLocalelEmentColumn()
            },
            deep: true,
        },
    },
    mounted() {
            this.elementId = this.$route.query.elementId;
            this.init();

            this.getElementIntervalTask = setInterval(() => {
                this.getElement(this.elementId)
            }, 30 * 1000)

            //创建一个定时器
            this.nowIntervalTask = setInterval(() => {
                this.now = new Date().getTime();
            })

            this.getCcsSceneDeviceFields(this.elementId)

            //如果localStorage保存过，直接使用localStorage中的数据
            let elementColumn = window.localStorage.getItem('elementColumn-' + this.elementId)
            if (elementColumn) {
                elementColumn = JSON.parse(elementColumn);
                this.depository = elementColumn.depository
                this.car = elementColumn.car
                this.order = elementColumn.order
                this.company = elementColumn.company
                this.elementColumn = JSON.parse(JSON.stringify(elementColumn))
            } else {
                this.elementColumn = JSON.parse(JSON.stringify(this.$store.state.elementColumn))
            }
        },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
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
        setLocalCheckedKeys(checkedKeys) {
            window.localStorage.setItem('treeData-' + this.elementId, JSON.stringify(checkedKeys))
        },
        getLocalCheckedKeys(element) {
            //本地treeData
            let checkedKeys = window.localStorage.getItem('treeData-' + this.elementId)
            if (!checkedKeys) {
                if (element.points.length > 0) {
                    checkedKeys = element.points.map(item => {
                        return item.ccsPointId
                    })
                } else {
                    checkedKeys = []
                }
                this.setLocalCheckedKeys(checkedKeys)
            } else {
                checkedKeys = JSON.parse(checkedKeys)
            }
            this.depositoryCheckKeys = checkedKeys
        },
        setDepositoryTreeData(element) {
            if (element.points.length > 0) {
                let list = element.points.map(item => {
                    let tmp = {}
                    tmp.id = item.ccsPointId
                    tmp.label = item.ccsPointName
                    tmp.children = []
                    return tmp
                })
                this.depositoryTreeData = [{id: 'point', label: '库区', children: list}]
            }
        },
        /**********搜索 start********************/
        querySearchAsync(queryString, cb) {
            let points = this.element.points;
            if (queryString == "") {
                this.showAllPoint(true)
                cb([]);
                return;
            }
            let results = points.filter(item => {
                item.value = item.ccsPointName
                return item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0;
            });
            cb(results);
        },

        //监听选择的对象
        handleSelectElement(item) {
            this.showAllPoint(false, item.ccsPointName)
        },
        //清空搜索
        clearSearch(e) {
            this.$refs.searchInput.$refs.input.blur()
            this.showAllPoint(true)
        },
        showAllPoint(show, name) {
            let pointsDom = document.getElementsByClassName("point")
            for (let i = 0; i < pointsDom.length; i++) {
                if (show) {
                    pointsDom[i].style.display = 'block'
                } else {
                    if (name && pointsDom[i].dataset.name == name) {
                        pointsDom[i].style.display = 'block'
                    } else {
                        pointsDom[i].style.display = 'none'
                    }
                }
            }
        },
        /**********搜索 end********************/

        init() {
            let width = this.$refs.divContainer.clientWidth;
            let height = this.$refs.divContainer.clientHeight;
            this.scaleX = width / this.div_origin_width;
            this.scaleY = height / this.div_origin_height;

            this.imageUrl = this.$route.query.imageUrl;
            this.getElement(this.elementId)
        },
        getElement(elementId) {
            // 页面首次加载的时候先加载底图，国控演示临时适配
            if (this.elementId === '187'){
                this.element = {
                    backgroundUrl: require('../../../assets/img/scence_bg.png')
                };
            }
            https.get('/ccsScenesElement/getCcsElementById?id=' + elementId).then(res => {
                if(res.headers && res.headers["iot-token"]){
                    window.localStorage.setItem("token", res.headers["iot-token"]);
                }
                let elementData = {...res.data};
                if (elementData.scenesElementId === 187){
                    console.log('静态场景，大图。。。。');
                    elementData.backgroundUrl = require('../../../assets/img/scence_bg.png')
                    // elementData.backgroundUrl = 'https://test-iotap-osp.cdcerp.cn/api/common/getFile/d6244a81-e64c-46c3-8e3f-3275359ce5e4.png'
                }
                this.element = elementData;
                this.setDepositoryTreeData(this.element)//设置树
                if (this.depositoryCheckKeys.length === 0) {
                    this.getLocalCheckedKeys(this.element) //获取树选中的keys
                }
                this.$nextTick(() => {
                    this.showPointById() //根据local保存的数据显示点位
                })
            })
        },
        getCcsSceneDeviceFields(elementId) {
            https.get('ccsScenesElement/getCcsElementDeviceFields', {elementId: elementId}).then(res => {
                this.options = res.data
                this.options.unshift({
                    label: '名称',
                    value: 'ccsPointName',
                })
                this.options.unshift({
                    label: '请选择',
                    value: '',
                })
            })
        },
        saveLocalelEmentColumn() {
            //保存对象显示字段配置
            let elementColumn = {
                depository: this.depository,
                car: this.car,
                order: this.order,
                company: this.company,
            }
            this.elementColumn = JSON.parse(JSON.stringify(elementColumn))
            window.localStorage.setItem('elementColumn-' + this.elementId, JSON.stringify(elementColumn))
        },
        checkedkeys(clickNode, treeNode) {
            this.depositoryCheckKeys = treeNode.checkedKeys
            this.showPointById()
            //保存treeData显示对象配置
            this.setLocalCheckedKeys(this.depositoryCheckKeys)
        }
    },

    destroyed() {
        window.clearInterval(this.nowIntervalTask);
        window.clearInterval(this.getElementIntervalTask);
    }
};
</script>
<style scoped>

.box {
    width: 100%;
    height: 100%;
}

.box .header {
    width: 100%;
    height: 52px;
    background-color: black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
}

.box .header .left {
    color: white;
    height: 52px;
    display: flex;
    align-items: center;
}

.box .header .left .scene-name {
    color: #f0b100;
    font-size: 20px;
    font-weight: 400;
    margin-left: 30px;
    cursor: default;
}

.box .header .left .setting {
    color: gray;
    font-size: 25px;
    font-weight: 200;
    margin-left: 30px;
    cursor: pointer;
}

.box .header .right {
    color: white;
    height: 52px;
    display: flex;
    align-items: center;
}

.box .header .right .time {
    color: gray;
    font-size: 14px;
    margin-right: 20px;
}


.box .header .right .username {
    font-size: 14px;
    color: #f0b100;
    margin-right: 20px;
}

.header /deep/ .el-input__inner {
    background: gray;
    border-radius: 100px;
    border-color: gray;
}

.header /deep/ .el-input__inner:focus {
    border-color: gray;
    color: #eaeaea;
}

.dialog /deep/ .el-input__inner {
    height: 32px;

}

.select-mt {
    margin-top: 10px;
}

.el-card {
    /*margin: 5px;*/
    height: 510px;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__body {
    padding: 10px;
    height: 490px;
    box-sizing: border-box;
}

.el-tree {
    padding: 10px 0px;
    /*width: 263px;*/
    height: 490px;
    overflow: auto;
    box-sizing: border-box;
}

/*.el-tree::-webkit-scrollbar {*/
/*    !*滚动条整体样式*!*/
/*    width: 2px; !*高宽分别对应横竖滚动条的尺寸*!*/
/*    height: 1px;*/
/*}*/

/*.el-tree::-webkit-scrollbar-thumb {*/
/*    !*滚动条里面小方块*!*/
/*    border-radius: 2px;*/
/*    !*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*!*/
/*    background: #909399;*/
/*}*/

/*.el-tree::-webkit-scrollbar-track {*/
/*    !*滚动条里面轨道*!*/
/*    !*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*!*/
/*    border-radius: 2px;*/
/*    background: #ededed;*/
/*}*/
</style>
