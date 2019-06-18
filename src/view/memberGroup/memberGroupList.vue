<template>
  <div class="memberGroupList-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <!-- 左边的会员分组 -->
      <div class="left-box">
        <group-list @getRecommend="getRecommend" @second-list="getsecondList"></group-list>
      </div>
      <!-- 右边的表格 -->
      <div class="right-box" v-show="!isRecommend">
        <div class="common-wrap__opt">
          <el-input
            class="w-220 m-r-8"
            placeholder="请输入关键字搜索人群"
            prefix-icon="el-icon-search"
            v-model="tagSearch"
            clearable
            @clear="clearSearch"
            @keyup.enter.native="searchEnterFun"
          />
          <el-select v-model="statusSelect" @change="searchByStatus" placeholder="请选择" class="w-220 m-l-0">
            <el-option :key="0" label="失效" :value="0"> </el-option>
            <el-option :key="1" label="有效" :value="1"> </el-option>
            <el-option key="" label="全部" value=""> </el-option>
          </el-select>
          <div class="batch-option">

            <!-- <el-cascader
              placeholder="批量操作"
              class="w-180 m-l-0"
              :options="options"
              v-model="batchSelect"
              @focus="handleFocus"
              :props="props"
              @change="batchHandleSelect">
            </el-cascader> -->

            <el-select v-model="batchSelect" @change="batchHandleSelect" @focus="handleFocus" placeholder="批量操作" class="w-180 m-l-0">
              <el-option :key="0" label="失效" :value="0"> </el-option>
              <el-option :key="1" label="删除" :value="1"> </el-option>
              <el-option :key="2" label="修改所属分类" :value="2"> </el-option>
            </el-select>
            <el-button type="primary" @click="toAddGroup" class="fr">新增分组</el-button>
          </div>
        </div>
        <div class="common-wrap__table m-t-20">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="groupTableData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="分组名称" >
              <template slot-scope="scope">
                <el-popover placement="top-start" width="200" trigger="hover">
                  <div>
                    <p>名称：{{ scope.row.groupName }}</p>
                    <p>描述：{{ scope.row.describle }}</p>
                  </div>
                  <router-link class="a-href" slot="reference" :to="`/memberGroupDetail?memberTagGroupId=${scope.row.memberTagGroupId}`">
                    {{ scope.row.groupName }}
                  </router-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="是否实时" >
              <template slot-scope="scope">
                {{ scope.row.isRealTime === 1 ? '实时' : '非实时' }}
              </template>
            </el-table-column>
            <el-table-column label="最近更新时间">
              <template slot-scope="scope">
                <p class="h-18">{{ scope.row.latestUpdateTime | formatTimeYMD }}</p>
                <p class="h-18">{{ scope.row.latestUpdateTime | formatTimeHMS }}</p>
              </template>
            </el-table-column>
            <el-table-column label="更新频率">
              <template slot-scope="scope">
                {{scope.row | formatUpdateFrequency}}
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" >
              <template slot-scope="scope">
                <span :class="scope.row.effectiveStatus == 1 ? 'dm-status--success' : 'dm-status--error'"></span>
                {{ scope.row.effectiveStatus == 1 ? '有效' : '失效' }}
              </template>
            </el-table-column>
            <el-table-column prop="peopleCover" label="覆盖人数" show-overflow-tooltip >
              <template slot="header">
                覆盖人数
                <el-popover width="260" trigger="hover">
                  <div style="color: #909399;">
                    默认显示上次页面缓存人数，可点击刷新按钮查看当页分组最新人数。
                  </div>
