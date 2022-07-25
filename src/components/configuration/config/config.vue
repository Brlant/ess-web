<template>
    <el-row>
        <el-col :span="8" style="padding: 10px;background:#fff;height: calc(100vh - 70px);overflow: auto;">
            <div class="custom-tree-container">
                <div style="margin-bottom: 5px;">
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                    </el-input>
                </div>
                <el-tree
                    v-loading="loading"
                    :data="treeData"
                    :show-checkbox="false"
                    node-key="id"
                    ref="tree"
                    :default-expand-all="false"
                    :default-expanded-keys="expandedKeys"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    @node-click="nodeClicked"
                    @node-collapse="nodeCollapse"
                    @node-expand="nodeExpand"
                >

                          <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <!-- <span v-if="data.nodeType == 'point'"> -->
                            <span>
                                <!-- <el-button
                                    v-has="'ccs-point-dev-binding'"
                                    type="success"
                                    size="mini"
                                    @click.stop="() => ruleConfig('s,' + data.ccsPointId)">
                                    绑定规则
                                  </el-button>
                                <el-button
                                    v-has="'ccs-point-rule-binding'"
                                    type="success"
                                    size="mini"
                                    @click.stop="() => addBandingDev(node,data)">
                                    绑定设备
                                  </el-button> -->
                            </span>
                              <!-- <span v-else> -->
                              <span>
                                  <el-button
                                      v-show="data.nodeType !== 'root'"
                                      v-has="'ccs-scene-object-binding'"
                                      type="success"
                                      size="mini"
                                      @click.stop="() => addBandingDev(node,data)">
                                    绑定对象
                                  </el-button>
                                    <el-button
                                        v-show="data.nodeType == 'root'"
                                        v-has="'ccs-scene-configuration-add'"
                                        type="primary"
                                        size="mini"
                                        @click.stop="() => append(node,data)">
                                        <span>添加场景</span>
                                    </el-button>

                              </span>
                          </span>

                          <!--
                              之前逻辑
                          <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span v-if="data.nodeType == 'point'">
                                <el-button
                                    v-has="'ccs-point-dev-binding'"
                                    type="success"
                                    size="mini"
                                    @click.stop="() => ruleConfig('s,' + data.ccsPointId)">
                                    绑定规则
                                  </el-button>
                                <el-button
                                    v-has="'ccs-point-rule-binding'"
                                    v-if="data.nodeType == 'point'"
                                    type="success"
                                    size="mini"
                                    @click.stop="() => addBandingDev(node,data)">
                                    绑定设备
                                  </el-button>
                            </span>
                              <span v-else>
                                  <el-button
                                      v-has="'ccs-object-management-add'"
                                      v-if="data.nodeType == 'scene'"
                                      type="success"
                                      size="mini"
                                      @click.stop="() => addBandingDev(node,data)">
                                    绑定对象
                                  </el-button>
                                    <el-button
                                        v-if="data.scenesType !=='3'"
                                        v-has="'ccs-scene-configuration-add'"
                                        v-show="data.nodeType == 'root'"
                                        type="primary"
                                        size="mini"
                                        @click.stop="() => append(node,data)">
                                        <span>添加场景</span>
                                    </el-button>
                            -->
                                  <!--                                  <el-button-->
                                  <!--                                      v-if="data.scenesType !=='3'"-->
                                  <!--                                      v-has="'ccs-object-management-add'"-->
                                  <!--                                      v-show="data.nodeType == 'scene'"-->
                                  <!--                                      type="primary"-->
                                  <!--                                      size="mini"-->
                                  <!--                                      @click.stop="() => append(node,data)">-->
                                  <!--                                      <span>添加对象</span>-->
                                  <!--                                  </el-button>-->

                                  <!--                                  <el-button-->
                                  <!--                                      v-if="data.scenesType !=='3'"-->
                                  <!--                                      v-has="'ccs-point-configuration-add'"-->
                                  <!--                                      v-show="data.nodeType == 'element'"-->
                                  <!--                                      type="primary"-->
                                  <!--                                      size="mini"-->
                                  <!--                                      @click.stop="() => append(node,data)">-->
                                  <!--                                      <span>添加点位</span>-->
                                  <!--                                  </el-button>-->
                              <!-- </span>
                          </span> -->

                </el-tree>
            </div>
        </el-col>
        <el-col :span="16" style="height: calc(100vh - 70px);overflow: auto;">
            <el-row v-if="currentTreeNode!=null" style="background: #fff;border-bottom: 1px solid #ccc;">
                <el-col :span="18">
                    <div style="padding: 20px;">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <template v-if="currentTreeNode.data.nodeType=='scene'">
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.data.label }}
                                </el-breadcrumb-item>
                            </template>
                            <template v-else-if="currentTreeNode.data.nodeType=='element'">
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.parent.data.label }}
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.data.label }}
                                </el-breadcrumb-item>
                            </template>
                            <template v-else-if="currentTreeNode.data.nodeType=='point'">
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.parent.parent.data.label }}
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.parent.data.label }}
                                </el-breadcrumb-item>
                                <el-breadcrumb-item>
                                    {{ currentTreeNode.data.label }}
                                </el-breadcrumb-item>
                            </template>

                        </el-breadcrumb>
                    </div>
                </el-col>
                <el-col :span="6" style="line-height:54px;text-align: right;padding-right:20px;">

                    <el-popconfirm
                        @onConfirm="deleteNode"
                        title="您确定删除吗？"
                        v-show="currentTreeNode.data.nodeType=='scene'"
                        v-has="'ccs-scene-configuration-del'"
                    >
                        <el-button icon="el-icon-delete" type="danger" plain slot="reference">删除场景</el-button>
                    </el-popconfirm>


                    <!-- <el-popconfirm
                        @confirm="deleteNode"
                        title="您确定删除吗？"
                        v-show="currentTreeNode.data.nodeType=='element'"
                        v-has="'ccs-object-management-del'"
                    >
                        <el-button icon="el-icon-delete" type="danger" plain slot="reference">删除对象</el-button>
                    </el-popconfirm> -->

                    <!-- <el-popconfirm
                        @confirm="deleteNode"
                        title="您确定删除吗？"
                        v-show="currentTreeNode.data.nodeType=='point'"
                        v-has="'ccs-point-configuration-del'"
                    >
                        <el-button icon="el-icon-delete" type="danger" plain slot="reference">删除点位</el-button>
                    </el-popconfirm> -->

                </el-col>
            </el-row>

            <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="wform">

                <!--场景-->
                <div v-if="currentNodeType=='scene'" class="formContainer">
                    <div class="edit-scene">
                        <div class="action-label">
                            编辑场景
                        </div>
                        <div>{{ currentTreeNode.data.id }}</div>
                    </div>
                    <!-- <el-form-item label="类型" prop="scenesType">
                        <el-select v-model="form.scenesType" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in sceneTypes"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item label="名称" prop="scenesName">
                        <oms-input
                            placeholder="请输入名称"
                            type="text"
                            v-model="form.scenesName"
                            :maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>
                    <two-column>
                        <template slot="left">
                            <el-form-item label="状态">
                                <el-switch
                                    active-text="启用"
                                    active-value="1"
                                    inactive-text="停用"
                                    inactive-value="0"
                                    v-model="form.activeFlag"
                                ></el-switch>
                            </el-form-item>
                        </template>
                    </two-column>
                    <el-form-item>
                        <el-button type="default" plain @click="clearEditContainer">取消</el-button>
                        <el-button type="primary" plain @click="onSubmit('wform')"
                                   v-has="'ccs-scene-configuration-edit'">保存
                        </el-button>
                    </el-form-item>
                </div>
                <!--场景End-->


                <!--对象-->
                <!-- <div v-if="currentNodeType=='element'" class="formContainer">
                    <h2>编辑对象</h2>
                    <el-form-item label="场景ID" prop="scenesId">
                        {{ form.scenesId }}
                        <el-tag type="success" v-show="form.dynamicStatic == 1">动态</el-tag>
                        <el-tag type="info" v-show="form.dynamicStatic == 2">静态</el-tag>
                    </el-form-item>
                    <el-form-item label="名称" prop="scenesElementName">
                        <oms-input
                            placeholder="请输入名称"
                            type="text"
                            v-model="form.scenesElementName"
                            :maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>

                    <el-form-item label="对象类型" prop="elementType">
                        <el-select v-model="form.elementType" placeholder="请选择" @change="changeElementType">
                            <el-option
                                v-for="(item,index) in elementTypes"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="form.elementType==2 || form.elementType==3"
                                  :label="elementInfoText[form.elementType].label" prop="elementInfo">
                        <oms-input
                            :placeholder="elementInfoText[form.elementType].placeholder"
                            type="text"
                            v-model="form.elementInfo"
                            :maxlength="50"
                            show-word-limit
                        />
                    </el-form-item>

                    <el-form-item label="上传分布图" v-if="form.dynamicStatic==2">
                        <el-upload
                            class="avatar-uploader"
                            :action="fileUploadUrl"
                            :headers="headers"
                            list-type="picture-card"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-success="handleSuccess">
                            <img v-if="form.backgroundUrl" :src="form.backgroundUrl" class="avatar">
                            <i v-else class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="选择图标" v-else>
                        图标依次是:正常，告警，离线，停止
                        <el-select style="width: 240px;" v-model="backgroundImage" placeholder="请选择预定义图标"
                                   @change="changebackgroundImage">
                            <el-option
                                v-for="(item,index) in backgroundImages"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <div class="file-upload">
                            <div class="type-label">正常</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleSuccess">
                                <img v-if="form.backgroundUrl" :src="form.backgroundUrl" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">告警</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleExSuccess">
                                <img v-if="form.backgroundUrlEx" :src="form.backgroundUrlEx" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">离线</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleOfflineSuccess">
                                <img v-if="form.backgroundUrlOffline" :src="form.backgroundUrlOffline" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">停止</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleStopSuccess">
                                <img v-if="form.backgroundUrlStop" :src="form.backgroundUrlStop" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </el-form-item>

                    <two-column>
                        <template slot="left">
                            <el-form-item label="状态">
                                <el-switch
                                    active-text="启用"
                                    active-value="1"
                                    inactive-text="停用"
                                    inactive-value="0"
                                    v-model="form.activeFlag"
                                ></el-switch>
                            </el-form-item>
                        </template>
                    </two-column>

                    <el-form-item v-show="form.dynamicStatic==1" label="坐标位置" prop="sceneName"
                                  style="position: relative;">
                        <div id="mapContainer"></div>
                        <div class="lnglatContainer">
                            <el-row>
                                <el-form-item label="坐标经度">
                                    <el-input v-model="form.longitude" placeholder="请输入内容"></el-input>
                                </el-form-item>
                                <el-form-item label="坐标纬度">
                                    <el-input v-model="form.latitude" placeholder="请输入内容"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <input id="tipinput" placeholder="输入地址查询定位" autocomplete="off"></input>
                            </el-row>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="default" plain @click="clearEditContainer">取消</el-button>
                        <el-button type="primary" plain @click="onSubmit('wform')" v-has="'ccs-object-management-edit'">
                            保存
                        </el-button>
                    </el-form-item>
                </div> -->
                <!--对象END-->

                <!--点位-->
                <!-- <div v-if="currentNodeType=='point'" class="formContainer">
                    <h2>编辑点位</h2>
                    <el-form-item label="点位名称" prop="ccsPointName">
                        <oms-input placeholder="请输入点位名称" type="text" v-model="form.ccsPointName" :maxlength="100"
                                   show-word-limit></oms-input>
                    </el-form-item>
                    <two-column>
                        <template slot="left">
                            <el-form-item label="监控状态">
                                <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0"
                                           v-model="form.activeFlag"></el-switch>
                            </el-form-item>
                        </template>
                    </two-column>
                    <el-form-item label="选择图标" prop="backgroundUrl">
                        图标依次是:正常，告警，离线，停止
                        <el-select v-model="backgroundImage" placeholder="请选择预定义图标" @change="changebackgroundImage">
                            <el-option
                                v-for="(item,index) in backgroundImages"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <div class="file-upload">
                            <div class="type-label">正常</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleSuccess">
                                <img v-if="form.backgroundUrl" :src="form.backgroundUrl" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">告警</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleExSuccess">
                                <img v-if="form.backgroundUrlEx" :src="form.backgroundUrlEx" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">离线</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleOfflineSuccess">
                                <img v-if="form.backgroundUrlOffline" :src="form.backgroundUrlOffline" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="file-upload">
                            <div class="type-label">停止</div>
                            <el-upload
                                class="avatar-uploader"
                                :action="fileUploadUrl"
                                :headers="headers"
                                list-type="picture-card"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleStopSuccess">
                                <img v-if="form.backgroundUrlStop" :src="form.backgroundUrlStop" class="avatar">
                                <i v-else class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="点位坐标" prop="longitude">
                        PositionX:
                        <el-input v-model="form.longitude" style="width:4rem"/>
                        PositionY:
                        <el-input v-model="form.latitude" style="width:4rem"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="default" plain @click="clearEditContainer">取消</el-button>
                        <el-button type="primary" plain @click="onSubmit('wform')"
                                   v-has="'ccs-point-configuration-edit'">保存
                        </el-button>
                    </el-form-item>
                </div> -->
            </el-form>
        </el-col>


        <!--        <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">-->
        <!--            <point :element="currentElement" :scene="currentScene" :item="form" :action="action" :index="showIndex" @refresh="refresh"-->
        <!--                   v-if="showIndex=== 0"/>-->
        <!--            &lt;!&ndash; <temp-export :activeId="activeId" :index="showIndex" v-show="showIndex=== 2"/> &ndash;&gt;-->
        <!--            <banding-dev :formItem="form" :action="action" :index="showIndex" @refresh="refresh"-->
        <!--                         v-if="showIndex=== 3" :element="currentElement" :scene="currentScene"/>-->
        <!--        </page-right>-->

        <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1"
                    @right-close="()=>{this.showIndex = -1}">
            <!--            <banding-dev :formItem="form" :index="showIndex" @refresh="()=>{this.showIndex = -1}"-->
            <!--                         v-if="showIndex === 3" :element="form.currentElement" :scene="form.currentScene"/>-->
            <element-bind :formItem="form" :index="showIndex" @refresh="()=>{this.showIndex = -1}"
                          v-if="showIndex === 3" :element="form.currentElement"
                          :scene="form.currentScene"></element-bind>
        </page-right>

    </el-row>
