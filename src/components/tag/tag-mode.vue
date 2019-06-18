<template>
  <div class="tag-mode">
    <p class="title">营销方式</p>
    <div class="tag-header">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部选择</el-checkbox>
    </div>
    <div class="tag-content">
      <el-checkbox-group v-model="checkedMode" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="mode in modes" :label="mode" :key="mode.value">{{ mode.name }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
const MODES = [{ name: '图文', value: 1 }, { name: '文本', value: 2 }, { name: '图片', value: 3 }, { name: '小程序', value: 4 }];
export default {
  name: 'tag-mode',

  data() {
    return {
      modes: MODES,
      checkedMode: [],
      isIndeterminate: false,
      checkAll: false
    };
  },

  methods: {
    handleCheckAllChange(val) {
      this.checkedMode = val ? MODES : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(val) {
      let checkCount = val.length;
      this.checkAll = checkCount === this.modes.length;
      this.isIndeterminate = checkCount > 0 && checkCount < this.modes.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-mode {
  margin-top: 10px;
  .tag-header {
    padding: 12px;
    background-color: #ebeef5;
    color: #909399;
  }
  .tag-content {
    padding: 12px;
  }
  .title {
    padding: 5px 0;
  }
}
</style>
