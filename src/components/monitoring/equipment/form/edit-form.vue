<style lang="scss" scoped>
  $labelWidth: 180px;
  .content-part {
    .content-left {
      width: $labelWidth;
    }

    .content-right {
      > h3 {
        left: $labelWidth;
      }

      left: $labelWidth;
    }
  }
</style>
<template>
  <dialog-template :btnSavePosition="100" :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">{{actionType}}设备监控</template>

    <!-- <template slot="btnSave"> -->
    <template slot="btn">
        <!-- <div style="position:absolute; width:100%; bottom:20px; left:0; text-align:center;"> -->
            <el-button :disabled="doing" @click="save('tempForm')" plain type="primary" style="">保存</el-button>
        <!-- </div> -->
    </template>

    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content  mt-10">
            <el-form-item label="编码" prop="monitordevCode">
              <oms-input placeholder="请输入编码" type="text" v-model="form.monitordevCode"></oms-input>
            </el-form-item>
            <el-form-item label="类型" prop="monitordevType">
              <el-select placeholder="请选择类型" v-model="form.monitordevType">
                <el-option :key="item.id" :label="item.title" :value="item.id" v-for="item in typeList"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="监控状态">
              <el-switch active-text="激活" active-value="1" inactive-text="未激活"
                         inactive-value="0" v-model="form.monitorFlag"></el-switch>
            </el-form-item>

            <el-form-item label="状态">
              <el-switch active-text="启用" active-value="1" inactive-text="停用"
                         inactive-value="0" v-model="form.activeFlag"></el-switch>
            </el-form-item>
              <el-form-item label="备注" prop="comment">
                  <oms-input placeholder="请输入备注" type="textarea" v-model="form.comment"></oms-input>
              </el-form-item>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}
            </h3>
          </div>
          <div class="content">
            <pointList @open="openFn" :form="form" :typeList="typeList" class="w-part" ref="pointList"></pointList>
          </div>
        </div>
      </el-form>
        <page-right :css="{'width':'900px','padding':0}" v-if="showIndex !== -1" :show="showIndex !== -1" @right-close="resetRightBox">
            <form-part :form-item="form" :type="type"  v-if="showIndex !== -1"  @refresh="refresh" @right-close="resetRightBox"></form-part>
        </page-right>
    </template>
   
  </dialog-template>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';
    import {DevMonitoring} from '@/resources';
    import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

    // yxh 引入点位信息组件
    import pointList from '@/components/monitoring/equipment/pointList' ;

    import formPart from './form';

    export default {
        components: {TwoColumn, pointList, formPart},
        props: ['formItem', 'index'],
        mixins: [methodsMixin],
        data() {
            return {
                pageSets: [
                    {name: '基本信息', key: 1},
                    {name: '点位信息', key: 2}
                ],
                currentTab: {},
                form: {
                    details: []
                },
                doing: false,
                rules: {
                    monitordevCode: [
                        {required: true, message: '请输入编码', trigger: 'blur'}
                    ],
                    monitordevType: [
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ]
                },
                actionType: '编辑',
                typeList: this.$parent.$parent.typeList,

                showIndex: -1,
                // form: {},
                type: ''
            };
        },
        computed: {
            useableTempList() {
                this.allTempList.forEach(f => {
                    this.form.details.forEach(i => {
                        if (i.id === f.id) {
                            f.disabled = true;
                        }
                    });
                });
                return this.allTempList;
            }
        }, 
        watch: {
            formItem : {
                deep : true,
                handler( item ){ 
                    if( !item ){ return ; } 
                    this.form = item ; 
                }
            }, 
            index: {
                deep : true,
                handler(val) {
                    /*
                        之前逻辑
                        this.allTempList = [];
                        if (val !== 0) return;
                        this.$refs['tempForm'].resetFields();
                        this.form.devIds = [];
                        if (this.formItem.id) {
                            this.queryDetail();
                            this.actionType = '编辑';
                        } else {
                            this.resetForm();
                            this.actionType = '编辑';
                            // this.actionType = '添加';
                        }
                    */
                }
            }
        },
        mounted(){
            this.initFn() ;
        },
        methods: {
            initFn(){
                this.form = this.formItem;
                // console.error( this.formItem , 8) ;
            },
            resetForm() {
                this.form = {
                    monitordevCode: '',
                    monitordevType: '',
                    monitorFlag: '',
                    warnStatus: '0',
                    activeFlag: '1',
                    devIds: [],
                    relationName: '',
                    comment: '',
                    details: []
                };
            },

            resetRightBox() {
                this.showIndex = -1;

                // 这种情况是为了避免子组件已经打开右侧弹窗并没有正常关闭的情况下~ 强制关闭弹窗组件
                this.$refs.pointList && this.$refs.pointList.refresh && this.$refs.pointList.refresh() ; // 刷新子组件操作
            },

            selectTab(item) {
                this.currentTab = item;
            },
            queryDetail() {
                // console.error(  66 ) ;
                DevMonitoring.get(this.formItem.id).then(res => {
                    this.form = Object.assign({devIds: [], details: []}, res.data);
                    this.form.details = this.form.devs.map((m, index) => {
                        return {
                            id: m.ccsDevId,
                            name: this.form.relationNames && this.form.relationNames[index] || ''
                        };
                    });
                    this.queryAllTemp();
                });
            },
            setTempListWhenEdit() {
                if (!this.form.id) return;
                this.form.devs && this.form.devs.forEach(i => {
                    let isHas = this.allTempList.some(s => s.id === i.ccsDevId);
                    if (!isHas) {
                        this.allTempList.push({
                            id: i.ccsDevId,
                            devCode: i.devCode,
                            devType: i.devType,
                            devName: i.devName
                        });
                    }
                });
                this.form.devs && (this.form.devIds = this.form.devs.map(m => m.ccsDevId));
            },
            addTemp() {
                this.form.details.push(Object.assign({}, {name: '', id: ''}));
            },
            deleteTempItem(item) {
                let index = this.form.details.indexOf(item);
                index !== -1 && this.form.details.splice(index, 1);
            },


            openFn( form, type ){
                this.form = Object.assign({}, form);
                this.type = type;
                this.showIndex = 0;
            //   console.error( 'open: ...', form, this.showIndex, type ) ;
            },

            refresh(data, type, actionType) {
                // console.error( 'refresh...' ) ;
                this.resetRightBox();
                const logsic = this.$refs['logsic'];
                const warehouse = this.$refs['pointList'];
                if (type === '0') {
                    if (actionType === 1) {
                        logsic.getList();
                    } else {
                        this.replaceItem(logsic.logisticsCenterList, data);
                        logsic.currentItem = Object.assign({}, data);
                    }
                } else if (type === '1') {
                    if (actionType === 1) {
                        warehouse.queryWarehouse();
                    } else {
                        this.replaceItem(warehouse.warehouseList, data);
                    }
                } else if (type === '2') {
                    if (actionType === 1) {
                        warehouse.queryArea();
                    } else {
                        this.replaceItem(warehouse.areaList, data);
                        warehouse.currentArea = Object.assign({}, data);
                    }
                }
                
            },

            save(formName) {
                // console.error( 'save...' ) ;
                // this.$emit('right-close');

                // this.$emit('change') ;
                this.$refs[formName].validate((valid) => {

                    if( valid ){
                        // console.error( '修改', DevMonitoring.update(this.formItem.id, this.formItem) ) ;
                        this.$httpRequestOpera(DevMonitoring.update(this.formItem.id, this.formItem), {
                            successTitle: '修改成功',
                            errorTitle: '修改失败',
                            success: res => {
                                this.doing = false;
                                this.$emit('change', res.data);
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }

                     
                    /*
                        yxh 之前逻辑
                        if (valid && this.doing === false) {
                            let form = JSON.parse(JSON.stringify(this.form));
                            console.error( form, 8881 ) ;
                            form.devIds = form.details.map(m => m.id);

                            form.relationNames = form.details.map(m => m.name || null);
                            if (!form.id) {
                                this.doing = true;
                                this.$httpRequestOpera(DevMonitoring.save(form), {
                                    successTitle: '添加成功',
                                    errorTitle: '添加失败',
                                    success: res => {
                                        this.doing = false;
                                        this.resetForm();
                                        this.$emit('change', res.data);
                                    },
                                    error: () => {
                                        this.doing = false;
                                    }
                                });
                            } else {
                                this.$httpRequestOpera(DevMonitoring.update(form.id, form), {
                                    successTitle: '修改成功',
                                    errorTitle: '修改失败',
                                    success: res => {
                                        this.doing = false;
                                        this.$emit('change', res.data);
                                    },
                                    error: () => {
                                        this.doing = false;
                                    }
                                });
                            }
                        }
                    */
                });

            }
        }
    };
</script>
