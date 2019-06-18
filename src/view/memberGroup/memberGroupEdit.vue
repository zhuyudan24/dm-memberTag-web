<template>
  <div class="common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="memberGroupEdit-wrap__body">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label prop="selectedTag">
              <div :class="['label-title', {'m-l-60': ruleForm.selectedTags.length > 1}]">
                已选标签
                <span class="color-909399 font-14">（同一个输入框内标签关系为且）</span>
              </div>
              <tags-group-list
                :selectedTagsData="ruleForm.selectedTags"
                :tagsGroupRelation="ruleForm.tagsGroupRelation"
                :activeTagsGroupIndex.sync="activeTagsGroupIndex"
                :activeTagIndex.sync="activeTagIndex"
                :showAddMenu="true"
                @addTags="addTags"
                @editTags="editTags"
              />
            </el-form-item>
            <el-form-item
              label
              prop="groupName"
              :class="['w-220', {'m-l-60': ruleForm.selectedTags.length > 1}]"
            >
              <div class="label-title">分组名称</div>
              <el-input
                class="w-220"
                v-model="ruleForm.groupName"
                :maxlength="10"
                placeholder="请输入分组名称"
              ></el-input>
              <label class="input-label">{{ ruleForm.groupName.length }}/10</label>
            </el-form-item>
            <el-form-item
              label
              prop="effectiveDateTmp"
              :class="{'m-l-60': ruleForm.selectedTags.length > 1}"
            >
              <div class="effective label-title">
                分组有效期
                <el-tooltip content="分组有效期需早于所用标签的最早有效期，且最长不超过365天">
                  <i class="form-tip-icon">i</i>
                </el-tooltip>
              </div>
              <el-date-picker
                v-model="ruleForm.effectiveDateTmp"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="23:59:59"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label prop :class="{'m-l-60': ruleForm.selectedTags.length > 1}">
              <div class="label-title">分组所属分类</div>
              <el-select v-model="ruleForm.memberTagGroupClassifyId">
                <el-option
                  v-for="item in memberGroupList"
                  :key="item.memberTagGroupClassifyId"
                  :value="item.memberTagGroupClassifyId"
                  :label="item.classifyName"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label
              prop="describle"
              :class="['w-400', {'m-l-60': ruleForm.selectedTags.length > 1}]"
            >
              <div class="label-title">分组描述</div>
              <el-input
                class="w-400"
                type="textarea"
                v-model="ruleForm.describle"
                :maxlength="200"
                rows="4"
              ></el-input>
              <label class="textarea-label">{{ ruleForm.describle.length }}/200</label>
            </el-form-item>
            <el-form-item
              label
              prop="updateDay"
              v-show="ruleForm.isActive == 0"
              :class="{'m-l-60': ruleForm.selectedTags.length > 1}"
            >
              <div class="label-title">
                更新频率
                <span class="form-tip-text">(更新时间预计选择日期的凌晨0点至6点)</span>
              </div>
              <el-select
                class="w-200"
                v-model="ruleForm.updateType"
                placeholder="请选择"
                @change="ruleForm.updateDay = ''"
              >
                <el-option
                  v-for="(item, index) in rateData"
                  :key="item.label"
                  :label="item.label"
                  :value="index + 1"
                ></el-option>
              </el-select>
              <el-select
                class="w-200 p-l-8"
                v-model="ruleForm.updateDay"
                v-show="ruleForm.updateType != 1"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in rateData[ruleForm.updateType ? ruleForm.updateType - 1 : 0].options"
                  :key="item"
                  :label="item"
                  :value="index + 1"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label :class="{'m-l-60': ruleForm.selectedTags.length > 1}">
              <el-button
                type="primary"
                @click.stop="confirmSavePost"
              >{{$route.query.memberTagGroupId ? '保存': '创建会员分组'}}</el-button>
              <el-button>
                <router-link to="/memberGroupList">返回</router-link>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 选择标签 -->
    <el-dialog :visible.sync="showSelectTagPop" title="选择标签" custom-class="tags-body" width="980px">
      <div class="tags">
        <div class="tags-list">
          <el-tree
            :data="tagsList"
            :props="{ label: 'nameStr', children: 'children' }"
            :default-expand-all="true"
            :highlight-current="true"
            @node-click="treeClick"
          ></el-tree>
        </div>
        <div class="tags-table">
          <div class="tags-search">
            <el-input
              type="search"
              placeholder="请输入关键词回车搜索标签"
              prefix-icon="el-icon-search"
              v-model="searchData"
              @keydown.native.enter="searchTags"
            ></el-input>
          </div>
          <tag-container
            :data="tagsGroupList"
            :refersh="refreshList"
            @addTag="selectedTag"
            style="height: 475px"
          ></tag-container>
          <div class="page-box">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[20, 30]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              v-if="total > 0"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--  添加标签、编辑标签  -->
    <edit-tag
      :showEditTagPop.sync="showEditTagPop"
      :tagData="tagData"
      :title="editPopType === 'add' ? '添加标签' : '编辑标签'"
      @returnTagData="returnTagData"
      @refersh="refresh"
    ></edit-tag>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import './tags-detail.css';
