<template>
    <div class="box">
        <div class="header">
            <div class="left">
                <div>
                    <span class="scene-name">{{ this.sceneName }}</span>
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
                        style="margin-right: 20px;width:200px;"
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
        <div class="tools">
            <el-button type="info" style="position:absolute; z-index:1; right:20px; top:70px; padding:10px" @click="changeModeStyleFn">深浅切换</el-button>
        </div>
        
        <amap-page
            class="amap-container"
            :sceneid="sceneid"
            :modeStyle="modeStyle"
            :elementColumn="elementColumn"
            :carStatusCode="carStatusCode"
            :showmarkerid="showmarkerid"
            :showMarkerIdList="showMarkerIdList"
            :showUnit="showUnit"
            @elements-change="elementsChange"></amap-page>

        <el-dialog :visible.sync="dialogVisible" width="1200px">
            <!-- 
                之前逻辑
                <div style="position: absolute;top:25px; right: 100px;" v-if=" this.sceneName.indexOf('新冠')!==-1 ">
                    <el-button @click="pullRemoteShowMarkerIdList" :loading="pullLoading" size="mini">
                        获取监控对象
                    </el-button>
                </div> 
            -->
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="筛选条件" name="zero">
                    <p>车辆监控状态：</p>
                    <el-radio-group v-model="carStatus">
                        <el-radio :label="1">所有车辆</el-radio>
                        <el-radio :label="2">监控中车辆</el-radio>
                        <el-radio :label="3">未监控车辆</el-radio>
                    </el-radio-group>
                    <el-row class="carStatusBtnInfo">
                        <el-button @click="saveCarStatusFn" size="small" type="primary">确定</el-button>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="显示对象配置" name="first">
                    <div style="display: flex;">
                        <el-card shadow="never">
                            <el-input placeholder="输入关键字进行过滤" size="small" v-model="depositoryFilterText"></el-input>
                            <el-tree
                                @check="checkedkeys"
                                ref="depositoryTree"
                                :filter-node-method="filterNode"
                                :data="depositoryTreeData"
                                :default-checked-keys="showMarkerIdList"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                 </span>
                            </el-tree>
                        </el-card>
                        <el-card shadow="never">
                            <el-input placeholder="输入关键字进行过滤" size="small" v-model="companyFilterText"></el-input>
                            <el-tree
                                @check="checkedkeys"
                                ref="companyTree"
                                :filter-node-method="filterNode"
                                :data="companyTreeData"
                                :default-checked-keys="showMarkerIdList"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                            >
                                 <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                 </span>
                            </el-tree>
                        </el-card>
                        <el-card shadow="never">
                            <el-input placeholder="输入关键字进行过滤" size="small" v-model="carFilterText"></el-input>
                            <el-tree
                                @check="checkedkeys"
                                ref="carTree"
                                :filter-node-method="filterNode"
                                :data="carTreeData"
                                :default-checked-keys="showMarkerIdList"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                 </span>
                            </el-tree>
                        </el-card>
                        <el-card shadow="never">
                            <el-input placeholder="输入关键字进行过滤" size="small" v-model="orderFilterText"></el-input>
                            <el-tree
                                @check="checkedkeys"
                                ref="orderTree"
                                :filter-node-method="filterNode"
                                :data="orderTreeData"
                                :default-checked-keys="showMarkerIdList"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                 </span>
                            </el-tree>
                        </el-card>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="显示对象字段配置" name="second">
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
                                        v-for="item in reservoirOptions"
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
                                        v-for="item in reservoirOptions"
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
                                        v-for="item in reservoirOptions"
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
                                        v-for="item in reservoirOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </div>
                        </el-card>
                        <el-card shadow="hover">
                            <div>单位</div>
                            <div>
                                <el-select v-model="company.first"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in unitOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="company.second"
                                           :disabled="company.first==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in unitOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="company.third"
                                           :disabled="company.second==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in unitOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="company.fourth"
                                           :disabled="company.third==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in unitOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-card>
                        <el-card shadow="hover">
                            <div>车辆</div>
                            <div>
                                <el-select v-model="car.first"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in carOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="car.second"
                                           :disabled="car.first==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in carOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="car.third"
                                           :disabled="car.second==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in carOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="car.fourth"
                                           :disabled="car.third==''?true:false"
                                           placeholder="请选择"
                                           class="select-mt">
                                    <el-option
                                        size="mini"
                                        v-for="item in carOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-card>
                        <el-card shadow="hover">
                            <div>订单</div>
                            <div>
                                <el-select v-model="order.first"
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
                                <el-select v-model="order.second"
                                           :disabled="order.first==''?true:false"
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
                                <el-select v-model="order.third"
                                           :disabled="order.second==''?true:false"
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
                                <el-select v-model="order.fourth"
                                           :disabled="order.third==''?true:false"
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
                            <!-- <el-checkbox style="margin-left: 20px" v-model="showUnit">显示数据单位</el-checkbox> -->
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <!--            <span slot="footer" class="dialog-footer">-->
            <!--                <el-button type="primary" @click="selectElementColumn">确 定</el-button>-->
            <!--            </span>-->
        </el-dialog>
    </div>