<!--                  <el-button type="text" @click="refershMember">刷新</el-button>-->
                  <i slot="reference" class="iconfont icon-zhongzhi refresh" @click="refershMember"></i>
                </el-popover>
              </template>

              <template slot-scope="scope">
                {{ (scope.row.memberCount || 0) | formatNum }} 人
              </template>
            </el-table-column>
            <el-table-column prop="appStatus" label="好办展示" >
              <template slot-scope="scope">
                <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.appStatus" active-color="#1890ff" @change="switchAppStatus(scope.row.appStatus, scope.row)"> </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">
                <p class="h-18">{{ scope.row.createTime | formatTimeYMD }}</p>
                <p class="h-18">{{ scope.row.createTime | formatTimeHMS }}</p>
              </template>
            </el-table-column>

            <el-table-column prop="recentUpdateDate" label="到期时间">
              <template slot-scope="scope">
                <p class="h-18">{{ scope.row.effectiveDate | formatTimeYMD }}</p>
                <p class="h-18">{{ scope.row.effectiveDate | formatTimeHMS }}</p>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <router-link
                  :to="`/memberGroupDetail?memberTagGroupId=${scope.row.memberTagGroupId}`"
                  class="edit-btn el-button--text p-r-12"
                >
                  详情
                </router-link>
                <router-link
                  :to="`/memberGroupEdit?memberTagGroupId=${scope.row.memberTagGroupId}`"
                  class="edit-btn el-button--text p-r-12"
                >
                  编辑
                </router-link>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="block common-wrap__page text-right" v-if="groupTableData.length != 0">
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

      <div class="right-box recommend-box" v-show="isRecommend">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane :label="item.recommendName" :name="item.recommendName" v-for="item in recommendItems" :key="item.tagGroupRecommendId">
            <recommend-table :data="recommendData"></recommend-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <batch-list :batchVisiable.sync="batchVisiable" @refresh-list="refreshList" :operateNumber="operateNumber" :multipleSelection="multipleSelection"></batch-list>
  </div>
</template>
<script>
import BatchList from '@/components/tag/batch-list';
import navCrumb from '@/components/nav/nav.vue';
import errMsg from '@/common/js/error';
import timeFormat from '@/common/js/timeFormat';
import { getRequest } from '@/api/api';
import { recommendList, recommendGroupList, findSecondMemberList, refershMemberCount, memberTagGroupList, memberGroupList } from '@/request/api';
import GroupList from './group-list';
import RecommendTable from './recommend-table';

