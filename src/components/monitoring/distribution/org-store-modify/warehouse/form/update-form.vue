<style lang="scss" scoped>
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
    <dialog-template :btnSavePosition="100">
        <template slot="title">编辑分布图</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
                <el-form-item label="名称" prop="imageName">
                    <oms-input v-model="form.imageName"></oms-input>
                </el-form-item>
                <el-form-item label="上传分布图">
<!--                    <oms-upload :fileList="attachmentList" :limit="1" @change="changeFiles"-->
<!--                                @refreshCodes="setDoing(false)"-->
<!--                                @uploadProgress="setDoing(true)"-->
<!--                                ref="uploadFile"></oms-upload>-->
                    <el-upload
                        :fileList="attachmentList"
                        class="upload-demo"
                        :action="fileUploadUrl"
                        :headers="headers"
                        :limit="1"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="物流中心">
                    <el-select :remote-method="queryLogisticsCenterList" @change="logsicChange"
                               @click.once.native="queryLogisticsCenterList('')"
                               clearable filterable placeholder="请选择物流中心" remote v-model="form.logsicId">
                        <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                   v-for="item in logisticsCenterList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseIds">
                    <el-select clearable filterable remote :remote-method="queryWarehouse"
                               @click.once.native="queryWarehouse('')"
                               multiple placeholder="请选择仓库" v-model="form.warehouseIds">
                        <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                   v-for="item in warehouseList"></el-option>
                    </el-select>
                </el-form-item>
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
                            <i class="delete el-icon-circle-close" v-if="item.normalImageSrc" @click="resetNormal"></i>
                            <el-upload
                                class="upload"
                                :ref="'normal'+index"
                                :action="fileUploadUrl"
                                accept="image/jpeg,image/png,image/gif"
                                :show-file-list="false"
                                :headers="headers"
                                :limit="1"
                                :on-success="handelNormal"
                            >
                                <div class="el-upload--picture-card">
                                    <i :class="['icon', 'normal', item.icon]" v-if="!item.normalImageSrc"></i>
                                    <img :src="item.normalImageSrc" v-else>
                                </div>
                            </el-upload>
                            <span>正常</span>
                        </div>
                        <!-- 高温 -->
                        <div class="item">
                            <i class="delete el-icon-circle-close" v-if="item.highWarnImageSrc" @click="resetWarn"></i>
                            <el-upload
                                class="upload"
                                :ref="'highWarn'+index"
                                :action="fileUploadUrl"
                                accept="image/jpeg,image/png,image/gif"
                                :show-file-list="false"
                                :headers="headers"
                                :limit="1"
                                :on-success="handelWarn"
                            >
                                <div class="el-upload--picture-card">
                                    <i :class="['icon', 'warn', item.icon]" v-if="!item.highWarnImageSrc"></i>
                                    <img :src="item.highWarnImageSrc" v-else>
                                </div>
                            </el-upload>
                            <span>高温</span>
                        </div>
                        <!--低温-->
                        <div class="item">
                            <i class="delete el-icon-circle-close" v-if="item.lowWarnImageSrc" @click="resetHypothermia"></i>
                            <el-upload
                                class="upload"
                                :ref="'lowWarn'+index"
                                :action="fileUploadUrl"
                                accept="image/jpeg,image/png,image/gif"
                                :show-file-list="false"
                                :headers="headers"
                                :limit="1"
                                :on-success="handelHypothermia"
                            >
                                <div class="el-upload--picture-card">
                                    <i :class="['icon', 'hypothermia', item.icon]" v-if="!item.lowWarnImageSrc"></i>
                                    <img :src="item.lowWarnImageSrc" v-else>
                                </div>
                            </el-upload>
                            <span>低温</span>
                        </div>
                        <!--离线-->
                        <div class="item">
                            <i class="delete el-icon-circle-close" v-if="item.offlineWarnImageSrc" @click="resetOffLine"></i>
                            <el-upload
                                class="upload"
                                :ref="'offlineWarn'+index"
                                :action="fileUploadUrl"
                                accept="image/jpeg,image/png,image/gif"
                                :show-file-list="false"
                                :headers="headers"
                                :limit="1"
                                :on-success="handelOffLine"
                            >
                                <div class="el-upload--picture-card">
                                    <i :class="[item.icon]" v-if="!item.offlineWarnImageSrc"></i>
                                    <img :src="item.offlineWarnImageSrc" v-else>
                                </div>
                            </el-upload>
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

import https from "@/https";

