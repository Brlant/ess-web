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
    <template slot="title">添加热点监控</template>
    
    <template slot="btnSave">
      <el-button :disabled="doing" @click="onSubmit('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
        <el-form-item label="货主" prop="targetId">
          <!-- <org-select :list="orgList" :remoteMethod="queryOrg"
                      placeholder="请输入名称搜索货主信息" v-model="form.targetId"></org-select>  -->
          <el-select filterable placeholder="请输入名称搜索货主信息" :clearable="true"
                  @click.native="reqConditionFn('')"
                  value-key="orgId"
                  v-model="form.targetId" popperClass="good-selects" >
              <el-option :value="org.orgId" :key="org.orgId" :label="org.orgName" v-for="org in orgList">
                    {{ org.orgName }}
              </el-option>
          </el-select>
          <!--<oms-input type="text" v-model="form.targetId" placeholder="请输入货主"></oms-input>-->
        </el-form-item>
        <!-- <el-form-item label="设备" prop="devIds"> -->
        <el-form-item label="点位" prop="devIds">
          <el-select :remote-method="reqPointFn" @click.native="reqPointFn('')" filterable
                     multiple
                     placeholder="请输入名称搜索点位" popper-class="selects--custom" remote reserve-keyword
                     v-model="form.devIds">
            <el-option :key="item.pointId" :label="item.pointName" :value="item.pointId"
                       v-for="(item, index) in allTempList">
              <!-- yxh 之前逻辑用的设备单独分离的组件 -->
              <!-- <dev-option-info :item="item"/> -->
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="监控状态">-->
        <!--<el-switch active-text="激活" inactive-text="未激活" v-model="form.activeFlag"-->
        <!--active-value="1" inactive-value="0"></el-switch>-->
        <!--</el-form-item>-->
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
    import {MonitoringObjGroup, BaseInfo, Point} from '@/resources';
    import methodsMixin from '@/mixins/methodsMixin';

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                labelWidth: '100px',
                form: {
                    targetId: '',
                    devIds: [],
                    activeFlag: '1',
                    relationType: '3'
                },
                rules: {
                    targetId: [
                        {required: true, message: '请选择货主', trigger: 'change'}
                    ],
                    devIds: [
                        {required: true, type: 'array', message: '请选择设备', trigger: 'change'}
                    ]
                },
                doing: false
            };
        },
        computed: {},
        props: ['index'],
        watch: {
            index: function (val) {
                this.$refs['form'].resetFields();
            }
        },
        methods: {
            reqPointFn( query ){ // 请求 查询点位
              Point.queryPager({keyWord: query}).then(res => {
                let { data } = res ; 
                if( data && data.list ){
                    data.list.forEach(i => (i.disabled = false));
                    this.allTempList = data.list;
                    this.setTempListWhenEdit && this.setTempListWhenEdit();
                }
              });
            },
            reqConditionFn( query ){ // 请求 查询货主
                // let params = {type: '0'};
                let params = { orgtype: '0'};
                if (typeof query === 'string') {
                    Object.assign(params, {keyWord: query});
                } else if (typeof query === 'object') {
                    Object.assign(params, query);
                }

                // yxh 之前逻辑
                BaseInfo.getOrgList(params).then(res => {
                    this.orgList = res.data.list;
                });
            },
            doClose() {
                this.$emit('right-close');
            },
            
            onSubmit: function (formName) {

                this.$refs[formName].validate((valid) => {
                        if (!valid || this.doing) return; 
                        if (!this.form.id) { 

                            // yxh 之前逻辑
                            // this.$httpRequestOpera(MonitoringObjGroup.save(this.form), {
                            this.$httpRequestOpera(MonitoringObjGroup.bindCcsMonitorRelationsPoint(this.form), {
                                successTitle: '添加成功',
                                errorTitle: '添加失败',
                                success: res => {
                                    this.doing = false;
                                    this.form = {
                                        targetId: '',
                                        devIds: [],
                                        activeFlag: '1',
                                        relationType: '3'
                                    };
                                    this.$emit('change', res.data);
                                    this.$emit('right-close');
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
