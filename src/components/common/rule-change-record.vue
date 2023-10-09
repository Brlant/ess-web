<template>
  <div class="content mt-10">
    <el-table :data="changeList" header-row-class-name="table-header-color" style="width: 100%;" v-loading="loading">
      <el-table-column label="时间" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operatorName"/>
      <el-table-column label="修改前规则" prop="oldRule"/>
      <el-table-column label="修改后规则" prop="newRule"/>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ruleChangeRecord",
  props: {
    changeList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      loading: false
    }
  }
}
</script>

<style scoped>

</style>
