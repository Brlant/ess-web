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
</style>
<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">添加分布图</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
                <el-form-item label="名称" prop="imageName">
                    <oms-input v-model="form.imageName"></oms-input>
                </el-form-item>
                <el-form-item label="上传分布图">
                   <oms-upload :limit="1" @change="changeFiles" ref="uploadFile"></oms-upload>
                    <!--
                        // 之前逻辑
                        <el-upload
                            ref="uploadRef"
                            class="upload-demo"
                            :action="fileUploadUrl"
                            :headers="headers"
                            :limit="1"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    -->
                </el-form-item>
                <el-form-item label="物流中心">
                    <el-select :remote-method="queryLogisticsCenterList" @change="logsicChange" @focus="queryLogisticsCenterList"
                               clearable filterable placeholder="请选择物流中心" remote v-model="form.logsicId">
                        <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                   v-for="item in logisticsCenterList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseIds">
                    <el-select clearable filterable @focus="queryWarehouse"
                               multiple placeholder="请选择仓库" v-model="form.warehouseIds">
                        <el-option :key="item.id" :label="item.warehouseCode" :value="item.id"
                                   v-for="item in warehouseList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否有3D场景" prop="is3dScene">
                  <el-switch
                      v-model="form.enableSceneUrl"
                      @change="switchChangeScene"
                  />
                </el-form-item>
                <el-form-item label="3D场景地址" prop="sceneUrl" v-if="showSceneUrl">
                  <oms-input v-model="form.sceneUrl"></oms-input>
                </el-form-item>
            </el-form>
        </template>
    </dialog-template>
</template>
<script>
    import {CcsWarehouse, warehouseDevImage} from '@/resources';
    import methodsMixin from '@/mixins/methodsMixin';
    import Vue from "vue";

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/open-api/file/upload',
                headers: {
                    token: window.localStorage.getItem('token')
                },
                labelWidth: '100px',
                form: {
                    imageName: '',
                    logsicId: '',
                    warehouseIds: [],
                    imageId: '',
                    imageUrl: '',
                    enableSceneUrl: false,
                    sceneUrl: '',
                },
                logisticsCenterList: [],
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
                // 是否显示3d场景地址输入框
                showSceneUrl: false,
            };
        },
        props: ['index', 'formItem'],
        watch: {
            index: function (val) {
                this.$refs['form'].resetFields();
                //默认新增的时候清除上一个图片路径
                if(val===1){

                  this.$refs.uploadFile && this.$refs.uploadFile.$refs.upload.clearFiles();

                  // 之前逻辑
                  // this.$refs.uploadRef.clearFiles();
                }

            }
        },
        methods: {
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
                // console.error( files, 88 ) ;
                this.form.imageId = files.length ? files[0].attachmentId : '';
                this.form.imageUrl = files.length ? files[0].attachmentStoragePath : '';
            },
            //处理上传
            handleSuccess(res) {
                this.form.imageId = res;
            },
            onSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                        if (!valid || this.doing) return;
                        if (!this.form.id) {
                            let form = {
                                picId: this.form.imageId,
                                imageName: this.form.imageName,
                                imageUrl: this.form.imageUrl,
                                imageId: this.form.imageId,
                                warehouseIds: this.form.warehouseIds,
                                sceneType : 2,  // 1 : 静态场景     2 : 室内定位场景
                                enableSceneUrl: this.form.enableSceneUrl,
                                sceneUrl: this.form.sceneUrl,
                            };
                            this.doing = true;
                            this.$httpRequestOpera(warehouseDevImage.save(form), {
                                successTitle: '添加成功',
                                errorTitle: '添加失败',
                                success: res => {
                                    this.doing = false;
                                    this.$emit('refresh');
                                    this.form = {
                                        imageName: '',
                                        logsicId: '',
                                        warehouseIds: [],
                                        imageId: '',
                                        imageUrl: '',
                                        enableSceneUrl: false,
                                        sceneUrl: '',
                                    };
                                    // this.$refs.uploadFile.$refs.upload.clearFiles();
                                },
                                error: () => {
                                    this.doing = false;
                                }
                            });
                        }
                    }
                );
            },

            // 是否有3d场景改变
            switchChangeScene(val) {
              if ( val) {
                this.showSceneUrl = true
              } else {
                this.showSceneUrl = false;
                this.form.sceneUrl = '';
              }
            },
        }

    };
</script>