export default {
    mixins: [methodsMixin],
    data: function () {
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
            flag: 0,
            baseUrl: Vue.prototype.$http.defaults.baseURL + '/open-api/file/download?imageId=',

            fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/open-api/file/upload',
            headers: {
                token: window.localStorage.getItem('token')
            },
            labelWidth: '100px',
            fontColor:'#000000',
            form: {
                imageName: '',
                logsicId: '',
                warehouseIds: [],
                imageId: '',
                imageUrl: '',
                devType: 0,

                // 视频设备
                videoDevIds : []
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
                ]
            },
            doing: false,

            videoDevList : []
        };
    },
    props: ['index', 'formItem'],
    watch: {
        index: function (newVal, oldVal) {
            this.$refs['form'].resetFields();
            // this.$refs.uploadFile.$refs.upload.clearFiles();
            this.logisticsCenterList=[];
            this.warehouseList=[];
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
        // 修改图标相关
        handelNormal(res, file) {
            this.formItems[this.flag].normalImageId = res
            this.formItems[this.flag].normalImageSrc = this.baseUrl + res
            this.$refs['normal'+this.flag][0].clearFiles()
        },
        handelWarn(res, file) {
            this.formItems[this.flag].highWarnImageId = res
            this.formItems[this.flag].highWarnImageSrc = this.baseUrl + res
            this.$refs['highWarn'+this.flag][0].clearFiles()
        },
        handelHypothermia(res, file) {
            this.formItems[this.flag].lowWarnImageId = res
            this.formItems[this.flag].lowWarnImageSrc = this.baseUrl + res
            this.$refs['lowWarn'+this.flag][0].clearFiles()
        },
        handelOffLine(res, file) {
            this.formItems[this.flag].offlineWarnImageId = res
            this.formItems[this.flag].offlineWarnImageSrc = this.baseUrl + res
            this.$refs['offlineWarn'+this.flag][0].clearFiles()
        },
        typeChange(value) {
            this.flag = value
        },
        reset() {
            this.flag = 0
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
        },
        resetNormal() {
            this.formItems[this.flag].normalImageSrc = ''
            this.formItems[this.flag].normalImageId = ''
        },
        resetWarn() {
            this.formItems[this.flag].highWarnImageSrc = ''
            this.formItems[this.flag].highWarnImageId = ''
        },
        resetHypothermia() {
            this.formItems[this.flag].lowWarnImageSrc = ''
            this.formItems[this.flag].lowWarnImageId = ''
        },
        resetOffLine() {
            this.formItems[this.flag].offLineImageSrc = ''
            this.formItems[this.flag].offLineImageId = ''
        },
        beforeUpload(file, fileList) {
            let limitFileSize = 1024 * 1024 * 1; // 1M

            // console.error('change: ', file, fileList, limitFileSize ) ;

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
        queryImageInfo(id, valFlag) {
            if (!id) {
                return;
            }
            // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
            // this.$http.get(`warehouseDevImage/info/${id}`).then(res => {
            this.$http.get(`warehousePointImage/info/${id}`).then(res => {
                this.form = res.data;
                // console.log(res,'res')
                this.logisticsCenterList.push({id: this.form.logsicId, warehouseCode: this.form.logsicName});
                this.warehouseList = this.form.warehouseList;
                this.attachmentList = [{name: this.form.imageName}];
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
            const { warehouseImageIconList } = res.data
                if (warehouseImageIconList) {
                    this.formItems.forEach(v1 => {
                        warehouseImageIconList.forEach(v2 => {
                            if (v1.devType == v2.devType) {
                                // console.error( v1.devType, v2.devType ) ;
                                v1.normalImageId = v2.normalImageId || ''
                                v1.highWarnImageId = v2.highWarnImageId || ''
                                v1.lowWarnImageId = v2.lowWarnImageId || ''
                                v1.offlineWarnImageId= v2.offlineWarnImageId || ''

                                v1.normalImageSrc = v2.normalImageId? this.baseUrl+v2.normalImageId: ''
                                v1.highWarnImageSrc = v2.highWarnImageId? this.baseUrl+v2.highWarnImageId: ''
                                v1.lowWarnImageSrc= v2.lowWarnImageId? this.baseUrl+v2.lowWarnImageId: ''
                                v1.offlineWarnImageSrc= v2.offlineWarnImageId ? this.baseUrl+v2.offlineWarnImageId: ''


                                // yxh 之前取值字段信息
                                // v1.warnImageSrc = v2.warnImageSrc? this.baseUrl+v2.warnImageSrc: ''
                            }
                        })
                    })
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
        // changeFiles(files) {
        //     this.form.imageId = files.length ? files[0].attachmentId : '';
        //     this.form.imageUrl = files.length ? files[0].attachmentStoragePath : '';
        // },
        onSubmit: function (formName) {
            this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) return;
                    const warehouseImageIconList = this.formItems.map(v => {
                        return {
                            backgroundId: this.formItem.backgroundId,
                            devType: v.devType,
                            normalImageId: v.normalImageId,
                            warnImageId: v.warnImageId,
                            highWarnImageId:v.highWarnImageId ,
                            lowWarnImageId:v.lowWarnImageId,
                            offlineWarnImageId: v.offlineWarnImageId ,
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
                        videoDevIds : this.form.videoDevIds
                    };
                    this.doing = true;
                    this.$httpRequestOpera(warehouseDevImage.updateImage(this.form.id, form), {
                        successTitle: '编辑成功',
                        errorTitle: '编辑失败',
                        success: res => {
                            this.doing = false;
                            this.$emit('refresh');
                            this.$refs['form'].resetFields();
                            this.fontColor='';
                            // this.$refs.uploadFile.$refs.upload.clearFiles();
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                }
            );
        }
    }

};
</script>
