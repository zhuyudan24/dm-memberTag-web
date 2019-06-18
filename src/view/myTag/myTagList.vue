<template>
  <div class="myTagList-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <!-- <el-button @click="handleShowTag">显示</el-button> -->
        <!-- 子类 -->
        <div class="common-wrap__cateTags">
          <tag-category :tagLibName="tagLibName"></tag-category
          ><!-- :tagCateId="currentGroupId" -->
        </div>
        <div class="common-wrap__opt">
          <el-input class="w-184" placeholder="搜索标签" prefix-icon="el-icon-search" v-model="tagSearch" clearable @clear="clearSearch" @keyup.enter.native="value => searchEnterFun(value)"
            ><!-- enter. -->
          </el-input>

          <!-- <el-button type="primary" @click="toManualTagLib" class="fr m-l-8">从手工库新增</el-button>
          <el-button type="primary" @click="toPlatformTagLib" class="fr">从平台库新增</el-button> -->
        </div>
        <div class="common-wrap__table m-t-20">
          <el-table ref="multipleTable" :data="tagTableData" tooltip-effect="dark" style="width: 100%"
            ><!-- @selection-change="handleSelectChange" -->
            <!-- <el-table-column
              type="selection"
              >
            </el-table-column> -->
            <el-table-column label="标签名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="pointer name-hover" @click="addTemporary(scope.row.tagId)">{{ scope.row.tagName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tagDescribe" label="标签描述" show-overflow-tooltip> </el-table-column>
            <el-table-column label="是否实时">
              <template slot-scope="scope">
                {{ scope.row.isActive == 1 ? '实时' : '非实时' }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ path: '/myTagDetail', query: { tagId: scope.row.tagId } }" class="edit-btn el-button--text">详情</router-link>
                <el-button type="text" size="small" class="p-l-10" @click="addTemporary(scope.row.tagId)">添加至暂存架</el-button>
                <!-- <el-button type="text" size="small" class="p-l-32" @click="toDelTag(scope.row.id)">删除</el-button> -->
                <!-- 本期不做 -->
                <!-- <el-popover
                  placement="top"
                  width="160"
                  v-model="scope.row.popVisible">
                  <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelDelTag(scope.$index,scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="toDelTag(scope.$index,scope.row)">确定</el-button>
                  </div> -->
                <el-button slot="reference" class="" type="text" @click="toDelTag(scope.$index, scope.row)">
                  删除
                </el-button>
                <!-- </el-popover> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block common-wrap__page text-right" v-if="tagTableData.length != 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 标签详情缩写版 -->
    <tagShortDetail :fromFlag="fromFlag" :tagShortId.sync="tagShortDetailId" :showTagDetail="showTagDetail" @hideTag="handleHideTag" @updateTemp="updateTemp"></tagShortDetail>
    <!-- 暂存架 -->
    <tag-temporary ref="tagTemp" @showShortDetail="showShortDetail"></tag-temporary>
  </div>
</template>
<script>
/* eslint-disable */
import navCrumb from '@/components/nav/nav.vue';
import tagCategory from '@/components/tagCategory.vue';
import tagTemporary from '@/components/tagTemporary.vue';
import tagShortDetail from '@/components/tagShortDetail.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'myTagList',
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
          path: '/myTagLib'
        },
        {
          name: '我的标签列表',
          path: ''
        }
      ],

      showTagDetail: false, // 标签详情缩小版显示/隐藏
      tagShortDetailId: '', // 标签详情缩写版 id
      fromFlag: 'myTag', // 参数--来源标志

      tagLibName: 'myTag', // 面包屑分类需要的参数
      tagSearch: '', // 搜索值绑定的参数

      // 标签列表数据
      tagTableData: [
        // {
        //   tagId: 1,
        //   tagName: "123",
        //   tagDescribe: '描述描述，最多200字，一行显示50字，默认显示一行',
        //   isActive: 1,
        //   isAdd: 0,
        // }
      ],

      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 子分类数据
      currentGroupId: 0 // 当前的分类 id
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
     * 显示标签详情缩小版
     */
    handleShowTag() {
      const that = this;
      that.showTagDetail = true;
    },

    /**
     * 隐藏标签详情缩小版
     */
    handleHideTag(val) {
      const that = this;
      that.showTagDetail = false;
    },

    /**
     * 到手工标签库
     */
    toManualTagLib() {
      const that = this;
      that.changeRoute('/manualTagList');
    },

    /**
     * 到平台标签库
     */
    toPlatformTagLib() {
      const that = this;
      that.changeRoute('/platformTagList');
    },

    /**
     * 搜索标签
     */
    searchEnterFun: _debounce(function(e) {
      const that = this;
      that.currentPage = 1;
      that.getTagList();
    }, 500),

    /**
     * 搜索标签清空
     */
    clearSearch() {
      const that = this;
      that.currentPage = 1;
      that.getTagList();
    },

    /**
     * 表格---多选(无用)
     */
    // handleSelectChange(val) {
    //   var that = this
    //   console.log(val);
    // },

    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      const that = this;
      that.pageSize = val;
      that.getTagList();
    },
    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      const that = this;
      that.currentPage = val;
      let fullPath = that.$route.fullPath;
      if (fullPath.includes('?')) {
        that.$router.push(`${that.$route.path}?tagLevelGroupId=${that.$route.query.tagLevelGroupId}&currentPage=${val}`);
      }
      that.getTagList();
    },

    /**
     * 获取当前分类下下的标签
     */
    getTagList() {
      const that = this;
      const para = {
        tagName: that.tagSearch, // 搜索字段
        tagLevelGroupId: that.currentGroupId, // 当前分类的id
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize // 一页显示个数
      };

      getRequest('/enterpriseMemberTag/pageList', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result.result && !!resData.result.result.length) {
              resData.result.result.forEach(function(ele, index) {
                ele.popVisible = false;
              });
              that.tagTableData = resData.result.result;
            } else {
              that.tagTableData = [];
              that.$message.error({
                duration: 1000,
                message: '未找到数据'
              });
            }
            that.total = resData.result.totalCount;
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
     * 点击显示标签详情缩写版
     */
    addTemporary(id) {
      const that = this;
      that.tagShortDetailId = id;
      that.showTagDetail = true;
      that.$refs.tagTemp.hideTagList();
    },

    /**
     * 删除当前标签 -- 取消
     */
    cancelDelTag(index, row) {
      row.popVisible = false;
    },

    /**
     * 删除当前标签 -- 确定
     */
    toDelTag(index, row) {
      const that = this;
      that
        .$confirm('确认要删除此标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postToDelTag(index, row);
        })
        .catch(() => {});
    },

    /**
     * 删除当前标签 -- api
     */
    postToDelTag(index, row) {
      const that = this;
      const para = {
        enterpriseMemberTagId: row.enterpriseMemberTagId
      };
      getRequest('/enterpriseMemberTag/del', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.tagTableData.splice(index, 1);
            that.$refs.tagTemp.getTagList();
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
     * 子组件暂存架-点击名字显示标签详情缩略版
     */
    showShortDetail(val) {
      const that = this;
      that.showTagDetail = true;
      that.tagShortDetailId = val;
    },

    /**
     * 子组件添加到暂存架-更新暂存架
     */
    updateTemp() {
      const that = this;
      that.$refs.tagTemp.getTagList();
      that.$refs.tagTemp.showTagList();
    },

    getUrlParams() {
      const that = this;
      // 获取标签库中传递的搜索字段
      that.tagSearch = !!that.$route.query.searchName ? that.$route.query.searchName : '';
      // 获取标签库传递过来的分类 id
      that.currentGroupId = !!that.$route.query.tagLevelGroupId ? that.$route.query.tagLevelGroupId : 0;
      // 获取页码
      that.currentPage = !!that.$route.query.currentPage ? parseInt(that.$route.query.currentPage) : 1;
      that.getTagList();
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        const that = this;
        that.getUrlParams();
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    const that = this;
    that.getUrlParams();
  },
  components: {
    navCrumb,
    tagShortDetail,
    tagCategory,
    tagTemporary
  }
};
</script>
<style lang="scss" scoped></style>
