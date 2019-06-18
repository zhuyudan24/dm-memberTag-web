<template>
  <div class="navwrap boxbttom">
    <el-breadcrumb separator="/">
      <template v-for="(item, index) in navpath">
        <template v-if="!!item.path">
          <!-- <el-breadcrumb-item :data-v="item.path" :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item> -->
          <el-breadcrumb-item :key="item.name + index" :to="{ path: item.path }" @click="changeRoute(item.path, item.relocation)"
            ><span class="el-breadcrumb__inner is-link" @click="changeRoute(item.path, item.relocation)">{{ item.name }}</span></el-breadcrumb-item
          >
        </template>
        <template v-else>
          <el-breadcrumb-item :key="item.name + index">{{ item.name }}</el-breadcrumb-item>
        </template>
      </template>

      <!-- :to="{ path: item.path}"-->
    </el-breadcrumb>
    <h1 class="navtitle">{{ navpath[navpath.length - 1].name }}</h1>
    <div class="navtip navmTop" v-if="navtip == true">
      <i class="el-icon-info navtipcolor"></i>变更导航个数，移动顺序，更换页面链接均需提交小程序审核后重新发布生效，其他变更立即生效。小程序审核请联系品牌项目经理。
    </div>
  </div>
</template>

<script>
import { postRequest } from '@/api/api';
import errMsg from '@/common/js/error';
export default {
  name: 'navpath',
  data() {
    return {
      projectName: 'member' // 当前项目名
      // navpath: [
      //   {
      //     name: '首页',
      //     path: ''
      //   },
      //   {
      //     name: '会员标签',
      //     path: ''
      //   },

      // ],
    };
  },
  props: {
    navpath: {
      type: Array,
      default() {
        return [];
      }
    },
    navtip: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 使用点击事件手动控制路由跳转，所以el-breadcrumb-item标签中无需再用to属性绑定跳转路径
     * 我需要去掉to属性吗？我也很纠结。。。
     * */
    changeRoute(path, relocation) {
      let that = this;
      if (relocation) {
        window.location.href = path;
      } else {
        that.$router.push(path);
      }
    },
    // get nav path
    getNavPath() {
      let that = this;
      let para = {
        project: that.projectName,
        path: that.$route.path.split('/')[1]
      };

      postRequest('/api-auth/get-current-memu-data', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (!resData.result) {
              return;
            }
            that.navpath = [];
            if (!!resData.result.list && !!resData.result.list.length) {
              resData.result.list.forEach(function(ele, index) {
                ele.name = ele.menuName;
                ele.path = '';
                if (index == resData.result.list.length - 1) {
                  ele.path = '/' + ele.menuUrl;
                }
                if (index > 0) {
                  that.navpath.push(ele);
                }
              });
              // that.navpath = resData.result.list
            }
            // that.navpath[0].name = resData.result.level2.menuName;
            // that.navpath[0].path = ''
            // that.navpath[1].name = resData.result.level3.menuName;
            // that.navpath[1].path = ''
            // if (!!resData.result.level4) {
            //   that.navpath[2] = {
            //     name:'',
            //     path: ''
            //   }
            //   that.navpath[2].name = resData.result.level4.menuName;
            //   that.navpath[2].path = ''
            // }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  mounted() {
    // var that = this;
    // that.getNavPath();
  }
};
</script>

<style scoped>
.navwrap {
  padding: 20px 24px;
  /*margin-top: 20px;*/
  background-color: #fff;
  border-radius: 2px;
}
.boxbttom {
  border-bottom: 1px solid #e4e7ed;
}
.boxshow {
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 5px -1px 5px #dfdfdf;
}
.navtitle {
  margin: 24px 0 0 0;
  font-size: 20px;
  color: #303133;
  font-weight: 500;
}
.navtip {
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 13px;
  border-radius: 2px;
  color: #606266;
  background-color: #f4f4f5;
}
.navmTop {
  margin-top: 25px;
}
.navtipcolor {
  margin: 0 12px;
  color: #1890ff;
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  color: #303133;
}
</style>
