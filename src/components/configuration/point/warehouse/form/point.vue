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
    .file-upload{
        float: left;
        width: 148px;
        margin-left: 10px;
        .type-label{
            width: 100%;
            text-align: center;
        }
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
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 145px;
    height: 145px;
    line-height: 145px;
    text-align: center;
}
.avatar {
    width: 145px;
    height: 145px;
    display: block;
}
</style>
<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">{{ title }}监控点位</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="point" :rules="rules" ref="form">
                <el-form-item label="点位名称" prop="ccsPointName">
                    <oms-input placeholder="请输入点位名称" type="text" v-model="point.ccsPointName" :maxlength="100"
                               show-word-limit></oms-input>
                </el-form-item>
                <two-column>
                    <template slot="left">
                        <el-form-item label="监控状态">
                            <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0"
                                        v-model="point.activeFlag"></el-switch>
                        </el-form-item>
                    </template>
                </two-column>
                <el-form-item label="选择图标" prop="backgroundUrl">
                   <!-- <icon-pickup v-model="point.backgroundUrl"/> -->
                   <!--<oms-upload :limit="1" @change="changeFiles" ref="uploadFile"></oms-upload>-->
                    <!--图标依次是:正常，告警，离线，停止-->
                    <div class="file-upload">
                        <div class="type-label">正常</div>
                        <el-upload
                            class="avatar-uploader"
                            :action="fileUploadUrl"
                            :headers="headers"
                            list-type="picture-card"
                            :show-file-list="false"
                            :on-success="handleSuccess">
                            <img v-if="point.backgroundUrl" :src="point.backgroundUrl" class="avatar">
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
                            :on-success="handleExSuccess">
                            <img v-if="point.backgroundUrlEx" :src="point.backgroundUrlEx" class="avatar">
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
                            :on-success="handleOfflineSuccess">
                            <img v-if="point.backgroundUrlOffline" :src="point.backgroundUrlOffline" class="avatar">
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
                            :on-success="handleStopSuccess">
                            <img v-if="point.backgroundUrlStop" :src="point.backgroundUrlStop" class="avatar">
                            <i v-else class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="选择点位坐标" prop="longitude">
                   PositionX: <el-input v-model="point.longitude" style="width:4rem"/>
                   PositionY: <el-input v-model="point.latitude" style="width:4rem"/>
                   <!-- <icon-map-pick v-if="scene.scenesType+'' === '2'" :src="element.backgroundUrl"/> -->
                </el-form-item>
                <!-- <el-form-item label="备注" prop="remark">
                    <oms-input placeholder="请输入点位备注" type="textarea" v-model="point.remark" :maxlength="300"
                               show-word-limit></oms-input>
                </el-form-item> -->
            </el-form>
        </template>
    </dialog-template>
</template>

<script>
import {CcsPoint} from '@/resources';
import methodsMixin from '@/mixins/methodsMixin';
import IconMapPick from "@/components/common/icon-map/pick";
import Vue from 'vue'
// import 'e-icon-picker/dist/main.css' // fontAwesome 图标库样式

export default {
    mixins: [methodsMixin],
    components:{
        IconMapPick
    },
    data: function () {

        return {
            labelWidth: '100px',
            title: '',
            icon_options:{ElementUI: true},
            fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/common/uploadFileOBS',
            headers:{
              token:window.localStorage.getItem('token')
            },
            point: {
                scenesElementId: '',
                ccsPointName:'',
                activeFlag:"1",
                backgroundUrl:"",
                backgroundUrlEx:"",
                backgroundUrlOffline:"",
                backgroundUrlStop:"",
                longitude: '0',//坐标X
                latitude: '0'//坐标Y
                // warehouseId: ''
            },
            rules: {
                ccsPointName: [
                    {required: true, message: '请输入点位名称', trigger: 'blur'},
                    // {validator: checkPointName, trigger: 'blur'}
                ]
            },
            doing: false,
            files:[]
        };
    },
    props: ['index', 'scene','element', 'item', 'action','scene','element'],
    watch: {
        item:{
            immediate: true,
            handler (val) {
                if (!val.scenesElementId) {
                    this.point = {
                        scenesElementId: '',
                        ccsPointName: '',
                        activeFlag: "1",
                        backgroundUrl: "",
                        backgroundUrlEx: "",
                        backgroundUrlOffline: "",
                        backgroundUrlStop: "",
                        longitude: '0',//坐标X
                        latitude: '0'//坐标Y
                    }
                } else {
                    this.point = Object.assign({}, this.item);
                    // this.point
                }
            }
        },
        action:{
            immediate: true,
            handler (val) {
                if (val === 'add') {
                    this.title = "新增";
                }
                if (val === 'edit') {
                    this.title = "编辑";
                }
            }
        },
    },
    methods: {
        changeFiles(files) {
                // this.form.imageId = files.length ? files[0].attachmentId : '';
                //正常，告警，离线，停止
                this.point.backgroundUrl = files.length ? files[0].attachmentStoragePath : '';
            },
        handleSuccess(res){
            if(res.code === 200) {
                this.point.backgroundUrl = res.data;
            }
        },
        handleExSuccess(res){
            if(res.code === 200) {
                this.point.backgroundUrlEx = res.data;
            }
        },
        handleOfflineSuccess(res){
            if(res.code === 200) {
                this.point.backgroundUrlOffline = res.data;
            }
        },
        handleStopSuccess(res){
            if(res.code === 200){
                this.point.backgroundUrlStop = res.data;
            }

        },
        doClose() {
            this.$emit('right-close');
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) return;
                    // console.log(this.area);
                    // return;
                    this.point.scenesElementId = this.element.scenesElementId;
                    this.doing = true;
                    if (!this.point.ccsPointId) {

                                // if(this.files.length !=4){
                                //     this.$notify.info({
                                //         message: "需要上传4张图片,分别表示：正常，告警，离线，停止",
                                //     });
                                //     return;
                                // }

                        this.$httpRequestOpera(CcsPoint.save(this.point), {
                            successTitle: '新增点位成功',
                            errorTitle: '新增点位失败',
                            success: res => {
                                this.doing = false;
                                // this.point.warehouseId = '';
                                this.point.ccsPointName = '';
                                //this.$refs.uploadFile && this.$refs.uploadFile.$refs.upload.clearFiles();
                                // this.point.remark = '';
                                this.$emit('refresh');
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }
                    if (this.point.ccsPointId) {
                        this.$httpRequestOpera(CcsPoint.update(this.point), {
                            successTitle: '修改点位成功',
                            errorTitle: '修改点位失败',
                            success: res => {
                                this.doing = false;
                                this.$refs.uploadFile && this.$refs.uploadFile.$refs.upload.clearFiles();
                                this.$emit('refresh');
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }
                }
            );
        }
    }
    ,
    mounted(){
        // console.log(this.element);
    }
};
</script>
