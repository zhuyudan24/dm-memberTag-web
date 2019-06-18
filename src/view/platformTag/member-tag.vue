<template>
<!-- @click.stop="collapseRightList($event)" -->
  <div class="member-tag">
    <div class="tag-container">
      <nav-crumb :navpath="navpath"></nav-crumb>

      <div class="member-box">
        <div class="tag-input">
          <el-input placeholder="请输入关键词回车搜索标签" prefix-icon="el-icon-search" style="width: 348px" v-model="memberTag" @keyup.native.enter="searchMemberList" @clear="allTagList" clearable></el-input>
        </div>
        <div class="main-tag">
          <div class="tag-list">
            <div class="search-box"></div>
            <p :class="['user-info', {'light-active': tagRealName === '我的用户'}]" @click="allTagList">我的用户</p>
            <div class="list-box">
              <TagType v-for="(list, i) in tagList" :key="i" :tag-list="list" @handleFristTag="handleFristTag"> </TagType>
            </div>
          </div>

          <div class="tag-all">
            <p class="tag-name">
              <!--{{ tagName }}-->
              {{showSearchResult ? `【${tagName}】搜索结果` : tagName}}
              <el-button type="primary" class="add-newtag" @click="editHandTag()" v-show="handTag == 1">新增标签</el-button>
            </p>

            <tag-container @deleteHandTag="deleteHandTag" :data="memberTagList" :handTag="handTag" :groupId="groupId" :refersh="refershList" @addTag="selectedTag" @editHandTag="editHandTag" ref="tagContainer" />

            <div class="page-box" v-if="total > 0">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>

            <!-- 我的标签 -->
            <div class="my-pop-tagbox" @click="expendsGroupList">
              <p class="txt">已选标签</p>
              <p class="number-txt">{{ groupListNumber }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="foot-box">
      <vue-gic-footer></vue-gic-footer>
    </div>

    <div class="group-right-list" :class="{'group-transtion-list': groupShow}">
      <div class="group-title">
        <i class="iconfont icon-17" />
        已选标签：
        <strong class="label-count">
          {{ groupListNumber }}
        </strong>
        <i class="el-icon-close icon-right" @click="groupShow = false" />
      </div>

      <div class="wapper">
          <p class="desc-labeltxt" :class="{ 'margin-60': marginSixty }">（一个输入框内标签关系为且）</p>
          <div class="inner">
            <tags-group-list
              :selectedTagsData="selectedTags"
              :tagsGroupRelation="tagsGroupRelation"
              @editTags="editTags"
              :activeTagsGroupIndex.sync="activeTagsGroupIndex"
              :activeTagIndex.sync="activeTagIndex"
            />
            <div class="form-item" :class="{ 'margin-60': marginSixty }">
              <label for="">分组名称</label>
              <el-input v-model="tagConfig.groupName" :maxlength="10" class="w-220" placeholder="请输入内容"></el-input>
              <span class="groupName-txt">{{ tagConfig.groupName.length }}/10</span>
            </div>
            <div class="form-item" :class="{ 'margin-60': marginSixty }">
              <label for="">
                分组有效期
                <el-tooltip content="分组有效期需早于所用标签的最早有效期，且最长不超过365天">
                  <i class="form-tip-icon">i</i>
                </el-tooltip>
              </label>
              <el-date-picker class="w-220" v-model="tagConfig.date" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"> </el-date-picker>
            </div>
            <div :class="['form-item', {'margin-60': marginSixty}]">
              <label for="">分组所属分类</label>
              <el-select v-model="tagConfig.memberTagGroupClassifyId">
                <el-option
                  v-for="item in memberGroupList"
                  :key="item.memberTagGroupClassifyId"
                  :value="item.memberTagGroupClassifyId"
                  :label="item.classifyName"
                />
              </el-select>
            </div>
            <div class="form-item" :class="{ 'margin-60': marginSixty }">
              <label for="">分组描述</label>
              <el-input type="textarea" v-model="tagConfig.textarea" :maxlength="200" rows="4" placeholder="请输入内容"></el-input>
              <span class="textarea-txt">{{ tagConfig.textarea.length }}/200</span>
            </div>
            <div class="form-item" v-show="tagConfig.isRealTime == 0" :class="{ 'margin-60': marginSixty }">
              <label for="">更新频率<span class="desc-labeltxt">（更新时间预计选择日期的凌晨0点至6点）</span></label>
              <el-select class="w-200" v-model="tagConfig.updateType" placeholder="请选择">
                <el-option v-for="(item, index) in rateData" :key="item.label" :label="item.label" :value="index + 1"></el-option>
              </el-select>
              <el-select class="w-200 p-l-8" v-model="tagConfig.updateDay" v-show="tagConfig.updateType != 1" placeholder="请选择">
                <el-option v-for="(item, index) in rateData[tagConfig.updateType ? tagConfig.updateType - 1 : 0].options" :key="item" :label="item" :value="index + 1"></el-option>
              </el-select>
            </div>
          </div>
        </div>

      <div class="fixed-btn">
        <el-button type="primary" @click="createNewGroup">创建会员分组</el-button>
      </div>
    </div>
    <edit-tag :showEditTagPop.sync="showEditTagPop" :tagData="tagData" :title="editPopType === 'add' ? '添加标签' : '更新标签'" @returnTagData="returnTagData" @refersh="refersh"></edit-tag>
    <manual-tag-edit :options="manualTagPop" :showPop.sync="manualTagPop.show" @save="addNewTag"></manual-tag-edit>
  </div>
</template>

<script>
import Vue from 'vue';
import { CollapseTransition } from 'element-ui';
import navCrumb from '@/components/nav/nav.vue';
import TagsGroupList from '../memberGroup/tags-group-list';
import TagType from './tag-type';
import TagContainer from './tag-container';
import ManualTagEdit from '../manualTag/manualTagEdit';
import { getMemberTag, getMemberTagList, addNewGroup, memberGroupList } from '@/request/api';
import EditTag from '../memberGroup/edit-tag';
import { mapState } from 'vuex';

Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  name: 'member-tag',

  componentName: 'member-tag',

  components: {
    navCrumb,
    TagType,
    TagContainer,
    TagsGroupList,
    EditTag,
    ManualTagEdit
  },

  data() {
    return {
      margin60: false,
      refershList: {},
      tagConfig: {
        groupName: '',
        // 会员分组分类id
        memberTagGroupClassifyId: '0',
        textarea: '', // 描述
        date: '', // 有效期
        updateType: '', // 更新类型频率
        updateDay: '', // 更新类型时间
        isRealTime: 0, // 实时
        effectiveStatus: 1 // 有效状态nage
      },
      activeTagsGroupIndex: 0,
      activeTagIndex: 0,
      groupShow: false,
      selectedTags: [[]],
      tagsGroupRelation: [],
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let oneYear = 365 * 24 * 3600 * 1000;
          let y = curDate + oneYear;
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > y;
        }
      },
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: `${window.location.origin}/report/#/memberSummary`,
          relocation: true
        },
        {
          name: '会员管理',
          path: ''
        },
        {
          name: '会员标签',
          path: ''
        }
      ],
      tagList: [],
      memberTagList: [], // 会员标签列表
      tagName: '全部标签',
      memberTag: '', // 搜索会员标签关键字
      showSearchResult: false, // tagName后面加“搜索结果”
      tagCategory: '', // 当前标签类别
      pageSize: 20,
      pageNum: 1,
      total: 0,

      // 分组分类
      memberGroupList: [],
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

      showEditTagPop: false,
      tagData: {},
      editPopType: 'add',
      manualTagPop: {
        show: false,
        popTitle: '',
        // popTitle: '编辑手工标签',
        // tagId: '6285cee7e2e14dddae3e2322c6ef6089'
        tagId: '',
        tagLevelGroupId: '',
        tagTwoLevelGroupId: ''
      }
    };
  },

  computed: {
    groupListNumber() {
      let listNumber = 0;
      let index = 0;
      while (index < this.selectedTags.length) {
        listNumber += this.selectedTags[index].length;
        index++;
      }
      this.checkRealTime();
      return listNumber;
    },
    marginSixty() {
      return this.selectedTags.length > 1;
    },
    ...mapState(['tagRealName'])
  },

  methods: {
    // 设置默认的分组有效期
    defaultDate() {
      let date = new Date(new Date().getTime() + 365 * 24 * 3600 * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      this.tagConfig.date = Y + M + D + '23:59:59';
    },
    // 收起右边的
    collapseRightList(eve) {
      // console.log(eve.target.className);
    },
    // 刷新
    refersh(list) {
      list.changeRefersh = true;
      this.refershList = list;
    },
    allTagList() {
      localStorage.setItem('groupId', '');
      this.params.id = '';
      this.params.type = -1;
      this.loadMemberTagList(this.params);
      this.tagName = '全部标签';
      this.handTag = false;
      this.$store.commit('modiftTagName', '我的用户');
    },
    checkRealTime() {
      let arr = this.selectedTags.reduce((curr, el) => {
        return curr.concat(el);
      }, []);

      let newActiveArr = arr.map(el => el.isActive);
      // 0 非实时 1 实时
      this.tagConfig.isRealTime = newActiveArr.indexOf(0) > -1 ? 0 : 1;
    },

    createNewGroup() {
      this.selectedTags.forEach((tagsGroup, tagsGroupIndex) => {
        let relation = this.tagsGroupRelation[tagsGroupIndex - 1];
        tagsGroup.forEach(item => {
          item.levelType = relation ? relation : 'or';
        })
      });
      const param = {
        groupName: this.tagConfig.groupName,
        memberTagGroupClassifyId: this.tagConfig.memberTagGroupClassifyId,
        isRealTime: this.tagConfig.isRealTime,
        describle: this.tagConfig.textarea,
        updateType: this.tagConfig.updateType,
        updateDay: this.tagConfig.updateDay,
        effectiveStatus: 1,
        requestProject: 'gic-member-tag-web',
        json: JSON.stringify(this.selectedTags),
        effectiveDateTmp: `${this.tagConfig.date.split(' ')[0]} 23:59:59`
      };
      // 必填项目
      const isEmpty = this.selectedTags.length === 0 || this.selectedTags.some(item => item.length === 0);
      if (isEmpty) {
        this.$message.warning({ message: '请至少保留一个标签！' })
        return;
      }
      if (param.groupName == '') {
        this.$message.warning({ message: '会员分组名称不能为空！' })
        return;
      }

      if (param.effectiveDateTmp == '') {
        this.$message.warning({ message: '会员分组有效期不能为空！' })
        return;
      }

      if (param.isRealTime === 0 && param.updateType !== 1 && param.updateDay === '') {
        this.$message.warning({ message: '会员分组更新频率不能为空！' })
        return;
      }

      addNewGroup(param)
        .then(res => {
          if (res.errorCode == 1) {
            this.$router.push({ path: 'memberGroupList' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    expendsGroupList() {
      // if (this.selectedTags && this.selectedTags.length) {
      this.groupShow = true;
      // }
    },
    returnTagData(tagData) {
      let tagParams = JSON.parse(tagData.tagParams);
      tagData.newTagVal = JSON.stringify(tagParams.selectedVal);
      tagData.level = this.activeTagsGroupIndex;
      switch (this.editPopType) {
        case 'add':
          const isHad = this.selectedTags[this.activeTagsGroupIndex].some(item => item.tagId === tagData.tagId);
          if (isHad) {
            this.selectedTags[this.activeTagsGroupIndex].forEach((tag, tagIndex) => {
              if (tag.tagId === tagData.tagId) {
                this.selectedTags[this.activeTagsGroupIndex].splice(tagIndex, 1, tagData);
              }
            });
          } else {
            this.selectedTags[this.activeTagsGroupIndex].push(tagData);
          }
          break;
        case 'edit':
          // 注意有坑
          let tagsGroup = this.selectedTags[this.activeTagsGroupIndex];
          tagsGroup.splice(this.activeTagIndex, 1, { ...tagsGroup[this.activeTagIndex], ...tagData });
          this.selectedTags.splice(this.activeTagsGroupIndex, 1, tagsGroup);
          break;
      }
    },
    editTags() {
      this.editPopType = 'edit';
      this.showEditTagPop = true;
      this.$nextTick(_ => {
        this.tagData = Object.assign({}, this.tagData, this.selectedTags[this.activeTagsGroupIndex][this.activeTagIndex]);
        this.tagData.editCondition = true;
      });
    },
    // 新增选择标签
    selectedTag(tagData) {
      this.editPopType = 'add';
      this.tagData = Object.assign({}, this.tagData, tagData);
      this.tagData.editCondition = false;
      this.showEditTagPop = true;
    },
    // 新增第三级手工标签
    editHandTag(list) {
      /**
       * 第一级标签切换时，重置manualTagPop.tagTwoLevelGroupId和manualTagPop.tagLevelGroupId为空
       * 第二级标签切换时，修改manualTagPop.tagTwoLevelGroupId为当前第二级标签的tagLevelGroupId，重置manualTagPop.tagLevelGroupId为空
       * 第三级标签切换时，修改manualTagPop。tagLevelGroupId为当前第三级标签的tagLevelGroupId，修改manualTagPop.tagTwoLevelGroupId为parentLevelGroupId
       *
       * 编辑三级手工标签，修改manualTagPop.tagId为list.tagId
       * 新增三级手工标签，重置manualTagPop.tagId为空
       *
       * 然后将manualTagPop传递给manualTagEdit组件
       * */
      this.manualTagPop.tagId = list ? list.tagId : '';
      this.manualTagPop.popTitle = list ? '编辑手工标签' : '新增手工标签';
      this.manualTagPop.show = true;
    },
    async getTagList() {
      const Data = await getMemberTag();
      if (Data.result && Data.result.length) {
        this.tagList = Data.result;
      } else {
        this.tagList = [];
      }
    },

    async loadMemberTagList(opt) {
      try {
        const params = {
          requestProject: 'gic-member-tag-web',
          search: opt.searchName || null, // 标签名
          tagLevelGroupId: opt.id || '', // 标签层级
          tagType: opt.type || null, // 标签类型
          pageNum: opt.pageNum || 1,
          pageSize: opt.pageSize || 20
        };
        const Data = await getMemberTagList(params);
        this.showSearchResult = !!opt.showSearchResult;
        if (Data.result.result && Data.result.result.length) {
          this.memberTagList = Data.result.result.map(el => ({
            ...el,
            refersh: false
          }));
          this.total = Data.result.totalCount;
        } else {
          this.memberTagList = [];
          this.total = 0;
        }
      } catch (e) {
        // console.log(e);
      }
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.params.pageSize = val;
      // const param = this.JudgeIsHandTag();
      this.loadMemberTagList(this.params);
    },
    // 当前页码改变
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.pageNum = val;
      this.loadMemberTagList(this.params);
    },
    /**
     * 判断是否是手工标签
     */
    JudgeIsHandTag() {
      let param = null;
      let keys = Object.keys(this.middleWareVariable);
      // 长度大于0就表示 有手工标签的值
      if (keys.length) {
        param = {
          id: this.middleWareVariable.id,
          type: this.middleWareVariable.type == 1 ? 1 : 0
        };
      }
      return param;
    },

    // 模糊查询会员标签
    searchMemberList() {
      if (this.memberTag) {
        this.tagName = this.memberTag;
      } else {
        this.tagName = '全部标签';
      }
      this.handTag = false;

      this.loadMemberTagList({
        searchName: this.memberTag,
        showSearchResult: true
      });
      // this.tagName = '全部标签';
      // this.handTag = null;
    },
    // 一级标签
    handleFristTag(list) {
      this.pageNum = 1;
      this.pageSize = 20;
      this.params.pageNum = 1;
      this.params.pageSize = 20;
      localStorage.setItem('groupId', '');
      this.saveHandTagData(list);
      this.saveTagLevelGroupId(list);
      this.loadMemberTagList(this.params);
      this.groupId = list.id;
      this.handTag = list.handTag;
      this.manualTagPop.tagTwoLevelGroupId = '';
      this.manualTagPop.tagLevelGroupId = '';
      this.changeTagTitle(list.name);
    },
    changeTagTitle(name) {
      this.tagName = name || '全部标签';
      this.$store.commit('modiftTagName', this.tagName);
    },
    saveTagLevelGroupId(list = {}) {
      this.params.id = list.id;
      if (list.handTag == 1) {
        // const hangObj = {
        //   name: list.name,
        //   type: 1,
        //   id: list.id
        // };
        // 要存下来是不是手工标签
        // this.params.type = 1;
        // localStorage.setItem('groupId', JSON.stringify(hangObj));
      } else {
        this.params.type = -1;
        localStorage.setItem('groupId', '');
      }
    },
    // 添加手工标签后刷新标签列表
    addNewTag() {
      this.loadMemberTagList(this.params);
    },
    // 删除手工
    deleteHandTag(id) {
      this.loadMemberTagList({
        id: id,
        type: 1 // 手工标签传1
      });
    },

    // 保存手工标签的数据 一 二 三 级
    saveHandTagData(list) {
      localStorage.setItem('middleHandtag', JSON.stringify(list));
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
          this.memberGroupList = result.slice(0);
        })
        .catch(err => {
          console.log(err);
        });
    }
    // onLoadV() {
    //   localStorage.setItem('jumpThirdTag', '');
    // }
  },

  beforeMount() {
    // 一二三级都需要一个变量来保存自己的信息 在切换页码和数量的时候也要传参数过去
    this.middleWareVariable = {};
    /**
     * 列表数据的参数
     *
     * 如果选中手工标签就判断是不是手工标签 是的话我们就存下手工标签的id和类型
     * 如果是其他的就去掉 groupId 的storage内容
     *
     */
    this.params = {
      requestProject: 'gic-member-tag-web',
      id: '',
      searchName: this.memberTag,
      type: -1,
      pageNum: 1,
      pageSize: 20
    };
    this.tagConfig = {
      groupName: '',
      memberTagGroupClassifyId: '0',
      isRealTime: '',
      textarea: '',
      updateType: '',
      updateDay: '',
      date: ''
    };
    this.handTag = null;
    this.groupId = '';
    this.getTagList();
    if (localStorage.getItem('groupId')) {
      const hangObj = JSON.parse(localStorage.getItem('groupId'));
      this.middleWareVariable = JSON.parse(JSON.stringify(hangObj));

      this.params.type = 1;
      this.params.id = hangObj.id;
      this.loadMemberTagList(this.params);
      this.tagName = hangObj.name;
      this.$store.commit('modiftTagName', this.tagName);
      this.handTag = true;
    } else {
      this.loadMemberTagList(this.params);
      this.$store.commit('modiftTagName', '我的用户');
    }
  },
  mounted() {
    this.$on('refersh-member-list', () => {
      this.getTagList();
    });

    // window.onload = this.onLoadV();

    // 处理二级标签
    this.$on('handle-second-tag', list => {
      this.middleWareVariable = {
        id: list.id,
        type: list.handTag,
        name: list.name
      };
      this.pageNum = 1;
      this.pageSize = 20;
      localStorage.setItem('groupId', '');
      this.saveHandTagData(list);
      this.saveTagLevelGroupId(list);
      this.loadMemberTagList(this.params);
      this.groupId = list.id;
      this.handTag = list.handTag;
      this.manualTagPop.tagTwoLevelGroupId = list.tagLevelGroupId;
      this.manualTagPop.tagLevelGroupId = '';
      this.changeTagTitle(list.name);
    });
    // 处理三级标签
    this.$on('edit-third-tag', _ => {
      let list = JSON.parse(localStorage.getItem('middleHandtag'));
      this.saveTagLevelGroupId(list);
    });

    this.$on('handle-third-tag', list => {
      this.middleWareVariable = {
        id: list.id,
        type: list.handTag,
        name: list.name
      };
      this.pageNum = 1;
      this.pageSize = 20;
      this.params.pageNum = 1;
      this.params.pageSize = 20;
      localStorage.setItem('groupId', '');
      this.saveHandTagData(list);
      this.saveTagLevelGroupId(list);
      this.loadMemberTagList(this.params);
      this.groupId = list.id;
      this.handTag = list.handTag;
      this.manualTagPop.tagTwoLevelGroupId = list.parentLevelGroupId;
      this.manualTagPop.tagLevelGroupId = list.tagLevelGroupId;
      this.changeTagTitle(list.name);
    });
    this.defaultDate();
    this.getMemberGroupList();
    // if (localStorage.getItem('jumpThirdTag')) {
    //   console.log(1);
    //   let tagList = JSON.parse(localStorage.getItem('jumpThirdTag'));
    //   this.params.id = tagList.id;
    //   this.params.type = 1;
    //   this.tagName = tagList.name;
    //   this.loadMemberTagList(this.params);
    // }
  }
};
</script>

<style lang="scss" scoped>
.deal-list-mask {
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background-color: transparent;
  z-index: 10;
}
.member-tag {
  position: relative;
  width: 100%;
  overflow-y: auto;
  .tag-container {
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 93px;
  }
  .foot-box {
    margin-top: -100px;
  }
  .main-tag {
    display: flex;
    border-top: 1px solid #ebeef5;
    .tag-list {
      overflow-y: auto;
      flex: 0 0 470px;
      padding: 23px 0 0 25px;
      // height: 580px;
      border-right: 1px solid #ebeef5;
      .user-info {
        font-size: 16px;
        color: #909399;
        cursor: pointer;
      }
      .light-active {
        color: #1890ff;
      }
    }
    .tag-all {
      flex: 1;
      position: relative;
      padding-bottom: 40px;
      .tag-name {
        line-height: 34px;
        padding: 10px 20px;
        font-size: 16px;
        color: #303133;
        font-weight: bold;
      }
      .page-box {
        float: right;
        margin: 20px;
      }
      .add-newtag {
        float: right;
        margin-bottom: 10px;
      }
    }
  }
  .member-box {
    padding-bottom: 20px;
    margin: 20px 32px 0;
    min-width: 1500px;
    min-height: 70vh;
    background-color: #fff;
    .tag-input {
      padding: 16px 20px;
    }
  }
  .my-pop-tagbox {
    position: fixed;
    z-index: 2;
    right: 120px;
    bottom: 100px;
    height: 70px;
    width: 70px;
    color: #fff;
    background-color: #1890ff;
    box-shadow: 0 0 5px #555;
    border-radius: 50%;
    cursor: pointer;
    .txt {
      text-align: center;
      padding-top: 25px;
      font-size: 12px;
    }
    .number-txt {
      text-align: center;
      padding-top: 5px;
      font-size: 14px;
    }
    &:hover {
      transition: all ease 0.3s;
      transform: scale(1.2);
    }
  }
  .group-right-list {
    position: fixed;
    top: 0px;
    right: -500px;
    bottom: 0px;
    box-shadow: 0 0 5px #bbb;
    background-color: #fff;
    z-index: 1001;
    transition: all .3s ease-in;
    .group-title {
      padding: 10px;
      height: 50px;
      line-height: 30px;
      font-size: 14px;
      color: #303133;
      background-color: #f3f6f9;
      border: 1px solid rgba(235, 238, 245, 1);
      .label-count {
        font-size: 16px;
      }
      .icon-right {
        float: right;
        margin-top: 7px;
        cursor: pointer;
      }
    }
    .form-item {
      margin-top: 20px;
      margin-bottom: 20px;
      color: #606266;
      label {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
        font-size: 14px;
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
    }
    .refresh-txt {
      color: #606266;
    }
    .wapper {
      height: calc(100% - 130px);
      padding: 10px;
      overflow-y: auto;
      .desc-labeltxt {
        padding: 10px;
        color: #909399;
        font-size: 14px;
      }
    }
    .marginwapper {
      margin-left: 0px;
    }
    .fixed-btn {
      position: absolute;
      height: 56px;
      line-height: 56px;
      right: 0px;
      left: 0px;
      bottom: 0px;
      width: 100%;
      text-align: center;
      background-color: #fff;
      box-shadow: 3px 0px 12px 2px rgba(220, 223, 230, 0.75);
    }
  }
  .group-transtion-list {
    transition: all .3s ease-in;
    right: 0px;
  }
  .groupName-txt {
    position: relative;
    color: #909399;
    top: 2px;
    left: -45px;
    font-size: 12px;
  }
  .textarea-txt {
    float: right;
    transform: translate(0, 10px);
    color: #909399;
    font-size: 12px;
  }
}
.margin-60 {
  margin-left: 60px;
}
</style>
