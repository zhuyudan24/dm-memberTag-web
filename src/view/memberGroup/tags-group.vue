<template>
  <div class="w-400 border-box">
    <div :class="['tags-group', { 'tags-group--active': active }]" @click="checkTagsGroup">
      <!--右上角的下拉菜单-->
      <el-dropdown class="tags-group__dropdown" placement="bottom-end" v-if="showAddMenu || showDelMenu">
        <el-popover width="200" placement="top" v-model="showDelPop" trigger="manual">
          <p class="m-b-20">确认删除输入框及内部所有标签？</p>
          <div class="text-right">
            <el-button @click="showDelPop = false">取消</el-button>
            <el-button type="primary" @click="delTagsGroup">确认</el-button>
          </div>
          <i slot="reference" class="el-icon-more more"></i>
        </el-popover>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="showAddMenu" @click.native="addTags">添加标签</el-dropdown-item>
          <el-dropdown-item v-if="showDelMenu" @click.native="handleDelTagsGroup">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--展示选中的标签-->
      <div class="tags-group__show">
        <draggable v-model="tagsData" group="article" style="height: 100%" @end="dragTag" :move="checkMove" :sort="false" :data-index="tagsGroupIndex">
          <div class="tags-group__tag" v-for="(item, index) in tagsData" :key="item.tagId">
            <el-tooltip>
              <span>{{ item.tagName }} 【选择:{{ item.newTagVal }}】</span>
              <div style="max-width: 400px;font-size: 14px" slot="content">{{ item.tagName }} 【选择:{{ item.newTagVal }}】</div>
            </el-tooltip>
            <i class="iconfont icon-bianji1 edit" @click="editTags(index)"></i>
            <i class="iconfont icon-guanbi" @click="delTags(index)"></i>
          </div>
        </draggable>
      </div>
    </div>
    <!--标签组之间的关系-->
    <div class="tags-group__relation" v-show="showTagsRelation">
      <el-tooltip content="点击切换运算符" placement="bottom-start">
        <el-button type="btn btn-default tags-group__btn" @click="changeTagsGroupRelation">
          {{ tagsRelation === 'or' ? '或者' : tagsRelation === 'andNot' ? '剔除' : '' }}
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
/**
 * props
 *  @tagsData 一组标签的数据
 *  @showTagsRelation 是否显示与下一组标签之间的关系
 *  @tagsRelation 与下一组标签之间的关系（or或者，andNot剔除）
 *  @tagsGroupIndex 当前标签组的索引
 *  @showAddMenu 下拉菜单是否显示“添加标签”菜单项
 * methods
 *  @delTagsGroup 删除一个标签组，将会emit(delTagsGroup事件，{tagsGroupIndex: 当前标签组的索引})
 *  @delTags 删除一个标签，将会emit(delTags事件， {tagsGroupIndex: 当前标签组的索引, tagIndex: 当前标签的索引})
 *  @addTags 添加一个标签，将会emit(addTags事件, {tagsGroupIndex: 当前标签组的索引})
 *  @editTags 编辑一个标签，将会emit(editTags事件, {tagsGroupIndex: 当前标签组的索引, tagIndex: 当前标签的索引})
 *  @changeTagsGroupRelation 切换与下一组标签之间的关系，将会emit(changeTagGroupRelation事件)
 * */
import draggable from 'vuedraggable';

