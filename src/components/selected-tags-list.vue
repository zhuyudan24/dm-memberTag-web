<template>
  <div class="flex m-t-20 tags">
    <div v-for="(tags, index) in tagsListFilter" :key="tags" :style="`width: ${100 / tagsList.length}%`" class="tag-group">
      <ul class="tag-list">
        <li class="tag-item" v-for="tag in tags" :key="tag.tagId">
          <el-tooltip>
            <span class="tags-item__name">{{ tag.tagName }}【选择:{{ getTagVal(tag) }}】</span>
            <div slot="content" style="max-width: 400px; font-size: 14px;">
              {{ tag.tagName }}【选择:{{ getTagVal(tag) }}】
            </div>
          </el-tooltip>
        </li>
      </ul>
      <div v-if="(index === 0 && tagsListFilter.length > 1) || (index === 1 && tagsListFilter.length > 2)" class="tag-relation">
        <span class="tag-relation__wrap">
          <i class="tag-relation__cont">
            {{ tagsListFilter[index + 1][0].levelType === 'or' ? '或者' : tagsListFilter[index + 1][0].levelType === 'andNot' ? '剔除' : '' }}
          </i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'selected-tags-list',
  props: {
    tagsList: {
      type: Array,
      required: true
    }
  },
  computed: {
    tagsListFilter() {
      return this.tagsList.filter(tags => tags.length > 0);
    }
  },
  methods: {
    getTagVal(tagData) {
      const tag = JSON.parse(tagData.tagParams);
      return tag.selectedVal;
    }
  }
};
</script>

<style lang="less" scoped>
.tags {
  width: 100%;
  border-right: 2px solid #dcdfe6;
  border-left: 2px solid #dcdfe6;
  .tag-group {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      padding: 0 35px;
      width: 100%;
      font-size: 16px;
      min-height: 120px;
      .tag-item {
        padding: 5px 10px;
        max-width: 100%;
        background: #f3f6f9;
        border-radius: 2px;
        font-size: 14px;
        color: #606266;

        i {
          color: #999;
          padding-left: 10px;
        }

        .tags-item__name {
          display: inline-block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .tag-relation {
      position: relative;
      border-left: 2px solid #dcdfe6;
      .tag-relation__wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        color: #333;
        cursor: default;
        background: #dcdfe6;
        border-radius: 15px;
        box-shadow: 0 0 0 8px #fff;
        transform: translate(-50%, -50%) rotateZ(45deg);
        .tag-relation__cont {
          font-size: 14px;
          color: #303133;
          transform: rotateZ(-45deg);
        }
      }
    }
  }
}
</style>
