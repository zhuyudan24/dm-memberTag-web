<template>
  <div class="group-list">
    <div class="member-group">
      <i class="icon-list el-icon-caret-top icon-transform" :class="expendClass" @click="handleExpend"></i>
      我的会员分组
      <i class="el-icon-plus icon-right icon-list" @click="addGroupDialog = true"></i>
    </div>

    <el-collapseTransition>
      <ul class="lists" v-show="expendTxt == '展开'">
        <li v-for="(list, i) in lists" :key="i" :class="['member-list', { 'active-li': i == currentIndex }]" @click="handleChangeIndex(i, list)">
          <span class="name-txt" :title="list.classifyName" v-show="!list.edit">{{ list.classifyName }}</span>
          <el-input style="width: 100px;" size="mini" v-show="list.edit" v-model="list.classifyName" maxLength="10" @keyup.native.enter="modifyName(list)" />
          <div class="oper-area" v-if="list.classifyName !== '未分类'">
            <i class="iconfont icon-list-oper" :class="[list.edit ? 'icon-dagou' : 'icon-bianji1']" @click.stop="editGroupName(list)"></i>
            <i class="iconfont icon-list-oper" :class="[list.edit ? 'icon-guanbi1' : 'icon-guanbi']" @click="deleteGroupName(list)"></i>
          </div>
        </li>
      </ul>
    </el-collapseTransition>

    <!-- <div class="recommend-list" :class="{ 'recommend-active': active }" @click="getRecommendList">
      推荐会员分组
    </div> -->

    <el-dialog :title="title" :visible.sync="addGroupDialog" width="320px" top="30vh" :close-on-click-modal="false">
      <div>
        分组名称：
        <el-input style="width: 200px;" placeholder="请输入分组名称" v-model="groupName" :maxlength="8" clearable></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleGroupDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import { CollapseTransition } from 'element-ui';
import { memberGroupList, memberGroupModify, memberGroupDelete } from '@/request/api';

Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  name: 'group-list',

  data() {
    return {
      lists: [],
      addGroupDialog: false,
      expendTxt: '展开',
      groupName: '',
      title: '新增分组名称',
      currentIndex: 0,
      active: false
    };
  },

  computed: {
    expendClass() {
      if (this.expendTxt != '展开') {
        return 'is-caret';
      } else {
        return '';
      }
    }
  },

  methods: {
    // 如果编辑二级会员分组分类 但是没有编辑有切换到其他的分类
    handleNoEditClassifyName() {
      this.lists = this.lists.map(el => ({
        ...el,
        edit: false
      }));
    },
    handleChangeIndex(i, list) {
      this.active = false;
      this.currentIndex = i;
      // 第二级的分组数据
      this.$emit('second-list', list);
    },
    /**
     * 修改和删除分组
     * 鼠标悬浮在分组名称上，显示编辑和删除按钮
     * 点击编辑之后，编辑按钮切换为保存按钮，删除按钮切换为不保存按钮。
     */
    editGroupName(list) {
      if (list.edit) {
        this.modifyName(list);
      } else {
        if (!this.operatorName(list)) {
          return;
        }
        list.edit = true;
      }
    },
    // 删除
    deleteGroupName(list) {
      if (!this.operatorName(list)) {
        return;
      }
      if (list.edit) {
        list.edit = false;
        this.getMemberGroupList();
        return;
      }
      this.$confirm('删除分组名称，包括该分组下的内容，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除操作
          this.excludeName(list);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    excludeName(list) {
      const param = {
        requestProject: 'gic-member-tag-web',
        memberTagGroupClassifyId: list.memberTagGroupClassifyId
      };
      memberGroupDelete(param).then(res => {
        if (res.errorCode == 1) {
          this.getMemberGroupList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    // 修改分组名称
    modifyName(list) {
      if (!list.classifyName) {
        this.$message({
          message: `分组名称不能为空！`,
          type: 'warning',
          duration: 2000
        });
        return;
      }
      const param = {
        requestProject: 'gic-member-tag-web',
        classifyName: list.classifyName,
        memberTagGroupClassifyId: list.memberTagGroupClassifyId
      };
      memberGroupModify(param).then(res => {
        if (res.errorCode == 1) {
          list.edit = false;
          this.getMemberGroupList();
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 2000
          });

        }
      });
    },

    operatorName(list) {
      if (list.memberTagGroupClassifyId == '0') {
        this.$message({
          message: `${list.classifyName}的不能操作`,
          type: 'warning',
          duration: 2000
        });
        return false;
      }
      return true;
    },

    /**
     * 新增会员分组分类
     */
    handleGroupDialog() {
      if (!this.groupName) {
        this.$message({
          type: 'warning',
          message: '分组名称不能为空'
        });
        return;
      }
      const param = {
        requestProject: 'gic-member-tag-web',
        classifyName: this.groupName
      };
      memberGroupModify(param).then(res => {
        if (res.errorCode == 1) {
          this.getMemberGroupList();
          this.groupName = '';
          this.addGroupDialog = false;
          this.$message({
            type: 'success',
            message: '添加成功'
          });
        }
      });
    },
    /**
     * 会员分组分类
     */
    getMemberGroupList() {
      memberGroupList({
        requestProject: 'gic-member-tag-web'
      }).then(res => {
        if (res.errorCode === 1) {
          this.lists = res.result.map(el => ({
            ...el,
            edit: false
          }));
        }
      });
    },
    // 收起
    handleExpend() {
      this.expendTxt = this.expendTxt === '展开' ? '收起' : '展开';
    },
    // getRecommendList() {
    //   let editFlag = this.lists.some(el => el.edit);
    //   if (editFlag) {
    //     this.handleNoEditClassifyName();
    //   }
    //   this.active = true;
    //   this.currentIndex = -1;
    //   this.$emit('getRecommend');
    // }
  },

  beforeMount() {
    this.getMemberGroupList();
  }
};
</script>

<style lang="scss" scoped>
.group-list {
  padding-top: 20px;
  .recommend-list {
    margin-top: 10px;
    padding-left: 37px;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    cursor: pointer;
  }
  .recommend-active {
    color: #1890ff;
  }
}
.member-group {
  padding: 5px 10px 20px 20px;
  font-size: 14px;
  color: #303133;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  .icon-right {
    float: right;
  }
  .icon-list {
    color: #909399;
    &:hover {
      color: #303133;
    }
  }
}
.member-list {
  height: 32px;
  line-height: 32px;
  padding-left: 37px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  &:hover {
    color: #1890ff;
    .oper-area {
      display: inline;
    }
  }
  .name-txt {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
    height: 32px;
  }
  .oper-area {
    display: none;
    float: right;
    margin-right: 10px;
  }
}
.lists {
  color: #606266;
  .active-li {
    color: #1890ff;
    background-color: #F3F6F9;
  }
  li:hover {
    background-color: #F3F6F9;
  }
}

.icon-list-oper {
  color: #c0c4cc;
  &:hover {
    color: #909399;
  }
}
.icon-transform {
  transition: transform 0.3s;
  transform: rotate(180deg);
  &.is-caret {
    transform: rotate(0deg);
  }
}
</style>
