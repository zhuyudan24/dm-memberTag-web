<template>
  <div class="list">
    <!-- v-if="list.name !== '手工标签'" -->
    <span class="expends-txt" @click="handleChangeExpends">{{ expends }} </span>
    <div class="first-tag">
      <div>
        <i :class="[list.icon, { 'icon-tag-light': list.name === tagRealName }]" class="iconfont menu-icon"></i>
        <span class="tag-name" :class="{ 'icon-tag-light': list.name === tagRealName }" @click="handleFirstTag">{{ list.name }}</span>
      </div>
      <el-collapseTransition>
        <div class="second-tag" v-show="expends === '收起'">
          <second-tag :list="item" :tag-name="list.name" v-for="(item, i) in list.children" :key="i"></second-tag>
        </div>
      </el-collapseTransition>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { CollapseTransition } from 'element-ui';
import SecondTag from './second-tag';
import { mapState } from 'vuex';

Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  name: 'tag-type',

  components: {
    SecondTag
  },

  props: {
    // 会员标签的数据
    tagList: Object
  },

  data() {
    return {
      list: {},
      typeName: '',
      editData: [],
      expends: '收起'
    };
  },

  computed: {
    ...mapState(['tagRealName'])
  },

  methods: {
    handleChangeExpends() {
      this.expends = this.expends === '收起' ? '展开' : '收起';
    },
    // 处理一级标签
    handleFirstTag() {
      localStorage.setItem('jumpTag', '');
      // 手工标签和其他标签
      this.$emit('handleFristTag', this.list);
    }
  },

  watch: {
    tagList: {
      immediate: true,
      handler(newval) {
        this.list = newval;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  position: relative;
  padding-top: 10px;
  margin-top: 10px;
  &:last-child {
    border-bottom: none;
  }
  .expends-txt {
    position: absolute;
    right: 20px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
  .tag-name {
    display: inline-block;
    margin-left: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
  .second-tag {
    margin: 0 1px;
    font-size: 14px;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
  }
  .icon-tag-light {
    color: #1890ff;
    font-size: 14px;
    font-weight: bold;
  }
}
.list:last-child .second-tag {
  border-bottom: none;
}
</style>