</template>

<script>
import https from "../../../https";
import utils from "../../../tools/utils";
import Vue from "vue";
import BandingDev from "../point/warehouse/form/banding-dev";
import ElementBind from "@/components/configuration/config/element-bind";

let id = 10000;

export default {
    name: "config.vue",
    components: {ElementBind, BandingDev},
    data() {
        return {
            loading: false,
            labelWidth: "90px",
            fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/common/uploadFileOBS',
            headers: {
                token: window.localStorage.getItem('token')
            },
            filterText: '',
            treeData: [],
            expandedKeys: [],
            currentNodeType: '',
            form: {},
            sceneTypes: [{
                value: '1',
                label: '动态'
            }, {
                value: '2',
                label: '静态'
            }, {
                value: '3',
                label: '自定义'
            }],
            backgroundImage: '0',//默认选中自定义
            backgroundImages: [
                {
                    label: '自定义',
                    value: '0',
                    backgroundUrl: '',
                    backgroundUrlEx: '',
                    backgroundUrlOffline: '',
                    backgroundUrlStop: '',
                },
                {
                    label: '六角形',
                    value: '1',
                    backgroundUrl: require('../../../assets/img/hexagonal-nomarl.png'),//正常
                    backgroundUrlEx: require('../../../assets/img/hexagonal-warning.png'),//告警
                    backgroundUrlOffline: require('../../../assets/img/hexagonal-offline.png'),//离线
                    backgroundUrlStop: require('../../../assets/img/hexagonal-stop.png'),//停止
                },
                {
                    label: '标注',
                    value: '2',
                    backgroundUrl: require('../../../assets/img/mark-nomarl.png'),
                    backgroundUrlEx: require('../../../assets/img/mark-warningr.png'),
                    backgroundUrlOffline: require('../../../assets/img/mark-offline.png'),
                    backgroundUrlStop: require('../../../assets/img/mark-stop.png'),
                },
                {
                    label: '三角形',
                    value: '3',
                    backgroundUrl: require('../../../assets/img/3-1.png'),
                    backgroundUrlEx: require('../../../assets/img/3-2.png'),
                    backgroundUrlOffline: require('../../../assets/img/3-3.png'),
                    backgroundUrlStop: require('../../../assets/img/3-4.png'),
                },
                {
                    label: '圆形',
                    value: '4',
                    backgroundUrl: require('../../../assets/img/round-nomarl.gif'),
                    backgroundUrlEx: require('../../../assets/img/round-warning.gif'),
                    backgroundUrlOffline: require('../../../assets/img/round-offline.gif'),
                    backgroundUrlStop: require('../../../assets/img/round-stop.gif'),
                },
                {
                    label: '正方形',
                    value: '5',
                    backgroundUrl: require('../../../assets/img/asquare-nomarl.gif'),
                    backgroundUrlEx: require('../../../assets/img/asquare-warning.gif'),
                    backgroundUrlOffline: require('../../../assets/img/asquare-offline.gif'),
                    backgroundUrlStop: require('../../../assets/img/asquare-stop.gif'),
                }
            ],
            elementTypes: [
                {
                    value: 1,
                    label: '库区'
                },
                {
                    value: 2,
                    label: '单位'
                },
                {
                    value: 3,
                    label: '车辆',
                },
                {
                    value: 4,
                    label: '订单',
                }
            ],
            elementInfoText: {
                1: {label: '', placeholder: ''},
                2: {label: '单位地址', placeholder: '请输入单位地址'},
                3: {label: '车牌号', placeholder: '请输入车牌号'},
                4: {label: '', placeholder: ''},
            },
            rules: {},
            sceneRules: {
                scenesName: [
                    {required: true, message: "请输入场景名称", trigger: "blur"},
                ],

                // yxh 屏蔽场景类型选择
                // scenesType: [
                //     {required: true, message: "请选择场景类型", trigger: "change"},
                // ],
            },
            elementRules: {
                scenesElementName: [
                    {required: true, message: "请输入场景对象名称", trigger: "blur"},
                ],
                elementType: [
                    {required: true, message: '请选择对象类型', trigger: 'change'}
                ],
                elementInfo: [
                    {required: true, message: "请输入对象信息", trigger: "blur"},
                ],
            },
            pointRules: {
                ccsPointName: [
                    {required: true, message: '请输入点位名称', trigger: 'blur'},
                ]
            },
            showIndex: -1,
            currentTreeNode: null,
        }
    },
    mounted() {
        this.refresh();
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        beforeAvatarUpload: function (file) {
            if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                this.$notify.error('请上传格式为png/gif/jpg/jpeg格式的图片');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 6;
            if (!isLt2M) {
                this.$notify.error('上传头像图片大小不能超过 6MB!');
            }
            return isLt2M;
        },
        changeElementType: function (selectedElementTypeId) {
            let elementType = this.elementTypes.find(item => {
                return item.value == selectedElementTypeId;
            });
        },
        changebackgroundImage: function (selectedIndex) {
            let image = this.backgroundImages.find(item => {
                return item.value == selectedIndex;
            });
            if (image) {
                this.form.backgroundUrl = image.backgroundUrl;
                this.form.backgroundUrlEx = image.backgroundUrlEx;
                this.form.backgroundUrlOffline = image.backgroundUrlOffline;
                this.form.backgroundUrlStop = image.backgroundUrlStop;
            }
        },
        refresh: function () {
            this.loading = true;
            // this.buildTree().then(res => {
            //     this.treeData = res;
            //     this.loading = false;
            // });
            this.loadTree().then(res => {
                this.treeData = res;
                this.loading = false;
                this.initTreeExpand();
            });
        },
        //获取场景列表(因为增加了loadTree，这个就不再使用了，可以删除)
        listScenes: function () {
            let params = {
                pageNo: 1,
                pageSize: 1000,
                activeFlag: '',
                scenesType: '',
                scenesName: ''
            };

            // yxh 所有带 /scenes  改为 /ccsScenes
            // return https.get("/scenes", params);
            return https.get("/ccsScenes", params);
        },
        //获取Element列表(因为增加了loadTree，这个就不再使用了，可以删除)
        listElements: function (scenesId) {
            let params = {
                page: 1,
                size: 10000,
                scenesId: scenesId,
                activeFlag: 1,
                scenesElementName: '',
            };
            return https.get("/ccsScenesElement", params);
        },
        //获取点位(因为增加了loadTree，这个就不再使用了，可以删除)
        listPoints: function (scenesElementId) {
            let params = {
                page: 1,
                size: 10000,
                scenesElementId: scenesElementId,
                activeFlag: 1,
                ccsPointName: '',
            };
            return https.get("/ccsPoint", params);
        },
        //(因为增加了loadTree，这个就不再使用了，可以删除)
        buildTree: async function () {
            let scenesResponse = await this.listScenes().then();
            let scenes = scenesResponse.currentList;
            for (let i = 0; i < scenes.length; i++) {
                //新增-节点类型 nodeType
                //新增-节点标签 label
                //新增-节点类型 children
                scenes[i].label = this._prefixSceneLabel(scenes[i]) + scenes[i].scenesName; //为了展现tree增加的属性
                scenes[i].nodeType = 'scene'; //为了展现tree增加的属性
                //查询elements
                let elementsResponse = await this.listElements(scenes[i].id);
                let elements = scenes[i].children = elementsResponse.data.list;
                //查询对象下面的点位
                for (let j = 0; j < elements.length; j++) {
                    elements[j].id = elements[j].scenesElementId;//为了展现tree增加的属性
                    elements[j].label = this._prefixElementLabel(elements[j]) + elements[j].scenesElementName;//为了展现tree增加的属性
                    elements[j].nodeType = "element";//为了展现tree增加的属性
                    elements[j].dynamicStatic = parseInt(scenes[i].scenesType); //增加一个Element的场景属性
                    //查询points
                    let pointsResponse = await this.listPoints(elements[j].scenesElementId);
                    let points = elements[j].children = pointsResponse.data.list;
                    for (let k = 0; k < points.length; k++) {
                        points[k].id = elements[j].id + '-' + points[k].ccsPointId;//为了展现tree增加的属性
                        points[k].label = this._prefixPointLabel(points[k]) + points[k].ccsPointName;//为了展现tree增加的属性
                        points[k].nodeType = "point";//为了展现tree增加的属性
                    }
                }
            }
            return [{
                id: 0,
                label: '场景配置',
                nodeType: 'root',
                children: scenes
            }];
        },
        //一次性从服务器端加载Tree
        loadTree: async function () {
            let params = {
                pageNo: 1,
                pageSize: 1000,
                activeFlag: '',
                scenesType: '',
                scenesName: ''
            };

            // yxh 所有带 /scenes  改为 /ccsScenes
            // let scenes = await https.get("/scenes/tree", params);
            let scenes = await https.get("/ccsScenes/tree", params);

            for (let i = 0; i < scenes.length; i++) {
                scenes[i].label = this._prefixSceneLabel(scenes[i]) + scenes[i].scenesName;
                scenes[i].nodeType = 'scene'; //为了展现tree增加的属性
                // let elements = scenes[i].children
                delete scenes[i].children
                // for (let j = 0; j < elements.length; j++) {
                //     elements[j].id = elements[j].scenesElementId;//为了展现tree增加的属性
                //     elements[j].label = this._prefixElementLabel(elements[j]) + elements[j].scenesElementName;//为了展现tree增加的属性
                //     elements[j].nodeType = "element";//为了展现tree增加的属性
                //     elements[j].dynamicStatic = parseInt(scenes[i].scenesType); //增加一个Element的场景属性
                //     let points = elements[j].children;
                //     for (let k = 0; k < points.length; k++) {
                //         points[k].id = elements[j].id + '-' + points[k].ccsPointId;//为了展现tree增加的属性
                //         points[k].label = this._prefixPointLabel(points[k]) + points[k].ccsPointName;//为了展现tree增加的属性
                //         points[k].nodeType = "point";//为了展现tree增加的属性
                //     }
                // }
            }
            return [{
                id: 0,
                label: '场景配置',
                nodeType: 'root',
                children: scenes
            }];
        },
        //添加节点
        append(treeNode, dataNode) {
            // console.log("append->treeNode", treeNode);
            // console.log("append->dataNode", dataNode);
            let newNode = {
                id: id++,
                label: 'New-Node-' + id,
                children: []
            };
            if (dataNode.nodeType == "root") {
                let params = {
                    scenesName: '新场景',
                    // scenesType: '1',
                    activeFlag: '1',//0-禁用1-启用
                };
                newNode.nodeType = 'scene';
                newNode.label = params.scenesName;
                Object.assign(newNode, params);

                // yxh 所有带 /scenes  改为 /ccsScenes
                // https.post('/scenes', params).then(res => {
                https.post('/ccsScenes', params ).then(res => {
                    // console.error( 222, res ) ;
                    this.$notify.success({message: '场景添加成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            } else if (dataNode.nodeType == "scene") {
                let params = {
                    scenesId: dataNode.id,
                    scenesElementId: '',
                    scenesElementName: '新对象',
                    latitude: '0',
                    longitude: '0',
                    activeFlag: '1',
                    backgroundUrl: '',
                    backgroundUrlEx: '',
                    backgroundUrlOffline: '',
                    backgroundUrlStop: '',
                    //dynamicStatic: dataNode.dynamicStatic,
                    //elementType: '0',//增加字段-对象类型
                };
                newNode.nodeType = 'element';
                newNode.label = params.scenesElementName;
                Object.assign(newNode, params);
                https.post("/ccsScenesElement", params).then(res => {
                    this.$notify.success({message: '对象添加成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            } else if (dataNode.nodeType == "element") {
                let params = {
                    scenesId: dataNode.scenesId,
                    scenesElementId: dataNode.scenesElementId,
                    ccsPointName: '新点位',
                    activeFlag: '1',
                    backgroundUrl: '',
                    backgroundUrlEx: '',
                    backgroundUrlOffline: '',
                    backgroundUrlStop: '',
                    longitude: '0',//坐标X
                    latitude: '0'//坐标Y
                };
                newNode.nodeType = 'point';
                newNode.label = params.ccsPointName;
                Object.assign(newNode, params);
                https.post("/ccsPoint", params).then(res => {
                    this.$notify.success({message: '点位添加成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            }
            //添加到树结构
            if (!dataNode.children) {
                this.$set(dataNode, 'children', []);
            }
            dataNode.children.splice(0, 0, newNode);
        },
        //删除节点（删除数据之后更新tree就可以了，不需要从tree里再删除了）
        deleteNode() {
            // console.log("deleteNode", this.currentTreeNode);
            // console.log("deleteNode", this.currentTreeNode.data);
            let node = this.currentTreeNode.data;

            if (node.nodeType == "point") {
                https.destroy("/ccsPoint/" + node.ccsPointId).then(res => {
                    this.$notify.success({message: '点位删除成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            } else if (node.nodeType == "element") {
                https.destroy("/ccsScenesElement/" + node.scenesElementId).then(res => {
                    this.$notify.success({message: '对象删除成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            } else if (node.nodeType == "scene") {

                // yxh 所有带 /scenes  改为 /ccsScenes
                // https.destroy("/scenes/" + node.id).then(res => {
                https.destroy("/ccsScenes/" + node.id).then(res => {
                    this.$notify.success({message: '场景删除成功'});
                    this.clearEditContainer();
                    this.refresh();
                });
            }
            // Request URL: http://localhost:8006/api/ccsPoint/97
            // Request Method: DELETE
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //节点展开
        nodeExpand(dataNode, treeNode) {
            let ids = window.localStorage.getItem("tree-expand-ids");
            if (!ids) {
                ids = [];
            } else {
                ids = JSON.parse(ids);
            }
            ids.push(treeNode.key);
            window.localStorage.setItem("tree-expand-ids", JSON.stringify(ids));
        },
        //节点合并
        nodeCollapse(dataNode, treeNode) {
            let ids = window.localStorage.getItem("tree-expand-ids");
            if (!ids) {
                ids = [];
            } else {
                ids = JSON.parse(ids);
            }
            let index = ids.findIndex((key) => {
                return treeNode.key == key;
            });
            ids.splice(index, 1);
            window.localStorage.setItem("tree-expand-ids", JSON.stringify(ids));
        },
        //初始化展开节点
        initTreeExpand() {
            let ids = window.localStorage.getItem("tree-expand-ids");
            if (!ids) {
                ids = [0];
            } else {
                ids = JSON.parse(ids);
            }
            this.expandedKeys = ids;
        },
        nodeClicked(dataNode, treeNode) {
            // console.log("dataNode", dataNode);
            // console.log("treeNode", treeNode);

            //修改点击对象和点位不可编辑
            if (dataNode.nodeType == 'scene') {
                this.currentTreeNode = treeNode;
                this.currentNodeType = dataNode.nodeType;
                this.rules = this.sceneRules;
                this.form = {
                    id: dataNode.id,
                    scenesName: dataNode.scenesName,
                    scenesType: dataNode.scenesType,
                    activeFlag: dataNode.activeFlag,
                }
            }

            /***
             this.currentTreeNode = treeNode;
             this.currentNodeType = dataNode.nodeType;
             if (this.currentNodeType == "scene") {
                            this.rules = this.sceneRules;
                            this.form = {
                                id: dataNode.id,
                                scenesName: dataNode.scenesName,
                                scenesType: dataNode.scenesType,
                                activeFlag: dataNode.activeFlag,
                            }
                        } else if (this.currentNodeType == "element") {
                            this.rules = this.elementRules;
                            this.form = {
                                scenesId: dataNode.scenesId,
                                scenesElementId: dataNode.scenesElementId,
                                scenesElementName: dataNode.scenesElementName,
                                latitude: dataNode.latitude,
                                longitude: dataNode.longitude,
                                activeFlag: dataNode.activeFlag,
                                backgroundUrl: dataNode.backgroundUrl,
                                backgroundUrlEx: dataNode.backgroundUrlEx,
                                backgroundUrlOffline: dataNode.backgroundUrlOffline,
                                backgroundUrlStop: dataNode.backgroundUrlStop,
                                dynamicStatic: dataNode.dynamicStatic,
                                elementInfo: dataNode.elementInfo,
                                elementType: dataNode.elementType == 0 ? '' : dataNode.elementType,
                            };
                            utils.amap().then(AMap => {
                                this.AMap = AMap;
                                this.map = new this.AMap.Map('mapContainer', {
                                    center: [this.form.longitude, this.form.latitude],
                                    resizeEnable: true,
                                    zoom: 16,
                                });
                                let marker = new AMap.Marker({
                                    position: new AMap.LngLat(this.form.longitude, this.form.latitude),
                                    zIndex: 100,
                                });
                                this.map.add(marker);

                                //输入提示
                                AMap.plugin(['AMap.AutoComplete'], () => {
                                    let auto = new AMap.AutoComplete({input: "tipinput"});
                                    auto.on("select", (e) => {
                                        if (e.poi.location) {
                                            marker.setPosition(e.poi.location);
                                            this.map.setFitView();
                                            this.form.longitude = e.poi.location.lng;
                                            this.form.latitude = e.poi.location.lat;
                                        } else {
                                            this.$notify.error({message: '没有找到改地址的定位，请重新输入'});
                                        }
                                    });
                                });
                            })
                        } else if (this.currentNodeType == 'point') {
                            this.rules = this.pointRules;
                            this.form = {
                                ccsPointId: dataNode.ccsPointId,
                                scenesElementId: dataNode.scenesElementId,
                                ccsPointName: dataNode.ccsPointName,
                                activeFlag: dataNode.activeFlag,
                                backgroundUrl: dataNode.backgroundUrl,
                                backgroundUrlEx: dataNode.backgroundUrlEx,
                                backgroundUrlOffline: dataNode.backgroundUrlOffline,
                                backgroundUrlStop: dataNode.backgroundUrlStop,
                                longitude: dataNode.longitude,//坐标X
                                latitude: dataNode.latitude//坐标Y
                            }
                        } else {
                            this.clearEditContainer();
                        }

             ***/
        },
        //重置页面变量
        clearEditContainer() {
            this.currentTreeNode = null;
            this.currentNodeType = "";
            this.backgroundImage = "0";
            this.form = {};
            this.rules = {};
            delete this.AMap;
        },
        //更新Scene/Element/Point
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                // console.log("this.currentNodeType", this.currentNodeType);
                // console.log("this.form", this.form);
                if (this.currentNodeType == "scene") {

                    // yxh 所有带 /scenes  改为 /ccsScenes
                    // https.put("/scenes/" + this.form.id, this.form).then(res => {
                    https.put("/ccsScenes/" + this.form.id, this.form).then(res => {
                        this.$notify.success({message: '场景保存成功'});
                        this.clearEditContainer();
                        this.refresh();
                    });
                } else if (this.currentNodeType == "element") {
                    https.put("/ccsScenesElement", this.form).then(res => {
                        this.$notify.success({message: '对象保存成功'});
                        this.clearEditContainer();
                        this.refresh();
                    });
                } else if (this.currentNodeType == "point") {
                    https.put("/ccsPoint", this.form).then(res => {
                        this.$notify.success({message: '点位保存成功'});
                        this.clearEditContainer();
                        this.refresh();
                    });
                }
            });
        },
        //处理上传
        handleSuccess(res) {
            if (res.code === 200) {
                this.form.backgroundUrl = res.data;
            }
        },
        //处理上传
        handleExSuccess(res) {
            if (res.code === 200) {
                this.form.backgroundUrlEx = res.data;
            }
        },
        //处理上传
        handleOfflineSuccess(res) {
            if (res.code === 200) {
                this.form.backgroundUrlOffline = res.data;
            }
        },
        //处理上传
        handleStopSuccess(res) {
            if (res.code === 200) {
                this.form.backgroundUrlStop = res.data;
            }

        },
        //绑定设备-关闭弹窗
        resetRightBox: function () {
            this.showIndex = -1;
        },
        //绑定设备
        addBandingDev: function (treeNode, item) {
            this.clearEditContainer();
            // console.log("addBandingDev->treeNode", treeNode);
            // console.log("addBandingDev->item", item);
            // console.log(treeNode.parent.data);
            // console.log(treeNode.parent.parent.data);
            // if (this.currentElement.activeFlag==='0') {
            //     this.$notify.info({
            //         message: '场景对象【' + this.currentElement.scenesElementName + '】已停用，无法绑定设备。'
            //     });
            //     return;
            // }
            // item.warehouseId = item.scenesId;
            // console.log(item);
            this.form = Object.assign({}, item);
            this.form.currentElement = treeNode.parent.data;
            this.form.currentScene = treeNode.parent.parent.data;
            delete this.form.currentScene.children;
            delete this.form.currentElement.children;
            // console.log("this.form", JSON.stringify(this.form));
            this.showIndex = 3;
            this.action = 'edit';
        },
        addBindElement(treeNode, item) {
            console.log("addBindElement", item)
        },
        //绑定规则
        ruleConfig: function (id) {
            this.clearEditContainer();
            this.$store.commit('initUnitId', id);
        },
        // changeAddress(poi) {
        //     if (poi.lat, poi.lng) {
        //         this.form.longitude = poi.lng;
        //         this.form.latitude = poi.lat;
        //     }
        // },
        _prefixSceneLabel: function (scene) {
            /*
                // yxh 之前逻辑
                // let prefix = "";
                // if (scene.scenesType == "1") {
                    //     prefix = "[动态]"
                // } else if (scene.scenesType == "2") {
                    //     prefix = "[静态]"
                // } else {
                    //     prefix = "[自定义]"
                // }
            */
            let prefix = "[动态]";
            return prefix;
        },
        _prefixElementLabel: function (element) {
            let prefix = "[对象]";
            // if (element.activeFlag == "1") {
            //     prefix += "[启用]"
            // } else {
            //     prefix += "[禁用]"
            // }
            return prefix;
        },
        _prefixPointLabel: function (point) {
            let prefix = "[点位]";
            // if (point.activeFlag == "1") {
            //     prefix += "[启用]"
            // } else {
            //     prefix += "[禁用]"
            // }
            return prefix;
        },
    }
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.custom-tree-node span:first-child {
    /*width: 350px;   设置文本长度，像素或者百分比*/
    overflow:hidden; /*溢出的部分隐藏*/
    white-space: nowrap; /*文本不换行*/
    text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}

.formContainer {
    background: #fff;
    padding: 20px;
}

#mapContainer {
    width: 100%;
    height: 300px;
}

.lnglatContainer {
    width: 260px;
    position: absolute;
    padding: 10px;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background: #fff;
}

#tipinput {
    padding: 0px 15px;
    height: 36px;
    line-height: 14px;
    line-height: 1em;
    width: 100%;
    border: 1px solid rgb(220, 223, 230);
    border-radius: 4px;
}

/* 定义滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: rgba(240, 240, 240, 1);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
    border-radius: 10px;
    background-color: rgba(240, 240, 240, .5);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
    background-color: rgba(240, 240, 240, 1);
}

.el-button--mini {
    padding: 2px;
}

.top-breadcrumb {
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px;
}

/**************add by huangsz 上面是自定义的-下面是copy旧代码的******************/
.file-upload {
    float: left;
    width: 50px;
    margin-left: 10px;
}

div.type-label {
    width: 100%;
    text-align: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
<style>
div.file-upload > div.avatar-uploader > div {
    width: 50px;
    height: 50px;
    line-height: 50px;
}
</style>


<style lang="scss" scoped>
.edit-scene {

    display: flex;
    align-items: center;

    .action-label {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 21px;
        margin-right: 10px;
    }
}
</style>
