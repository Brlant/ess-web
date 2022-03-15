<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">货主热点监控查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="货主">
              <!-- 之前逻辑 <org-select :list="orgList" :remoteMethod="queryOrg" -->
              <!-- <org-select :list="orgList" :remoteMethod="queryOrg"
                          placeholder="请输入名称搜索货主信息" v-model="searchCondition.orgId"></org-select> -->

                          <!-- @click.native="reqConditionFn('')" -->
                          <el-select  v-model="searchCondition.orgId"  :remote-method="reqConditionFn"  remote reserve-keyword filterable placeholder="请输入名称搜索货主信息" :clearable="true" popperClass="good-selects">
                              <el-option 
                                :value="org.orgId" 
                                :key="org.orgId" 
                                :label="org.orgName" 
                                v-for="org in orgList"
                              >
                                 {{ org.orgName }}
                              </el-option>
                          </el-select>

                          <!-- <el-select v-model="value" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select> -->
                          
                          <!-- yxh 之前逻辑 -->
                          <!-- placeholder="请输入名称搜索货主信息" v-model="searchCondition.monitorTargetId"></org-select> -->
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <!-- <oms-form-row :span="5" label="设备编码"> -->
            <oms-form-row :span="5" label="点位名称">
              <!-- <oms-input @keyup.native.enter="search" placeholder="请输入点位编码"
                         v-model.trim="searchCondition.monitorTargetId"></oms-input> -->

                         <!-- <el-select :remote-method="reqPointFn" @click.native="reqPointFn('')" multiple filterable -->
                         <el-select :remote-method="reqPointFn" filterable
                                placeholder="请输入名称搜索点位" popper-class="selects--custom" remote reserve-keyword
                                v-model="searchCondition.monitorTargetId"
                                clearable
                                @click.native="clearListFn"
                                >
                          <el-option :key="item.pointId" :label="item.pointName" :value="item.pointId"
                                    v-for="(item, index) in allTempList">
                            <!-- yxh 之前逻辑用的设备单独分离的组件 -->
                            <!-- <dev-option-info :item="item"/> -->
                          </el-option>
                        </el-select>
                         
                         <!-- yxh 之前逻辑 -->
                         <!-- v-model.trim="searchCondition.devCode"></oms-input> -->
            </oms-form-row>
          </el-col>
          <!--<oms-form-row label="创建时间" :span="4">-->
          <!--<el-col :span="24">-->
          <!--<el-date-picker-->
          <!--v-model="times"-->
          <!--type="datetimerange"-->
          <!--placeholder="请选择">-->
          <!--</el-date-picker>-->
          <!--</el-col>-->
          <!--</oms-form-row>-->
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';
    import { BaseInfo, Point } from '@/resources';
    import axios from 'axios' ;

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                searchCondition: {
                    monitorTargetId: '',
                    
                    // yxh 之前逻辑
                    // devCode: '',
                    orgId: '',
                    
                    // yxh 之前逻辑
                    // monitorTargetId: '',
                    startTime: '',
                    endTime: ''
                },
                showSearch: false,
                times: [],
                allTempList : [],
                orgList : []
            };
        },
        mounted() {
            // 默认初始化 货主列表数据 和 点位名称列表数据 用于从别的界面跳转传参 查询
            if( this.$route.query ){
              
              if( this.$route.query.orgId ){
                // this.searchCondition.orgId = this.$route.query.orgId ; // 货主
                this.reqConditionFn( this.searchCondition.orgId ) ; // 请求 货主列表数据
              }

              if( this.$route.query.manufacturerCode ){ // 点位名
                this.reqPointFn( this.$route.query.manufacturerCode ) ; // 请求 点位名称列表数据
              }

              // axios.all([this.reqConditionFn( this.searchCondition.orgId ),this.reqPointFn( this.$route.query.manufacturerCode ) ])
              // .then( d => {
              //   console.error( this.orgList, this.allTempList, 88 ) ;
              //   this.initSearchParams();
              // } ) ;

            }
            

            // this.reqPointFn('') ;
        },
        methods: {
            reqPointFn( query ){ // 请求 查询点位
              if( !/^(\s+)?$/.test( query ) ){
               Point.queryPager({keyWord: query}).then(res => {
                  let { data } = res ; 
                  if( data && data.list ){
                      data.list.forEach(i => (i.disabled = false));
                      this.allTempList = data.list;

                      // 如果数据不为空 并且 this.$route.query.manufacturerCode 存在, 表示是从其它界面过来的, 比如: 告警中心/告警事件界面 点击货主热点监控类型的监控对象
                      if( data.list.length && this.$route.query.manufacturerCode ){ 
                        this.searchCondition.monitorTargetId = this.$route.query.code || data.list[0].pointId ; // 赋值点位 pointId
                        // this.searchCondition.monitorTargetId = data.list[0].pointId ; // 赋值点位 pointId
                      }
                      // this.setTempListWhenEdit && this.setTempListWhenEdit();
                      // this.search && this.search();

                      this.initSearchParams();
                  }
                });
              } else {
                this.clearListFn() ; // 重置列表数据
              }
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
                if( !/^(\s+)?$/.test( query ) ){
                 BaseInfo.getOrgList(params).then(res => {
                    this.orgList = res.data.list;
                    
                    if( this.orgList.some( v => v.orgId === v.orgId ) ){  
                        this.searchCondition.orgId = this.$route.query.orgId ; // 货主 
                    } 

                  });
                } else {
                  this.orgList = [] ;
                }
            },
            initSearchParams() {
                let query = this.$route.query;
                if (!query.code) return;
                this.searchCondition = {
                    monitorTargetId: query.code,
                    
                    // yxh 之前逻辑
                    // devCode: query.code,
                    orgId: query.orgId
                    
                    // yxh 之前逻辑
                    // monitorTargetId: query.orgId
                };
                this.search();

                // yxh 之前逻辑
                // this.queryOrg({manufacturerCode: query.manufacturerCode});
                this.reqConditionFn( {manufacturerCode: query.manufacturerCode} ) ;


            },
            search() {
                const parent = this.$parent;
                this.searchCondition.startTime = parent.formatTimeAry(this.times, 0);
                this.searchCondition.endTime = parent.formatTimeAry(this.times, 1);
                this.$emit('search', this.searchCondition);
                // let query = this.$route.query;
                // this.$emit('search', {
                //     monitorTargetId: query.code,
                    
                //     // yxh 之前逻辑
                //     // devCode: query.code,
                //     orgId: query.orgId
                    
                //     // yxh 之前逻辑
                //     // monitorTargetId: query.orgId
                // });
            },
            reset() {
                this.searchCondition = {
                    monitorTargetId: '',
                    
                    // yxh 之前逻辑
                    // devCode: '',
                    orgId: '',
                    
                    // yxh 之前逻辑
                    // monitorTargetId: '',
                    startTime: '',
                    endTime: ''
                };
                this.times = [];
                this.$emit('search', this.searchCondition);
            },
            isShow(val) {
                this.showSearch = val;
            },
            clearListFn(){
              if( !this.searchCondition.monitorTargetId ){ // 如果为空 或 没有值
                this.allTempList = [] ; // 重新列表数据
              }
            }
        }
    };
</script>
