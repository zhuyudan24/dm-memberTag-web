<template>
  <el-dialog :visible.sync="showPop" :title="options.popTitle" width="566px" @close="closePop">
    <div class="manualTagEdit-wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="78px">
        <el-form-item label="标签名称" prop="tagName" class="w-329">
          <el-input class="w-220" placeholder="请输入内容" v-model="ruleForm.tagName" :maxlength="10"></el-input>
          <label class="input-label">{{ ruleForm.tagName.length }}/10</label>
        </el-form-item>
        <el-form-item label="所属分类" prop="tagLevel">
          <el-form-item prop="tagTwoLevelGroupId" class="fl">
            <el-select class="w-220" placeholder="请选择" v-model="ruleForm.tagTwoLevelGroupId" @change="changeTwo">
              <el-option
                v-for="item in optionsTwo"
                :key="item.tagLevelGroupId"
                :label="item.levelName"
                :value="item.tagLevelGroupId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="tagLevelGroupId" class="fl">
            <el-select class="w-220 m-l-8" placeholder="请选择" v-model="ruleForm.tagLevelGroupId">
              <el-option
                v-for="item in optionsThree"
                :key="item.tagLevelGroupId"
                :label="item.levelName"
                :value="item.tagLevelGroupId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="标签描述" prop="tagDescribe" class="w-560">
          <el-input class="w-447" type="textarea" row="4" v-model="ruleForm.tagDescribe" :maxlength="200">
          </el-input>
          <label class="textarea-label">{{ ruleForm.tagDescribe.length }}/200</label>
        </el-form-item>
      </el-form>
      <div class="manualTagEdit-btns">
        <el-button @click="closePop">取消</el-button>
        <el-button type="primary" @click="confirmSave">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import './manualTagEdit.css';
import showMsg from '@/common/js/showmsg';
import { getRequest} from '@/api/api';
/**
 * 轮询接口的实现方式
 *  refreshTag用来保存需要轮询的标签值tagItemIndex索引和tagItemId ID
 *  页面打开后，会调用getValueData根据取到的标签值的状态，将需要轮询的标签值存入refreshTag中，然后开始轮询
 *  添加和删除标签值后，会重新调用getValueData，执行上一步操作
 *  当有标签值状态更新后，会将refreshTag中对应的标签值移除
 *  当refreshTag中无数据时，终止轮询。
 * */
export default {
  name: 'manualTagEdit',
  props: {
    showPop: Boolean,
    options: Object
  },
  data() {
    return {
      // 编辑标签的时候,获取标签的 id
      // tagId: '',
      // 标签基本信息模块的表单
      ruleForm: {
        tagName: '',
        tagLevel: 'test',
        tagTwoLevelGroupId: '',
        tagLevelGroupId: '',
        tagDescribe: '',
        pending: false
      },
      // 标签基本信息模块的表单验证
      rules: {
        tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        tagLevel: [{ required: true, message: '' }],
        tagLevelGroupId: [{ required: true, message: '请选择所属分类', trigger: 'blur' }],
        tagTwoLevelGroupId: [{ required: true, message: '请选择所属分类', trigger: 'blur' }]
      },
      // 标签所属分类的下拉列表数据
      optionsTwo: [],
      optionsThree: [],

      // 标签值列表的数据
      tagValTableData: []
    };
  },
  watch: {
    options: {
      deep: true,
      handler(newVal) {
        this.ruleForm.tagTwoLevelGroupId = newVal.tagTwoLevelGroupId;
        this.ruleForm.tagLevelGroupId = newVal.tagLevelGroupId;
        if (newVal.tagId) {
          this.getTagData(newVal.tagId);
        } else {
          this.ruleForm.tagName = '';
          this.getOptionsThree(newVal.tagTwoLevelGroupId);
        }
      }
    }
  },
  methods: {
    closePop() {
      this.$emit('update:showPop', false);
    },
    // 保存标签基本信息
    confirmSave() {
      if (this.ruleForm.pending) return;
      this.ruleForm.pending = true;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) this.saveApi();
      });
    },

    // 保存标签基本信息
    saveApi() {
      const para = {
        tagId: this.options.tagId,
        tagName: this.ruleForm.tagName,
        tagDescribe: this.ruleForm.tagDescribe,
        tagLevelGroupId: this.ruleForm.tagLevelGroupId
      };

      getRequest('/memberTag/saveHandMemberTag', para).then(res => {
        const { errorCode, message } = res.data;
        this.ruleForm.pending = false;
        if (errorCode !== 1) {
          this.$message.error({
            duration: 1000,
            message: message
          })
          return;
        }
        showMsg.showmsg('保存成功', 'success');
        this.$emit('save');
        this.closePop();
      }).catch(error => {
        this.ruleForm.pending = false;
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 获取二级分类列表
    getOptionsTwo() {
      return getRequest('/tagLevel/handSecondLevel', {}).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          this.optionsTwo = result;
        }
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 点击二级分类获取三级分类列表
    changeTwo(value) {
      this.ruleForm.tagLevelGroupId = '';
      this.getOptionsThree(value);
    },

    // 获取三级分类列表
    getOptionsThree(tagLevelGroupId) {
      getRequest('/tagLevel/handThirdLevel', { tagLevelGroupId }).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          this.optionsThree = result;
        }
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 编辑时获取当前标签数据
    getTagData(tagId) {
      getRequest('/memberTag/getTagById', { tagId }).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          this.ruleForm.tagName = result.tagName;
          this.ruleForm.tagLevelGroupId = result.tagLevelGroupId;
          this.ruleForm.tagTwoLevelGroupId = result.tagTwoLevelGroupId;
          this.ruleForm.tagDescribe = result.tagDescribe;
          // 根据已选二级 id 获取三级列表
          this.getOptionsThree(result.tagTwoLevelGroupId);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  },
  mounted() {
    this.getOptionsTwo();
  }
}
</script>
<style lang="less" scoped>
  .input-label {
    position: absolute;
    top: 2px;
    right: 45px;
    z-index: 1;
    font-size: 12px;
    color: #C0C4CC;
  }

  .textarea-label {
    .input-label;
    top: 92px;
    right: 45px;
  }

  .manualTagEdit-btns {
    padding: 10px 0;
    text-align: right;
  }

  .w-447 {
    width: 447px;
  }

  .w-560 {
    width: 560px;
  }
</style>
