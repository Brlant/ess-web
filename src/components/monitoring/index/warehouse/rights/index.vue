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
  <dialog-template>
    <template slot="title">单位授权</template>
    <template slot="content">
      <el-form :label-width="labelWidth" :model="form" :rules="rules" ref="form">
        <el-row>
          <el-col :span="18">
            <el-form-item label="单位" prop="orgIdList">
              <el-select :clearable="true" :remote-method="queryUnbindOrgs" @click.native.once="queryUnbindOrgs('')"
                         filterable multiple
                         placeholder="请输入名称搜索单位信息" popperClass="good-selects" remote
                         reserve-keyword v-model="form.orgIdList">
                <el-option :key="org.id" :label="org.name" :value="org.id" v-for="org in unbindOrgList">
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
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button :disabled="doing" @click="addItem()" type="primary">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="list"
                header-row-class-name="table-header-color" style="width: 100%;" v-loading="loading">
        <el-table-column label="已授权单位" prop="orgName"/>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <des-btn @click="deleteItem(scope.row)" icon="delete" v-has="'show'">删除</des-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center" v-show="(list.length || pager.currentPage !== 1) && !loading">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </template>
  </dialog-template>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                labelWidth: '80px',
                form: {
                    orgIdList: []
                },
                rules: {
                    orgIdList: [
                        {required: true, type: 'array', message: '请选择单位', trigger: 'change'}
                    ]
                },
                list: [],
                unbindOrgList: [],
                doing: false,
                loading: false,
                pager: {
                    currentPage: 1,
                    count: 0,
                    pageSize: 20
                }
            };
        },
        props: ['index', 'formItem'],
        watch: {
            index: function (val) {
                this.$refs['form'].resetFields();
                this.unbindOrgList = [];
                if (val !== 2) return;
                this.queryList();
                this.queryUnbindOrgs();
            }
        },
        methods: {
            doClose() {
                this.$emit('right-close');
            },
            queryList: function (pageNo = 1) {
                let params = {
                    pageNo: pageNo,
                    pageSize: this.pager.pageSize,
                    backgroundId: this.formItem.backgroundId
                };
                this.loading = true;
                this.$http.get('/org-warehouse-image/pager', {params}).then(res => {
                    this.loading = false;
                    this.list = res.data.list;
                    this.pager.count = res.data.count;
                });
            },
            handleSizeChange(val) {
                this.pager.pageSize = val;
                this.queryList();
            },
            handleCurrentChange(val) {
                this.queryList(val);
            },
            queryUnbindOrgs(query) {
                let params = {
                    backgroundId: this.formItem.backgroundId,
                    keyword: query
                };
                this.$http.get('/org-warehouse-image/unband', {params}).then(res => {
                    this.unbindOrgList = res.data;
                });
            },
            deleteItem(item) {
                this.$confirmOpera(`是否删除单位"${item.orgName}"`, () => {
                    this.$httpRequestOpera(this.$http.delete(`/org-warehouse-image/${item.id}`), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: res => {
                            this.doing = false;
                            this.queryList();
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                });
            },
            addItem: function () {
                this.$refs['form'].validate((valid) => {
                        if (!valid || this.doing) return;
                        this.doing = true;
                        this.form.backgroundId = this.formItem.backgroundId;
                        this.$httpRequestOpera(this.$http.post('/org-warehouse-image', this.form), {
                            successTitle: '添加成功',
                            errorTitle: '添加失败',
                            success: res => {
                                this.doing = false;
                                this.$refs['form'].resetFields();
                                this.queryList();
                                this.queryUnbindOrgs();
                            },
                            error: () => {
                                this.doing = false;
                            }
                        });
                    }
                );
            }
        }

    };
</script>
