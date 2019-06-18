<!--
    会员分组-我的标签列表和暂存架
    <add-tag-view @selectMytag="selectMytag" @selectTempTag="selectTempTag"></add-tag-view>
    import addTagView from '@/components/addTagView.vue';
 -->
<template>
  <div :class="['addTag-tab', addTagShow ? 'addTag-tab-show' : '']">
    <div class="addTag-tab-wrap">
      <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="closeView">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
      <el-tabs v-model="addTagTabActive" @tab-click="addTagTabClick">
        <el-tab-pane label="我的标签列表" name="first">
          <!-- 我的标签列表 -->
          <tag-category-small :tagLibName="tagLibName" @changeId="changeCateId"></tag-category-small>
          <div class="common-wrap__table">
            <el-table :data="myTagTableData" tooltip-effect="dark" style="width: 100%;max-height: 425px" @selection-change="handleSelectChange">
              class="myTagTab-table"
              <el-table-column label="标签名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="myTagTab-name color-blue" @click="showTagShort(scope.row, 'first')">
                    {{ scope.row.tagName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="tagDescribe" label="标签描述" show-overflow-tooltip> </el-table-column>
              <el-table-column label="是否实时" class="over-hide">
                <template slot-scope="scope">
                  <div class="tag-select-flag">{{ scope.row.isActive == 1 ? '实时' : '非实时' }}</div>
                  <label class="el-upload-list__item-status-label" v-if="scope.row.isAdd"><i class="el-icon-upload-success el-icon-check"></i></label>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block common-wrap__page text-right" v-if="myTagTableData.length != 0">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="暂存架" name="second">
          <!-- 暂存架 -->
          <el-table ref="templateTable" :data="temporaryData" tooltip-effect="dark" height="480" style="width: 100%" @select="selectRow" @select-all="handleSelectAll" @selection-change="handleSelectChange">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="标签名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="myTagTab-name color-blue" @click="showTagShort(scope.row, 'second')">
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import tagCategorySmall from '@/components/tagCategorySmall.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'addTagView',
  props: {
    tagLibName: {
      type: String
    },
    addTagShow: Boolean,
    selTagData: {
      type: Array
    },
    delTagId: String,
    returnEditObj: {
      type: Object
    }
  },
  data() {
    return {
      // 我的标签列表和暂存架
      addTagTabActive: 'first',

      // 我的标签列表数据
      currentGroupId: 0, //默认分类 id
      myTagTableData: [
        // {
        //   tagId: 1,
        //   tagName: "123",
        //   tagDescribe: '描述描述，最多200字，一行显示50字，默认显示一行',
        //   isActive: 1
        //   isAdd: false
        // },
      ],
      // 分页参数
      currentPage: 1,
      pageSize: 6,
      total: 0,

      // 暂存架
      temporaryData: [
        // {
        //   tagId: 1,
        //   tagName: "123",
        //   newTagVal: '描述描述，最多200字，一行显示50字，默认显示一行',
        //   isActive: 1
        // },
      ],

      selectTableArr: []
    };
  },
  methods: {
    /**
     * tab-click
     */
    addTagTabClick(tab, event) {
      console.log(tab, event);
    },

    /**
     * 关闭
     */
    closeView() {
      this.$emit('update:addTagShow');
    },

    /**
     * 我的标签列表
     */

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
      that.getTagList();
    },

    /**
     * 获取当前分类下下的标签
     */
    getTagList() {
      const that = this;
      const para = {
        tagName: '', // 搜索字段
        tagLevelGroupId: that.currentGroupId, // 当前分类的id
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize // 一页显示个数
      };

      getRequest('/enterpriseMemberTag/pageList', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result.result && !!resData.result.result.length) {
              let selIds = that.selTagData.map(item => item.tagId);
              resData.result.result.forEach(function(ele, index) {
                if (selIds.indexOf(ele.tagId) != -1) {
                  ele.isAdd = true;
                } else {
                  ele.isAdd = false;
                }
              });
              that.myTagTableData = resData.result.result;
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
     * 组件添加标签,判断我的标签列表已选
     */
    checkSelectTag() {
      const that = this;
      let selIds = that.selTagData.map(item => item.tagId);
      that.myTagTableData.forEach(function(ele, index) {
        if (selIds.indexOf(ele.tagId) != -1) {
          ele.isAdd = true;
        } else {
          ele.isAdd = false;
        }
      });

      // 先更新暂存架数据
      // that.getTempList(selIds)
      if (that.addTagTabActive === 'first') {
        // 如果当前操作时我的标签列表
        if (!!selIds.length) {
          that.temporaryData.forEach(function(ele, index) {
            if (selIds.includes(ele.tagId)) {
              that.$refs.templateTable.toggleRowSelection(ele, true);
              for (let el of that.selTagData) {
                if (el.tagId == ele.tagId) {
                  ele.tagParams = el.tagParams;
                  ele.tagValue = el.tagValue;
                  ele.newTagVal = el.newTagVal;
                }
              }
            } /*else {
                if (!!that.delTagId && that.delTagId != ele.tagId) {
                }
              }*/
          });
          that.$forceUpdate();
        } else {
          that.$refs.templateTable.clearSelection();
        }
      } else {
        // 在暂存架的时候
        // console.log('暂存架操作:')
      }
    },

    /**
     * 组件添加标签,判断暂存架已选
     */
    checkTempSelectTag(selIds) {
      const that = this;
      // 判断暂存架的已选状态
      if (that.addTagTabActive === 'first') {
        // 如果当前操作时我的标签列表
        that.temporaryData.forEach(function(ele, index) {
          if (selIds.indexOf(ele.tagId) != -1) {
            that.$refs.templateTable.toggleRowSelection(ele, true);
          }
        });
      }
    },

    /**
     * 点击子组件分类,改变当前分类 id
     */
    changeCateId(id) {
      const that = this;
      that.currentGroupId = id;
      that.getTagList();
    },

    /**
     **************************************
     **************************************
     */

    /**
     * 暂存架
     */

    /**
     * 获取暂存架列表 API
     */
    getTempList(selIds) {
      const that = this;
      getRequest('/member-tag-value/findList.json', {})
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
            that.temporaryData = dataVal;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);
          // that.$message.error({
          //   duration: 1000,
          //   message: error.message
          // });
        });
    },

    /**
     * 表格---多选
     */
    handleSelectChange(val) {
      var that = this;
      that.selectTableArr = val;
    },

    /**
     * 表格---全选
     */
    handleSelectAll(selection) {
      const that = this;
      if (!!selection.length) {
        that.selectTableArr = selection;
        if (that.addTagTabActive === 'first') {
          // 如果当前操作时我的标签列表
          return false;
        }
        // 返回暂存架已选数据
        that.$emit('returnTempData', selection);
      } else {
        that.selectTableArr = [];
        if (that.addTagTabActive === 'first') {
          // 如果当前操作时我的标签列表
          return false;
        }
        // 返回暂存架数据
        that.$emit('returnTempTableData', that.temporaryData);
      }
    },

    /**
     * 表格---单选一行
     */
    selectRow(selection, row) {
      const that = this;
      if (!!selection.length) {
        that.selectTableArr = selection;
        // 判断是选择还是不选
        let ids = that.selectTableArr.map(item => item.tagId);
        // 不选
        if (ids.indexOf(row.tagId) == -1) {
          // 返回暂存架已选标签 id
          that.$emit('returnTempTagId', row.tagId);
        } else {
          // 选择一行,返回当前一行数据
          that.$emit('returnTempRowData', row);
        }
      } else {
        that.selectTableArr = [];
        // 返回暂存架已选标签 id
        that.$emit('returnTempTagId', row.tagId);
      }
    },

    /**
     * 点击标签名,显示标签详情缩略版
     */
    showTagShort(row, tab) {
      const that = this;
      that.$emit('showShortDetail', row.tagId);
      that.$emit('showTabActive', tab);
    },

    /**
     * 暂存架里编辑标签值,刷新暂存架
     */
    /* eslint-disable */
    refreshTemp() {
      // that.getTempList();
    },

    /**
     * 暂存架里编辑标签值返回 obj---改变当前原有值
     */
    changeTempTagRowData(data) {
      const that = this;
      let newTagVal = JSON.parse(data.tagParams);
      if (newTagVal.selectedVal != '') {
        data.newTagVal = JSON.stringify(newTagVal.selectedVal).replace(/"/g, '');
      } else {
        data.newTagVal = '';
      }
      that.temporaryData.forEach(function(ele, index) {
        if (ele.tagId == data.tagId) {
          ele.tagParams = data.tagParams;
          ele.tagValue = data.tagValue;
          ele.newTagVal = data.newTagVal;
        }
      });
    },

    /**
     * 已选标签为删除---更新暂存架的已选标志(删除后更新暂存架有些问题,暂时采用先删后增的方式解决)
     */
    toDelTagId(delTagId) {
      const that = this;
      if (!!that.selTagData.length) {
        let existIds = that.temporaryData.map(item => item.tagId);
        if (existIds.includes(delTagId)) {
          let temData = null;
          that.temporaryData.forEach(function(ele, index) {
            if (ele.tagId == delTagId) {
              temData = ele;
              that.temporaryData.splice(index, 1);
            }
          });
          let selTagArrData = that.selTagData.map(item => item.tagId);
          that.temporaryData.forEach(function(ele, index) {
            if (selTagArrData.indexOf(ele.tagId) != -1) {
              that.$refs.templateTable.toggleRowSelection(ele, true);
            }
          });
          that.temporaryData.push(JSON.parse(JSON.stringify(temData)));
          that.$forceUpdate();
        }
      } else {
        that.$refs.templateTable.clearSelection();
      }
    }
  },
  watch: {
    selTagData: function(newData, oldData) {
      const that = this;
      that.checkSelectTag(); // 检查已选标志的时候可能暂存架里无数据
      // that.getTempList();
    },
    delTagId: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.toDelTagId(newData);
      }
    },
    returnEditObj: function(newData, oldData) {
      const that = this;
      if (!!newData && !!Object.keys(newData).length) {
        that.changeTempTagRowData(newData);
      }
    }
  },
  beforeMount() {
    const that = this;
    that.getTagList();
    that.getTempList();
  },
  components: {
    tagCategorySmall
  }
};
</script>
<style lang="scss" scoped>
.addTag-tab {
  position: fixed;
  bottom: 0;
  right: -659px;
  width: 656px;
  /*height: 671px;*/
  padding: 15px;
  background: #fff;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  box-shadow: 0px 2px 10px 1px rgba(220, 220, 220, 0.5);
  -webkit-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;

  &.addTag-tab-show {
    right: 0;
  }

  .addTag-tab-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .el-dialog__headerbtn {
      top: 10px;
      cursor: pointer;
      z-index: 2;
    }
  }
}

.myTagTab-name {
  cursor: pointer;
}

.el-upload-list__item-status-label {
  display: block;
  position: absolute;
  right: -22px;
  top: -11px;
  width: 46px;
  height: 26px;
  background: #1890ff;
  text-align: center;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  /*box-shadow: 0 1px 1px #ccc;*/

  i {
    font-size: 12px;
    color: #fff;
    margin-top: 14px;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
}
</style>