export default {
  name: 'memberGroupList',
  components: {
    navCrumb,
    GroupList,
    RecommendTable,
    BatchList
  },
  data() {
    return {
      operateNumber: -1,
      batchVisiable: false,
      dialogVisible: true,
      isRecommend: false,
      recommendItems: [],
      recommendData: [], // 推荐分组的数据
      activeName: '',
      // options: [
      //   {
      //     value: '0',
      //     classifyName: '失效'
      //   },
      //   {
      //     value: '1',
      //     classifyName: '删除'
      //   },
      //   {
      //     value: '2',
      //     classifyName: '修改所属分类',
      //     children: []
      //   },
      // ],
      // props: {
      //   label: 'classifyName',
      //   children: 'children'
      // },
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
          name: '会员分组',
          path: ''
        }
      ],

      tagSearch: '', // 搜索值绑定的参数

      // 会员分组列表数据
      groupTableData: [],

      multipleSelection: [], // 表格的多选框批量操作

      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,
      groupSetShow: false,
      loading: false,
      statusSelect: '',
      batchSelect: ''
    };
  },

  watch: {
    tagSearch(newval) {
      this.params.groupName = newval;
    },
    batchVisiable(newval) {
      if (!newval) {
        this.batchSelect = '';
      }
    }
  },

  filters: {
    formatTimeYMD(data) {
      return data && data != '- -' ? data.split(' ')[0] : '--';
    },
    formatTimeHMS(data) {
      return data && data != '- -' ? data.split(' ')[1] : '--';
    },
    formatNum(data) {
      const reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (data + '').replace(reg, '$&,');
    },
    formatUpdateFrequency(rowData) {
      const { updateType, updateDay, isRealTime } = rowData;
      if (isRealTime === 1) {
        return '--'
      }
      switch (updateType) {
        case 1:
          return '每天一次';
        case 2:
          let weekArr = ['一', '二', '三', '四', '五', '六', '日'];
          return updateDay ? `每周${weekArr[updateDay - 1]}` : '每周一次';
        case 3:
          return updateDay ? `每月${updateDay}号` : '每月一次';
        default:
          return '--';
      }
    }
  },

  methods: {
    getMemberGroupList() {
      memberGroupList({
        requestProject: 'gic-member-tag-web'
      }).then(res => {
        if (res.errorCode === 1) {
          this.options[2].children = res.result.filter(el => el.classifyName != '未分类');
        }
      });
    },
    refershMember() {
      let Ids = this.groupTableData.map(el => el.memberTagGroupId).join(',');
      const param = {
        requestProject: 'gic-member-tag-web',
        memberTagGroupIds: Ids
      };
      refershMemberCount(param).then(res => {
        if (res.errorCode == 1) {
          this.getGroupList(this.params);
          this.$message.success({message: '更新成功'});
        }
      });
    },
    refreshList() {
      this.getGroupList();
    },
    // 会员分组二级
    getsecondList(list) {
      this.isRecommend = false;
      this.params.memberTagGroupClassifyId = list.memberTagGroupClassifyId;
      findSecondMemberList(this.params).then(res => {
        if (res.errorCode == 1) {
          this.total = res.result.totalCount;
          this.groupTableData = res.result.result.map(el => ({
            ...el,
            createTime: timeFormat.timeToDateTime(el.createTime)
          }));
        } else {
          this.groupTableData = [];
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 切换推荐分组
    handleTabClick(instance) {
      let tabId = this.checkTabIndex(instance);
      if (tabId) {
        this.getRecommendList(tabId);
      }
    },
    // 查找列表请求需要的id
    checkTabIndex(instance) {
      let index = this.recommendItems.findIndex(el => el.recommendName == instance.name);
      if (index >= 0) {
        return this.recommendItems[index].tagGroupRecommendId;
      }
    },
    // 推荐分组
    getRecommend() {
      this.isRecommend = true;
      recommendGroupList().then(res => {
        if (res.errorCode == 1) {
          this.recommendItems = res.result;
          if (this.recommendItems && this.recommendItems.length) {
            this.activeName = this.recommendItems[0].recommendName;
            // 查第一个列表的数据
            this.getRecommendList(this.recommendItems[0].tagGroupRecommendId);
          } else {
            this.recommendItems = [];
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    /**
     * 推荐分组列
     */
    getRecommendList(id) {
      const param = {
        tagGroupRecommendId: id,
        requestProject: 'gic-member-tag-web',
      };
      recommendList(param).then(res => {
        if (res.errorCode == 1) {
          this.recommendData = res.result;
        } else {
          this.recommendData = [];
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 勾选框全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 批量操作
     */
    handleFocus() {
      if (!this.multipleSelection.length) {
        this.batchSelect = '';
        this.$message.warning({
          message: '请先勾选分组',
          duration: 2000
        });
        return false;
      }
    },
    batchHandleSelect(val) {
      if (!this.multipleSelection.length) {
        this.batchSelect = '';
        this.$message.warning({
          message: '请先勾选分组',
          duration: 2000
        });
        return false;
      } else {
        this.operateNumber = val;
        this.batchVisiable = true;
      }
    },

    /**
     *
     */
    showGroupSet() {
      this.groupSetShow = true;
    },

    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     * 新增分组
     */
    toAddGroup() {
      this.changeRoute('/memberGroupEdit');
    },

    /**
     * 搜索分组清空
     */
    clearSearch() {
      this.currentPage = 1;
      this.params.pageNum = 1;
      this.getGroupList();
    },

    /**
     * 搜索分组
     */
    searchEnterFun(e) {
      this.currentPage = 1;
      this.params.pageNum = 1;
      this.getGroupList();
    },

    /**
     * 分页--- 一页多少条
     */
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.pageSize = val;
      this.getGroupList();
    },

    /**
     * 分页--- 当前第几页
     */
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.currentPage = val;
      this.getGroupList();
    },

    /**
     * 点击失效
     */
    toInvalid(info) {
      // console.log(info, "thisGroup");
      const that = this;
      that
        .$confirm('该分组失效后，不再更新数据，确认要失效吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.loading = true;
          let pramas = {
            effectiveStatus: '0',
            memberTagGroupId: info.memberTagGroupId
          };
          that.updateGroup(pramas, info);
        })
        .catch(() => {});
    },

    /**
     * 更新好办展示状态
     */
    switchAppStatus(status, obj) {
      const that = this;
      that.loading = true;
      // const appStatus = status ? 1 : 0;
      const memberTagGroupId = obj.memberTagGroupId;
      let param = {
        memberTagGroupId,
        appStatus: status
      };
      that.updateGroup(param, obj);
    },

    /**
     * 刷新当前分组
     */
    refreshGroup(obj) {
      // console.log(obj);
      const that = this;
      that.loading = true;
      const memberTagGroupId = obj.memberTagGroupId;
      let params = {
        memberTagGroupId
      };
      getRequest('/member-tag-member/getMemberCountByGroupId.json', params)
        .then(res => {
          // console.log(res, 'count');
          obj.memberCount = res.data.result;
          that.loading = false;
          // let param = {
          //   memberTagGroupId,
          //   memberCount: res.data.result.page.totalCount
          // };
          // that.updateGroup(param, obj);
        })
        .catch(e => {
          that.loading = false;
          // console.log(e, 'error');
        });
    },

    /**
     * 简单更新当前分组 -- 失效/更改人数
     */
    updateGroup(pramas, info) {
      const that = this;
      getRequest('/member-tag-group/simpleUpdate.json', pramas)
        .then(res => {
          // console.log(res, 'updateResult');
          info.effectiveStatus = pramas.effectiveStatus || info.effectiveStatus;
          info.memberCount =
            pramas.memberCount || pramas.memberCount == 0 ? pramas.memberCount : info.memberCount;
          that.loading = false;
          that.$message.success({
            duration: 1000,
            message: '操作成功！'
          });
          that.loading = false;
        })
        .catch(e => {
          // console.log(e, 'error');
          that.loading = false;
        });
    },

    /**
     * 删除当前分组 -- 取消
     */
    cancelDelTag(index, row) {
      row.popVisible = false;
    },

    /**
     * 删除当前分组 -- 确定
     */
    toDelTag(obj, index) {
      const that = this;
      that
        .$confirm(
          `该分组覆盖${that.$options.filters['formatNum'](
            obj.memberCount || 0
          )}人，一旦删除无法恢复，确认要删除吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          // that.groupTableData.splice(index,1)
          that.loading = true;
          that.delGroup(obj.memberTagGroupId, index);
        })
        .catch(() => {});
    },

    /**
     * 删除当前分组 -- API
     */
    delGroup(id, index) {
      const that = this;
      const para = {
        memberTagGroupId: id // 搜索字段
      };
      getRequest('/member-tag-group/delete.json', para)
        .then(res => {
          // console.log(res, "delResult");
          var resData = res.data;
          that.loading = false;
          if (resData.errorCode == 1) {
            that.groupTableData.splice(index, 1);
            that.$message.success({
              duration: 1000,
              message: '删除成功！'
            });
            return;
          } else if (resData.errorCode == 200003) {
            that.$confirm(`该分组正在被活动使用，无法删除！`, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.loading = false;
          // console.log(error);
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    /**
     * 通过状态筛选列表
     */
    searchByStatus(val) {
      this.params.effectiveStatus = val;
      this.getGroupList();
    },
    /**
     * 获取列表数据
     */
    getGroupList() {
      memberTagGroupList(this.params).then(res => {
        if (res.errorCode == 1) {
          this.total = res.result.totalCount;
          this.groupTableData = res.result.result.map(el => ({
            ...el,
            latestUpdateTime: !!el.latestUpdateTime ? el.latestUpdateTime : '--',
            createTime: timeFormat.timeToDateTime(el.createTime)
          }));
        }
        this.loading = false;
      }).catch(err => {
        console.log(err);
      });
    }
  },
  created() {
    this.loading = true;
    this.params = {
      groupName: this.tagSearch,
      pageSize: 20,
      pageNum: 1,
      effectiveStatus: this.statusSelect,
      requestProject: 'gic-member-tag-web',
      memberTagGroupClassifyId: '0'
    };
  },
  mounted() {
    this.getGroupList();
    // this.getMemberGroupList();
  }
};
</script>
<style lang="scss">
.common-wrap__opt {
  font-size: 0;
  .m-r-8 {
    margin-right: 8px;
  }
}
.h-18 {
  font-size: 13px;
  height: 18px;
  line-height: 18px;
}
.right-content {
  display: flex;
  .left-box {
    flex: 0 0 200px;
    width: 200px;
    background-color: #fff;
    border-right: 1px solid rgba(220,223,230,1);
  }
  .right-box {
    flex: 1 1 1200px;
    min-width: 1200px;
    .batch-option {
      float: right;
      .fr {
        margin-left: 10px;
      }
    }
    .refresh {
      color: #909399;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
