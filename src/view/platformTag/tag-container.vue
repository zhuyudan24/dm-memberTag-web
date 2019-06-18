<template>
  <!-- 具体标签 -->
  <div class="tag-some-list">
    <el-table :data="tableData">
      <el-table-column label="标签名称" prop="tagName" min-width="150">
        <template slot-scope="scope">
          <span class="tag-name">{{ scope.row.tagName }}</span>
<!--          <el-tooltip class="item" effect="dark" :content="scope.row.refersh ? '更新标签' : '添加标签'" placement="bottom">-->
          <el-tooltip class="item" effect="dark" content="添加标签" placement="bottom">
            <!-- :class="{ 'icon-shoudonggengxin': scope.row.refersh }" -->
<!--            <i class="iconfont icon-tag-name" :class="scope.row.refersh ? 'icon-shoudonggengxin' : 'icon-jia'" @click="addTag(scope.row)"></i>-->
            <i class="iconfont icon-tag-name icon-jia" @click="addTag(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="标签描述" prop="tagDescribe" min-width="400">
        <template slot-scope="scope">
          <div>{{ scope.row.tagDescribe ? scope.row.tagDescribe : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否实时" prop="isActive" min-width="150">
        <template slot-scope="scope">
          <span> {{ scope.row.isActive == 1 ? '实时' : '非实时' }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="handTag" min-width="200">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.tagType == 1"> -->
            <el-button type="text" @click="editHandTag(scope.row)">编辑</el-button>
            <el-button type="text" @click="editHandTagValue(scope.row)">标签值设置</el-button>
            <el-button type="text" @click="deleteHandTag(scope.row)">删除</el-button>
          <!-- </span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Emitter from '@/mixins/emitter';
import tagDetails from '@/components/tagDetail/mixin/index';
import { delThirdHandTag } from '@/request/api';
import { getTagType } from '@/request/tagConfig';

export default {
  name: 'tag-container',

  mixins: [tagDetails, Emitter],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    handTag: {
      type: Boolean,
      default: false
    },
    groupId: String,
    refersh: Object
  },

  data() {
    return {
      tableData: [],
      tagData: {}
    };
  },

  methods: {
    // 将标签添加到已选标签 弹框里面操作
    addTag(list) {
      this.$emit('addTag', list);
    },
    editHandTag(list) {
      this.$emit('editHandTag', list);
    },
    editHandTagValue(list) {
      localStorage.setItem('jumpTag', '');
      localStorage.setItem('jumpThirdTag', '');
      // this.dispatch('member-tag', 'edit-third-tag');
      this.$router.push({
        path: '/manualTagValueEdit',
        query: { tagId: list.tagId }
      });
    },
    deleteHandTag(list) {
      this.$confirm('删除标签后，符合该标签值的会员对应标签值将同步删除。一旦删除将无法恢复，确认要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          const param = {
            tagId: list.tagId,
            requestProject: 'gic-member-tag-web'
          };
          delThirdHandTag(param)
            .then(res => {
              if (res.errorCode == 1) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                });
                this.$emit('deleteHandTag', this.groupId);
              }
            })
            .catch(err => {
              // console.log(err);
            });
        })
        .catch(err => {
          // console.log(err);
        });
    },
    getTagData(tagId) {
      const that = this;
      that.searchFlag = false; // 默认不显示搜索框
      const para = {
        tagId: tagId
      };
      getTagType(para)
        .then(res => {
          console.log(res);
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tagData.tagId = resData.result.tagId;
            that.tagData.tagName = resData.result.tagName;
            that.tagData.tagDescribe = resData.result.tagDescribe;
            that.tagData.isActive = resData.result.isActive;
            that.tagData.tagType = resData.result.tagType;
            // 获取 columnKey
            // if (!!resData.result.columnKey) {currentComputeType
            that.currentKey = resData.result.columnKey;
            // }else {
            //   that.currentKey = resData.result.tagId;
            // }
            let templateObj = resData.result.template;
            if (!!templateObj) {
              that.checkTagTemplate(templateObj.templateContent);
            }
            return;
          }
          // errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },

  watch: {
    data: {
      immediate: true,
      handler(newval) {
        this.tableData = newval;
      }
    },
    refersh: {
      immediate: true,
      handler(newval) {
        // 刷新
        if (newval.changeRefersh) {
          let index = this.tableData.findIndex(el => newval.tagId === el.tagId);
          this.tableData[index].refersh = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-some-list {
  margin: 0 20px;
  overflow-y: auto;
}
.icon-tag-name {
  display: inline-block;
  vertical-align: bottom;
  font-size: 13px;
  cursor: pointer;
  &:hover{
    color: #303133;
  }
}
</style>
