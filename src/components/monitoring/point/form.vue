<style lang="scss" scoped>
    .deleteBtn{ padding:4px 7px; margin-left:10px; }

    .itemsInfo{
        display:inline-block;
        margin-left:1em;
        span{ margin:0 .5em; }
        .itemTem{ width:70px; text-align:center; margin-left:.5em; }
        
    }

</style>
<style lang="scss">
    .activeItem .el-input__inner{border:solid 1px #F56C6C; }
</style>
<template>

    <dialog-template :btnSavePosition="90">
        <template slot="title">{{ actionType }}{{ title }}</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="onSubmit('wform')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="wform">
                <div v-show="!editBackgroundUrl" >
                    <el-form-item label="编码" prop="warehouseCode">
                        <oms-input placeholder="请输入编码" type="text" v-model="form.warehouseCode" :maxlength="50" show-word-limit/>
                    </el-form-item>
                    <!-- <two-column id="itemsInfo"> -->
                        <!-- <template slot="left"> -->
                            <el-form-item label="状态">
                                <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0"
                                           v-model="form.activeFlag"></el-switch>
                                    <el-button type="danger" class="deleteBtn" icon="el-icon-delete"  @click="deleteFn" >删除{{ title }}</el-button>

                                    <p class="itemsInfo" id="itemsInfo">
                                        <!-- <span>低温:<el-input placeholder="低温" :class='{ activeItem : isLow }' @blur="blurTemFn( 'lowTemperature' )" class="itemTem" size="mini" type="text" v-model="form.lowTemperature" :maxlength="50" /></span>
                                        <span>高温:<el-input placeholder="高温" :class='{ activeItem : isHig }' @blur="blurTemFn( 'highTemperature' )" class="itemTem" size="mini" type="text" v-model="form.highTemperature" :maxlength="50" /></span> -->
                                        <span>低温:<el-input placeholder="低温" :class='{ activeItem : isLow }' class="itemTem" size="mini" type="text" v-model="form.lowTemperature" :maxlength="50" /></span>
                                        <span>高温:<el-input placeholder="高温" :class='{ activeItem : isHig }' class="itemTem" size="mini" type="text" v-model="form.highTemperature" :maxlength="50" /></span>
                                    </p>
                            </el-form-item>
                        <!-- </template> -->
                    <!-- </two-column> -->
                    <div class="mb-10" v-show="type === '0'||'9' ">
                        <el-form-item>
                            <span v-show="form.longitude">经度:{{ form.longitude }} 维度:{{ form.latitude }}</span>
                        </el-form-item>
                        <map-location @changeAddress="changeAddress" ref="bdMap"></map-location>
                    </div>
                </div>
            </el-form>
        </template>
    </dialog-template>
</template>

<script>
import MapLocation from '@/components/common/map-location';
import {CcsWarehouse} from '@/resources';

let numPReg = /^(\d+)?\.?(\d+)$/ ; // 验证数值规则 带小数

export default {
    components: {MapLocation},
    data: function () {
        return {
            labelWidth: '90px',
            isLow : false,
            isHig : false,
            form: {
                warehouseCode: '',
                warehouseType: '',
                warnStatus: '0',
                latitude: '',
                longitude: '',
                activeFlag: '1',

                // 低温、高温
                lowTemperature : '',
                highTemperature : ''                
            },
            rules: {
                warehouseCode: [
                    {required: true, message: '请输入编码', trigger: 'blur'}
                ],
                warehouseType: [
                    {required: true, message: '请选择类型', trigger: 'change'}
                ]
            },
            doing: false,
            typeList: [
                {label: '物流中心', key: '0'},
                {label: '仓库', key: '1'},
                {label: '库区', key: '2'},
                {label: '物流中心', key: '9'}
            ],
            actionType: '添加',
            title: '物流中心',
            deleteStore : this.$parent.$parent.deleteStore
        };
    },
    computed: {},
    props: {
        formItem: Object,
        type: String,
        editBackgroundUrl: Boolean
    },
    watch: {
        formItem: function (val) {
            this.$refs['wform'].clearValidate();
            if (val.id) {
                this.form = Object.assign({}, val);
                this.actionType = '编辑';
                if (this.type === '0' || this.type === '9') {
                    this.setMarker();
                }
            } else {
                this.form = Object.assign({
                    warehouseCode: '',
                    warehouseType: '',
                    warnStatus: '0',
                    latitude: '',
                    longitude: '',
                    activeFlag: '1',

                    // 低温、高温
                    lowTemperature : '',
                    highTemperature : '' 
                }, val);
                this.actionType = '添加';
            }
        },
        type(val) {
            if (!val) return;
            this.typeList.forEach(i => {
                if (i.key === val) {
                    this.title = i.label;
                }
            })
        }
    },
    mounted(){
        // console.error( this.type ) ;
    },
    methods: {
        setMarker() {
            if (!this.form.longitude) return;
            const that = this.$refs['bdMap'];
            that.onSearchResult([
                {lng: this.form.longitude, lat: this.form.latitude}
            ]);
        },
        changeAddress(poi) {
            if (poi[0]) {
                this.form.longitude = poi[0].lng;
                this.form.latitude = poi[0].lat;
            }
        },
        onSubmit: function (formName) {
            this.form.warehouseType = this.type;
            if (this.type === '1') {
                this.form.parentId = this.$route.params.id;
            }

            /**
             * 低温和高温验证
                if( /^(\s+)?$/.test( this.form.lowTemperature ) ){
                    this.$message({
                    message : '请输入低温数值',
                    type : 'warning'
                    }) ;
                    this.isLow = true ;
                    return;
                }

                if( /^(\s+)?$/.test( this.form.highTemperature ) ){
                    this.$message({
                    message : '请输入高温数值',
                    type : 'warning'
                    }) ;
                    this.isHig = true ;
                    return;
                }
            */

            this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) return;
                    if (this.type === '0' || this.type === '9') {
                        if (!this.form.longitude) {
                            this.$notify.info({
                                message: '请选取经纬度'
                            });
                            return;
                        }
                    }
                    if (!this.form.id) {
                        this.doing = true;
                        this.$httpRequestOpera(CcsWarehouse.save(this.form), {
                            successTitle: '添加成功',
                            errorTitle: '添加失败',
                            success: res => {
                                this.doing = false;
                                this.$emit('refresh', this.form, this.type, 1);
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    } else {
                        this.$httpRequestOpera(CcsWarehouse.update(this.form.id, this.form), {
                            successTitle: '修改成功',
                            errorTitle: '修改失败',
                            success: res => {
                                this.doing = false;
                                this.$emit('refresh', this.form, this.type, 0);
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }
                }
            );
        },

        blurTemFn( key ){
            switch( key.toLowerCase() ){
                case 'lowtemperature':
                    this.isLow = !numPReg.test( this.form[ key ].trim() ) ;
                    break; 
                    
                case 'hightemperature':
                    this.isHig = !numPReg.test( this.form[ key ].trim() ) ;
                    break; 

                default : '' ;
            }

            if( !numPReg.test( this.form[ key ].trim() ) ){ 
                this.form[ key ] = '' ; 
            }
        },  

        deleteFn(){

            if( this.deleteStore ){
                this.deleteStore( this.formItem, this.type ) ;
            }

            // this.$confirmOpera(`是否删除"${item.warehouseCode}"`, () => {
            //     this.$httpRequestOpera(CcsWarehouse.delete(item.id), {
            //         successTitle: '删除成功',
            //         errorTitle: '删除失败',
            //         success: () => {
            //             const logsic = this.$refs['logsic'];
            //             const warehouse = this.$refs['warehouse'];
            //             type === '1' && warehouse.queryWarehouse();
            //             if (type === '0') {
            //                 logsic.getList();
            //                 logsic.currentItem = {};
            //             }
            //             if (type === '2') {
            //                 warehouse.queryArea();
            //                 warehouse.currentArea = {};
            //             }
            //         }
            //     });
            // });
        }



    }

};
</script>
