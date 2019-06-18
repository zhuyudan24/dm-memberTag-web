<!--
    公共标签列表分类面包屑组件,通过 tagLibName 参数不同,区分不同的标签列表,请求不同的标签库字段
 -->
<template>
  <div class="common-wrap__temp flex">
    <div class="common-wrap__currentTag inline-block">
      <a @click="changeRoute('/' + tagLibName + 'List?tagLevelGroupId=0')" class="common-wrap__currentTag__name">全部</a>
      <i class="el-icon-arrow-right m-l-8 m-r-8" v-if="!!currentTagDatas.length"></i>
      <template v-for="(item, index) in currentTagDatas">
        <a @click="changeRoute('/' + tagLibName + 'List?tagLevelGroupId=' + item.tagLevelGroupId)" class="common-wrap__currentTag__name" :key="item.levelName + index">{{ item.levelName }}</a>
        <i class="el-icon-arrow-right m-l-8 m-r-8" v-if="currentTagDatas.length - 1 != index" :key="item.levelName1 + index"></i>
      </template>
    </div>
    <div class="common-wrap__childTag inline-block" v-if="!!childTagDatas.length">
      <template v-for="(item, index) in childTagDatas">
        <a @click="changeRoute('/' + tagLibName + 'List?tagLevelGroupId=' + item.tagLevelGroupId)" class="common-wrap__childTag__name" :key="item.levelName + index">{{ item.levelName }} ({{ item.count }})</a>
      </template>
    </div>
    <div class="common-wrap__moreTag  p-l-20" v-if="childTagDatas.length > 6">
      <el-popover placement="bottom-end" trigger="click" width="1049">
        <!-- 更多列表 -->
        <div class="common-wrap__moreTag__body">
          <template v-for="(item, index) in childTagDatas">
            <a @click="changeRoute('/' + tagLibName + 'List?tagLevelGroupId=' + item.tagLevelGroupId)" class="common-wrap__childTag__name" :key="item.levelName + index"
              >{{ item.levelName }}({{ item.count }})</a
            >
          </template>
        </div>
        <i slot="reference" class="el-icon-more"></i>
      </el-popover>
    </div>
  </div>
</template>
<script>
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
export default {
  name: 'tagCategory',
  props: {
    // 当前标签库名
    tagLibName: {
      type: String
    }
  },
  data() {
    return {
      // 子分类数据
      tagLevelGroupId: '',
      currentTagDatas: [],
      childTagDatas: []
    };
  },
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },
    /**
     * 获取当前分类数据
     */
    getCateData(url) {
      const that = this;
      const para = {
        tagLevelGroupId: that.tagLevelGroupId
      };
      postRequest(url, para)
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 1) {
            that.currentTagDatas = resData.result.currentNode; // 当前分类数据
            that.childTagDatas = resData.result.dataList; // 子类数据
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 根据当前传递参数判断获取不同的分类数据
     */
    checkGetData(tagLibName) {
      const that = this;
      // 平台
      if (tagLibName == 'platformTag') {
        that.getCateData('/memberTag/platformTagLevel');
      }
      // 手工
      if (tagLibName == 'manualTag') {
        that.getCateData('/memberTag/handTagLevel');
      }
      // 我的
      if (tagLibName == 'myTag') {
        that.getCateData('/enterpriseMemberTag/enterpriseTagLevel');
      }
    },

    /**
     * 手工标签用---添加三级分类后要更新分类
     */
    refreshData() {
      const that = this;
      that.checkGetData(that.tagLibName);
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        const that = this;
        // 获取标签库传递过来的分类 id
        that.tagLevelGroupId = !!that.$route.query.tagLevelGroupId ? that.$route.query.tagLevelGroupId : 0;
        that.checkGetData(that.tagLibName);
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    const that = this;
    // 获取当前类别 id
    // that.tagLevelGroupId = that.tagCateId;
    that.tagLevelGroupId = !!that.$route.query.tagLevelGroupId ? that.$route.query.tagLevelGroupId : 0;
    that.checkGetData(that.tagLibName);
  },
  components: {}
};
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
.common-wrap__temp {
  padding-right: 82px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  .common-wrap__moreTag {
    position: relative;
    line-height: 20px;
    /*margin-left: 60px;*/
  }

  .inline-block {
    line-height: 20px;
  }

  .common-wrap__childTag {
    position: relative;
    overflow: hidden;
    border-left: 0px solid #979797;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 0;
      height: 12px;
      border-left: 1px solid #979797;
    }
  }

  .common-wrap__currentTag__name {
    &:last-child {
      color: #909399;
    }
  }

  .common-wrap__childTag__name {
    &:hover {
      background: #e6e8ed;
      color: #303133;
    }
  }
  .el-icon-more {
    font-size: 14px;
    color: #909399;
    cursor: pointer;
  }
}
</style>
