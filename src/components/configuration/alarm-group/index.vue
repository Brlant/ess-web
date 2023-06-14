<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-warn-rule-group-add'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>

    <div class="order-list" style="margin-top: 10px">
      <el-row class="order-list-header">
        <el-col :span="4">规则组名称</el-col>
        <el-col :span="4">运输条件</el-col>
        <el-col :span="4">货主</el-col>
        <el-col :span="4">匹配类型</el-col>
        <el-col :span="4">优先级</el-col>
        <!--<el-col :span="10">创建时间</el-col>-->
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length == 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="['status-no', {'active':currentItemId===item.id}]" @click="showItemDetail(item)"
             class="order-list-item order-list-item-bg " v-for="item in dataList">
          <el-row>
            <el-col :span="4">{{item.ruleGroupName}}</el-col>
            <el-col :span="4">
              <dict :dict-group="'transportationCondition'" :dict-key="item.transCondition"></dict>
            </el-col>
            <el-col :span="4">{{formatOwns(item.owners)}}</el-col>
            <el-col :span="4">{{formatNormalType(item.matchTypeList)}}</el-col>
            <el-col :span="4">{{item.level}}</el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'ccs-warn-rule-group-edit'">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-warn-rule-group-del'"
                       v-show="item.dataType === '0'">删除
              </des-btn>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultStyle" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
    import utils from '@/tools/utils';
    import SearchPart from './search';
    import addForm from './form/add-form.vue';
    import showForm from './form/show-form.vue';
    import CommonMixin from '@/mixins/commonMixin';
    import alarmMixin from '@/mixins/alarmMixin';

    import {AlarmRuleGroup} from '@/resources';
    import https from "@/https";
    export default {
        components: {
            SearchPart
        },
        mixins: [CommonMixin, alarmMixin],
        data() {
            return {
                statusType: utils.orderType,
                filters: {},
                dialogComponents: {
                    0: addForm,
                    1: showForm
                },
                defaultStyle: {
                    'width': '900px',
                    'padding': 0
                },
                customerList:[], // 货主列表
                ruleGroupMatchTypeList:[], // 匹配类型列表
            };
        },
        watch: {
            filters: {
                handler: function () {
                    this.queryList(1);
                },
                deep: true
            }
        },
        // computed: { 
        //     ruleGroupMatchTypeList(){
        //         return this.$getDict('ruleGroupMatchType');
        //     },
        // },
        async mounted() {
          await this.initCustom()
          await this.initType()
          await this.queryList(1);
        },
        methods: {
            searchResult: function (search) {
                this.filters = Object.assign({}, this.filters, search);
            },
            checkStatus(item, key) {
                this.filters.status = item.status;
                this.activeStatus = key;
            },
            resetRightBox() {
                this.defaultStyle.width = '900px';
                this.showIndex = -1;
            },
            showPart(index) {
                this.currentPart = this.dialogComponents[index];
                this.$nextTick(() => {
                    this.showIndex = index;
                });
            },
            queryList(pageNo) {
                const http = AlarmRuleGroup.query;
                this.queryUtil(http, pageNo);
            },
            add() {
                this.form = {};
                this.showPart(0);
            },
            edit(item) {
                this.currentItem = item;
                this.currentItemId = item.id;
                this.form = item;
                this.showPart(0);
            },
            showItemDetail(item) {
                this.currentItem = item;
                this.currentItemId = item.id;
                this.defaultStyle.width = '900px';
                this.showPart(1);
                this.$nextTick(() => {
                    this.form = item;
                });
            },
            deleteItem(item) {
                this.currentItem = item;
                this.currentItemId = item.id;
                this.$confirmOpera(`是否删除规则组"${item.ruleGroupName}"`, () => {
                    this.$httpRequestOpera(AlarmRuleGroup.delete(item.id), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: () => {
                            this.queryList(1);
                        }
                    });
                });
            },
            change() {
                this.resetRightBox();
                this.queryList(1);
            },
            // 初始化货主
            initCustom(){
              let params = {
                  pageNo: 1,
                  pageSize: 9999,
                  deleteFlag: false,
                  keyWord:''
              }
              https.get('/org/pager', params).then(res => {
                    this.customerList = res.list
              })
            },
            // 初始化匹配类型（computed字典暂时拿不到该值）
            initType(){
              let params = {} ;
              https.get('/dictGroup/ruleGroupMatchType/items', params).then(res => {
                 this.ruleGroupMatchTypeList = res || [] ;
              }).catch(error => {
                  this.$notify.error({
                      message: '接口请求失败！'
                  })
              }).finally(() => {
              }) ;

            },
            // 格式化货主
            formatOwns(val){
              if(!val || val == null || val== undefined ||val =='')return ''
              let value = val.split(',')
              let arr = []
              let str = ''
              this.customerList.forEach(item => {
                for(let i=0;i<value.length;i++){
                  if(item.orgId == value[i]){
                    arr.push(item)
                  }
                }
              });
              // 循环拼接字符串，最后一个不加，
              for(let i=0;i<arr.length;i++){
                if(i === arr.length-1){
                  str += arr[i].orgName
                } else {
                  str +=arr[i].orgName+','
                }
              }
              return str
            },
            // 格式化匹配类型
            formatNormalType(val){
              if(!val || val == null || val== undefined ||val =='')return ''
              let value = val.split(',')
              let arr = []
              let str = ''
              this.ruleGroupMatchTypeList.forEach(item => {
                for(let i=0;i<value.length;i++){
                  if(item.key == value[i]){
                    arr.push(item)
                  }
                }
              });
              // 循环拼接字符串，最后一个不加，
              for(let i=0;i<arr.length;i++){
                if(i === arr.length-1){
                  str += arr[i].label
                } else {
                  str +=arr[i].label+','
                }
              }
              return str
            },
        }
    };
</script>
