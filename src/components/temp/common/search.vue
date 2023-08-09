<style lang="scss" scoped>
.el-form::after {
    content: '';
    clear: both;
    display: table;
}
.select-other-info {
  line-height: initial;
  margin-left: 0;

  &:after, &:before {
    content: '';
    clear: both;
  }
}

.pull-left {
  float: left
}
</style>
<template>
    <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" @isShow="isShow" @reset="reset"
                     @search="search">
        <template slot="title">查询</template>
        <template slot="btn">
            <slot name="btn"></slot>
        </template>
        <template slot="content">
            <el-form class="advanced-query-form" onsubmit="return false">
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编码devCode">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编码devCode"
                                   v-model.trim="searchCondition.devCode"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编号devNo">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编号devNo"
                                   v-model.trim="searchCondition.devNo"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="4" label="名称">
                        <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                                   v-model.trim="searchCondition.devName"></oms-input>
                    </oms-form-row>
                </el-col>
              <el-col :span="8" v-if="type == 2">
                <oms-form-row :span="4" label="使用单位">
                  <el-select
                      v-model="searchCondition.usingOffice"
                      filterable
                      clearable
                      remote
                      placeholder="请输入使用单位"
                      popperClass="good-selects"
                      @click.native.once="queryOrg('')"
                      :remote-method="queryOrg">
                    <el-option :value="org.dhsOrgId" :key="org.id" :label="org.name" v-for="org in orgList">
                      <slot :row="org">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{org.name}}</span>
                        </div>
                        <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span>系统代码:</span>{{org.manufacturerCode}}
                          </span>
                        </div>
                      </slot>
                    </el-option>
                  </el-select>
                </oms-form-row>
              </el-col>
                <el-col :span="8" v-if="!type">
                    <oms-form-row :span="8" label="类型">
                        <el-select @change="search" placeholder="请选择设备类型" v-model="searchCondition.devType">
                            <el-option :key="key" :label="item" :value="key"
                                       v-for="(item, key) in tempTypeList"></el-option>
                        </el-select>
                    </oms-form-row>
                </el-col>
                <!--        <el-col :span="8" v-if="!type">-->
                <!--          <oms-form-row :span="8" label="状态">-->
                <!--            <el-select @change="search" clearable placeholder="请选择设备状态" v-model="searchCondition.status">-->
                <!--              <el-option :key="key" :label="item.title" :value="item.status"-->
                <!--                         v-for="(item, key) in statusType"></el-option>-->
                <!--            </el-select>-->
                <!--          </oms-form-row>-->
                <!--        </el-col>-->
            </el-form>
        </template>
    </search-template>
</template>
<script>
import utils from '@/tools/utils';
import { BaseInfo } from '@/resources';

export default {
    props: {
        type: Number,
        tempTypeList: Array
    },
    data: function () {
        return {
            searchCondition: {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null,
                usingOffice: null,
            },
            showSearch: false,
            list: [],
            times: [],
            orgList: [],
        };
    },
    computed: {
        statusType() {
            return utils[ 'wifiType' ];
        }
    },
    watch: {
        type() {
          console.log(this.type)
            this.searchCondition = {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null,
                usingOffice: null,
            };
        }
    },
    mounted() {
        let devCode = this.$route.query.devCode;
        if (!devCode) return;
        this.searchCondition.devCode = devCode;
        this.searchCondition.devNo = this.$route.query.devNo;
        this.search();
    },
    methods: {
        search() {
            this.$emit('search', this.searchCondition);
        },
        reset() {
            this.searchCondition = {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null,
                usingOffice: null,
            };
            this.$emit('search', this.searchCondition);
        },
        isShow(val) {
            this.showSearch = val;
        },

        // 查询使用单位
        queryOrg(query) {
          let params = { orgtype: '0'};
          if (typeof query === 'string') {
            Object.assign(params, {keyWord: query});
          } else if (typeof query === 'object') {
            Object.assign(params, query);
          }

          BaseInfo.query(params).then(res => {
            this.orgList = res.data.list;
          });
        },
    }
};
</script>
