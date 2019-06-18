<template>
  <div class="second">
    <span class="name" :class="{ 'manual-name': tagName === '手工标签', 'light-active': tagList.name === tagRealName }" @click="handleSecondtag(tagList)">
      <span>{{ tagList.name }}</span>
    </span>
    <i class="arrow-line iconfont icon-next-" v-if="tagName !== '手工标签'"></i>
    <el-popover placement="bottom" width="30" trigger="click">
      <li class="more" @click="addNewType">新增子分类</li>
      <li class="more" @click="handleEditType">编辑子分类</li>
      <i slot="reference" class="el-icon-more icon-tag" v-if="tagName === '手工标签'"></i>
    </el-popover>
    <div class="third-list" :class="{ 'manual-tag': tagName === '手工标签' }">
      <!-- <i class="iconfont icon-next-" v-if="tagName === '手工标签'"></i> -->
      <span v-for="(item, i) in tagList.children" :key="i" :class="{ 'light-active': item.name === tagRealName }" class="tag-item" @click="handleThirdTag(item)">
        {{ item.name }}
      </span>
    </div>

    <!-- 编辑子分类 -->
    <el-dialog :title="newName" :visible.sync="editVisiable" :close-on-click-modal="false" width="40%">
      <el-table :data="editData" height="400">
        <el-table-column label="子分类名称" prop="levelName">
          <template slot-scope="scope">
            <el-input v-model="scope.row.levelName" v-if="scope.row.editName"></el-input>
            <span v-else>{{ scope.row.levelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.levelName.indexOf('未分类') > -1"  @click="handleEdit(scope.row, scope.$index)" type="text">{{ scope.row.editText }}</el-button>
            <el-button :disabled="scope.row.levelName.indexOf('未分类') > -1" type="text" @click="handleDelete(scope.row, scope.$index)"> {{ scope.row.deleteText }} </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisiable = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 新增子分类 -->
    <el-dialog :title="newName" :visible.sync="dialogVisible" width="400px" top="20%" :close-on-click-modal="false">
      <div class="newtype">
        <span class="name">子分类名称 </span>
        <el-input style="width: 200px" placeholder="请输入分类名称" maxlength="10" v-model="typeName"> </el-input>
        <span class="count">{{ typeName.length }}/10</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newTag">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Emitter from '@/mixins/emitter';
import { mapState } from 'vuex';
import { newHandTag, thirdHandTagList, deleteThirdTag, editThirdTag } from '@/request/api';

export default {
  mixins: [Emitter],

  name: 'second-type',

  componentName: 'second-type',

  props: {
    list: Object,
    tagName: String
  },

  data() {
    return {
      tagList: {},
      editData: [],
      dialogVisible: false,
      editVisiable: false,
      editText: '编辑',
      typeName: '',
      currentIndex: -1,
      newName: '' // 新增子分类
    };
  },

  watch: {
    list: {
      immediate: true,
      handler(newval) {
        let noClassIndex  = newval.children.findIndex(el => el.name.indexOf('未分类') > -1);
        if (noClassIndex > -1) {
          let noClassData = newval.children.splice(noClassIndex, 1);
          newval.children.unshift(noClassData[0]);
        }
        this.tagList = newval;
      }
    }
  },

  computed: {
    ...mapState(['tagRealName'])
  },

  methods: {
    // 新增子分类
    addNewType() {
      this.newName = `${this.list.name} - 新增子分类`;
      this.dialogVisible = !this.dialogVisible;
    },
    // 编辑子分类
    handleEditType() {
      this.newName = `${this.list.name} - 编辑子分类`;
      this.editVisiable = !this.editVisiable;
      this.getThirdTag();
    },
    // 请求三级手工标签
    getThirdTag() {
      const param = {
        tagLevelGroupId: this.tagList.id,
        requestProject: 'gic-member-tag-web'
      };
      thirdHandTagList(param)
        .then(res => {
          if (res.errorCode == 1) {
            this.editData = res.result.map(el => ({
              ...el,
              editName: false,
              editText: '编辑',
              deleteText: '删除'
            }));
          } else {
            this.editData = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(list, i) {
      if (!list.editName) {
        this.editData = this.editData.map(el => ({
          ...el,
          editName: false,
          editText: '编辑',
          deleteText: '删除'
        }));
        this.editData[i].editName = true;
        this.editData[i].editText = '确认';
        this.editData[i].deleteText = '取消';
      } else {
        /** 提交修改的标签名
         *  不能为空
         */
        this.editThird(list, i);
      }
    },
    // 修改三级分类
    editThird(list, i) {
      if (!list.levelName) {
        this.$message({
          message: '子分类名称不能为空',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      const param = {
        tagLevelGroupId: list.tagLevelGroupId,
        levelName: list.levelName,
        requestProject: 'gic-member-tag-web'
      };

      editThirdTag(param)
        .then(res => {
          if (res.errorCode == 1) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            list.editName = false;
            list.editText = '编辑';
            list.deleteText = '删除';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除子分类
    handleDelete(list, i) {
      // list.editName = false;
      // list.editText = '编辑';
      if (list.deleteText == '取消') {
        this.editData[i].editName = false;
        this.editData[i].editText = '编辑';
        this.editData[i].deleteText = '删除';
        return;
      }
      const param = {
        tagLevelGroupId: list.tagLevelGroupId,
        requestProject: 'gic-member-tag-web'
      };
      deleteThirdTag(param)
        .then(res => {
          if (res.errorCode == 1) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getThirdTag();
            this.dispatch('member-tag', 'refersh-member-list');
            // this.editVisiable = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 添加手工标签
     */
    newTag() {
      const params = {
        levelName: this.typeName,
        parentLevelGroupId: this.tagList.id,
        requestProject: 'gic-member-tag-web'
      };
      // 子分类名称不能为空
      if (!this.typeName) {
        this.$message({
          message: '子分类名称不能为空',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      if (!this.addHandTagFlag) {
        this.addHandTagFlag = true;
        newHandTag(params)
          .then(res => {
            this.addHandTagFlag = false;
            if (res.errorCode == 1) {
              this.dispatch('member-tag', 'refersh-member-list');
              this.typeName = '';
              this.dialogVisible = false;
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3000
              });
            }
          })
          .catch(err => {
            this.addHandTagFlag = false;
            console.log(err);
          });
      }
    },
    /**
     * 处理二级分类
     */
    handleSecondtag(list) {
      localStorage.setItem('jumpThirdTag', '');
      localStorage.setItem('jumpTag', JSON.stringify(list));
      this.dispatch('member-tag', 'handle-second-tag', this.tagList);
    },
    /**
     * 处理三级标签
     */
    handleThirdTag(list, i) {
      localStorage.setItem('jumpTag', JSON.stringify(this.tagList));
      localStorage.setItem('jumpThirdTag', JSON.stringify(list));
      this.dispatch('member-tag', 'handle-third-tag', list);
    }
  },
  created() {
    this.addHandTagFlag = false;
  }
};
</script>

<style lang="scss" scoped>
.second {
  position: relative;
  line-height: 26px;
  min-height: 26px;
  padding-left: 24px;
  padding-top: 3px;
  padding-bottom: 2px;
  .name {
    position: relative;
    top: 1px;
    float: left;
    span:hover {
      color: #1890ff;
    }
  }
  .light-active {
    color: #1890ff;
  }
  .manual-name {
    display: block;
    float: none;
    text-align: left;
    font-size: 14px;
  }
  .third-list {
    margin-left: 90px;
    .tag-item {
      display: inline-block;
      vertical-align: middle;
      line-height: 26px;
      margin-right: 15px;
      font-size: 14px;
      color: #606266;
      &:hover {
        color: #1890ff;
      }
    }
    .light-active {
      color: #1890ff;
    }
    .icon-next- {
      font-size: 30px;
    }
  }
  .manual-tag {
    margin-left: 25px;
    .arrow {
      margin-right: 10px;
    }
  }
  .arrow-line {
    float: left;
    position: relative;
    top: 2px;
    font-size: 30px;
  }
  .icon-tag {
    position: absolute;
    right: 20px;
    top: 10px;
    color: #c0c4cc;
    cursor: pointer;
    &:hover {
      color: #606266;
    }
  }
}
.more {
  line-height: 26px;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
}
.newtype {
  position: relative;
  .name {
    margin-right: 10px;
  }
  .count {
    position: absolute;
    top: 4px;
    right: 90px;
  }
}
</style>