</template>

<script>
import utils from '@/tools/utils';
import {CCsScen} from "@/resources.js"
import https from "../../../https";
import AmapPage from '../../monitoring/index/vehicle/amap-page'


export default {
    name: "dynamic-fullscreen",
    data() {
        return {
            pullLoading: false,
            depositoryFilterText: '',
            depositoryTreeData: [],

            companyFilterText: '',
            companyTreeData: [],

            carFilterText: '',
            carTreeData: [],

            orderFilterText: '',
            orderTreeData: [],
            activeName: 'zero',
            reservoirOptions:[
                {label:'请选择',value:''},
                {label:'名称',value:'scenesElementName'},
                {label:'温度',value:'temperature'},
                {label:'湿度',value:'humidity'},
                {label:'电量',value:'voltage'},
            ],//库区
            unitOptions:[
                {label:'请选择',value:''},
                {label:'名称',value:'scenesElementName'},
            ],//单位
            carOptions:[
                {label:'请选择',value:''},
                {label:'名称',value:'scenesElementName'},
                {label:'温度',value:'temperature'},
                {label:'湿度',value:'humidity'},
                {label:'电量',value:'voltage'},
                {label:'经度',value:'longitude'},
                {label:'维度',value:'latitude'},
                {label:'海拔',value:'altitude'},
                {label:'速度',value:'speed'},
                {label:'方向角',value:'bearing'},
                {label:'设备代码',value:'devNo'},
                {label:'设备编码',value:'devCode'},
            ],//车辆
            options: [],
            depository: this.$store.state.elementColumn.depository,
            company: this.$store.state.elementColumn.company,
            car: this.$store.state.elementColumn.car,
            order: this.$store.state.elementColumn.order,
            elementColumn: this.$store.state.elementColumn,
            user: this.$store.state.user,
            dialogVisible: false,
            sceneid: '',//场景id
            sceneName: '',//场景名称
            now: '',//当前时间
            nowIntervalTask: null,//时间定时器
            searchValue: '',//搜索值
            elements: [],//对象列表
            showmarkerid: '',//需要显示对象ID
            showMarkerIdList: [],//需要现实的对象列表
            showUnit:true,//是否显示单位

            carStatus : 1,
            carStatusCode : 0,
            modeStyle : JSON.parse(localStorage.getItem( 'mapMode' )),
        }
    },
    components: {
        AmapPage
    },
    watch: {
        depositoryFilterText(val) {
            this.$refs.depositoryTree.filter(val);
        },
        carFilterText(val) {
            this.$refs.carTree.filter(val);
        },
        companyFilterText(val) {
            this.$refs.companyTree.filter(val);
        },
        orderFilterText(val) {
            this.$refs.orderTree.filter(val);
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
                this.saveLocalElementColumn()
            },
            deep: true,
        },
        company: {
            handler: function (newValue) {
                if (newValue.first === '') {
                    this.company.second = ''
                    this.company.third = ''
                    this.company.fourth = ''
                } else if (newValue.second === '') {
                    this.company.third = ''
                    this.company.fourth = ''
                } else if (newValue.third === '') {
                    this.company.fourth = ''
                }
                this.saveLocalElementColumn()
            },
            deep: true,
        },
        car: {
            handler: function (newValue) {
                if (newValue.first === '') {
                    this.car.second = ''
                    this.car.third = ''
                    this.car.fourth = ''
                } else if (newValue.second === '') {
                    this.car.third = ''
                    this.car.fourth = ''
                } else if (newValue.third === '') {
                    this.car.fourth = ''
                }
                this.saveLocalElementColumn()
            },
            deep: true,
        },
        order: {
            handler: function (newValue) {
                if (newValue.first === '') {
                    this.order.second = ''
                    this.order.third = ''
                    this.order.fourth = ''
                } else if (newValue.second === '') {
                    this.order.third = ''
                    this.order.fourth = ''
                } else if (newValue.third === '') {
                    this.order.fourth = ''
                }
                this.saveLocalElementColumn()
            },
            deep: true,
        },
    },
    mounted() {
        this.sceneid = this.$route.query.scenesId;


        let filterCarStatus = JSON.parse( localStorage.getItem( 'filterCarStatus' ) )  ;
        if( filterCarStatus ){
            this.carStatus = filterCarStatus[ this.sceneid ] ? filterCarStatus[ this.sceneid ] : 1 ;
        } 
        this.saveCarStatusFn() ;
       

        //如果localStorage保存过，直接使用localStorage中的数据
        let elementColumn = window.localStorage.getItem('elementColumn-' + this.sceneid)
        if (elementColumn) {
            elementColumn = JSON.parse(elementColumn);
            this.depository = elementColumn.depository
            this.car = elementColumn.car
            this.order = elementColumn.order
            this.company = elementColumn.company
            this.elementColumn = elementColumn
        }

        //获取场景信息
        this.getSceneInfo(this.sceneid);

        //时间定时器
        this.nowIntervalTask = setInterval(() => {
            this.now = new Date().getTime();
        })

        //获取设备字段
        // this.getCcsSceneDeviceFields(this.sceneid) // 暂时写死数据, 不需要请求接口

        window.removeEventListener( 'visibilitychange', this.visiblityChangeFn ) ;
        window.addEventListener( 'visibilitychange', this.visiblityChangeFn, false ) ;
    },
    methods: {
        visiblityChangeFn(){
            if( document.visibilityState === 'visible' ){
                // DO SOMETHING...
                this.modeStyle = JSON.parse(localStorage.getItem( 'mapMode' )) ;
            } else {
            }
        },

        changeModeStyleFn(){
            this.modeStyle = !this.modeStyle ;
            localStorage.setItem( 'mapMode', this.modeStyle ) ;
        },
        saveCarStatusFn(){
            let filterCarStatus = JSON.parse( localStorage.getItem( 'filterCarStatus' ) )  ;

            if( filterCarStatus ){ // 表示已经有车辆筛选存储状态
                filterCarStatus = { ...filterCarStatus, [ this.sceneid ] : this.carStatus } ;
                localStorage.setItem( 'filterCarStatus', JSON.stringify( filterCarStatus ) ) ;
            } else {
                localStorage.setItem( 'filterCarStatus', JSON.stringify( { [ this.sceneid ] : this.carStatus } ) ) ;
            }

            this.carStatusCode = this.carStatus ;
            this.dialogVisible = false ;

        },

        pullRemoteShowMarkerIdList() {
            this.pullLoading = true
            let params = {
                activeFlag: 1,
                scenesId: this.sceneid,
                phoneNumber: this.user.mobile,
            }
            https.get('/ccsScenes/listScenesElementIdByScenesId', params).then(res => {
                this.orderCheckKeys = this.$refs.orderTree.getCheckedKeys()
                this.depositoryCheckKeys = this.$refs.depositoryTree.getCheckedKeys()
                let list = this.orderCheckKeys.concat(this.depositoryCheckKeys)
                list = list.concat(res.data)
                this.$refs.carTree.setCheckedKeys(list)
                this.$refs.companyTree.setCheckedKeys(list)

                this.showMarkerIdList = list
                this.setLocalTreeCheckedKeys(list)
            }).catch(error => {
                this.$notify.error({
                    message: '接口请求失败！'
                })
            }).finally(() => {
                this.pullLoading = false
            })
        },
        getLocalTreeCheckedKeys() {
            let checkedKeys = window.localStorage.getItem('treeData-' + this.sceneid)
            if (!checkedKeys) {
                if (this.elements.length > 0) {
                    checkedKeys = this.elements.map(item => {
                        return item.scenesElementId
                    })
                } else {
                    checkedKeys = []
                }
                this.setLocalTreeCheckedKeys(checkedKeys)
            } else {
                checkedKeys = JSON.parse(checkedKeys)
            }
            this.showMarkerIdList = checkedKeys
        },
        setLocalTreeCheckedKeys(checkedKeys) {
            window.localStorage.setItem('treeData-' + this.sceneid, JSON.stringify(checkedKeys))
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        checkedkeys() {
            //保存treeData显示对象配置
            this.carCheckKeys = this.$refs.carTree.getCheckedKeys()
            this.orderCheckKeys = this.$refs.orderTree.getCheckedKeys()
            this.companyCheckKeys = this.$refs.companyTree.getCheckedKeys()
            this.depositoryCheckKeys = this.$refs.depositoryTree.getCheckedKeys()
            let list = this.orderCheckKeys.concat(this.carCheckKeys)
            list = list.concat(this.companyCheckKeys)
            list = list.concat(this.depositoryCheckKeys)
            this.showMarkerIdList = list
            this.setLocalTreeCheckedKeys(list)
        },
        selectElementColumn(done) {
            //关闭dialog
            this.dialogVisible = false
        },
        saveLocalElementColumn() {
            //保存对象显示字段配置
            let elementColumn = {
                depository: this.depository,
                car: this.car,
                order: this.order,
                company: this.company,
            }
            this.elementColumn = JSON.parse(JSON.stringify(elementColumn))
            //保存到locaStorage中
            window.localStorage.setItem('elementColumn-' + this.sceneid, JSON.stringify(elementColumn))

        },
        getSceneInfo(sceneid) {
            // yxh 所有带 /scenes  改为 /ccsScenes
            // https.get('/scenes/' + sceneid, {}).then(res => {
            https.get('/ccsScenes/' + sceneid, {}).then(res => {
                this.sceneName = res.scenesName;
            })
        },
        getCcsSceneDeviceFields(sceneId) {
            https.get('ccsScenesElement/getCcsSceneDeviceFields', {sceneId: sceneId}).then(res => {
                this.options = res.data
                this.options.unshift({
                    label: '名称',
                    value: 'scenesElementName',
                })
                this.options.unshift({
                    label: '请选择',
                    value: '',
                })
            })
        },
        /**********搜索 start********************/
        querySearchAsync(queryString, cb) {
            let elements = this.elements;
            if (queryString == "") {
                cb([]);
                return;
            }
            let results = elements.filter(item => {
                item.value = item.scenesElementName
                return item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0;
            });
            cb(results);
        },

        //监听选择的对象
        handleSelectElement(item) {
            this.showmarkerid = item.scenesElementId.toString();
        },
        //清空搜索
        clearSearch(e) {
            this.$refs.searchInput.$refs.input.blur()
            this.showmarkerid = "";
        },
        /**********搜索 end********************/

        //对象数组改变事件
        elementsChange(elements) {
            this.elements = elements;

            this.getShowElementTypeList(this.elements) //设置tree
            this.getLocalTreeCheckedKeys()
        },
        //获取分类对象集合
        getShowElementTypeList(elementList) {
            let elementColumn = this.elementColumn  
            let list = []
            for (let obj in this.elementColumn) {
                list.push(this.elementColumn[obj])
            }

            let data = []
            for (let i = 0; i < list.length; i++) {
                data.push({
                    id: 'parentId-' + list[i].value,
                    label: list[i].name,
                    children: this.getElementListByType(elementList, list[i].value)
                })
            }

            //库区
            let item = data.find(item => {
                return item.label === '库区'
            })
            this.depositoryTreeData = [item]

            //车辆
            item = data.find(item => {
                return item.label === '车辆'
            })
            this.carTreeData = [item]
            //订单
            item = data.find(item => {
                return item.label === '订单'
            })
            this.orderTreeData = [item]

            //单位
            item = data.find(item => {
                return item.label === '单位'
            })
            this.companyTreeData = [item]
        },
        //根据类型查询对象集合
        getElementListByType(elementList, type) {
            let children = elementList.filter(item => {
                return type === item.elementType
            })
            children = children.map(item => {
                let tmp = {}
                tmp.id = item.scenesElementId
                tmp.label = item.scenesElementName
                tmp.children = []
                return tmp
            })
            return children
        },

    },
    destroyed() {
        window.clearInterval(this.nowIntervalTask);
        window.removeEventListener( 'visibilitychange', this.visiblityChangeFn ) ;
    }

}
</script>

<style scoped>

.carStatusBtnInfo{ padding:200px 0 0; }
.box {
    width: 100%;
    height: 100%;
    background:black; 
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

.box .amap-container {
    width: 100%;
    height: calc(100vh - 52px);
}

.mr {
    margin-right: 20px;
}

.header /deep/ .el-input__inner {
    background: gray;
    border-radius: 100px;
    border-color: gray;
    color: #eaeaea;
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
    margin: 5px;
    height: 510px;
    box-sizing: border-box;
}

.el-card /deep/ .el-card__body {
    padding: 10px;
    height: 510px;
    box-sizing: border-box;
}

.el-tree {
    padding: 10px 0px;
    width: 263px;
    height: 500px;
    overflow: auto;
    box-sizing: border-box;
}

.el-tree::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
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

.custom-tree-node {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>

