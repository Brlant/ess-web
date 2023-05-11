<style lang="scss" scoped>
.flexDis{ display:flex;
    align-items:center;
    .el-input{ width:108px; margin:0 10px; }
    .el-tooltip{ margin:0 10px 0 0; }
}
.part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
}

.el-select {
    display: block;
}

.form-item-row {
    margin-bottom: 10px;
    line-height: 16px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.wrap {
    display: flex;
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
        position: relative;

        .delete {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 20px;
            color: #333;
        }
        .upload {
            width: 50px;
            height: 50px;
        }

        .el-upload--picture-card {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow:hidden;
            .icon {
                font-size: 24px;
            }
            .normal {
                color: #0f0;
            }
            .warn {
                color: #f00;
            }
            .hypothermia{
                color: #26d6dd;
            }
            .wireless {
                color: #26d6dd;
            }
            img {
                width: 50px;
                height: 50px;
            }
        }
    }
}
</style>
<template>
    <dialog-template :btnSavePosition="100" :pageSets="pageSets"  @selectTab="selectTab">
        <template slot="title">编辑分布图</template>
        <template slot="btn">
            <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
                <div class="form-header-part">
                    <div class="header">
                        <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                            {{pageSets[0].name}}</h3>
                    </div>

                    <el-form-item label="名称" prop="imageName">
                        <oms-input v-model="form.imageName"></oms-input>
                    </el-form-item>
                    <el-form-item label="上传分布图">
                        <oms-upload :fileList="attachmentList" :limit="1" @change="changeFiles"
                                    @refreshCodes="setDoing(false)"
                                    @uploadProgress="setDoing(true)"
                                    ref="uploadFile"></oms-upload>
                        <!-- <el-upload
                            :fileList="attachmentList"
                            class="upload-demo"
                            :action="fileUploadUrl"
                            :headers="headers"
                            :limit="1"
                            :before-upload="beforeUpload"
                            :on-success="handleSuccess"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload> -->
                    </el-form-item>
                    <el-form-item label="物流中心">
                        <el-select :remote-method="queryLogisticsCenterList" @change="logsicChange" @focus="queryLogisticsCenterList"
                                clearable filterable placeholder="请选择物流中心" remote v-model="form.logsicId">
                            <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                    v-for="item in logisticsCenterList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仓库" prop="warehouseIds">
                        <el-select clearable filterable remote  reserve-keyword
                                 @focus="queryWarehouse"
                                multiple placeholder="请选择仓库" v-model="form.warehouseIds">
                            <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                    v-for="item in warehouseList"></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="form-header-part">
                    <div class="header">
                        <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                            {{pageSets[1].name}}</h3>
                    </div>

                    <!-- 修改图标相关 -->
                    <el-form-item label="设备类型">
                        <el-select
                            v-model="form.devType"
                            placeholder="请选择设备类型"
                            @change="typeChange"
                        >
                            <el-option
                                v-for="(item, index) in devTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="图标修改"
                        v-for="(item, index) in formItems"
                        :key="index"
                        v-show="flag == index"
                    >
                        <div class="wrap">
                            <!-- 正常 -->
                            <div class="item">

                                <oms-upload-icon-picture class="user-img"
                                    @onSuccess="handelNormal"
                                    :ref="'normal'+index"
                                >
                                    <i class="delete el-icon-circle-close" v-if="item.normalImageSrc" @click.stop="resetNormal"></i>
                                    <div class="el-upload--picture-card">
                                        <i :class="['icon', 'normal', item.icon]" v-if="!item.normalImageSrc"></i>
                                        <img :src="item.normalImageSrc" v-else>
                                    </div>
                                </oms-upload-icon-picture>

                                <!--
                                    <i class="delete el-icon-circle-close" v-if="item.normalImageSrc" @click="resetNormal"></i>
                                    <el-upload
                                        class="upload"
                                        :ref="'normal'+index"
                                        :action="fileUploadUrl"
                                        accept="image/jpeg,image/png,image/gif"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :limit="1"
                                        :before-upload="beforeUpload"
                                        :on-success="handelNormal"
                                    >
                                        <div class="el-upload--picture-card">
                                            <i :class="['icon', 'normal', item.icon]" v-if="!item.normalImageSrc"></i>
                                            <img :src="item.normalImageSrc" v-else>
                                        </div>
                                    </el-upload>
                                -->
                                <span>正常</span>
                            </div>
                            <!-- 高温 -->
                            <div class="item">

                                <oms-upload-icon-picture class="user-img"
                                    @onSuccess="handelWarn"
                                    :ref="'highWarn'+index"
                                >
                                    <i class="delete el-icon-circle-close" v-if="item.highWarnImageSrc" @click.stop="resetWarn"></i>
                                    <div class="el-upload--picture-card">
                                        <i :class="['icon', 'warn', item.icon]" v-if="!item.highWarnImageSrc"></i>
                                        <img :src="item.highWarnImageSrc" v-else>
                                    </div>
                                </oms-upload-icon-picture>

                                <!--
                                    <i class="delete el-icon-circle-close" v-if="item.highWarnImageSrc" @click="resetWarn"></i>
                                    <el-upload
                                        class="upload"
                                        :ref="'highWarn'+index"
                                        :action="fileUploadUrl"
                                        accept="image/jpeg,image/png,image/gif"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :before-upload="beforeUpload"
                                        :limit="1"
                                        :on-success="handelWarn"
                                    >
                                        <div class="el-upload--picture-card">
                                            <i :class="['icon', 'warn', item.icon]" v-if="!item.highWarnImageSrc"></i>
                                            <img :src="item.highWarnImageSrc" v-else>
                                        </div>
                                    </el-upload>
                                -->
                                <span>超温</span>
                            </div>
                            <!--低温-->
                            <!-- <div class="item">
                                <i class="delete el-icon-circle-close" v-if="item.lowWarnImageSrc" @click="resetHypothermia"></i>
                                <el-upload
                                    class="upload"
                                    :ref="'lowWarn'+index"
                                    :action="fileUploadUrl"
                                    accept="image/jpeg,image/png,image/gif"
                                    :show-file-list="false"
                                    :headers="headers"
                                    :before-upload="beforeUpload"
                                    :limit="1"
                                    :on-success="handelHypothermia"
                                >
                                    <div class="el-upload--picture-card">
                                        <i :class="['icon', 'hypothermia', item.icon]" v-if="!item.lowWarnImageSrc"></i>
                                        <img :src="item.lowWarnImageSrc" v-else>
                                    </div>
                                </el-upload>
                                <span>低温</span>
                            </div> -->
                            <!--离线-->
                            <div class="item">

                                <oms-upload-icon-picture class="user-img"
                                    @onSuccess="handelOffLine"
                                    :ref="'offlineWarn'+index"
                                >
                                    <i class="delete el-icon-circle-close" v-if="item.offlineWarnImageSrc" @click.stop="resetOffLine"></i>
                                    <div class="el-upload--picture-card">
                                        <i :class="[item.icon]" v-if="!item.offlineWarnImageSrc"></i>
                                        <img :src="item.offlineWarnImageSrc" v-else>
                                    </div>
                                </oms-upload-icon-picture>

                                <!--
                                    <i class="delete el-icon-circle-close" v-if="item.offlineWarnImageSrc" @click="resetOffLine"></i>
                                    <el-upload
                                        class="upload"
                                        :ref="'offlineWarn'+index"
                                        :action="fileUploadUrl"
                                        accept="image/jpeg,image/png,image/gif"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :limit="1"
                                        :before-upload="beforeUpload"
                                        :on-success="handelOffLine"
                                    >
                                        <div class="el-upload--picture-card">
                                            <i :class="[item.icon]" v-if="!item.offlineWarnImageSrc"></i>
                                            <img :src="item.offlineWarnImageSrc" v-else>
                                        </div>
                                    </el-upload>
                                -->
                                <span>离线</span>
                            </div>
                        </div>
                    </el-form-item>
                    <!-- 字体颜色 -->
                    <el-form-item label="字体颜色">
                        <el-color-picker v-model="fontColor" size="mini" style="margin-top: 5px"> </el-color-picker>
                    </el-form-item>

                    <!-- 视频设备 -->
                    <el-form-item label="视频设备" prop="videoDevIds">
                        <el-select clearable filterable
                                multiple placeholder="请选择仓库" v-model="form.videoDevIds">
                            <el-option :key="item.id" :label="item.devName" :value="item.id"
                                    v-for="item in videoDevList">
                                    <div style="display:flex;">
                                            <p>{{ item.devName }}</p>
                                            <p style="margin-left:10px;color:#aaa;"><span>{{ item.devCode }}</span><span>{{ item.devNo ? ' - ' + item.devNo : '' }}</span></p>
                                        </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div class="form-header-part">
                    <div class="header">
                        <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
                            {{pageSets[2].name}}</h3>
                    </div>

                    <el-form-item label="分布图换算比例" prop="picProportion">
                        <div class="flexDis">
                            <el-tooltip class="item" effect="dark" content="分布图换算比例：原图大小与分布图显示大小的比例，原图大小为1" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            1 : <el-input v-model="form.picProportion" placeholder="分布图比例" @blur="picProportionBlurFn"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="设备坐标换算比例" prop="coordsProportion">
                        <div class="flexDis">
                        <el-tooltip class="item" effect="dark" content="设备坐标换算比例：设备坐标与转换坐标的比例，设备坐标为1" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                        1 : <el-input v-model="form.coordsProportion" placeholder="坐标比例" @blur="coordsProportionBlurFn"></el-input>
                        </div>
                    </el-form-item>

                    <el-form-item
                        label="定位图标修改"
                        v-for="(item, index) in formItemsSetOrigin"
                        :key="index"
                        v-show="flag == index"
                    >
                        <div class="wrap">
                            <!-- 正常 -->
                            <div class="item">

                                <oms-upload-icon-picture class="user-img"
                                    @onSuccess="handelSetOriginNormal"
                                    :ref="'normalSetOrigin'+index"
                                >
                                    <i class="delete el-icon-circle-close" v-if="item.normalImageSrc" @click.stop="resetSetOriginNormal"></i>
                                    <div class="el-upload--picture-card">
                                        <i :class="['icon', 'normal', item.icon]" v-if="!item.normalImageSrc"></i>
                                        <img :src="item.normalImageSrc" v-else>
                                    </div>
                                </oms-upload-icon-picture>

                                <!--
                                    <i class="delete el-icon-circle-close" v-if="item.normalImageSrc" @click="resetNormal"></i>
                                    <el-upload
                                        class="upload"
                                        :ref="'normal'+index"
                                        :action="fileUploadUrl"
                                        accept="image/jpeg,image/png,image/gif"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :limit="1"
                                        :before-upload="beforeUpload"
                                        :on-success="handelNormal"
                                    >
                                        <div class="el-upload--picture-card">
                                            <i :class="['icon', 'normal', item.icon]" v-if="!item.normalImageSrc"></i>
                                            <img :src="item.normalImageSrc" v-else>
                                        </div>
                                    </el-upload>
                                -->
                                <span>正常</span>
                            </div>

                            <!--离线-->
                            <div class="item">

                                <oms-upload-icon-picture class="user-img"
                                    @onSuccess="handelSetOriginOffLine"
                                    :ref="'offlineWarnSetOrigin'+index"
                                >
                                    <i class="delete el-icon-circle-close" v-if="item.offlineWarnImageSrc" @click.stop="resetSetOriginOffLine"></i>
                                    <div class="el-upload--picture-card">
                                        <i :class="[item.icon]" v-if="!item.offlineWarnImageSrc"></i>
                                        <img :src="item.offlineWarnImageSrc" v-else>
                                    </div>
                                </oms-upload-icon-picture>

                                <!--
                                    <i class="delete el-icon-circle-close" v-if="item.offlineWarnImageSrc" @click="resetOffLine"></i>
                                    <el-upload
                                        class="upload"
                                        :ref="'offlineWarn'+index"
                                        :action="fileUploadUrl"
                                        accept="image/jpeg,image/png,image/gif"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :limit="1"
                                        :before-upload="beforeUpload"
                                        :on-success="handelOffLine"
                                    >
                                        <div class="el-upload--picture-card">
                                            <i :class="[item.icon]" v-if="!item.offlineWarnImageSrc"></i>
                                            <img :src="item.offlineWarnImageSrc" v-else>
                                        </div>
                                    </el-upload>
                                -->
                                <span>离线</span>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="定位字体颜色">
                        <el-color-picker v-model="setOriginfontColor" size="mini" style="margin-top: 5px"> </el-color-picker>
                    </el-form-item>
                    <el-form-item label="图标闪烁">
                        <el-switch
                            v-model="isFlash"
                            active-color="rgba(64, 158, 255, 1)"
                            inactive-color="rgba(220, 223, 230, 1)"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="刷新间隔" prop="refreshStep">
                        <div class="flexDis">
                            <el-input v-model="form.refreshStep" placeholder="请输入刷新间隔" @blur="refreshStepBlurFn"></el-input> 秒
                        </div>
                    </el-form-item>

                </div>
            </el-form>
        </template>
    </dialog-template>
