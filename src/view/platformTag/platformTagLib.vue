<template>
  <div class="platformTagLib-wrap common-wrap">
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
  name: 'platformTagLib',
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
          name: '平台标签库',
          path: ''
        }
      ],
      tagCategory: 'platformTagList' // 当前标签类别
    };
  },

/* eslint-disable */
  methods: {},
  mounted() {},
  components: {
    navCrumb,
    tagLib
  }
};
</script>
<style type="text/scss" lang="scss" scoped>

</style>
