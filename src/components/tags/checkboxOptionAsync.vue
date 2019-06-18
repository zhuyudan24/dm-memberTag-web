<!--
    标签详情-选项(异步)组件
    <checkbox-option-async ></checkbox-option-async>
    import checkboxOptionAsync from '@/components/tags/checkboxOptionAsync.vue';
 -->
<template>
  <div class="checkboxOption-wrap">
    <div class="checkboxOption-wrap__head">
      <div class="checkboxOption-wrap__head__title">{{ tagData.name }}</div>
      <div class="checkboxOption-wrap__head__describe">{{ tagData.des }}</div>
    </div>
    <div class="checkboxOption-wrap__body">
      <div class="checkboxOption-wrap__body__title">标签值设置</div>
      <div class="checkboxOption-wrap__body__checkAll border-box">
        <el-checkbox :indeterminate="tagData.isIndeterminate" v-model="tagData.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <div class="checkboxOption-wrap__body__options border-box">
        <el-checkbox-group v-model="tagData.checkeditems" @change="handleCheckedChange">
          <el-checkbox v-for="(item, index) in tagData.options" :label="item.id" :key="item.id + index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'checkboxOptionAsync',
  data() {
    return {
      tagData: {
        name: '性别',
        des:
          '根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述根据描述',
        checkeditems: [],
        isIndeterminate: false,
        checkAll: false,
        options: [
          {
            id: 1,
            name: '男'
          },
          {
            id: 2,
            name: '女'
          }
        ]
      }
    };
  },
  methods: {
    handleCheckAllChange(val) {
      var that = this;
      if (val) {
        that.tagData.options.forEach(function(el, index) {
          that.tagData.checkeditems.push(el.id);
        });
      } else {
        that.tagData.checkeditems = [];
      }

      that.tagData.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      var that = this;
      let checkedCount = value.length;
      that.tagData.checkAll = checkedCount === that.tagData.options.length;
      that.tagData.isIndeterminate = checkedCount > 0 && checkedCount < that.tagData.options.length;
    }
  },
  /* eslint-disable */
  mounted() {},
  components: {}
};
</script>
<style lang="scss" scoped></style>
