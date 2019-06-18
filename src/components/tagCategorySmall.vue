<!--
    我的标签列表分类面包屑组件,通过 tagLibName 参数不同,区分不同的标签列表,请求不同的标签库字段
    <tag-category-small :tagLibName="tagLibName"></tag-category-small>
    import tagCategorySmall from '@/components/tagCategorySmall.vue';
 -->
<template>
  <div class="common-wrap__cateTags">
    <div class="common-wrap__temp flex">
      <div class="common-wrap__currentTag inline-block">
        <a class="common-wrap__currentTag__name" @click.stop="toRequestData(0)">全部</a>
        <i class="el-icon-arrow-right m-l-8 m-r-8" v-if="!!currentTagDatas.length"></i>
        <template v-for="(item, index) in currentTagDatas">
          <a class="common-wrap__currentTag__name" @click.stop="toRequestData(item.tagLevelGroupId)" :key="item.levelName + index">{{ item.levelName }}</a>
          <i class="el-icon-arrow-right m-l-8 m-r-8" v-if="currentTagDatas.length - 1 != index" :key="index"></i>
        </template>
      </div>
      <div class="common-wrap__childTag inline-block" v-if="!!childTagDatas.length">
        <template v-for="(item, index) in childTagDatas">
          <a class="common-wrap__childTag__name" @click.stop="toRequestData(item.tagLevelGroupId)" :key="item.levelName + index"> {{ item.levelName }}({{ item.count }}) </a>
        </template>
      </div>
      <div class="common-wrap__moreTag  p-l-20" v-if="childTagDatas.length >= 3">
        <el-popover placement="bottom-end" trigger="click" width="500">
          <!-- 更多列表 -->
          <div class="common-wrap__moreTag__body">
            <template v-for="(item, index) in childTagDatas">
              <a class="common-wrap__childTag__name" @click.stop="toRequestData(item.tagLevelGroupId)" :key="item.levelName + index"> {{ item.levelName }}({{ item.count }}) </a>
            </template>
          </div>
          <i slot="reference" class="el-icon-more"></i>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
export default {
  name: 'tagCategory',
  props: {
    tagLibName: {
      type: String
    }
  },
  data() {
    return {
      // 子分类数据
      currentTagDatas: [],
      childTagDatas: []
    };
  },
  methods: {
    /**
     * 点击分类
     */
    toRequestData(id) {
      const that = this;
      that.getCateData(id);
    },

    /**
     * 获取当前分类数据
     */
    getCateData(id) {
      const that = this;
      const para = {
        tagLevelGroupId: id
      };

      postRequest('/enterpriseMemberTag/enterpriseTagLevel', para)
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 1) {
            that.currentTagDatas = resData.result.currentNode; // 当前分类数据
            that.childTagDatas = resData.result.dataList; // 子类数据
            that.$emit('changeId', id);
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
    }
  },
  watch: {},
  mounted() {
    var that = this;
    that.getCateData(0);
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.common-wrap__cateTags {
  margin-bottom: 12px;

  .common-wrap__currentTag {
    line-height: 20px;
  }
}

.common-wrap__temp {
  padding-right: 20px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  .common-wrap__moreTag {
    position: relative;
    /*margin-left: 60px;*/
  }

  .common-wrap__currentTag__name {
    &:last-child {
      color: #909399;
    }
  }

  .common-wrap__childTag {
    position: relative;
    border-left: 0px solid #979797;
    max-width: 515px;
    overflow: hidden;
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

  .el-icon-more {
    font-size: 14px;
    color: #909399;
    cursor: pointer;
  }

  .common-wrap__currentTag__name {
    cursor: pointer;
  }
}
.common-wrap__childTag__name {
  display: inline-block;
  padding: 3px 5px;
  cursor: pointer;
  &:hover {
    background: #e6e8ed;
    color: #303133;
  }
}
</style>
