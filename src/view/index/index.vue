<template>
  <div id="index">
    <vue-gic-header :projectName="projectName" :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>
    <div id="content" class="content">
      <div class="content-body" :style="{ height: contentHeight }">
        <!-- <div class="left-menu" :style="{ height: contentHeight }">
          <vue-gic-aside-menu ref="asideMenu" :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="collapseFlag"></vue-gic-aside-menu>
        </div> -->
        <transition name="fade" mode="out-in">
          <!-- 缓存已经填好内容的页面 -->
          <!-- <keep-alive include="editGroupGrade"> -->
          <router-view></router-view>
          <!-- </keep-alive > -->
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import * as types from '@/store/types';
export default {
  name: 'App',
  data() {
    return {
      projectName: 'member-tag',
      contentHeight: '0px', //页面内容高度
      // 路由菜单
      // menuRouter: [
      //   {
      //       "menuCode": "m06",
      //       "menuName": "企业管理",
      //       "project": "gic-web",
      //       "menuUrl": "",
      //       "target": 0,
      //       "iconUrl": "",
      //       "parentCode": "0",
      //       "isRouter": 1,
      //       "level": 1,
      //       "level4List": null
      //   },
      //   {
      //       "menuCode": "xcx_01",
      //       "menuName": "小程序配置",
      //       "project": "gic-web",
      //       "menuUrl": "themeSetting",
      //       "target": 0,
      //       "iconUrl": "",
      //       "parentCode": "m08",
      //       "isRouter": 1,
      //       "level": 2,
      //       "level4List": null
      //   },
      //   {
      //       "menuCode": "m10",
      //       "menuName": "好办后台",
      //       "project": "gic-web",
      //       "menuUrl": "",
      //       "target": 0,
      //       "iconUrl": "",
      //       "parentCode": "0",
      //       "isRouter": 1,
      //       "level": 1,
      //       "level4List": null
      //   },
      //
      // ],
      // 左侧
      collapseFlag: false, // 折叠参数
      // 模块名
      leftModulesName: '会员标签'
      // 路由菜单
      // leftMenuRouter: [
      //  {
      //       "menuCode": "xcx_02",
      //       "menuName": "会员服务",
      //       "project": "gic-clique",
      //       "menuUrl": "themeSetting",
      //       "target": 0,
      //       "iconUrl": "icon-shequ-zhutifenxiang",
      //       "parentCode": "xcx_01",
      //       "isRouter": 1,
      //       "level": 3,
      //       "level4List": [
      //         {
      //             "menuCode": "xcx_06",
      //             "menuName": "会员成就",
      //             "project": "gic-clique",
      //             "menuUrl": "memberAchievement",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         },
      //         {
      //             "menuCode": "xcx_06",
      //             "menuName": "会员任务",
      //             "project": "gic-clique",
      //             "menuUrl": "memberTask",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         },
      //       ]
      //   },

      //   {
      //       "menuCode": "xcx_05",
      //       "menuName": "会员制度",
      //       "project": "gic-clique",
      //       "menuUrl": "",
      //       "target": 0,
      //       "iconUrl": "icon-huiyuan-",
      //       "parentCode": "xcx_01",
      //       "isRouter": 1,
      //       "level": 3,
      //       "level4List": [
      //         {
      //             "menuCode": "xcx_06",
      //             "menuName": "集团信息",
      //             "project": "gic-clique",
      //             "menuUrl": "companyGroup",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         },
      //         {
      //             "menuCode": "xcx_07",
      //             "menuName": "会员卡设置",
      //             "project": "gic-clique",
      //             "menuUrl": "memberCardSet",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         },
      //         {
      //             "menuCode": "xcx_07",
      //             "menuName": "积分制度",
      //             "project": "gic-clique",
      //             "menuUrl": "pointSystem",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         },
      //         {
      //             "menuCode": "xcx_07",
      //             "menuName": "附近门店",
      //             "project": "gic-clique",
      //             "menuUrl": "nearStoreSet",
      //             "target": 0,
      //             "iconUrl": "",
      //             "parentCode": "xcx_05",
      //             "isRouter": 1,
      //             "level": 4,
      //             "level4List": null
      //         }
      //       ]
      //   }
      // ]
    };
  },
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      let that = this;
      // 模拟检查数据
      // //有两个参数
      //{
      //  name:,
      //  path:
      //}
      that.$router.push({
        path: val.path
      });
    },
    // 折叠事件
    collapseTag(val) {
      let that = this;
      that.collapseFlag = val;
    }
  },
  watch: {
    // $route: {
    //   handler: function(val, oldVal) {
    //     this.$refs.asideMenu.refreshRoute();
    //   },
    //   // 深度观察监听
    //   deep: true
    // }
  },
  mounted() {
    let that = this;
    that.$store.commit(types.TITLE, '达摩GIC');
    document.title = this.$store.state.title;
    //获取项目名 pathname (路由的hash)
    that.pathName = window.location.hash.split('/')[1];
    that.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';
  },
  components: {}
};
</script>
<style type="text/scss" lang="scss">
#index {
  .content {
    padding-top: 64px;
    /* height: calc(100% - 64px);
    overflow-y: auto;*/
    min-width: 1400px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .content-body {
      display: flex;
      overflow: hidden;

      .right-wrap {
        flex: 1;
        overflow: auto;
        width: 100%;

        .right-content {
          width: 100%;
          padding: 24px;
          min-height: 615px;
        }
        &.near-store-contain {
          .right-content {
            min-height: 570px;
          }
        }

        /deep/ .el-tabs__nav {
          z-index: 1;
        }
      }

      .content-body .left-menu {
        -ms-flex: 0 0 200px;
        flex: 0 0 200px;
        width: 200px;
        height: 100%;
        background: #020b21;
        transition: all 0.2s ease;
        position: fixed;
        z-index: 5;
      }

      .common-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .right-content {
          /*width: 100%;*/
          padding: 24px;
          min-height: calc(100% - 240px);

          .right-box {
            background: #fff;
            padding: 24px;
          }
        }
      }
    }
  }

  /deep/ .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }

  /* 表格为空 */
  /deep/ .el-table__empty-block {
    height: 256px;
  }
}

