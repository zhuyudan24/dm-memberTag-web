<template>
  <el-dialog title="" width="400px" top="30vh" custom-class="cre-dialog" :visible.sync="batchDialog" center :modal-append-to-body="false" :before-close="closeBatch">
    <p class="tips" slot="title">{{ operNum == 0 ? '批量失效' : operNum == 1 ? '批量删除' : '修改所属分类' }}</p>

    <div class="batch-content">
      <div v-if="operNum == 0">
        <div class="el-message-box__status el-icon-warning"></div>
        <p class="batch-txt">该分组失效后，不再更新数据，确认要失效吗？</p>
      </div>
      <div v-if="operNum == 1">
        <div class="el-message-box__status el-icon-warning"></div>
        <p class="batch-txt">一旦删除无法恢复，确认要批量删除分组吗？</p>
      </div>
      <div v-if="operNum == 2">
        <p class="title">
          我的会员分组
        </p>

        <ul class="batch-ul">
          <li v-for="(item, i) in groupList" :key="item.memberTagGroupClassifyId" class="batch-li" :class="{'active-li': i == listIndex}" @click="chooseGroup(item, i)">
            {{ item.classifyName }}
          </li>
        </ul>
        <p class="group-name">选中的分组：{{ groupName }}</p>
      </div>
    </div>

    <div class="cre-btn">
      <el-button @click="closeBatch">取 消</el-button>
      <el-button type="primary" @click="confirmBatch">确 定</el-button>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="closeBatch">取 消</el-button>
      <el-button type="primary" @click="confirmBatch">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { memberGroupList, batchModifyEffective, batchDeleteGroup, batchChangeGroup } from '@/request/api';

export default {
  name: 'batch-list',

  props: {
    batchVisiable: Boolean,
    operateNumber: Number,
    multipleSelection: Array
  },

  data() {
    return {
      batchDialog: false,
      operNum: -1,
      groupList: [],
      groupName: '',
      listIndex: -1
    };
  },

  methods: {
    confirmBatch() {
      console.log(this.operateNumber);
      let batchNum = this.operateNumber;
      let tagIds = this.selectionList.map(el => el.memberTagGroupId);
      const param = {
        requestProject: 'gic-member-tag-web',
        memberTagGroupIds: tagIds.join(',')
      };
      // 1 批量失效 2批量删除 3批量转移会员组
      if (batchNum == 0) {
        param.effectiveStatus = 0;
        batchModifyEffective(param)
          .then(res => {
            if (res.errorCode == 1) {
              this.$message.success({
                message: '修改成功'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (batchNum == 1) {
        batchDeleteGroup(param).then(res => {
          if (res.errorCode == 1) {
            this.$message.success({
              message: '删除成功'
            });
          }
        });
      } else if (batchNum == 2) {
        if (!this.groupName) {
          this.$message.warning({
            message: '请先选择的会员分组的分类'
          });
          return;
        }
        let index = this.groupList.findIndex(el => el.classifyName === this.groupName);
        param.memberTagGroupClassifyId = this.groupList[index].memberTagGroupClassifyId;
        batchChangeGroup(param)
          .then(res => {
            if (res.errorCode == 1) {
              this.$message.success({
                message: '修改分类成功'
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.closeBatch();
      // 触发更新
      this.$emit('refresh-list');
    },
    // 选择分组
    chooseGroup(list, i) {
      this.listIndex = i;
      this.groupName = list.classifyName;
    },
    // 关
    closeBatch() {
      this.batchDialog = false;
      this.$emit('update:batchVisiable', false);
    },
    getMemberGroupList() {
      memberGroupList({
        requestProject: 'gic-member-tag-web'
      })
        .then(res => {
          if (res.errorCode === 1) {
            this.groupList = res.result.filter(el => el.classifyName != '未分类').map(item => ({
              ...item,
              edit: false
            }));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  created() {
    this.selectionList = [];
  },

  watch: {
    batchVisiable(newval) {
      this.batchDialog = newval;
      this.getMemberGroupList();
    },
    operateNumber(newval) {
      this.operNum = newval;
    },
    multipleSelection: {
      immediate: true,
      handler(newval) {
        this.selectionList = newval;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.batch-txt {
  padding-left: 35px;
  padding-top: 7px;
}
.batch-title {
  color: #333;
  font-size: 18px;
}
.title {
  font-size: 14px;
  font-weight: bold;
}
.batch-ul {
  overflow-y: auto;
  max-height: 200px;
  margin-top: 10px;
  .batch-li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 2px 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      background-color: #f6f8fd;
    }
  }
  .active-li {
    background-color: #f6f8fd;
    color: #1890ff;
  }
}
.group-name {
  margin-top: 20px;
  font-size: 14px;
  color: #1890ff;
}
</style>
