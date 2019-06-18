<template>
  <!--自定义字段列表-弹框-->
  <el-dialog title="自定义字段列表" :visible.sync="showFlag" :before-close="handleClose" width="600px">
    <div class="checkwtip mBottom10">
      请选择您想显示的列表详细信息，最多勾选8个选项，已经勾选了<span class="curcheck">{{ checkedFields.length }}</span> 个
    </div>
    <el-checkbox-group v-model="checkedFields" :min="0" :max="8">
      <div class="checkwrap flex flex-wrap">
        <div class="checkwrap-item line-30" v-for="(item, index) in memberFields" :key="index">
          <el-checkbox :label="item.code" :key="item.code">{{ item.name }}</el-checkbox>
        </div>
      </div>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSel">取 消</el-button>
      <el-button type="primary" @click="submitFields">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
/* eslint-disable */
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'userDefined',
  props: {
    showUserDefined: Boolean,
    selectedData:[],
    fieldsData: []
  },
  data() {
    return {
      checkedFields: [],
      memberFields: [],
      showFlag: false
    };
  },
  methods: {
    /**
     * 关闭
     */
    handleClose(done) {
      this.$emit('hideUserDefined', false);
    },

    submitFields() {
      this.$emit('confirmUserDefined', this.checkedFields);
    },

    /**
     * 取消选择
     */
    cancelSel() {
      this.handleClose();
    }
  },
  watch: {
    showUserDefined: function(newData, oldData) {
      this.showFlag = newData;
    },
    fieldsData: function(newData, oldData) {
      this.memberFields = newData;
    },
    selectedData: function(newData, oldData) {
      this.checkedFields = newData;
    }
  }
};
</script>
<style lang="scss" scoped>
.checkwtip {
  padding: 10px;
  background-color: #f8f9fb;
}

.mBottom10 {
  margin-bottom: 10px;
}

.el-checkbox-group {
  font-size: 0;
}

.checkwrap {
  width: 100%;
}

.checkwrap-item {
  /*-ms-flex: 25%;
    flex: 25%;*/
  width: 25%;
}

.line-30 {
  line-height: 30px;
}
</style>