</template>
<script>
import {CcsWarehouse, warehouseDevImage} from '@/resources';
import methodsMixin from '@/mixins/methodsMixin';
import Vue from "vue";
import formItems from './formItems'
import convertImgToBase64 from '@/tools/convertImgToBase64'

import omsUploadIconPicture from '@/components/common/upload/upload.icon.picture.vue';

import https from "@/https";

// 定位图标
import formItemsSetOrigin from './formItemsSetOrigin'

export default {
    mixins: [methodsMixin],
    components: {
        omsUploadIconPicture
    },
    data() {
        return {
            // 修改图标相关
            devTypeList: [
                { label: '有线温度计', value: 0 },
                { label: '无线温度计', value: 1 },
                { label: '冷柜温度计', value: 2 },
                { label: '车载温度计', value: 3 },
                { label: '湿度计', value: 4 }
            ],
            formItems,
            formItemsSetOrigin,
            flag: 0,
            baseUrl: Vue.prototype.$http.defaults.baseURL + '/open-api/file/download?imageId=',

            fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/open-api/file/upload',
            headers: {
                token: window.localStorage.getItem('token')
            },
            labelWidth: '140px',
            fontColor:'#000000',
            setOriginfontColor:'#000000',
            isFlash : false,
            form: {
                imageName: '',
                logsicId: '',
                warehouseIds: [],
                imageId: '',
                imageUrl: '',
                devType: 0,

                // 视频设备
                videoDevIds : [],

                picProportion : 1,
                coordsProportion : 1,
                refreshStep : 5
            },
            logisticsCenterList: [],
            attachmentList: [],
            warehouseList: [],
            rules: {
                imageName: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                logsicId: [
                    {required: true, message: '请选择物流中心', trigger: 'change'}
                ],
                warehouseIds: [
                    {required: true, type: 'array', message: '请选择仓库', trigger: 'change'}
                ],
                picProportion: [
                    {required: true, message: '请输入分布图换算比例', trigger: 'change'}
                ],
                coordsProportion: [
                    {required: true, message: '请输入设备坐标换算比例', trigger: 'change'}
                ],
                refreshStep: [
                    {required: true, message: '请输入刷新间隔', trigger: 'change'}
                ],
            },
            doing: false,

            pageSets: [
                {name: '基本信息', key: 1},
                {name: '静态设备', key: 2},
                {name: '室内定位', key: 3},
            ],

            currentTab : {},

            videoDevList : [],
            devTypeVal : -1 // 初始化后的 formItemsSetOrigin 对象索引
        };
    },
    props: ['index', 'formItem', 'normalIconUrlBase64', 'offlineIconUrlBase64'],
    computed : {
        normalUrlBase64(){
            return this.normalIconUrlBase64 ;
        },
        offlineUrlBase64(){
            return this.offlineIconUrlBase64 ;
        }
    },
    watch: {
        index: function (newVal, oldVal) {

            this.$refs['form'].resetFields();
            // this.$refs.uploadFile.$refs.upload.clearFiles();
            this.logisticsCenterList=[];
            this.warehouseList=[];
            this.resetItemsFn() ;
            this.queryImageInfo(this.formItem.backgroundId, newVal);
            this.getVideoDevListFn() ;

        }
    },

    methods: {

        getVideoDevListFn(){
            let params = {
                keyWord : '' // 关键字
            } ;
            https.get('/ccsDevice/video/list', params).then(res => {
                  this.videoDevList = res ;
            }).catch(error => {
                this.$notify.error({
                    message: '接口请求失败！'
                })
            }).finally(() => {
            }) ;
        },

        // 修改定位图标 - 正常
        handelSetOriginNormal(res, file) {
            this.formItemsSetOrigin[this.flag].normalFile = res ;
            this.formItemsSetOrigin[this.flag].normalImageId = res.attachmentId
            this.formItemsSetOrigin[this.flag].normalImageSrc = res.url ? res.url : ''
            this.$refs['normalSetOrigin'+this.flag][0].clearFilesFn && this.$refs['normalSetOrigin'+this.flag][0].clearFilesFn() ;

        },


        // 修改定位图标 - 离线
        handelSetOriginOffLine(res, file) {
            // console.error( res, this.flag, 222222) ; // 之前返回 res 就是一个数字, 来做为 highWarnImageId 使用
            this.formItemsSetOrigin[this.flag].offlineWarnFile = res ;
            this.formItemsSetOrigin[this.flag].offlineWarnImageId = res.attachmentId
            this.formItemsSetOrigin[this.flag].offlineWarnImageSrc = res.url ? res.url : ''
            this.$refs['offlineWarnSetOrigin'+this.flag][0].clearFilesFn && this.$refs['offlineWarnSetOrigin'+this.flag][0].clearFilesFn() ;

        },

        // 重置定位图标 - 正常
        resetSetOriginNormal() {
            this.formItemsSetOrigin[this.flag].normalImageSrc = ''
            this.formItemsSetOrigin[this.flag].normalImageId = ''
            this.formItemsSetOrigin[this.flag].normalFile = { attachmentId : '', url : '' } ;

            // console.error(this.formItems[this.flag], this.formItems[this.flag].normalFile, 7) ;

            // if(
            //     this.$refs['normal'+this.flag][0] &&
            //     this.$refs['normal'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].normalFile
            // ){
            //     this.$refs['normal'+this.flag][0].handleRemove( this.formItems[this.flag].normalFile ) ;
            // }

            // this.$refs['normal'+this.flag][0].clearFilesFn && this.$refs['normal'+this.flag][0].clearFilesFn() ;

        },

        // 重置定位图标 - 离线
        resetSetOriginOffLine() {
            this.formItemsSetOrigin[this.flag].offlineWarnImageSrc = '' ;
            this.formItemsSetOrigin[this.flag].offlineWarnImageId = '' ;
            this.formItemsSetOrigin[this.flag].offlineWarnFile = { attachmentId : '', url : '' } ;

            // if(
            //     this.$refs['offlineWarn'+this.flag][0] &&
            //     this.$refs['offlineWarn'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].offlineWarnFile
            // ){
            //     this.$refs['offlineWarn'+this.flag][0].handleRemove( this.formItems[this.flag].offlineWarnFile ) ;
            // }
        },


        // 修改图标相关
        handelNormal(res, file) {
            this.formItems[this.flag].normalFile = res ;
            this.formItems[this.flag].normalImageId = res.attachmentId
            this.formItems[this.flag].normalImageSrc = res.url ? res.url : ''
            this.$refs['normal'+this.flag][0].clearFilesFn && this.$refs['normal'+this.flag][0].clearFilesFn() ;


            /*
                // 之前逻辑
                this.formItems[this.flag].normalImageId = res ; // 之前返回 res 就是一个数字, 来做为 normalImageId 使用
                this.formItems[this.flag].normalImageSrc = this.baseUrl + res
                this.$refs['normal'+this.flag][0].clearFiles()
            */
        },
        handelWarn(res, file) {
            // console.error(this.formItems, res, this.flag, 77777) ; // 之前返回 res 就是一个数字, 来做为 highWarnImageId 使用
            this.formItems[this.flag].highWarnFile = res ;
            this.formItems[this.flag].highWarnImageId = res.attachmentId
            this.formItems[this.flag].highWarnImageSrc = res.url ? res.url : ''
            this.$refs['highWarn'+this.flag][0].clearFilesFn && this.$refs['highWarn'+this.flag][0].clearFilesFn()

            /*
                // 之前逻辑
                this.formItems[this.flag].highWarnImageId = res
                this.formItems[this.flag].highWarnImageSrc = this.baseUrl + res
                this.$refs['highWarn'+this.flag][0].clearFiles()
            */
        },
        handelHypothermia(res, file) {
            this.formItems[this.flag].lowWarnFile = res ;
            this.formItems[this.flag].lowWarnImageId = res.attachmentId
            this.formItems[this.flag].lowWarnImageSrc = res.url ? res.url : ''
            this.$refs['lowWarn'+this.flag][0].clearFilesFn && this.$refs['lowWarn'+this.flag][0].clearFilesFn() ;

            /*
                // 之前逻辑
                this.formItems[this.flag].lowWarnImageId = res
                this.formItems[this.flag].lowWarnImageSrc = this.baseUrl + res
                this.$refs['lowWarn'+this.flag][0].clearFiles()
            */
        },
        handelOffLine(res, file) {
            // console.error(this.formItems, res, this.flag, 222222) ; // 之前返回 res 就是一个数字, 来做为 highWarnImageId 使用
            this.formItems[this.flag].offlineWarnFile = res ;
            this.formItems[this.flag].offlineWarnImageId = res.attachmentId
            this.formItems[this.flag].offlineWarnImageSrc = res.url ? res.url : ''
            this.$refs['offlineWarn'+this.flag][0].clearFilesFn && this.$refs['offlineWarn'+this.flag][0].clearFilesFn() ;

            /*
                // 之前逻辑
                this.formItems[this.flag].offlineWarnImageId = res
                this.formItems[this.flag].offlineWarnImageSrc = this.baseUrl + res
                this.$refs['offlineWarn'+this.flag][0].clearFiles()
            */
        },

        typeChange(value) {
            this.flag = value
        },
        resetItemsFn(){
            this.formItems.forEach(v => {
                v.normalFile = {
                    attachmentId : '',
                    url : '',
                } ;
                v.highWarnFile = {
                    attachmentId : '',
                    url : '',
                } ;
                v.lowWarnFile = {
                    attachmentId : '',
                    url : '',
                } ;
                v.offlineWarnFile = {
                    attachmentId : '',
                    url : '',
                } ;
                v.normalImageSrc = ''
                v.highWarnImageSrc = ''
                v.lowWarnImageSrc = ''
                v.offlineWarnImageSrc = ''
                v.normalImageId = ''
                v.highWarnImageId = ''
                v.lowWarnImageId=''
                v.offlineWarnImageId=''
            })

            this.formItemsSetOrigin.forEach(v => {
                v.normalImageSrc = ''
                v.highWarnImageSrc = ''
                v.lowWarnImageSrc = ''
                v.offlineWarnImageSrc = ''
                v.normalImageId = ''
                v.highWarnImageId = ''
                v.lowWarnImageId=''
                v.offlineWarnImageId=''
            })
        },
        reset() {
            this.flag = 0
            this.currentTab = this.pageSets[0] ;

            this.resetFormFn() ;
            // console.error( 'reset...' ) ;

            this.formItems.forEach(v => {
                v.normalImageSrc = ''
                v.highWarnImageSrc = ''
                v.lowWarnImageSrc = ''
                v.offlineWarnImageSrc = ''
                v.normalImageId = ''
                v.highWarnImageId = ''
                v.lowWarnImageId=''
                v.offlineWarnImageId=''
            })

            this.formItemsSetOrigin.forEach(v => {
                v.normalImageSrc = ''
                v.highWarnImageSrc = ''
                v.lowWarnImageSrc = ''
                v.offlineWarnImageSrc = ''
                v.normalImageId = ''
                v.highWarnImageId = ''
                v.lowWarnImageId=''
                v.offlineWarnImageId=''
            })
        },
        resetNormal() {
            this.formItems[this.flag].normalImageSrc = ''
            this.formItems[this.flag].normalImageId = ''
            this.formItems[this.flag].normalFile = { attachmentId : '', url : '' } ;

            // console.error(this.formItems[this.flag], this.formItems[this.flag].normalFile, 7) ;

            // if(
            //     this.$refs['normal'+this.flag][0] &&
            //     this.$refs['normal'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].normalFile
            // ){
            //     this.$refs['normal'+this.flag][0].handleRemove( this.formItems[this.flag].normalFile ) ;
            // }

            // this.$refs['normal'+this.flag][0].clearFilesFn && this.$refs['normal'+this.flag][0].clearFilesFn() ;

        },
        resetWarn() {
            this.formItems[this.flag].highWarnImageSrc = ''
            this.formItems[this.flag].highWarnImageId = ''
            this.formItems[this.flag].highWarnFile = { attachmentId : '', url : '' } ;

            // if(
            //     this.$refs['highWarn'+this.flag][0] &&
            //     this.$refs['highWarn'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].highWarnFile
            // ){
            //     this.$refs['highWarn'+this.flag][0].handleRemove( this.formItems[this.flag].highWarnFile ) ;
            // }
        },
        resetHypothermia() {
            this.formItems[this.flag].lowWarnImageSrc = ''
            this.formItems[this.flag].lowWarnImageId = ''
            this.formItems[this.flag].lowWarnFile = { attachmentId : '', url : '' } ;

            // if(
            //     this.$refs['lowWarn'+this.flag][0] &&
            //     this.$refs['lowWarn'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].lowWarnFile
            // ){
            //     this.$refs['lowWarn'+this.flag][0].handleRemove( this.formItems[this.flag].lowWarnFile ) ;
            // }

        },
        resetOffLine() {
            // this.formItems[this.flag].offLineImageSrc = '' ;
            // this.formItems[this.flag].offLineImageId = '' ;
            this.formItems[this.flag].offlineWarnImageSrc = '' ;
            this.formItems[this.flag].offlineWarnImageId = '' ;
            this.formItems[this.flag].offlineWarnFile = { attachmentId : '', url : '' } ;

            // if(
            //     this.$refs['offlineWarn'+this.flag][0] &&
            //     this.$refs['offlineWarn'+this.flag][0].handleRemove &&
            //     this.formItems[this.flag].offlineWarnFile
            // ){
            //     this.$refs['offlineWarn'+this.flag][0].handleRemove( this.formItems[this.flag].offlineWarnFile ) ;
            // }
        },
        beforeUpload(file, fileList) {
            let limitFileSize = 1024 * 1024 * 1; // 1M

            if( file.size > limitFileSize ){
                this.$message({
                  message : '上传文件超出大小限制! 最大上传1M文件',
                  type : 'warning'
                }) ;

                return ;
            }

            if( !/(je?pg|gif|png|eps|bmp|webp)$/i.test( file.name ) ){
                this.$message({
                  message : '请选择图片类型文件!',
                  type : 'warning'
                }) ;

                return ;
            }


        },
        handleSuccess(res) {
            this.form.imageId = res;
        },
        setDoing(val) {
            this.doing = val;
        },
        resetFormFn(){
            this.form = {
                imageName: '',
                logsicId: '',
                warehouseIds: [],
                imageId: '',
                imageUrl: '',
                devType: 0,

                // 视频设备
                videoDevIds : [],

                picProportion : 1,
                coordsProportion : 1,
                refreshStep : 5
            } ;
        },
        queryImageInfo(id, valFlag) {
            if (!id) {
                return;
            }

            // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
            // this.$http.get(`warehouseDevImage/info/${id}`).then(res => {
            this.$http.get(`warehousePointImage/info/${id}`).then(res => {
                this.form = res.data;
                this.logisticsCenterList.push({id: this.form.logsicId, warehouseCode: this.form.logsicName});
                this.warehouseList = this.form.warehouseList;

                // 之前逻辑
                // this.attachmentList = [{ name : this.form.imageName } ];

                if( res.data.imageId && res.data.imageUrl ){
                    this.attachmentList = [{
                        name : res.data.imageName,

                        attachmentId : res.data.imageId,

                        // attachmentStoragePath、attachmentFileName 这二个属性用于在 upload.vue 文件中解析
                        attachmentStoragePath : res.data.imageUrl,
                        attachmentFileName : res.data.imageName
                    } ];
                } else {
                    this.attachmentList = [] ;
                }

                this.fontColor=res.data.fontColor;
                if (this.form.devType === undefined) {
                    this.form.devType = 0
                }
                if (valFlag == 3) {
                    this.init(res)
                }
            }).catch(error => {
            });
        },
        init(res) {
            const { warehouseImageIconList, indoorPositionSceneDTO } = res.data
                if (warehouseImageIconList) {
                    this.formItems.forEach(v1 => {
                        warehouseImageIconList.forEach(v2 => {
                            if (+v1.devType === +v2.devType) {
                                v1.normalImageId = v2.normalAttachmentId || ''
                                v1.highWarnImageId = v2.highWarnAttachmentId || ''
                                v1.lowWarnImageId = v2.lowWarnAttachmentId || ''
                                v1.offlineWarnImageId= v2.offlineWarnAttachmentId || ''

                                v1.normalImageSrc = v2.normalIconUrl? v2.normalIconUrl : ''
                                v1.highWarnImageSrc = v2.highWarnIconUrl? v2.highWarnIconUrl: ''
                                v1.lowWarnImageSrc= v2.lowWarnIconUrl? v2.lowWarnIconUrl: ''
                                v1.offlineWarnImageSrc= v2.offlineWarnIconUrl ? v2.offlineWarnIconUrl: ''

                                // 正常
                                v1.normalFile = {
                                    attachmentId : ( v2.normalAttachmentId && v2.normalIconUrl ) ? v2.normalAttachmentId : '',
                                    url : ( v2.normalAttachmentId && v2.normalIconUrl ) ? v2.normalIconUrl : ''
                                } ;

                                // 高温
                                v1.highWarnFile = {
                                    attachmentId : ( v2.highWarnAttachmentId && v2.highWarnIconUrl ) ? v2.highWarnAttachmentId : '',
                                    url : ( v2.highWarnAttachmentId && v2.highWarnIconUrl ) ? v2.highWarnIconUrl : ''
                                } ;

                                // 低温
                                v1.lowWarnFile = {
                                    attachmentId : ( v2.lowWarnAttachmentId && v2.lowWarnIconUrl ) ? v2.lowWarnAttachmentId : '',
                                    url : ( v2.lowWarnAttachmentId && v2.lowWarnIconUrl ) ? v2.lowWarnIconUrl : ''
                                } ;

                                // 离线
                                v1.offlineWarnFile = {
                                    attachmentId : ( v2.offlineWarnAttachmentId && v2.offlineWarnIconUrl ) ? v2.offlineWarnAttachmentId : '',
                                    url : ( v2.offlineWarnAttachmentId && v2.offlineWarnIconUrl ) ? v2.offlineWarnIconUrl : ''
                                } ;

                                // 之前字段
                                // v1.normalImageId = v2.normalImageId || ''
                                // v1.highWarnImageId = v2.highWarnImageId || ''
                                // v1.lowWarnImageId = v2.lowWarnImageId || ''
                                // v1.offlineWarnImageId= v2.offlineWarnImageId || ''

                                // v1.normalImageSrc = v2.normalImageId? this.baseUrl+v2.normalImageId: ''
                                // v1.highWarnImageSrc = v2.highWarnImageId? this.baseUrl+v2.highWarnImageId: ''
                                // v1.lowWarnImageSrc= v2.lowWarnImageId? this.baseUrl+v2.lowWarnImageId: ''
                                // v1.offlineWarnImageSrc= v2.offlineWarnImageId ? this.baseUrl+v2.offlineWarnImageId: ''


                                // yxh 之前取值字段信息
                                // v1.warnImageSrc = v2.warnImageSrc? this.baseUrl+v2.warnImageSrc: ''
                            }
                        })
                    })
                }

                // 解析 定位对象信息
                if( indoorPositionSceneDTO ){
                    this.formItemsSetOrigin.forEach( v => {
                        if (v.devType == res.data.devType) {
                            this.devTypeVal = v.devType ;
                            v.normalImageId = indoorPositionSceneDTO.normalIconId ;
                            // v.normalImageSrc = indoorPositionSceneDTO.normalIconUrl ; // 之前逻辑

                            // 如果接口有数据用接口数据, 否则用 base64数据
                            v.normalImageSrc = indoorPositionSceneDTO.normalIconUrl ? indoorPositionSceneDTO.normalIconUrl : this.normalUrlBase64 ;


                            v.offlineWarnImageId = indoorPositionSceneDTO.offlineIconId ;
                            // v.offlineWarnImageSrc = indoorPositionSceneDTO.offlineIconUrl ;  // 之前逻辑

                            // 如果接口有数据用接口数据, 否则用 base64数据
                            v.offlineWarnImageSrc = indoorPositionSceneDTO.offlineIconUrl ? indoorPositionSceneDTO.offlineIconUrl : this.offlineUrlBase64 ;
                        }
                    } ) ;

                    // this.form.picProportion = indoorPositionSceneDTO.backgroundRatio ;
                    // this.form.coordsProportion = indoorPositionSceneDTO.pointRatio ;
                    // this.form.refreshStep = indoorPositionSceneDTO.refreshInterval ;

                    this.$set( this.form, 'picProportion', indoorPositionSceneDTO.backgroundRatio ) ;
                    this.$set( this.form, 'coordsProportion', indoorPositionSceneDTO.pointRatio ) ;
                    this.$set( this.form, 'refreshStep', indoorPositionSceneDTO.refreshInterval ) ;


                    this.setOriginfontColor = indoorPositionSceneDTO.fontColor ;
                    this.isFlash = +indoorPositionSceneDTO.flashIcon ? true : false ;


                }
        },
        doClose() {
            this.$emit('right-close');
        },
        queryLogisticsCenterList: function () {
            let param = {
                warehouseType: '0',
                activeFlag: '1'
            };
            CcsWarehouse.queryAllList(param).then(res => {
                this.logisticsCenterList = res.data.currentList;
            });
        },
        queryWarehouse: function () {
            if (!this.form.logsicId) return;
            let param = {
                parentId: this.form.logsicId,
                warehouseType: '1',
                activeFlag: '1'
            };
            CcsWarehouse.queryAllList(param).then(res => {
                this.warehouseList = res.data.currentList;
            });
        },
        logsicChange() {
            this.form.warehouseIds = [];
            this.queryWarehouse();
        },
        changeFiles(files) {
            this.form.imageId = files.length ? files[0].attachmentId : '';
            this.form.imageUrl = files.length ? files[0].attachmentStoragePath : '';
        },
        onSubmit: function (formName) {
            this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) return;

                    const warehouseImageIconList = this.formItems.map(v => {
                        return {
                            backgroundId: this.formItem.backgroundId,
                            devType: v.devType,


                            normalAttachmentId : v.normalFile ? v.normalFile.attachmentId : '',
                            normalIconUrl : v.normalFile ? v.normalFile.url : '',

                            highWarnAttachmentId : v.highWarnFile ? v.highWarnFile.attachmentId : '',
                            highWarnIconUrl : v.highWarnFile ? v.highWarnFile.url : '',

                            lowWarnAttachmentId : v.lowWarnFile ? v.lowWarnFile.attachmentId : '',
                            lowWarnIconUrl : v.lowWarnFile ? v.lowWarnFile.url : '',

                            offlineWarnAttachmentId : v.offlineWarnFile ? v.offlineWarnFile.attachmentId : '',
                            offlineWarnIconUrl : v.offlineWarnFile ? v.offlineWarnFile.url : ''

                            // 之前字段
                            // normalImageId: v.normalImageId,
                            // warnImageId: v.warnImageId,
                            // highWarnImageId:v.highWarnImageId ,
                            // lowWarnImageId:v.lowWarnImageId,
                            // offlineWarnImageId: v.offlineWarnImageId,
                        }
                    })
                    let form = {
                        picId: this.form.imageId,
                        imageName: this.form.imageName,
                        imageUrl: this.form.imageUrl,
                        imageId: this.form.imageId,
                        warehouseIds: this.form.warehouseIds,
                        fontColor:this.fontColor,
                        warehouseImageIconList,
                        videoDevIds : this.form.videoDevIds,

                        // 关联室内定位场景信息
                        // indoorPositionSceneDTO : {
                        //     backgroundRatio : this.form.picProportion,
                        //     pointRatio : this.form.coordsProportion,
                        //     fontColor : this.setOriginfontColor,
                        //     flashIcon : this.isFlash ? 1 : 0, // 0 : 不闪烁     1 : 闪烁
                        //     refreshInterval : this.form.refreshStep,
                        //     normalIconId : '',
                        //     normalIconUrl : '',
                        //     offlineIconId : '',
                        //     offlineIconUrl : ''
                        // }
                    };

                    // normalFile
                    // offlineWarnFile

                    form.indoorPositionSceneDTO = {
                        backgroundRatio : this.form.picProportion,
                        pointRatio : this.form.coordsProportion,
                        fontColor : this.setOriginfontColor,
                        flashIcon : this.isFlash ? 1 : 0, // 0 : 不闪烁     1 : 闪烁
                        refreshInterval : this.form.refreshStep,
                        normalIconId : '',
                        normalIconUrl : '',
                        offlineIconId : '',
                        offlineIconUrl : ''
                    } ;

                    this.formItemsSetOrigin.map( v => {
                        if( v.devType === this.devTypeVal ){

                            form.indoorPositionSceneDTO.normalIconId = v.normalImageId ;
                            // form.indoorPositionSceneDTO.normalIconUrl = v.normalImageSrc ; // 后台让修改的, 做图片本地缓存, 不用传 url 字段值, 只用传图片相关的 id 值

                            form.indoorPositionSceneDTO.offlineIconId = v.offlineWarnImageId ;
                            // form.indoorPositionSceneDTO.offlineIconUrl = v.offlineWarnImageSrc ;  // 后台让修改的, 做图片本地缓存, 不用传 url 字段值, 只用传图片相关的 id 值
                        }

                    } ) ;

                    this.doing = true;

                    this.$httpRequestOpera(warehouseDevImage.updateImage(this.form.id, form), {
                        successTitle: '编辑成功',
                        errorTitle: '编辑失败',
                        success: res => {
                            this.doing = false;
                            this.$emit('refresh');
                            // this.$refs['form'].resetFields();
                            this.fontColor='';
                            // this.$refs.uploadFile.$refs.upload.clearFiles();
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                }
            );
        },

        selectTab(item){
            // console.error( 22, item ) ;
            this.currentTab = item;
        },

        refreshStepBlurFn(){
            // console.error( 'refreshStepBlurFn: ', this.form.refreshStep ) ;
            if( !/^([0-9]\.[0-9]+|[1-9]|10)$/.test( this.form.refreshStep ) ){
                this.$message({
                  message : '1 ~ 10, 可以为小数, 最大为10',
                  type : 'warning'
                }) ;
                this.form.refreshStep = '' ;
            }
        },

        picProportionBlurFn( v ){

            if( !/^([0-9]\.[0-9]+|[1-9]|10)$/.test( this.form.picProportion ) ){
                this.$message({
                  message : '不能小于等于0, 可以为小数, 最大为10',
                  type : 'warning'
                }) ;
                this.form.picProportion = '' ;
            }

            // console.error( 'picProportion: ', this.form.picProportion ) ;
        },
        coordsProportionBlurFn(){
            if( !/^([0-9]{1,2}\.?[0-9]+|[1-9]|100)$/.test( this.form.coordsProportion ) ){
                this.$message({
                  message : '不能小于等于0, 可以为小数, 最大为100',
                  type : 'warning'
                }) ;
                this.form.coordsProportion = '' ;
            }
            // console.error( 'coordsProportion: ', this.form.coordsProportion ) ;
        },




    }

};
</script>
