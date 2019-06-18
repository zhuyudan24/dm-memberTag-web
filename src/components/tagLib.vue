<!--
    公共标签库组件,通过 tagCategory 参数不同,区分不同的标签库,请求不同的标签库字段
 -->
<template>
  <div class="common-wrap__temp">
    <div class="common-wrap__opt">
      <el-input class="w-184" placeholder="搜索标签" prefix-icon="el-icon-search" v-model="tagSearch" clearable @clear="clearSearch" @keyup.enter.native="searchEnterFun"> </el-input>
      <el-button v-if="tagCategory != 'myTagList'" type="primary" @click="toAddMyTagLib" class="fr">添加至我的标签库</el-button>
      <!-- <el-button v-if="tagCategory == 'myTagList'" type="primary" @click="changeRoute('/manualTagLib')" class="fr">前往手工标签库</el-button>
      <el-button v-if="tagCategory == 'myTagList'" type="primary" @click="changeRoute('/platformTagLib')" class="fr m-r-8">前往平台标签库</el-button> -->
    </div>
    <div class="common-libFields flex">
      <template v-for="(item, pindex) in libDatas">
        <div :class="['common-lib__cell', 'flex-1', item.id == libRadio ? 'border-primary-color' : '']" :key="pindex" @click.stop="selectTag(item.id)">
          <div class="border-box common-lib__cell__head">
            <a @click="changeRoute('/' + tagCategory + '?tagLevelGroupId=' + item.id)" class="block"
              ><i :class="['iconfont', 'common-lib__cell__icon', item.icon]"></i><span class="common-lib__cell__name">{{ item.name }}</span
              ><span class="platformTagLib-wrap__cell__icon fr"><i class="el-icon-arrow-right"></i></span>
            </a>
          </div>
          <div class="border-box common-lib__cell__body">
            <template v-for="(itemTwo, cindex) in item.children">
              <div class="border-box common-lib__cell__fieldRow" :key="cindex">
                <div class="inline-block common-lib__cell__fieldChild">
                  <a @click="changeRoute('/' + tagCategory + '?tagLevelGroupId=' + itemTwo.id)" class="inline-block common-lib__cell__name">{{ itemTwo.name }}</a
                  ><i class="el-icon-arrow-right"></i>
                </div>
                <div class="inline-block common-lib__cell__fieldLastChild">
                  <template v-for="(itemThree, lindex) in itemTwo.children">
                    <a @click="changeRoute('/' + tagCategory + '?tagLevelGroupId=' + itemThree.id)" :key="itemThree.id + lindex" class="inline-block common-lib__cell__fieldName">{{ itemThree.name }}</a>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div class="platformTagLib-wrap__cell__radio common-lib__cell__radio" v-if="tagCategory != 'myTagList'">
            <!-- <el-radio v-model="libRadio" :label="item.id" name=""> </el-radio> -->
            <!-- 新增选中 -->
            <div class="platformTagLib-wrap__box__triangle" v-if="item.id == libRadio">
              <div class="platformTagLib-wrap__box__outer">
                <i class="el-icon-upload-success el-icon-check"></i>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'platformTagLib',
  props: {
    tagCategory: {
      type: String
    }
  },
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: ''
        },
        {
          name: '会员标签',
          path: ''
        }
      ],
      tagSearch: '', // 标签搜索参数
      libRadio: '', //单选的参数

      // 标签库数据
      libDatas: []
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
     * 路由跳转
     */
    selectTag(id) {
      const that = this;
      if (that.tagCategory == 'myTagList') {
        return false;
      }
      that.libRadio = that.libRadio == id ? '' : id;
    },

    /**
     * 添加到我的标签库
     */
    toAddMyTagLib() {
      const that = this;
      if (!that.libRadio) {
        that.$message.error({
          duration: 1000,
          message: '请选择分类'
        });
        return false;
      }
      const para = {
        tagLevelGroupId: that.libRadio
      };
      getRequest('/enterpriseMemberTag/addByLevelGroupId', para)
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
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
     * 搜索标签清空
     */
    /* eslint-disable */
    clearSearch() {
      const that = this;
    },

    /**
     * 搜索标签
     */
    searchEnterFun(e) {
      const that = this;
      let searchVal = String(e.target.value).trim();
      if (!searchVal) {
        return false;
      }
      window.location.href = `${window.location.origin}/member-tag/#/${that.tagCategory}?searchName=${searchVal}`;
    },

    /**
     * 点击分类到列表
     */
    /* eslint-disable */
    toPlatformTagList() {},

    /**
     * 获取标签库数据
     */
    getTagLib(url) {
      const that = this;
      const para = {};
      getRequest(url, para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.libDatas = resData.result;
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
    const that = this;
    if (that.tagCategory == 'platformTagList') {
      that.getTagLib('/memberTag/platformHomePage');
    }
    if (that.tagCategory == 'manualTagList') {
      that.getTagLib('/memberTag/handHomePage');
    }
    if (that.tagCategory == 'myTagList') {
      that.getTagLib('/enterpriseMemberTag/homePage');
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.common-lib__cell__head {
  &:hover {
    .common-lib__cell__icon {
      color: #1890ff;
    }
    .common-lib__cell__name {
      color: #1890ff;
    }
  }
}

.common-lib__cell__name {
  &:hover {
    color: #1890ff;
  }
}

.common-lib__cell {
  cursor: pointer;
  &:hover {
    border-color: #1890ff;
  }

  .common-lib__cell__fieldName {
    &:hover {
      color: #1890ff;
    }
  }
}

.platformTagLib-wrap {
  &__cell {
    &__head {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    &__icon {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      color: #c0c4cc;
    }

    &__body {
      cursor: pointer;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    &__fieldRow {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    &__fieldChild {
      i {
        font-weight: normal;
        color: #c0c4cc;
      }
    }
  }
  .common-lib__cell__radio {
    right: 0;
    bottom: 0;
  }

  &__box__triangle {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__box__outer {
    position: absolute;
    right: -16px;
    bottom: -6px;
    width: 40px;
    height: 20px;
    background: #1890ff;
    text-align: center;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    transform: rotate(-45deg);

    i {
      position: absolute;
      top: 1px;
      left: 15px;
      font-size: 12px;
      color: #fff;
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
</style>
