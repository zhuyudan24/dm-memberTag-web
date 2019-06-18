<!--
    公共暂存架组件
    <tag-temporary @showShortDetail="showShortDetail"></tag-temporary>
    import tagTemporary from '@/components/tagTemporary.vue';
 -->
<template>
  <div class="common-wrap__fix">
    <div class="common-wrap__fix__div">
      <div class="common-wrap__fix__showSection clearfix">
        <div class="common-wrap__fix__left" @click.stop="toggleTagList">
          <i class="iconfont icon-17 inline-block"></i
          ><span class="inline-block"
            >已选择<i class="p-lr-4 font-18">{{ selectTag.length }}</i
            >个标签</span
          >
        </div>
        <el-button type="primary" class="fr" @click.stop="toMemberGroupEdit">新增会员组<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
      <div :class="['common-wrap__fix__hideList', !toggleTagListFlag ? 'hide' : '']">
        <!-- v-if="toggleTagListFlag" -->
        <div class="common-wrap__fix__title">已选标签</div>
        <div class="common-wrap__fix__table">
          <el-table
            ref="tempTableMult"
            :data="tagListData"
            tooltip-effect="dark"
            height="333"
            style="width: 100%"
            @select="handleSelectRow"
            @select-all="handleSelectAll"
            @selection-change="handleSelectChange"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="标签名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="pointer name-hover color-blue" @click="showTagShort(scope.row)">
                  {{ scope.row.tagName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="已选标签值" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.newTagVal }}</template>
            </el-table-column>
            <el-table-column label="是否实时">
              <template slot-scope="scope">
                {{ scope.row.isActive == 1 ? '实时' : '非实时' }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" class="" @click="toDelTag(scope.row.tagValueId, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'TagTemporary',
  props: {},
  data() {
    return {
      // 暂存架参数
      toggleTagListFlag: false, // 是否显示参数
      selectTag: [], // 已选择标签数据
      tagListData: [
        // {
        //   tagId: 1,
        //   tagName: "123",
        //   newTagVal: '描述描述，最多200字，一行显示50字，默认显示一行',
        //   isActive: 1
        // }
      ]
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
     * 显示隐藏暂存架标签列表
     */
    toggleTagList() {
      const that = this;
      that.toggleTagListFlag = !!that.toggleTagListFlag ? false : true;
    },

    hideTagList() {
      const that = this;
      that.toggleTagListFlag = false;
    },

    showTagList() {
      const that = this;
      that.toggleTagListFlag = true;
    },

    /**
     * 表格---多选
     */
    handleSelectChange(val) {
      const that = this;
      setTimeout(function() {
        that.selectTag = val;
      }, 10);
    },

    /**
     * 表格---全选
     */
    handleSelectAll(val) {
      const that = this;
      setTimeout(function() {
        that.selectTag = val;
      }, 10);

      let status = 1;
      if (!!val && !!val.length) {
        status = 1;
      } else {
        status = 0;
      }
      that.postSelectAll(status);
    },

    /**
     * 表格---全选 选择状态 api
     */
    postSelectAll(status) {
      const that = this;
      const para = {
        batchSelect: status
      };
      postRequest('/member-tag-value/updateByBatch.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!status) {
              that.tagListData.forEach(function(ele, index) {
                ele.selectStatus = 1;
              });
            } else {
              that.tagListData.forEach(function(ele, index) {
                ele.selectStatus = 0;
              });
            }
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
     * 表格选择状态------api
     */
    postSelect(row, status) {
      const that = this;
      const para = {
        tagValueId: row.tagValueId,
        tagValue: row.tagValue,
        tagParams: row.tagParams,
        selectStatus: status
      };
      postRequest('/member-tag-value/update.json', para)
        .then(res => {
          var resData = res.data;
          if (resData.errorCode == 1) {
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
     * 表格---单选
     */
    handleSelectRow(val, row) {
      const that = this;
      setTimeout(function() {
        that.selectTag = val;
      }, 10);
      let status = 1;
      if (!!val.length) {
        let idArr = val.map(item => item.tagId);
        if (idArr.includes(row.tagId)) {
          status = 1;
        } else {
          status = 0;
        }
      }
      that.postSelect(row, status);
    },

    /**
     * 表格---删除
     */
    toDelTag(id, index) {
      const that = this;
      that.delTag(id, index);
    },

    /**
     * 表格---删除 API
     */
    delTag(id, index) {
      const that = this;
      const para = {
        tagValueId: id
      };
      getRequest('/member-tag-value/delete.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tagListData.splice(index, 1);
            showMsg.showmsg('删除成功', 'success');
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
     * 点击标签名,收起暂存架,显示标签详情缩略版
     */
    showTagShort(row) {
      const that = this;
      that.$emit('showShortDetail', row.tagId);
    },

    /**
     * 跳转会员分组
     */
    toMemberGroupEdit() {
      const that = this;
      if (!!that.selectTag.length) {
        sessionStorage.setItem('selectTempTag', JSON.stringify(that.selectTag));
        window.open(`${window.location.origin}/member-tag/#/memberGroupEdit`);
      } else {
        that.$message.error({
          duration: 1000,
          message: '请选择标签'
        });
      }
    },

    /**
     * 获取暂存架列表 API
     */
    getTagList() {
      const that = this;
      const para = {};
      getRequest('/member-tag-value/findList.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            let dataVal = JSON.parse(JSON.stringify(resData.result));
            dataVal.forEach(function(ele, index) {
              let newTagVal = JSON.parse(ele.tagParams);
              if (newTagVal.selectedVal != '') {
                ele.newTagVal = JSON.stringify(newTagVal.selectedVal).replace(/"/g, '');
              } else {
                ele.newTagVal = '';
              }
            });
            that.tagListData = dataVal;
            setTimeout(function() {
              if (!!that.tagListData) {
                that.tagListData.forEach(row => {
                  if (parseInt(row.selectStatus) == 1) {
                    that.$refs.tempTableMult.toggleRowSelection(row, true);
                  }
                });
              }
            }, 100);
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
    that.getTagList();
  },
  components: {}
};
</script>
<style lang="scss" scoped></style>
