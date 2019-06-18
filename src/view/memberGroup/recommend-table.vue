<template>
  <el-table :data="tableData">
    <el-table-column label="查看详情" type="expand" width="200"> </el-table-column>
    <el-table-column prop="groupName" label="分组名称"> </el-table-column>
    <el-table-column prop="describle" label="分组描述"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="text" @click="createMemberGroup(scope)">创建会员分组</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'recommend-table',

  props: {
    data: Array
  },

  data() {
    return {
      tableData: []
    };
  },

  watch: {
    data: {
      immediate: true,
      handler(newval) {
        this.tableData = newval;
      }
    }
  },

  methods: {
    createMemberGroup(list) {
      console.log(list);
    }
  }
};
</script>
