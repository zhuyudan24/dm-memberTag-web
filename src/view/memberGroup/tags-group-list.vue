<template>
  <div :class="{ 'm-l-60': selectedTagsData.length > 1 }">
    <tags-group
      v-for="(item, index) in selectedTagsData"
      :key="item"
      :tagsData="item"
      :showTagsRelation="(index === 0 && selectedTagsData.length > 1) || (index === 1 && selectedTagsData.length > 2)"
      :tagsGroupIndex="index"
      :tagsRelation="tagsGroupRelation[index]"
      :showAddMenu="showAddMenu"
      :show-del-menu="selectedTagsData.length > 1"
      :active="activeTagsGroupIndex === index"
      @addTags="addTags"
      @delTags="delTags"
      @editTags="editTags"
      @delTagsGroup="delTagsGroup"
      @changeTagsGroupRelation="changeTagsGroupRelation"
      @checkTagsGroup="checkTagsGroup"
      @dragTag="dragTag"
    />
    <el-button class="m-t-10 w-400 el-icon-plus color-blue add-group-btn" v-show="selectedTagsData.length < 3" @click="addTagsGroup">
      &nbsp;&nbsp;添加
    </el-button>
  </div>
</template>

<script>
/**
 * 5个地方需要切换标签组选中状态，分别是
 *  默认标签组
 *  点击下拉菜单添加按钮
 *  点击下拉菜单删除按钮
 *  新增一个标签组
 *  点击选择标签组
 * */
import tagsGroup from './tags-group';

export default {
  name: 'tags-detail',
  props: {
    // 标签组选中状态的索引
    activeTagsGroupIndex: {
      type: Number,
      default: 0
    },
    activeTagIndex: {
      type: Number,
      default: 0
    },
    // 选中的标签数据
    selectedTagsData: Array,
    // 标签组之间的关系
    tagsGroupRelation: Array,
    // 是否显示下拉菜单的"添加标签"按钮
    showAddMenu: {
      type: Boolean,
      default: false
    }
  },
  components: {
    tagsGroup
  },
  methods: {
    // 拖拽标签
    dragTag(data) {
      let { fromTagsGroupIndex, fromTagIndex, toTagsGroupIndex } = { ...data };
      let tagData = this.selectedTagsData[fromTagsGroupIndex].splice(fromTagIndex, 1)[0];
      tagData.level = toTagsGroupIndex;
      this.selectedTagsData[toTagsGroupIndex].push(tagData);
    },
    // 添加一个标签组，最多只能有3个标签组
    addTagsGroup() {
      if (this.selectedTagsData.length < 3) {
        this.selectedTagsData.push([]);
        this.selectedTagsData.length > 1 && this.tagsGroupRelation.push('or');
      }
      this.checkTagsGroup({ tagsGroupIndex: this.selectedTagsData.length - 1 });
    },
    // 删除一个标签组
    delTagsGroup(data) {
      this.tagsGroupRelation.splice(data.tagsGroupIndex === this.selectedTagsData.length - 1 ? data.tagsGroupIndex - 1 : data.tagsGroupIndex, 1);
      this.selectedTagsData.splice(data.tagsGroupIndex, 1);
      // 删除一个标签组，会导致之后标签组中标签的level不再等于当前标签组的索引，即level !== index
      // 所以这里重置标签的level为index，即tag.level = index
      this.selectedTagsData.forEach((group, index) => {
        group.forEach(tag => tag.level = index);
      });
      this.checkTagsGroup({ tagsGroupIndex: 0 });
    },
    // 添加标签
    addTags(data) {
      this.checkTagsGroup({ tagsGroupIndex: data.tagsGroupIndex });
      this.$emit('addTags');
    },
    // 删除标签
    delTags(data) {
      this.$confirm('确定要删除这个标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedTagsData[data.tagsGroupIndex].splice(data.tagIndex, 1);
      });
    },
    // 编辑一个标签
    editTags(data) {
      this.$emit('editTags');
      this.$emit('update:activeTagsGroupIndex', data.tagsGroupIndex);
      this.$emit('update:activeTagIndex', data.tagIndex);
    },
    // 修改两个标签组之间的关系
    changeTagsGroupRelation(data) {
      this.tagsGroupRelation[data.relationIndex] = this.tagsGroupRelation[data.relationIndex] === 'or' ? 'andNot' : 'or';
    },
    // 切换标签组的选中状态
    checkTagsGroup(data) {
      this.activeTagsGroupIndex = data.tagsGroupIndex;
      this.$emit('update:activeTagsGroupIndex', data.tagsGroupIndex);
    }
  }
};
</script>

<style lang="less" scoped>
.m-l-60 {
  margin-left: 60px;
}

.add-group-btn {
  border-style: dashed;
}

.page-box {
  transform: translate(0, -20px);
}
</style>