import navCrumb from '@/components/nav/nav.vue';
import tagContainer from '@/view/platformTag/tag-container.vue';
import editTag from './edit-tag';
import tagsGroupList from './tags-group-list.vue';
import showMsg from '@/common/js/showmsg';
import { postRequest } from '@/api/api';
import { getMemberTagCount } from '@/request/memberGroup.js';
import { getMemberTagList, memberGroupList } from '@/request/api.js';

export default {
  name: 'memberGroupEdit',
  data() {
    const rateOneValid = (rule, value, callback) => {
      console.log(value);
      if (this.ruleForm.isActive == 0 && value == '') {
        callback(new Error('请选择更新频率'));
      } else {
        callback();
      }
    };
    const rateValid = (rule, value, callback) => {
      console.log(value, this.ruleForm);
      if (this.ruleForm.isActive == 0 && (this.ruleForm.updateType != '1' || this.ruleForm.updateType == '') && value == '') {
        console.log(value, this.ruleForm);
        callback(new Error('请选择更新频率'));
      } else {
        callback();
      }
    };
    return {
      templateCode: '',
      // 编辑数据
      ruleForm: {
        // 会员分组id
        memberTagGroupId: '',
        // 会员分组分类id
        memberTagGroupClassifyId: '',
        // 已选标签
        selectedTags: [
          [
            // {
            //   tagId: 'a',
            //   tagName: '有车一族',
            //   tagValue: '233',
            //   newTagVal: '233',
            //   tagParams: '',
            //   isActive: 0
            // }
          ]
        ],
        // 标签组之间的关系
        tagsGroupRelation: [],
        newTagVal: '',
        // 分组名称
        groupName: '',
        // 分组有效期
        effectiveDateTmp: '',
        // 分组描述
        describle: '',
        // 非实时需要根据标签判断
        isActive: 0,
        // 更新频率类型 1=每日一次 2=每周一次 3=每月一次
        updateType: '',
        // 更新日期
        // 每日更新一次，无更新日期
        // 每周更新一次，更新日期1到7对应周一到周日
        // 每月更新一次，更新日期为每月1到28号
        updateDay: '',
        effectiveStatus: 1
      },
      refreshList: {},

      // 标签组的索引
      activeTagsGroupIndex: 0,
      // 标签的索引
      activeTagIndex: 0,

      // 有效期时间选择器的配置
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let oneYear = 365 * 24 * 3600 * 1000;
          let y = curDate + oneYear;
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > y;
        }
      },
      // 会员分组分类
      memberGroupList: {},
      // 表单验证规则
      rules: {
        selectedTags: [{ type: 'array', required: true, message: '请选择标签', trigger: 'blur' }],
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        effectiveDateTmp: [{ required: true, message: '请选择分组过期时间', trigger: 'change' }],
        updateType: [{ validator: rateOneValid, trigger: 'blur' }],
        updateDay: [{ validator: rateValid, trigger: 'change' }]
      },

      // 更新频率
      rateData: [
        {
          label: '每日一次',
          options: []
        },
        {
          label: '每周一次',
          options: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        {
          label: '每月一次',
          options: [
            '1号',
            '2号',
            '3号',
            '4号',
            '5号',
            '6号',
            '7号',
            '8号',
            '9号',
            '10号',
            '11号',
            '12号',
            '13号',
            '14号',
            '15号',
            '16号',
            '17号',
            '18号',
            '19号',
            '20号',
            '21号',
            '22号',
            '23号',
            '24号',
            '25号',
            '26号',
            '27号',
            '28号'
          ]
        }
      ],

      // 是否显示选择标签的弹窗
      showSelectTagPop: false,
      // 标签分组的数据
      tagsList: [],
      // 一组标签的数据
      tagsGroupList: [],
      // 搜索框
      searchData: '',

      // 是否显示编辑标签的弹窗
      showEditTagPop: false,
      // 编辑标签的弹窗类型 add=新增 edit=编辑
      editPopType: 'add',
      // 单个标签的数据
      tagData: {},

      // 分页相关
      pageNum: 1,
      pageSize: 20,
      total: 0
    };
  },
  computed: {
    // 面包屑参数
    navpath() {
      let memberTagGroupId = this.$route.query.memberTagGroupId;
      return [
        {
          name: '首页',
          path: `${window.location.origin}/report/#/memberSummary`,
          relocation: true
        },
        {
          name: '会员标签',
          path: ''
        },
        {
          name: '会员分组',
          path: '/memberGroupList'
        },
        {
          name: memberTagGroupId ? '会员分组编辑' : '新增会员分组',
          path: ''
        }
      ];
    }
  },
  /**
   * 检查标签是不是实时
   * 1=实时 0=非实时
   */
  watch: {
    'ruleForm.selectedTags': {
      deep: true,
      handler() {
        let flag =
          this.ruleForm.selectedTags.length === 0 ||
          this.ruleForm.selectedTags.some(tagsGroup => {
            return tagsGroup.length === 0 || tagsGroup.some(tag => parseInt(tag.isActive) === 0);
          });
        this.ruleForm.isActive = flag ? 0 : 1;
      }
    }
  },
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },
    refresh(list) {
      list.changeRefersh = true;
      this.refershList = list;
    },

    // 添加标签
    addTags() {
      this.editPopType = 'add';
      this.showSelectTagPop = true;
    },

    // 编辑标签
    editTags() {
      this.editPopType = 'edit';
      this.showEditTagPop = true;
      this.$nextTick(() => {
        this.tagData = Object.assign({}, this.tagData, this.ruleForm.selectedTags[this.activeTagsGroupIndex][this.activeTagIndex]);
        this.tagData.editCondition = true;
      });
    },

    // 选择标签
    selectedTag(tagData) {
      this.showEditTagPop = true;
      this.tagData = Object.assign({}, this.tagData, tagData);
      this.tagData.editCondition = false;
    },
    // 保存选择的标签数据
    returnTagData(data) {
      let tagParams = JSON.parse(data.tagParams);
      data.newTagVal = JSON.stringify(tagParams.selectedVal);

      data.level = this.activeTagsGroupIndex;

      switch (this.editPopType) {
        case 'add':
          const isHad = this.ruleForm.selectedTags[this.activeTagsGroupIndex].some(item => item.tagId === data.tagId);
          if (isHad) {
            this.ruleForm.selectedTags[this.activeTagsGroupIndex].forEach((tag, tagIndex) => {
              if (tag.tagId === data.tagId) {
                this.ruleForm.selectedTags[this.activeTagsGroupIndex].splice(tagIndex, 1, data);
              }
            });
          } else {
            this.ruleForm.selectedTags[this.activeTagsGroupIndex].push(data);
          }
          break;
        case 'edit':
          // 注意有坑
          let tagsGroup = this.ruleForm.selectedTags[this.activeTagsGroupIndex];
          tagsGroup.splice(this.activeTagIndex, 1, { ...tagsGroup[this.activeTagIndex], ...data });
          this.ruleForm.selectedTags.splice(this.activeTagsGroupIndex, 1, tagsGroup);
          break;
      }
    },

    /**
     * 点击保存
     */
    confirmSavePost() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const flag = this.ruleForm.isActive === 0 && this.ruleForm.updateType !== 1 && this.ruleForm.updateDay === '';
          const isEmpty = this.ruleForm.selectedTags.length === 0 || this.ruleForm.selectedTags.some(item => item.length === 0);
          if (flag) {
            this.$message.error({ message: '请选择更新频率!' });
            return false;
          }
          if (isEmpty) {
            this.$message.error({ message: '请至少保留一个标签!' });
            return false;
          }
          this.postSave();
        }
      });
    },

    /**
     * 点击保存---api
     */
    postSave() {
      let ruleForm = this.ruleForm;

      ruleForm.selectedTags.forEach((tagsGroup, tagsGroupIndex) => {
        let relation = ruleForm.tagsGroupRelation[tagsGroupIndex - 1];
        tagsGroup.forEach(item => {
          item.levelType = relation ? relation : 'or';
        });
      });
      const para = {
        memberTagGroupId: ruleForm.memberTagGroupId,
        memberTagGroupClassifyId: ruleForm.memberTagGroupClassifyId,
        groupName: ruleForm.groupName,
        isRealTime: ruleForm.isActive,
        describle: ruleForm.describle,
        updateType: ruleForm.updateType,
        updateDay: ruleForm.updateDay,
        effectiveStatus: ruleForm.effectiveStatus,
        json: JSON.stringify(ruleForm.selectedTags),
        effectiveDateTmp: `${ruleForm.effectiveDateTmp.split(' ')[0]} 23:59:59`
      };

      let postUrl = !!this.ruleForm.memberTagGroupId ? '/member-tag-group/update.json' : '/member-tag-group/add.json';

      postRequest(postUrl, para)
        .then(res => {
          if (res.data.errorCode === 1) {
            showMsg.showmsg(this.ruleForm.memberTagGroupId ? '编辑成功' : '新增成功', 'success');
            this.changeRoute('/memberGroupList');
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch(error => {
          this.$message.warning(error);
        });
    },

    // 获取标签分类
    getTagsList() {
      getMemberTagCount().then(res => {
        if (res.result && res.result.length) {
          this.tagsList = res.result;
          this.tagsList.forEach(first => {
            first.nameStr = first.name;
            first.children.forEach(second => {
              second.nameStr = second.name;
              second.children.forEach(item => {
                item.nameStr = item.name;
                if (item.count && item.count > 0) {
                  item.nameStr = `${item.name} (${item.count})`;
                }
              });
            });
          });
        } else {
          this.tagsList = [];
        }
      });
    },
    // 获取一个标签分类下面的标签数据
    getTagsGroupList(opt) {
      opt = opt ? opt : {};
      const params = {
        requestProject: 'gic-member-tag-web',
        search: opt.searchName || null, // 模糊查询的标签名
        tagLevelGroupId: opt.id || 0, // 标签层级
        tagType: opt.type || null, // 标签类型 手工标签传1
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getMemberTagList(params).then(res => {
        if (res.result.result && res.result.result.length) {
          this.tagsGroupList = res.result.result;
          this.total = res.result.totalCount;
        } else {
          this.tagsGroupList = [];
          this.total = 0;
        }
        console.log('tagsGroupList', this.tagsGroupList);
      });
    },
    // 搜索标签
    searchTags() {
      if (this.searchData.length > 0) {
        this.pageNum = 1;
        this.getTagsGroupList({
          searchName: this.searchData
        });
      }
    },
    // 点击tree 选择标签组
    treeClick(data, node) {
      if (node.level === 3) {
        this.pageNum = 1;
        this.getTagsGroupList({
          id: data.id,
          type: data.handTag
        });
      }
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getTagsGroupList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTagsGroupList();
    },
    /**
     * 编辑会员分组的时候时候---获取会员分组数据
     */
    getGroupData() {
      postRequest('/member-tag-group/findOneDetial.json', { memberTagGroupId: this.ruleForm.memberTagGroupId })
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 1) {
            let tagGroupDto = resData.result.tagGroupDto;
            console.log('tagGroupDto', tagGroupDto.memberTagGroupClassifyId);
            if (!!tagGroupDto) {
              this.ruleForm.memberTagGroupClassifyId = tagGroupDto.memberTagGroupClassifyId || '0';
              this.ruleForm.groupName = tagGroupDto.groupName;
              this.ruleForm.isActive = tagGroupDto.isRealTime;
              this.ruleForm.effectiveStatus = tagGroupDto.effectiveStatus;
              this.ruleForm.describle = tagGroupDto.describle;
              this.ruleForm.effectiveDateTmp = tagGroupDto.effectiveDate;
              this.ruleForm.updateType = !!tagGroupDto.updateType ? Number(tagGroupDto.updateType) : '';
              this.ruleForm.updateDay = !!tagGroupDto.updateDay ? Number(tagGroupDto.updateDay) : '';
            }

            let tagValueDtoList = Array.isArray(resData.result.tagValueDtoList) ? resData.result.tagValueDtoList : [];

            this.ruleForm.selectedTags = tagValueDtoList.map(item => {
              return item.map(el => {
                if (Object.prototype.toString.call(el) === '[object Object]') {
                  let newTagVal = JSON.parse(el.tagParams);
                  el.newTagVal = newTagVal.selectedVal ? JSON.stringify(newTagVal.selectedVal) : '';
                }
                return el;
              });
            });
            this.ruleForm.selectedTags = this.ruleForm.selectedTags.filter(item => item.length > 0);
            this.ruleForm.selectedTags.map((tagsGroup, index) => {
              if (this.ruleForm.selectedTags[index + 1]) {
                this.ruleForm.tagsGroupRelation.push(this.ruleForm.selectedTags[index + 1][0].levelType ? this.ruleForm.selectedTags[index + 1][0].levelType : 'or');
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMemberGroupList() {
      memberGroupList({ requestProject: 'gic-member-tag-web' })
        .then(res => {
          let { errorCode, message, result } = res;
          if (errorCode !== 1) {
            this.$message.error(message);
            return;
          }
          result = result || [];
          result.forEach(item => {
            if (item.memberTagGroupClassifyId === 'b3a45c4711134c939b5f8ee31a10f646') {
              console.log(item);
            }
          });
          this.memberGroupList = result.slice(0);
          console.log('memberTagGroupClassifyId', this.ruleForm.memberTagGroupClassifyId);
          this.ruleForm.memberTagGroupClassifyId = this.ruleForm.memberTagGroupClassifyId || '0';
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    let localData = sessionStorage.getItem('selectTempTag');
    let memberTagGroupId = this.$route.query.memberTagGroupId;
    if (!!localData) {
      this.ruleForm.selectedTags = JSON.parse(localData);
      sessionStorage.removeItem('selectTempTag');
    }

    if (!!memberTagGroupId) {
      this.ruleForm.memberTagGroupId = memberTagGroupId;
      this.getGroupData();
    } else {
      let date = new Date(new Date().getTime() + 365 * 24 * 3600 * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      this.ruleForm.effectiveDateTmp = Y + M + D + '23:59:59';
    }
    this.getTagsList();
    this.getTagsGroupList();
    this.getMemberGroupList();
  },
  components: {
    navCrumb,
    tagsGroupList,
    tagContainer,
    editTag
  }
};
</script>

<style lang="scss" scoped>
.m-l-60 {
  margin-left: 60px;
}
.w-460 {
  width: 460px;
}

.memberGroupEdit-wrap__body {
  width: 100%;
  font-size: 14px;

  .effective {
    display: flex;
    align-items: center;
  }
  .label-title {
    font-size: 14px;
    color: #606266;
  }

  .form-tip-text {
    margin-top: 8px;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: #909399;
  }
  .form-tip-icon {
    margin-left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14px;
    height: 14px;
    font-size: 12px;
    color: #909399;
    border: 1px solid #909399;
    border-radius: 14px;
    cursor: pointer;
  }

  .input-label {
    position: absolute;
    right: 10px;
    top: 34px;
    font-size: 12px;
    color: #909399;
  }

  .textarea-label {
    position: absolute;
    right: 10px;
    top: 126px;
    font-size: 12px;
    color: #909399;
  }
}

.tags {
  display: flex;
  border-top: 1px solid #dcdfe6;
  .tags-list {
    padding-top: 20px;
    width: 20%;
    height: 620px;
    border-right: 1px solid #dcdfe6;
    overflow-x: scroll;
  }
  .tags-table {
    padding-top: 20px;
    width: 80%;

    .tags-search {
      margin: 0 0 20px 20px;
      width: 300px;
    }
  }
}
.page-box {
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
