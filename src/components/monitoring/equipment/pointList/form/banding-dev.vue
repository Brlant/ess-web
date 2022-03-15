<style lang="scss" scoped>
@import "../../../../../assets/scss/mixins";

$leftWidth: 0px;

.el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
}

.el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
}

.content-part {

    .content-left {
        width: $leftWidth;
    }

    .content-right {
        > h3 {
            left: $leftWidth;
        }

        left: $leftWidth;
    }
}
</style>
<template>
    <div>
        <div class="content-part">
            <div class="content-right min-gutter">
                <h3>添加点位设备绑定</h3>
                <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm" style="padding-right: 20px">
                    <el-form-item label="点位名称">
                        {{ form.pointName }}
                    </el-form-item>
                    <el-form-item label="设备" prop="devId">
                        <el-select :remote-method="queryAllTemp" @click.once.native="queryAllTemp('')"
                                   filterable
                                   placeholder="请输入名称搜索设备" popper-class="selects--custom" remote reserve-keyword
                                   v-model="form.devId" @change="setDevInfo">
                            <el-option :key="item.id" :label="item.devName" :value="item.id"
                                       v-for="(item, index) in allTempList">
                                <dev-option-info :item="item"/>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备编码">
                        {{ form.devCode }}
                    </el-form-item>
                    <el-form-item label="启用时间" prop="startTime">
                        <el-date-picker
                            v-model="form.startTime"
                            type="datetime"
                            placeholder="请选择启用时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止时间" prop="endTime">
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            placeholder="请选择截止时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否已存在绑定的设备" class="mini-line-height-label" prop="currentDevFlag">
                        <el-radio-group v-model="form.currentDevFlag" @change="setCurrentDevFlag">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="原绑定设备" prop="oldPointRelationId" v-if="form.currentDevFlag">
                        <el-select filterable clearable placeholder="请输入名称搜索设备" popper-class="selects--custom" reserve-keyword
                                   v-model="form.oldPointRelationId" @change="setDevInfo">
                            <el-option :key="item.pointRelationId" :label="item.devName" :value="item.pointRelationId"
                                       v-for="(item, index) in pointRelationList">
                                <dev-option-info :item="item"/>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="doing" @click="save('tempForm')" type="primary">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';
import {PointRelation} from '@/resources';

export default {
    components: {},
    props: ['formItem', 'index'],
    mixins: [methodsMixin],
    data() {
        let checkStartTime = (rule, value, callback) => {
            if (!value) {
                callback();
            } else {
                if (!this.form.endTime) {
                    callback();
                }
                let startTime = new Date(value).getTime();
                let endTime = new Date(this.form.endTime).getTime();
                if (startTime >= endTime) {
                    callback("启用时间必须小于截止时间");
                } else {
                    callback();
                }
            }
        };
        let checkEndTime = (rule, value, callback) => {
            if (!value) {
                callback();
            } else {
                if (!this.form.startTime) {
                    callback();
                }
                let startTime = new Date(this.form.startTime).getTime();
                let endTime = new Date(value).getTime();
                if (endTime <= startTime) {
                    callback("截止时间必须大于启用时间");
                } else {
                    callback();
                }
            }
        };
        return {
            form: {
                devId: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: ''
            },
            doing: false,
            rules: {
                devId: [
                    {required: true, message: '请选择设备', trigger: 'change'}
                ],
                oldPointRelationId: [
                    {required: true, message: '请选择原绑定设备', trigger: 'change'}
                ],
                currentDevFlag: [
                    {required: true, message: '请选择是否存在当前设备', trigger: 'change'}
                ],
                startTime: [
                    {required: true, message: '请选择启用时间', trigger: 'change'},
                    {validator: checkStartTime, trigger: 'blur'}
                ],
                endTime: [{validator: checkEndTime, trigger: 'blur'}]
            },
            pointRelationList: []
        };
    },
    computed: {},
    watch: {
        index: function (val) {
            this.allTempList = [];
            if (val !== 3) return;
            this.$refs['tempForm'].resetFields();
            this.form = {
                devId: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: ''
            };
            this.form.devCode = '';
            this.form.pointName = this.formItem.pointName;
            // 查询设备
            this.queryAllTemp();
            // 查询旧设备绑定记录
            this.queryPointRelationRecord();
        }
    },
    methods: {
        setCurrentDevFlag() {
            if (!this.form.currentDevFlag && this.form.oldPointRelationId) {
                this.form.oldPointRelationId = '';
            }
            
            if( this.form.currentDevFlag ){ // 如果为是
                // 查询旧设备绑定记录
                this.queryPointRelationRecord();
            }
        },
        setDevInfo(devId) {
            if (devId) {
                this.allTempList.forEach(i => {
                    if (i.ccsDevId === devId) {
                        this.form.devCode = i.devCode;
                    }
                })
            }
        },
        resetForm() {
            this.form = {
                pointRelationList: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: ''
            };
        },
        queryPointRelationRecord() {
            let pointId = this.formItem.id;
            this.$http.get(`/ccs-point-relation/list/${pointId}`, {}).then(res => {
                this.pointRelationList = res.data;
            });
        },
        setPointRelation() {
            this.form = Object.assign({}, {
                ccsWarehouseId: this.formItem.warehouseId,
                pointId: this.formItem.id,
            }, this.form);
        },
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.doing === false) {
                    // 组装数据
                    this.setPointRelation();
                    let form = JSON.parse(JSON.stringify(this.form));
                    this.doing = true;
                    this.$httpRequestOpera(PointRelation.save(form), {
                        successTitle: '添加成功',
                        errorTitle: '添加失败',
                        success: res => {
                            this.doing = false;
                            this.resetForm();
                            this.$emit('refresh');
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                }
            });

        }
    }
};
</script>
