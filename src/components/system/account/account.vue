<style lang="scss" scoped>

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .upload-demo{
    margin-right:15px;
    ul.el-upload-list{ display:none!important; }
  }

  .el-icon-edit-outline{ display:none; }
  .el-icon-edit-outline:hover{ color:#409eff; }
  

  .show-list{
    li{
      &:hover .el-icon-edit-outline{ display:block; }
    }
  }

  .flexDis{ display:flex; align-items:center; justify-content:space-between; padding-right:12px; }

</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <div class="flexDis">
          <h2 class="header">单位用户管理</h2>
          <div>
              <el-button type="primary" size="mini" plain  style="margin:0 10px 5px 0; padding:3px 5px;" @click="addUnitFn"><i class="el-icon-plus"></i>添加单位</el-button>
              <el-upload
                  class="upload-demo"
                  :file-list="attachmentList"
                  :action="fileUploadUrl"
                  :headers="headers"
                  :limit="1"
                  :on-success="handleSuccess"
                  :on-change="onChange"
                  :on-progress="onProgress"
                >
                  <el-button size="small" type="primary" style="padding:5px 10px;" :disabled="isSaved" >{{ isSaved ? '上传中...' : '批量添加' }}</el-button>
                </el-upload>
          </div>
          <div>
            <a @click.prevent="searchType" class="btn-circle" href="#"><i
                class="el-icon-t-search"></i></a>
          </div>
        </div>
        
        <div class="search-left-box" v-show="showTypeSearch">
          <oms-input :showFocus="showTypeSearch" placeholder="请输入关键字搜索" v-model="typeTxt"></oms-input>
        </div>
        <div class="empty-info" v-if="!currentItem.id">
          暂无信息
        </div>
        <div v-else>
          <el-scrollbar :style="'height:'+bodyHeight" @scroll="scrollLoadingData" class="d-table-left_scroll"
                        tag="div">
            <div>
              <ul class="show-list">
                <li :class="{'active':item.id==currentItem.id}" @click="showType(item)" class="list-item"
                    v-for="item in showTypeList">
                  <div class="id-part">
                    系统代码 {{item.manufacturerCode }}
                  </div>
                  <div>
                    {{item.name }}
                  </div>
                  <i class="el-icon-edit-outline" @click="editAddUnitFn( item )" style="position:absolute; font-size:1.2em; top:40%; right:20px;"></i>
                </li>
              </ul>
            </div>
          </el-scrollbar>
          <div class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <el-scrollbar :style="'height:'+bodyHeight" class="d-table-left_scroll" tag="div">
          <div class="scrollbar-content">
          
           <span class="pull-right" style="margin-top: 10px">
                <span>
                  
                </span>
                <span class="btn-search-toggle open" v-show="showSearch">
                    <single-input :showFocus="showSearch" placeholder="请输入关键字搜索" v-model="keyTxt"></single-input>
                    <i @click.stop="showSearch=(!showSearch)" class="el-icon-t-search"></i>
                </span>
               <a @click.stop.prevent="showSearch=(!showSearch)" class="btn-circle" href="#" v-show="!showSearch">
                  <i class="el-icon-t-search"></i>
               </a>
                <a @click.stop.prevent="add" class="btn-circle" href="#" v-has="'ccs-org-user-add'">
                  <i class="el-icon-t-plus"></i>
                </a>
            </span>
            <h2 class="org-name-h2" v-show="orgNo">系统代码:{{orgNo}}</h2>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>姓名</th>
                <th>角色</th>
                <th>手机号码</th>
                <th>邮箱</th>
                <th>状态</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-show="dataRows.length === 0">
              <tr>
                <td class="text-center" colspan="10">
                  <div class="empty-info">暂无信息</div>
                </td>
              </tr>
              </tbody>
              <tbody>
              <tr v-for="row in dataRows">
                <td>
                  {{row.name}}
                  <el-tag type="success" v-show="row.adminFlag">主账号</el-tag>
                </td>
                <td>
                  {{ row.list | formatRole }}
                </td>
                <td>
                  {{row.phone}}
                </td>
                <td>
                  {{row.email}}
                </td>
                <td>
                  <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(row.status)"></dict>
                </td>
                <td class="list-op">
                  <a @click.stop.prevent="edit(row)" class="btn-line-block" href="#" v-has="'ccs-org-user-edit'"><i
                    class="el-icon-t-edit"></i>编辑</a>
                  <oms-forbid :item="row" :tips='"确认停用单位用户\""+row.name+"\"？"' @forbided="forbid" class="btn-line-block"
                              v-has="'ccs-org-user-edit'"
                              v-show="row.status!=='2'">
                    <i class="el-icon-t-forbidden"></i>停用
                  </oms-forbid>
                  <oms-forbid :item="row" :tips='"确认启用单位用户 \""+row.name+"\" ?"' @forbided="useNormal"
                              class="btn-line-block"
                              v-has="'ccs-org-user-edit'"
                              v-show="row.status=== '2' "><i
                    class="el-icon-t-start"></i>启用
                  </oms-forbid>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center" v-show="dataRows.length">
              <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                             :page-sizes="[10,20,50,100]"
                             :total="pager.count" @current-change="handleCurrentChange"
                             @size-change="handleSizeChange"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :action="action" :actionType="showRight" :formItem="form" :orgId="filters.orgId" :title="formTitle"
                 @change="itemChange"
                 @close="showRight=false"></edit-form>
    </page-right>
    <page-right :show="isAddUnit" @right-close="addUnitCloseFn">
      <div>
        <div>
          <h3>单位基础信息</h3>
        </div>
        <div>
          <el-form ref="unitForm" :model="unitForm" label-width="120px" :rules="unitFormRules">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="unitForm.status"
                active-text="启用"
                inactive-text="停用">
              </el-switch>
            </el-form-item>
            <el-form-item label="单位名称" prop="name" class="contact-check">
              <oms-input type="text" v-model="unitForm.name" placeholder="请输入单位名称"></oms-input>
            </el-form-item>
            <el-form-item label="单位简称" prop="easyName" class="contact-check">
              <oms-input type="text" v-model="unitForm.easyName" placeholder="请输入单位简称"></oms-input>
            </el-form-item>
            <el-form-item label="单位系统代码" prop="code" class="contact-check">
              <oms-input type="text" v-model="unitForm.code" placeholder="请输入单位系统代码"></oms-input>
            </el-form-item>
            <el-form-item label="区域代码" prop="areaCode" class="contact-check">
              <oms-input type="text" v-model="unitForm.areaCode" placeholder="请输入区域代码"></oms-input>
            </el-form-item>
            
            <el-form-item label="单位类型" prop="type">
              <el-select placeholder="请选择" v-model="unitForm.type" multiple filterable>
                <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组织类型" prop="orgType">
              <el-select placeholder="请选择" v-model="unitForm.orgType" filterable>
                <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in orgTypeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" :loading="isLoading" @click="saveAddUnitFn">保存</el-button>
            </el-form-item>
          </el-form>
          
          
        </div>
      </div>
    </page-right>
  </div>

</template>
<script>
    import {BaseInfo, http, OrgUser, User} from '../../../resources';
    import editForm from './form/form.vue';
    import https from "../../../https";
    import Vue from "vue";

    export default {
        components: {
            editForm
        },
        data: function () {
            return {
                fileUploadUrl: Vue.prototype.$http.defaults.baseURL + '/org/import/add',
                headers: {
                    token: window.localStorage.getItem('token')
                },
                showRight: false,
                showTypeSearch: false,
                showSearch: false,
                dataRows: [],
                showTypeList: [],
                typeTxt: '',
                keyTxt: '',
                filters: {
                    orgId: ''
                },

                unitForm : {
                  status : false,
                  name : '',
                  easyName : '',
                  code : '',
                  areaCode : '',
                  type : '',
                  orgType : ''
                },
                typeList : [], // 单位类型
                orgTypeList : [
                  {
                    label : '客户', 
                    value : '0'
                  },
                  {
                    label : '业务单位', 
                    value : '1'
                  },
                ], // 组织类型
                unitFormRules : {
                  name: [
                    {required: true, message: '请输入单位名称', trigger: 'blur'}
                  ],
                  code: [
                    {required: true, message: '请输入单位系统代码', trigger: 'blur'}
                  ],
                  areaCode: [
                    {required: true, message: '请输入区域代码', trigger: 'blur'}
                  ],
                  type: [
                    {required: true, message: '请选择单位类型', trigger: 'blur'}
                  ],
                  orgType: [
                    {required: true, message: '请选择组织类型', trigger: 'blur'}
                  ],
                },

                form: {list: [{roleId: ''}]},
                formTitle: '新增',
                oldItem: {},
                action: 'add',
                pager: {
                    currentPage: 1,
                    count: 0,
                    pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
                    totalPage: 1
                },
                typePager: {
                    currentPage: 1,
                    count: 0,
                    pageSize: 20,
                    totalPage: 1
                },
                orgName: '', // 单位名称
                currentItem: {}, //  左边列表点击时，添加样式class
                isInit: true,
                orgNo: '',
                isAddUnit : false, // 是否新增单位
                isLoading : false, // 是否加载
                isSaved : false, // 是否是保存状态
                attachmentList: [],
                attachmentIdList: [],
                isAdd : false, // 是否添加单位
            };
        },
        filters: {
            formatRole: function (list) {
                return list.map(m => m.title).join('，');
            }
        },
        computed: {
            bodyHeight: function () {
                return this.$store.state.bodyHeight;
            }
        },
        mounted() {
            this.getOrgsList(1);

            this.reqUnitTypeFn() ; // 请求 单位类型接口
        },
        watch: {
            'typeTxt': function () {
                this.dataRows = [];
                this.orgName = '';
                this.getOrgsList(1);
            },
            'keyTxt': function () {
                this.getPageList(1);
            },
            filters: {
                handler: function () {
                    this.getPageList(1);
                },
                deep: true
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pager.pageSize = val;
                window.localStorage.setItem('currentPageSize', val);
                this.getPageList(1);
            },
            handleCurrentChange(val) {
                this.getPageList(val);
            },
            scrollLoadingData(event) {
                this.$scrollLoadingData(event);
            },
            resetRightBox: function () {
                this.showRight = false;
            },
            addType: function () {
                this.showTypeRight = true;
            },
            searchType: function () {
                this.showTypeSearch = !this.showTypeSearch;
            },
            getOrgsList: function (pageNo, isContinue = false) {

                this.typePager.currentPage = pageNo;
                let params = Object.assign({}, {
                    pageNo: pageNo,
                    pageSize: this.pager.pageSize,
                    deleteFlag: false,
                    keyWord: this.typeTxt
                }, this.filters);


                https.get('/org/pager', params).then(res => {
                  if (params.keyWord !== this.typeTxt) return;
                    this.$store.commit('initBottomLoading', false);

                    // 原来接口是有 id 和 name 字段的, 新写的接口没有这二个字段信息, 用 orgId 和 orgName 做替代, 为了保证和之前统一这里的 id 和 name 是自定义上去的, 原来的接口没有
                    res.list.map( v => {
                      if( !v.id ){ v.id = v.orgId ; }
                      if( !v.name ){ v.name = v.orgName ; }
                    } ); 

                    if (isContinue) {
                      this.showTypeList = this.showTypeList.concat(res.list);
                    } else {
                      this.showTypeList = res.list;
                        if (this.showTypeList.length !== 0) {
                            this.currentItem = res.list[0];
                            this.orgName = this.showTypeList[0].name;
                            this.filters.orgId = this.currentItem.id;
                            
                            this.getPageList(1);
                        } else {
                            this.currentItem = Object.assign({'id': ''});
                            this.filters.orgId = '';
                        }
                    }
                    this.goAccountUrl();
                    this.typePager.totalPage = res.totalPage;
                    //           this.showTypeList = res.data.list;
                    //           if (this.showTypeList.length > 0) {
                    //             this.orgName = this.showTypeList[0].name;
                    //           }
                    //           this.currentItem = Object.assign({}, {"id": ""}, this.showTypeList[0]);
                    //           this.filters.orgId = "";
                    this.isInit = false;
                }).catch(error => {
                    this.$notify.error({
                        message: '接口请求失败！'
                    })
                }).finally(() => {
                }) ;

              
                /*
                  之前逻辑
                  BaseInfo.query(params).then(res => {
                      if (params.keyWord !== this.typeTxt) return;
                      this.$store.commit('initBottomLoading', false);
                      if (isContinue) {
                          this.showTypeList = this.showTypeList.concat(res.data.list);
                      } else {
                          this.showTypeList = res.data.list;
                          if (this.showTypeList.length !== 0) {
                              this.currentItem = res.data.list[0];
                              this.orgName = this.showTypeList[0].name;
                              this.filters.orgId = this.currentItem.id;
                              console
                              this.getPageList(1);
                          } else {
                              this.currentItem = Object.assign({'id': ''});
                              this.filters.orgId = '';
                          }
                      }
                      this.goAccountUrl();
                      this.typePager.totalPage = res.data.totalPage;
                      //           this.showTypeList = res.data.list;
                      //           if (this.showTypeList.length > 0) {
                      //             this.orgName = this.showTypeList[0].name;
                      //           }
                      //           this.currentItem = Object.assign({}, {"id": ""}, this.showTypeList[0]);
                      //           this.filters.orgId = "";
                      this.isInit = false;
                  });
                */

                //        this.$nextTick(() => {
                //          this.filters.orgId = this.currentItem.id;
                //        });
            },
            getOrgMore: function () {
                this.getOrgsList(this.typePager.currentPage + 1, true);
            },
            getPageList: function (pageNo) {
                if (!this.filters.orgId) return;
                this.pager.currentPage = pageNo;
                let data = Object.assign({}, {
                    pageNo: pageNo,
                    pageSize: this.pager.pageSize,
                    keyWord: this.keyTxt
                });
                OrgUser.queryOrgInfo(this.filters.orgId, data).then(res => {
                    this.dataRows = res.data.list;
                    this.pager.count = res.data.count;
                    this.getCurrentOrg(this.filters.orgId);
                });

            },
            add: function () {
                this.action = 'add';
                this.formTitle = '新增 ' + this.orgName + '用户';
                this.form = {
                    list: [{roleId: ''}],
                    orgId: this.filters.orgId
                };
                this.showRight = true;
            },
            edit: function (item) {
                this.action = 'edit';
                this.formTitle = '编辑 ' + this.orgName + '用户';
                this.oldItem = item;
                this.form = JSON.parse(JSON.stringify(item));
                this.showRight = true;
            },
            remove: function () {

            },
            forbid: function (item) {
                let itemTemp = JSON.parse(JSON.stringify(item));
                itemTemp.status = '2';
                User.stopUser(itemTemp.id).then(() => {
                    item.status = '2';
                    this.$notify.success({
                        title: '成功',
                        message: '已成功停用单位用户"' + itemTemp.name + '"'
                    });
                });
            },
            useNormal: function (item) {
                let itemTemp = JSON.parse(JSON.stringify(item));
                itemTemp.status = '0';
                User.enableUser(itemTemp.id).then(() => {
                    item.status = '0';
                    this.$notify.success({
                        title: '成功',
                        message: '已成功启用单位用户"' + item.name + '"'
                    });
                });
            },
            removeType: function (item) {
                BaseInfo.delete(item.id).then(() => {
                    this.getOrgsList(1);
                    this.$notify.success({
                        title: '成功',
                        message: '已成功删除单位用户"' + item.name + '"'
                    });
                });
            },
            showType: function (item) {
                this.filters.orgId = item.id;
                this.orgName = item.name;
                this.currentItem = item;
                this.goAccountUrl();
            },
            itemChange: function (formData) {
                if (!formData.id) {
                    this.getPageList(1);
                } else {
                    let index = -1;
                    this.dataRows.forEach((f, key) => {
                        if (f.id === formData.id) {
                            index = key;
                        }
                    });
                    if (index !== -1) {
                        this.dataRows.splice(index, 1, formData);
                    } else {
                        this.getPageList(this.pager.currentPage);
                    }
                }
                this.showRight = false;
            },
            formatStatus: function (value) {
                if (!value) return '';
                return value.toString();
            },
            goAccountUrl() {
                /*
                 if (this.currentItem.id) {
                 this.$router.replace('/#/permission/account/' + this.currentItem.id);
                 // history.pushState({}, this.currentItem.name, '/#/permission/account/' + this.currentItem.id);
                 }
                 */
            },
            getCurrentOrg(id) {
                http.get('/orgs/' + id).then(res => {
                    this.orgNo = res.data.orgDto.manufacturerCode;
                });
            },

            reqUnitTypeFn(){ // 请求 单位类型接口
              let params = {} ;
              https.get('/dictGroup/orgRelationType/items', params).then(res => {
                 this.typeList = res || [] ;
              }).catch(error => {
                  this.$notify.error({
                      message: '接口请求失败！'
                  })
              }).finally(() => {
              }) ;
            },
            reqSaveUnitTypeFn(){ // 请求 保存单位类型接口
              let data = {
                orgName : this.unitForm.name,
                orgNameJc : this.unitForm.easyName,
                orgManufacturerCode : this.unitForm.code,
                orgAreaCode : this.unitForm.areaCode,
                orgRelationTypeList : this.unitForm.type,
                orgType: this.unitForm.orgType,
                isDisable: this.unitForm.status ? 1 : 0,
                isResponse : true //是否返回全局参数 true ： response       false : response.data
              } ;
              let req, url ;

              this.isLoading = true ;

              if( !this.isAdd ){ // 如果是修改数据
                data.orgId = this.tempObj.id ;
                req = https.put ;
                url = '/org/updateOrgEss' ;
              } else {
                req = https.post ;
                url = '/org/addOrgList' ;

              }

              req( url, data).then( res => {
                let { code, msg } = res ;

                this.isLoading = false ;
                this.isAddUnit = false ;

                this.getOrgsList(1); // 重新请求 单位用户管理更新列表数据

                this.$message({
                  message : msg,
                  type : +code === 200 ? 'success' : 'warning'
                }) ; 

              }).catch(error => {
                let { response } = error, { data } = response, { code, msg } = data ; 

                this.isLoading = false ;
                this.isAddUnit = false ;
                this.$notify.error({
                    message: msg ? msg : '接口请求失败！'
                    // message: '接口请求失败！'
                })
              }).finally(() => {
              }) ;
              
            },


            reqBaseInfoByPidFn( orgId ){ // 根据 id 请求 单位基础信息
              let params = { orgId } ;

              https.get('/org/getOrgEss', params).then(res => {
                 
                if( res ){
                 this.unitForm = {
                    status : res.isDisable ? true : false,
                    name : res.orgName,
                    easyName : res.orgNameJc,
                    code : res.orgManufacturerCode,
                    areaCode : res.orgAreaCode,
                    type : res.orgRelationTypeList,
                    orgType : res.orgType
                  } ;
                }

              }).catch(error => { 
                  this.$notify.error({
                      message: '接口请求失败！'
                  })
              }).finally(() => { 
                
              }) ;
            },

            editAddUnitFn( item ){
              this.tempObj = item ;
              this.isAddUnit = true ;
              this.isAdd = false ; // 是否是添加单位

              this.$refs['unitForm'] && this.$refs['unitForm'].resetFields() ; // 先重置表单提示信息 
              
              this.reqBaseInfoByPidFn( item.id ) ;  // 根据 id 请求 单位基础信息

            },

            addUnitFn(){
              this.isAddUnit = true ;
              this.isAdd = true ; // 是否是添加单位

              // 重置
              this.unitForm = {
                status : false,
                name : '',
                easyName : '',
                code : '',
                areaCode : '',
                type : '',
                orgType : ''
              } ;
            }, 

            addUnitCloseFn(){
              this.isAddUnit = false ;
            },
            saveAddUnitFn(){
              this.$refs['unitForm'].validate((valid) => {
                if( valid ){
                  this.reqSaveUnitTypeFn() ; // 请求 保存单位类型接口
                } else {

                }
              }) ;
            },
            changeFiles: function (fileList) {
              let ids = [];
              fileList.forEach(file => {
                  ids.push(file.attachmentId);
              });
              this.attachmentIdList = ids;
            },

            onProgress( event, file, fileList ){
              this.isSaved = true;
            },

            handleSuccess(res, file, fileList){
              let { code, data, msg } = res ;
              this.isSaved = false;
              // this.attachmentList = [{name: this.form.imageName}];
               this.attachmentList = [] ;
               if( +code === 200 ){
                 if( data && !/^(\s+)?$/.test(data.path) ){
                   window.open( data.path, '_self' ) ;
                 }
               }

              this.$message({
                message : msg,
                type : +code === 200 ? 'success' : 'warning'
              }) ;

              // https.post('/org/import/add', params).then(res => {
                 
              //    console.error( '上传: ', res ) ; 

                
              // }).catch(error => { 
              //     this.$notify.error({
              //         message: '接口请求失败！'
              //     })
              // }).finally(() => { 
                
              // }) ;
              // console.error( 'upload...', this.attachmentList ) ;
            },

            onChange( file, fileList ){
              // this.attachmentList = [file] ;
            },

            

        }
    };
</script>
