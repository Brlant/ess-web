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
    <template slot="title">导出历史数据</template>
    <template slot="btnSave">
      <el-button :loading="doing" @click="onSubmit('form')" plain type="primary">{{doing ? '正在导出': '导出'}}</el-button>
    </template>
    <template slot="content">
      <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
        <el-form-item label="时间段" prop="times">
          <el-date-picker :default-time="['00:00:00', '23:59:59']" end-placeholder="结束时间" start-placeholder="开始时间"
                          style="width: 450px"
                          type="datetimerange"
                          v-model="form.times"/>
        </el-form-item>
        <el-form-item label="时间间隔" prop="statPiece">
          <el-input placeholder="请选择时间间隔" style="width: 200px" v-model.number="form.statPiece">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';
    import utils from '@/tools/utils';
    import qs from 'qs';

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                labelWidth: '100px',
                form: {
                    times: [],
                    statPiece: 5
                },
                rules: {
                    times: [
                        {required: true, type: 'array', message: '请选择时间段', trigger: 'blur'}
                    ],
                    statPiece: [
                        {required: true, message: '请输入时间间隔', trigger: 'blur'},
                        {type: 'number', message: '请输入数字', trigger: 'blur'},
                        {type: 'number', min: 0, message: '输入的数值不能为负', trigger: 'blur'}
                    ]
                },
                doing: false
            };
        },
        props: ['index', 'ccsWarehouseId'],
        watch: {
            index: function (val) {
                this.$refs['form'].resetFields();
            }
        },
        methods: {
            doClose() {
                this.$emit('right-close');
            },
            onSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                        if (!valid || this.doing) return;
                        let {form, ccsWarehouseId, $moment} = this;
                        if (!this.form.id) {
                            let params = {
                              // warehouseIds: [ccsWarehouseId], // 之前字段信息
                                warehouseId: ccsWarehouseId,
                                startDate: $moment(form.times[0]).format('YYYY-MM-DD HH:mm:ss'),
                                endDate: $moment(form.times[1]).format('YYYY-MM-DD HH:mm:ss'),
                                statPiece: form.statPiece
                            };
                            this.doing = true;
                            this.$httpRequestOpera(this.$http({
                              
                                // 之前导出地址
                                // url: '/mcc-data/ccsWarehouse/export/warehouse-dev-report',

                                url: '/mcc-data/warehouse/area/point/export', 

                                params,
                                paramsSerializer(params) {
                                    return qs.stringify(params, {indices: false});
                                }
                            }), {
                                successTitle: '导出成功',
                                errorTitle: '导出失败',
                                success: res => {
                                    this.doing = false;
                                    utils.download(res.data.path);
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
