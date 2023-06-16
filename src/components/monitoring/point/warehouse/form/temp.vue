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
        <template slot="title">{{ title }}监控点位</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="point" :rules="rules" ref="form">
                <el-form-item label="点位名称" prop="pointName">
                    <oms-input placeholder="请输入点位名称" type="text" v-model="point.pointName" min="0" :maxlength="100"
                               show-word-limit></oms-input>
                </el-form-item>
                <el-form-item label="高度">
                    <oms-input placeholder="请输入点位高度"
                               type="number"
                               v-model="point.pointHeight"
                               :min="0"
                               :maxlength="100"
                               show-word-limit></oms-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <oms-input placeholder="请输入点位备注" type="textarea" v-model="point.remark" :maxlength="300"
                               show-word-limit></oms-input>
                </el-form-item>
            </el-form>
        </template>
    </dialog-template>
</template>

<script>
import {Point} from '@/resources';
import methodsMixin from '@/mixins/methodsMixin';

export default {
    mixins: [methodsMixin],
    data: function () {
        let checkPointName = (rule, value, callback) => {
            if (value !== '' && value !== null) {
                Point.checkPointName({
                    pointName: value,
                    // warehouseId: this.area.id,
                    id: this.point.id
                }).then(val => {
                    if (!val.data) {
                        callback(new Error('输入的点位名称已存在,请重新输入'));
                    } else {
                        callback();
                    }
                });
            } else {
                callback();
            }
        };
        return {
            labelWidth: '100px',
            title: '',
            point: {
                id: '',
                pointName: '',
                pointHeight:'',//高度
                remark: '',
                warehouseId: ''
            },
            rules: {
                pointName: [
                    {required: true, message: '请输入点位名称', trigger: 'blur'},
                    {validator: checkPointName, trigger: 'blur'}
                ]
            },
            doing: false
        };
    },
    props: ['index', 'area', 'tempItem', 'action'],
    watch: {
        tempItem:function (val){
            console.log(val,'打印监听的值');
            this.$refs.form.resetFields();
            this.resetForm()
            if (!val.id){
                this.point.id = '';
                this.point = {
                    id: '',
                    pointName: '',
                    pointHeight:'',//高度
                    remark: '',
                    warehouseId: ''
                }
            }else {
                this.point = Object.assign({}, this.tempItem);
            }
        },
        action: function (val) {
            if (val === 'add') {
                this.title = "新增";
            }
            if (val === 'edit') {
                this.title = "编辑";
            }
        }
    },
    methods: {
        resetForm() {
            this.point = {
                id: '',
                pointName: '',
                pointHeight: '',//高度
                remark: '',
                warehouseId: ''
            }
        },
        doClose() {
            this.$emit('right-close');
        },

        onSubmit(formName) {

            this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) return;
                    if(Number(this.point.pointHeight) < 0){
                        this.$notify.error({
                            message: '请输入非负数'
                        });
                        return;
                    }
                    // yxh warehouseId 字段修改为 belongObjectId, 添加 pointType : 1 (库区)
                    // this.point.warehouseId = this.area.id;
                    this.point.belongObjectId = this.area.id;
                    this.point.pointType = '1'; // 库区

                    this.doing = true;
                    if (!this.point.id) {
                        this.$httpRequestOpera(Point.save(this.point), {
                            successTitle: '新增点位成功',
                            errorTitle: '新增点位失败',
                            success: res => {
                                this.doing = false;

                                // this.point.warehouseId = '';
                                this.point.belongObjectId = '';
                                this.point.pointType = '1';

                                this.point.pointName = '';
                                this.point.pointHeight = '';
                                this.point.remark = '';
                                this.$emit('refresh');
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }
                    if (this.point.id) {
                        this.$httpRequestOpera(Point.update(this.point.id, this.point), {
                            successTitle: '修改点位成功',
                            errorTitle: '修改点位失败',
                            success: res => {
                                this.doing = false;
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

};
</script>
