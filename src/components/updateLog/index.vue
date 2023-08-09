<template>
  <div class="update-log">
    <el-row class="mb20">
      <el-col>
        <el-button type="primary" @click="handleAdd" v-has="'ccs-update-log-add'">新增日志</el-button>
      </el-col>
    </el-row>
    <div class="flex">
      <!--   日志列表   -->
      <div class="left-content">
        <div v-for="(item,index) in list" class="mb20">
          <el-row>
            <el-col :span="6" class="flex">
              <div class="update-title">
                {{ item.version }}
              </div>
              <el-button type="danger" size="mini" @click="handleDel(item, index)" v-has="'ccs-update-log-delete'">删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <div class="lh40">发布时间： {{ item.publishTime | date }} </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <div>发布内容：</div>
               <div>
                 {{ item.content }}
               </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--   新增表单   -->
      <div class="right-content">
        <el-form v-if="isAdd" ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="发布时间" prop="publishTime">
            <el-date-picker
                v-model="form.publishTime"
                type="date"
                placeholder="请选择发布时间"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发布内容" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="请输入发布内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="text-center" v-show="(list.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {CcsPublishLog} from '@/resources';

export default {
  name: "index",
  data() {
    return {
      queryParams:{
        page: 1,
        size: 10
      },
      list: [],
      form: {
        version: null,
        publishTime: null,
        content: null,
      },
      rules: {
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          }
        ],
        publishTime: [
          {
            required: true,
            message: '请选择发布时间',
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入发布内容',
            trigger: 'blur'
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      isAdd: false,
      loadingData: true,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
    }
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    // 查询更新日志列表
    getList(pageNo) {
      this.pager.currentPage = pageNo;
      this.queryParams = {
        page: pageNo,
        size: this.pager.pageSize,
      }
      CcsPublishLog.getCcsPublishLogList(this.queryParams).then(res => {
        this.list = res.data.list;
        this.pager.count = res.data.total;
        this.loadingData = false;
      });
    },

    // 删除
    handleDel(item, index) {
      this.$confirmOpera(`是否删除更新日志"${item.version}"`, () => {
        this.$httpRequestOpera(CcsPublishLog.deleteCcsPublishLog(item.id), {
          successTitle: '删除成功',
          errorTitle: '删除失败',
          success: () => {
            this.getList(1);
          }
        });
      });
    },

    // 重置表单
    reset() {
      this.form = {
        version: null,
        publishTime: null,
        content: null,
      }
    },

    // 新增日志
    handleAdd() {
      this.reset();
      this.isAdd = true;
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$httpRequestOpera(CcsPublishLog.addCcsPublishLog(this.form), {
            successTitle: '新增成功',
            errorTitle: '新增失败',
            success: () => {
              this.getList(1);
              this.isAdd = false;
            }
          });
        }
      })
    },

    // 取消
    handleCancel() {
      this.isAdd = false;
    },

    // 切换每页条数
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getList(1);
    },

    // 切换页码
    handleCurrentChange(val) {
      this.getList(val);
    },
  }
}
</script>

<style lang="scss" scoped>
.update-log {
  padding: 30px 5%;

  .mb20 {
    margin-bottom: 20px;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }
  .left-content, .right-content {
    word-wrap:break-word;
    word-break:normal;
    width: 50%;
  }
  .update-title{
    font-size: 20px;
    color: red;
  }
  .lh40{
    line-height: 40px;
  }
}

</style>