export default {
  name: 'tags-group',
  components: {
    draggable
  },
  props: {
    // 一组标签（选中的）的数据
    tagsData: Array,
    // 是否显示剔除按钮
    showTagsRelation: Boolean,
    // 与上一组标签之间的关系 or 、andNot
    tagsRelation: String,
    // 当前标签组的索引
    tagsGroupIndex: Number,
    // 下拉菜单是否显示"添加标签"菜单项
    showAddMenu: Boolean,
    // 下拉菜单是否显示"删除"菜单项
    showDelMenu: Boolean,
    // 标签组是否选中
    active: Boolean
  },
  data() {
    return {
      // 确认删除标签组的弹窗
      showDelPop: false,
      changed: false
    };
  },
  methods: {
    // 删除一个标签组
    delTagsGroup() {
      this.showDelPop = false;
      this.$emit('delTagsGroup', {
        tagsGroupIndex: this.tagsGroupIndex
      });
    },
    // 删除一个标签组
    handleDelTagsGroup() {
      if (this.tagsData.length === 0) {
        this.delTagsGroup();
      } else {
        this.showDelPop = true;
      }
    },
    // 添加一个标签
    addTags() {
      this.$emit('addTags', {
        tagsGroupIndex: this.tagsGroupIndex
      });
    },
    // 删除一个标签
    delTags(tagIndex) {
      this.$emit('delTags', {
        tagsGroupIndex: this.tagsGroupIndex,
        tagIndex
      });
    },
    // 编辑一个标签
    editTags(tagIndex) {
      this.$emit('editTags', {
        tagsGroupIndex: this.tagsGroupIndex,
        tagIndex
      });
    },
    // 切换与下一个标签组之间的关系
    changeTagsGroupRelation() {
      this.tagsRelation = this.tagsRelation === 'or' ? 'andNot' : 'or';
      this.$emit('changeTagsGroupRelation', { relationIndex: this.tagsGroupIndex });
    },
    // 选中当前标签组
    checkTagsGroup() {
      this.$emit('checkTagsGroup', {
        tagsGroupIndex: this.tagsGroupIndex
      });
    },
    // 拖拽标签
    dragTag(evt) {
      if (this.changed) {
        this.$emit('dragTag', {
          fromTagIndex: evt.oldIndex,
          toTagIndex: evt.newIndex,
          fromTagsGroupIndex: parseInt(evt.from.getAttribute('data-index')),
          toTagsGroupIndex: parseInt(evt.to.getAttribute('data-index'))
        });
      }
    },
    checkMove(evt) {
      const relatedList = evt.relatedContext.list;
      const draggedElement = evt.draggedContext.element;
      this.changed = !relatedList.some(item => item.tagId === draggedElement.tagId);
      return this.changed;
    }
  }
};
</script>

<style lang="less" scoped>
.tags-group {
  position: relative;
  padding: 12px 0;
  border: 1px solid #dcdfe6;
  border-radius: 5px;

  .tags-group__dropdown {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    padding: 0 8px;
    height: 20px;
    .more {
      color: #909399;
      cursor: pointer;
      &:hover {
        color: #303133;
      }
    }
  }

  .tags-group__show {
    padding: 0 12px;
    height: 120px;
    overflow-y: scroll;
  }

  .tags-group__tag {
    position: relative;
    display: inline-block;
    vertical-align: top;
    padding: 0 50px 0 10px;
    margin-right: 8px;
    margin-bottom: 8px;
    max-width: 100%;
    height: 32px;
    line-height: 32px;
    background: #f3f6f9;
    border-radius: 2px;
    font-size: 14px;
    color: #606266;
    cursor: pointer;

    &:hover {
      color: #303133;
      background: #e6e8ed;
    }

    &:last-child {
      margin-bottom: 0;
    }
    span {
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      position: absolute;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      padding: 0 2px;
      height: 100%;
      color: #999;
      cursor: pointer;
    }
    i.icon-bianji1 {
      right: 25px;
      color: #c0c4cc;
      &:hover {
        color: #1890ff;
      }
    }
    i.icon-guanbi {
      right: 5px;
      &:hover {
        color: #f56c6c;
      }
    }
  }
}

.tags-group--active {
  border: 1px solid #1890ff;
}

.tags-group__relation {
  position: relative;
  transform: translate(-55px, 0);

  .tags-group__btn {
    padding: 0;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 40px;
    border: none;
    background: #f3f6f9;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 15px;
    z-index: 1;
    width: 40px;
    height: 60px;
    border-left: 1px solid #dcdfe6;
  }

  &::before {
    top: -65px;
    border-top: 1px solid #dcdfe6;
  }

  &::after {
    bottom: -65px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
