<template>
  <div>
    <!-- 添加标签、编辑标签 -->
    <el-dialog :title="title" :visible.sync="showEditTagPop" top="10vh" width="900px" :before-close="handleClose" custom-class="edit-tag" :close-on-click-modal="false" append-to-body>
      <div class="dialog-box">
        <div class="tag-info">
          <p class="tag-name">
            {{ tagDataAssgin.tagName }}
            <span class="tag-flag">{{ tagDataAssgin.isActive == 1 ? '实时' : '非实时' }}</span>
          </p>
          <p class="tag-desc">{{ tagDataAssgin.tagDescribe }}</p>
        </div>
        <p v-if="tagId" class="m-t-20 m-b-20 tag-config">标签值设置</p>
        <!-- 所有标签的配置项 -->
        <div class="tag-config-options">
          <tag-config-options v-if="isAddFlag" :tagId="tagDataAssgin.tagId" ref="tagConfig" :templateDataList="templateObj" @returnTagData="returnTagData"></tag-config-options>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import './edit-tag.css';
import TagConfigOptions from '@/components/tag/tag-config-options';
// import tagDetails from '@/components/tagDetail/mixin/index';

export default {
  name: 'edit-tag',
  components: {
    TagConfigOptions
  },
  props: {
    // 是否现在编辑标签的弹窗
    showEditTagPop: Boolean,
    // 编辑标签的弹窗标题
    title: String,
    // 标签数据
    tagData: Object
  },

  data() {
    return {
      tagId: '',
      postTemplateData: {
        selectedVal: [],
        template: []
      },
      templateData: [],
      tagDataAssgin: {},
      templateObj: {},
      isAddFlag: false
    };
  },
  watch: {
    tagData: {
      immediate: true,
      handler(newval) {
        this.isAddFlag = false;
        setTimeout(_ => {
          this.isAddFlag = true;
          this.tagId = newval.tagId;
          this.tagDataAssgin = newval;
          this.templateObj = newval;
        }, 20);
      }
    }
  },
  // mixins: [tagDetails],
  methods: {
    handleClose() {
      this.$emit('update:showEditTagPop', false);
    },
    handleSave() {
      const ret = this.$refs.tagConfig.getTemplateData();

      this.templateData = JSON.parse(JSON.stringify(ret));
      this.tagId = this.tagDataAssgin.tagId;

      this.$refs.tagConfig.saveConfirm().then(res => {
        if (res) {
          this.$emit('update:showEditTagPop', false);
          this.$emit('refersh', this.tagDataAssgin);
        }
      });
    },
    returnTagData(list) {
      this.$emit('returnTagData', list);
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-box {
  .tag-info {
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
    .tag-name {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      font-weight: 600;
      color: #303133;
      .tag-flag {
        margin-left: 6px;
        padding: 3px 10px;
        font-size: 12px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: #1890ff;
        color: #fff;
      }
    }
    .icon-tag-name {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
    .tag-desc {
      margin-top: 5px;
      font-size: 14px;
      color: #606266;
    }
  }
  .tag-config {
    font-size: 14px;
    color: #606266;
  }
  .tag-config-options {
    max-height: 50vh;
    overflow-y: scroll;
  }
  .tag-value {
    margin-top: 10px;
    padding-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