.el-table__empty-block {
  height: 256px;
}

.el-table__empty-text {
  width: auto;
  margin-bottom: 80px;
  &::before {
    content: ' ';
    display: block;
    width: 60px;
    height: 60px;
    background: url(../../assets/no-data_icon.png) no-repeat center;
    margin: 0px auto 22px auto;
  }
}

.el-submenu__title {
  height: 40px;
  line-height: 40px;
}

.user-header-pop {
  min-width: 95px;
}
.el-popover.user-header-pop {
  min-width: 95px;
}

.left-aside-contain {
  /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
}

.el-menu.el-menu--popup {
  background: #020b21;
  border-radius: 4px;
}

/* 输入框 focus*/
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #dcdfe6;
}

/* 箭头*/
.icon-to-pre {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.icon-to-next {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

/*树形*/
.vue-treeselect /deep/ {
  /deep/ .vue-treeselect__control {
    height: 36px;
    /*line-height: 36px;*/
    cursor: pointer;
  }

  .vue-treeselect__placeholder {
    line-height: 36px;
    font-size: 12px;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect__multi-value {
    line-height: 1;
  }

  span.vue-treeselect__multi-value-label {
    line-height: 1;
  }

  .vue-treeselect__multi-value-item {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f0f2f5;
    color: #909399;
  }

  .vue-treeselect__value-remove {
    color: #909399;
  }

  &:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover {
    background-color: #f0f2f5;
    color: #909399;
  }

  .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
    cursor: pointer;
  }

  .vue-treeselect__control-arrow {
    display: none;
  }

  .vue-treeselect__control-arrow-container {
    position: relative;
  }

  /deep/.vue-treeselect__control-arrow-container:after,
  .vue-treeselect__control-arrow-container:before {
    border: 6px solid transparent;
    border-left: 6px solid #fff;
    width: 0;
    height: 0;
    position: absolute;
    top: 49%;
    left: 50%;
    margin-left: -6px;
    content: ' ';
    margin-top: -3px;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  /deep/ .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 52%;
  }

  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:after,
  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    margin-top: -6px;
    -webkit-transform: rotateZ(-90deg);
    -moz-transform: rotateZ(-90deg);
    -o-transform: rotateZ(-90deg);
    transform: rotateZ(-90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 47%;
  }

  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 0;
  }
}

/* 富文本编辑器 */
.mce-tinymce {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.channelicon {
  width: 20px;
  height: 20px;
  display: inline-block;
}

/* 已使用小程序 */
.xcxicon {
  background: url('../../assets/group/status@xcx.png') no-repeat 50%;
}
/* 未使用小程序 */
.xcxicongray {
  background: url('../../assets/group/status@xcxgray.png') no-repeat 50%;
}
/* 已关注公众号 */
.gzhicon {
  background: url('../../assets/group/status@gzh.png') no-repeat 50%;
}
/* 取消关注公众号 */
.gzhiconcanclegray {
  background: url('../../assets/group/status@gzhcanclegray.png') no-repeat 50%;
}
/* 未关注 */
.gzhicongray {
  background: url('../../assets/group/status@gzhgray.png') no-repeat 50%;
}
/* 淘宝 */
.taobaoicon {
  background: url('../../assets/group/channel@taobao.png') no-repeat 50%;
}
.taobaoicongray {
  background: url('../../assets/group/channel@taobaogray.png') no-repeat 50%;
}
/* 京东 */
.jdicon {
  background: url('../../assets/group/channel@jd.png') no-repeat 50%;
}
.jdicongray {
  background: url('../../assets/group/channel@jdgray.png') no-repeat 50%;
}
/* 唯品会 */
.vipicon {
  background: url('../../assets/group/channel@vip.png') no-repeat 50%;
}
.vipicongray {
  background: url('../../assets/group/channel@vipgray.png') no-repeat 50%;
}
</style>
