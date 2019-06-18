<template>
  <div class="platformTagList-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <!-- 子类 -->
        <div class="common-wrap__cateTags">
          <tag-category :tagLibName="tagLibName"></tag-category
          ><!-- :tagCateId="currentGroupId" -->
        </div>
        <div class="common-wrap__opt">
          <el-input class="w-184" placeholder="搜索标签" prefix-icon="el-icon-search" v-model="tagSearch" clearable @clear="clearSearch" @keyup.enter.native="searchEnterFun"> </el-input>
          <el-button type="primary" @click="toAddMyTagLib('mult')" class="fr">添加至我的标签库</el-button>
        </div>
        <div class="common-wrap__table m-t-20">
          <el-table ref="multipleTable" :data="tagTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectChange">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column prop="tagName" label="标签名称" show-overflow-tooltip>
              <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
            </el-table-column>
            <el-table-column prop="tagDescribe" label="标签描述" show-overflow-tooltip> </el-table-column>
            <el-table-column label="是否实时">
              <template slot-scope="scope">
                {{ scope.row.isActive == 1 ? '实时' : '非实时' }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link
                  :to="{
                    path: '/platformTagDetail',
                    query: {
                      tagId: scope.row.tagId,
                      addFlag: scope.row.isAdd,
                      form: 'notMyTag',
                      navSign: 'platformTag'
                    }
                  }"
                  class="edit-btn el-button--text"
                  >详情</router-link
                >
                <el-button type="text" size="small" class="p-l-10" :disabled="scope.row.isAdd == 1" @click="toAddMyTagLib('single', scope.row.tagId)">
                  {{ scope.row.isAdd == 1 ? '已' : '' }}添加至我的标签库
                </el-button>
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
  </div>
</template>
<script>
/* eslint-disable */
import navCrumb from '@/components/nav/nav.vue';
import tagCategory from '@/components/tagCategory.vue';
// import tagTemporary from '@/components/tagTemporary.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'platformTagList',
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
          path: '/platformTagLib'
        },
        {
          name: '平台标签列表',
          path: ''
        }
      ],

      tagLibName: 'platformTag', // 面包屑分类需要的参数
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
      selTagTableData: [], // 已选择
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,
      // 子分类数据
      currentGroupId: 0 //当前分类 id, 0默认全部
    };
  },
  methods: {
    /**
     * 添加到我的标签库
     */
    toAddMyTagLib(flag, id) {
      const that = this;
      const para = {};
      if (flag === 'mult') {
        if (!that.selTagTableData.length) {
          that.$message.error({ message: '请选择标签' });
          return false;
        }
        para.tagIds = [];
        that.selTagTableData.forEach(function(ele, index) {
          para.tagIds.push(ele.tagId);
        });
        para.tagIds = para.tagIds.join(',');
        that.addByTagId('addByTagIds', para);
      } else {
        para.tagId = id;
        that.addByTagId('addByTagId', para);
      }
    },

    /**
     * 添加单个ID至我的标签库
     */
    addByTagId(name, para) {
      const that = this;
      getRequest(`/enterpriseMemberTag/${name}`, para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.getTagList();
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
     * 搜索标签
     */
    searchEnterFun(e) {
      const that = this;
      that.currentPage = 1;
      that.getTagList();
    },

    /**
     * 搜索标签清空
     */
    clearSearch() {
      const that = this;
      that.currentPage = 1;
      that.getTagList();
    },

    /**
     * 表格---多选
     */
    handleSelectChange(val) {
      const that = this;
      that.selTagTableData = val;
    },

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
        that.$router.push(
          `${that.$route.path}?tagLevelGroupId=${that.$route.query.tagLevelGroupId}&currentPage=${val}`
        );
      }
      that.getTagList();
    },

    /**
     * 获取当前分类下下的标签
     */
    getTagList(val) {
      const that = this;
      const para = {
        tagName: that.tagSearch, // 搜索字段
        tagLevelGroupId: that.currentGroupId, // 当前分类的id
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize // 一页显示个数
      };

      getRequest('/memberTag/platformTagPageList', para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tagTableData = resData.result.result;
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
    tagCategory
    // tagTemporary
  }
};
</script>
<style lang="scss" scoped></style>
