<template>
  <div class="myTagLib-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <tag-lib :tagCategory="tagCategory"></tag-lib>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
/* eslint-disable */
import navCrumb from '@/components/nav/nav.vue';
import tagLib from '@/components/tagLib.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'myTagLib',
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: `${window.location.origin}/report/#/memberSummary`,
          relocation: true
        },
        {
          name: '会员管理',
          path: ''
        },
        {
          name: '会员标签',
          path: ''
        },
        {
          name: '我的标签库',
          path: ''
        }
      ],
      tagCategory: 'myTagList' // 当前标签类别
    };
  },
  methods: {
    /**
     * 添加到我的标签库
     */

    /* eslint-disable */
    toAddMyTagLib() {

    }
  },

  /* eslint-disable */
  mounted() {},
  components: {
    navCrumb,
    tagLib
  }
};
</script>
<style lang="scss" scoped></style>
