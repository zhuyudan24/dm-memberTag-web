<template>
  <div class="manualTagList-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <!-- 子类 -->
        <div class="common-wrap__cateTags">
          <tag-category ref="tagCategoryCom" :tagLibName="tagLibName"></tag-category
          ><!-- :tagCateId="currentGroupId" -->
        </div>
        <div class="common-wrap__opt">
          <el-input class="w-184" placeholder="搜索标签" prefix-icon="el-icon-search" v-model="tagSearch" clearable @clear="clearSearch" @keyup.enter.native="searchEnterFun"> </el-input>
          <el-button @click="toAddMyTagLib('mult')" class="fr m-l-8">添加至我的标签库</el-button>
          <el-button @click="showCateDialog" class="fr">分类设置</el-button>
          <el-button type="primary" @click="toManualTagEdit" class="fr">新增标签</el-button>
        </div>
        <div class="common-wrap__table m-t-20">
          <el-table ref="multipleTable" :data="tagTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectChange">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column prop="tagName" label="标签名称" show-overflow-tooltip>
              <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
            </el-table-column>
            <el-table-column prop="tagDescribe" label="标签描述" show-overflow-tooltip> </el-table-column>
            <el-table-column label="是否实时">
              <template slot-scope="scope">
                {{ scope.row.isActive == 1 ? '实时' : '非实时' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
              <template slot-scope="scope">
                <router-link
                  :to="{
                    path: '/manualTagDetail',
                    query: {
                      tagId: scope.row.tagId,
                      addFlag: scope.row.isAdd,
                      form: 'notMyTag',
                      navSign: 'manualTag'
                    }
                  }"
                  class="edit-btn el-button--text"
                  >详情</router-link
                >
                <router-link :to="{ path: '/manualTagEdit', query: { tagId: scope.row.tagId } }" class="edit-btn el-button--text p-l-10">编辑</router-link>
                <!-- <el-popover
                  placement="top"
                  width="160"
                  v-model="scope.row.popVisible">
                  <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelDelTag(scope.$index,scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="toDelTag(scope.$index,scope.row)">确定</el-button>
                  </div> -->
                <el-button slot="reference" class="p-l-10" type="text" @click="toDelTag(scope.$index, scope.row)">
                  删除
                </el-button>
                <!-- </el-popover> -->
                <el-button type="text" size="small" class="" @click="toAddMyTagLib('single', scope.row.tagId)" :disabled="scope.row.isAdd == 1">
                  {{ scope.row.isAdd == 1 ? '已' : '' }}添加至我的标签库
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block common-wrap__page text-right" v-if="tagTableData.length != 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 分类设置 -->
    <el-dialog title="分类设置" :visible.sync="cateTableVisible" width="543px" class="cate-dialog" :before-close="closeCateDialog">
      <el-form :model="cateForm" :rules="rules" ref="cateForm" label-width="80px" :label-position="'left'">
        <el-form-item label="二级分类" prop="cateTwo">
          <el-select v-model="cateForm.cateTwo" placeholder="请选择" @change="cateTwoChange">
            <el-option v-for="item in cateTwOptions" :key="item.tagLevelGroupId" :label="item.levelName" :value="item.tagLevelGroupId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" prop="cateThree">
          <el-input v-model="cateForm.cateThree" auto-complete="off" placeholder="请输入分类名称" @keyup.native="value => toInput(value)"></el-input>
          <label class="input-label">{{ inputNum }}/{{ limitLength }}</label>
          <el-button type="text" size="small" class="" @click="toAddCate('cateForm')">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="cateTableData" height="275">
        <el-table-column label="分类名称">
          <template slot-scope="scope">
            {{ !scope.row.editAble ? scope.row.levelName : '' }}
            <el-input
              v-if="scope.row.editAble"
              size="small"
              class="h5-el-input"
              v-model="scope.row.inputValue"
              type="text"
              placeholder="请输入分类名称"
              @keyup.native="value => toEditInput(value, scope.$index, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.editAble" type="text" size="small" :disabled="!scope.row.enterpriseId ? true : false" class="" @click="toEditCate(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-popover
              v-if="!scope.row.editAble"
              placement="top"
              width="160"
              v-model="scope.row.popVisible">
              <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="cancelDelTag(scope.$index,scope.row)">取消</el-button>
                <el-button type="primary" size="mini" @click="toDelCate(scope.$index,scope.row)">确定</el-button>
              </div> -->
            <!-- <el-button slot="reference" class="p-l-20" type="text">
                删除
              </el-button> -->
            <el-button v-if="!scope.row.editAble" slot="reference" type="text" size="small" :disabled="!scope.row.enterpriseId ? true : false" class="" @click="toDelCate(scope.$index, scope.row)"
              >删除</el-button
            >
            <!-- </el-popover> -->

            <el-button v-if="scope.row.editAble" type="text" @click.stop="confirmEdit(scope.$index, scope.row)">确认</el-button>
            <el-button v-if="scope.row.editAble" type="text" @click.stop="cancleEdit(scope.$index, scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import navCrumb from '@/components/nav/nav.vue';
import tagCategory from '@/components/tagCategory.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'manualTagList',
  data() {
    return {
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
        },
        {
          name: '手工标签库',
          path: '/manualTagLib'
        },
        {
          name: '手工标签列表',
          path: ''
        }
      ],

      tagLibName: 'manualTag', // 面包屑分类需要的参数

      tagSearch: '', // 搜索值绑定的参数

      // 标签列表数据
      tagTableData: [
        // {
        //   tagId: 1,
        //   tagName: "123",
        //   tagDescribe: '描述描述，最多200字，一行显示50字，默认显示一行',
        //   isActive: 1,
        //   isAdd: 0,
        // }
      ],
      selTagTableData: [], // 已选择

      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 子分类数据
      currentGroupId: 0, // 当前分类 id

      // 分类设置
      cateTableVisible: false,
      inputNum: 0,
      limitLength: 10,
      cateForm: {
        // 添加三级分类 form
        cateTwo: '',
        cateThree: ''
      },
      rules: {
        cateTwo: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        cateThree: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      cateTwOptions: [], // 二级分类列表
      cateTableData: [
        // 二级分类下三级列表数据
        // {
        //   enterpriseId: null,
        //   groupChain: "0_fc19fd4806d74ac9b2ca9111aaf0a812_48b08c669d074166abc57ed6b4929543",
        //   icon: null,
        //   level: 1,
        //   levelName: "活动参与",
        //   parentLevelGroupId: "fc19fd4806d74ac9b2ca9111aaf0a812",
        //   status: 1,
        //   tagGroupType: 1,
        //   tagLevelGroupId: "48b08c669d074166abc57ed6b4929543",
        // }
        // {
        //   tagLevelGroupId: 1,
        //   levelName: '分类1',
        //   inputValue: '',
        //   editAble: false,
        // },
        // {
        //   tagLevelGroupId: 1,
        //   levelName: '分类2',
        //   inputValue: '',
        //   editAble: false,
        // },
      ]
    };
  },
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     * 添加到我的标签库
     */
    toAddMyTagLib(flag, id) {
      const that = this;
      console.log(id);
      const para = {};
      if (flag === 'mult') {
        if (!that.selTagTableData.length) {
          that.$message.error({ message: '请选择标签' });
          return false;
        }
        para.tagIds = [];
        that.selTagTableData.forEach(function(ele, index) {
          para.tagIds.push(ele.tagId);
        });
        console.log(para);
        para.tagIds = para.tagIds.join(',');
        that.addByTagId('addByTagIds', para);
      } else {
        para.tagId = id;
        that.addByTagId('addByTagId', para);
      }
    },

    /**
     * 添加单个ID至我的标签库
     */
    addByTagId(name, para) {
      const that = this;

      getRequest(`/enterpriseMemberTag/${name}`, para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          var resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.getTagList();
            return;
          }

          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);

          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 搜索标签
     */
    searchEnterFun(e) {
      const that = this;
      console.log(e);
      that.currentPage = 1;
      that.getTagList();
    },

    /**
     * 搜索标签清空
     */
    clearSearch() {
      const that = this;
      that.currentPage = 1;
      that.getTagList();
    },

    /**
     * 表格---多选
     */
    handleSelectChange(val) {
      const that = this;
      // console.log(val);
      that.selTagTableData = val;
    },

    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      const that = this;
      // console.log(`每页 ${val} 条`);
      that.pageSize = val;
      that.getTagList();
    },

    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      const that = this;
      // console.log(`当前页: ${val}`);
      that.currentPage = val;
      let fullPath = that.$route.fullPath;
      if (fullPath.includes('?')) {
        that.$router.push(`${that.$route.path}?tagLevelGroupId=${that.$route.query.tagLevelGroupId}&currentPage=${val}`);
      }
      that.getTagList();
    },

    /**
     * 获取当前分类下下的标签
     */
    getTagList(val) {
      const that = this;
      const para = {
        tagName: that.tagSearch, // 搜索字段
        tagLevelGroupId: that.currentGroupId, // 当前分类的id
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize // 一页显示个数
      };

      getRequest('/memberTag/handTagPageList', para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          var resData = res.data;
          if (resData.errorCode == 1) {
            that.tagTableData = resData.result.result;
            that.total = resData.result.totalCount;
            return;
          }

          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);

          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 删除当前标签 -- 取消
     */
    cancelDelTag(index, row) {
      row.popVisible = false;
    },

    /**
     * 删除当前标签 -- 取消
     */
    toDelTag(index, row) {
      const that = this;
      that
        .$confirm('删除标签后，符合该标签值的会员对应标签值将同步删除。一旦删除将无法恢复，确认要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postDelTag(index, row);
        })
        .catch(() => {});
    },

    /**
     * 删除当前标签 --- api
     */
    postDelTag(index, row) {
      const that = this;
      let para = {
        tagId: row.tagId
      };

      getRequest('/memberTag/delHandMemberTag', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tagTableData.splice(index, 1);
            showMsg.showmsg('删除成功', 'success');
            return;
          } else if (resData.errorCode == 100005) {
            that.$message.error({
              duration: 1000,
              message: '该标签正在被会员分组使用，无法删除！'
            });
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 点击新增标签
     */
    toManualTagEdit() {
      const that = this;
      that.changeRoute('/manualTagEdit');
    },

    /**
     * 判断添加重复字段
     */
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },

    /**
     * 点击分类设置-显示弹窗
     */
    showCateDialog() {
      const that = this;
      that.cateTableVisible = true;
      that.getTWoLevel();
    },

    /**
     * 点击二级分类获取三级分类列表
     */
    cateTwoChange(e) {
      const that = this;
      // 清空原有值
      that.cateForm.cateThree = '';
      that.inputNum = 0;
      that.getThreeLevel(e);
    },

    /**
     * 添加分类
     */
    toAddCate(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.cateForm.levelName = that.cateForm.cateThree;
          that.cateForm.editAble = false;
          that.cateForm.inputValue = '';
          let newCateTableData = JSON.parse(JSON.stringify(that.cateTableData));
          newCateTableData.push(JSON.parse(JSON.stringify(that.cateForm)));
          let arrKeys = newCateTableData.map(item => item.levelName); // 返回对象中键值集合的数组

          if (that.isRepeat(arrKeys)) {
            newCateTableData.splice(that.cateTableData.length - 1, 1);
            that.$message.error({
              duration: 1000,
              message: '名称不能重复'
            });
            return;
          }
          // showMsg.showmsg('添加成功','success')
          that.postAdd();
        } else {
          return false;
        }
      });
    },

    /**
     * 添加分类--请求 api
     */
    postAdd() {
      const that = this;
      let para = {
        parentLevelGroupId: that.cateForm.cateTwo,
        levelName: that.cateForm.cateThree
      };

      getRequest('/tagLevel/addHand', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // 更新外层分类
            that.$refs.tagCategoryCom.refreshData();
            showMsg.showmsg('添加成功', 'success');
            that.getThreeLevel(that.cateForm.cateTwo);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 编辑分类
     */
    toEditCate(index, item) {
      item.editAble = true;
      item.inputValue = item.levelName;
    },

    /**
     * 删除分类
     */
    toDelCate(index, item) {
      const that = this;
      that
        .$confirm('删除分类后，该分类下所有标签进入未分类，确认要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postDel(index, item);
        })
        .catch(() => {});
    },

    /**
     * 确认删除三级分类
     */
    postDel(index, item) {
      const that = this;
      let para = {
        tagLevelGroupId: item.tagLevelGroupId
      };

      getRequest('/tagLevel/delHand', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.cateTableData.splice(index, 1);
            // 更新外层分类
            that.$refs.tagCategoryCom.refreshData();
            showMsg.showmsg('删除成功', 'success');
            return;
          } else if (resData.errorCode == 200001) {
            that.$message.error({
              duration: 1000,
              message: '该标签被会员分组使用，无法删除!'
            });
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 确认编辑分类
     */
    confirmEdit(index, item) {
      const that = this;
      if (!item.inputValue.trim()) {
        that.$message.error({
          duration: 1000,
          message: '请输入分类名称'
        });
        return false;
      }

      let newCateTableData = JSON.parse(JSON.stringify(that.cateTableData));
      newCateTableData[index].levelName = item.inputValue;
      let arrKeys = newCateTableData.map(item => item.levelName); // 返回对象中键值集合的数组
      if (that.isRepeat(arrKeys)) {
        that.$message.error({
          duration: 1000,
          message: '名称不能重复'
        });
        return;
      }
      // 提交接口
      that.postEdit(item);
    },

    /**
     * 确认编辑单击分类
     */
    postEdit(item) {
      const that = this;
      let para = {
        tagLevelGroupId: item.tagLevelGroupId,
        levelName: item.inputValue
      };

      getRequest('/tagLevel/editHand', para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 1) {
            item.levelName = item.inputValue;
            item.editAble = false;
            // 更新外层分类
            that.$refs.tagCategoryCom.refreshData();
            showMsg.showmsg('保存成功', 'success');
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 取消编辑分类
     */
    cancleEdit(index, item) {
      item.editAble = false;
    },

    /**
     * 输入三级分类名
     */
    toInput: function(value) {
      const that = this;
      let temp = '';
      temp = strLength.getByteVal(value.target.value, that.limitLength);
      that.cateForm.cateThree = temp.trim();
      that.inputNum = strLength.getZhLen(temp.trim());
    },

    /**
     * 输入三级分类名
     */
    toEditInput: function(value, index, row) {
      const that = this;
      let editTemp = '';
      editTemp = strLength.getByteVal(value.target.value, that.limitLength);
      row.inputValue = editTemp.trim();
    },

    /**
     * 关闭弹框
     */
    closeCateDialog() {
      const that = this;
      that.cateTableVisible = false;
      that.cateForm.cateTwo = '';
      that.cateForm.cateThree = '';
      that.cateTableData = [];
      that.inputNum = 0;
    },

    /**
     * 取消-->关闭弹框
     */
    cancelDialog() {
      const that = this;
      that.closeCateDialog();
    },

    /**
     * 确定-->关闭弹框
     */
    confirmDialog() {
      const that = this;
      that.closeCateDialog();
    },

    /**
     * 获取二级分类
     */
    getTWoLevel() {
      const that = this;
      let para = {};
      getRequest('/tagLevel/handSecondLevel', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.cateTwOptions = resData.result;
            that.cateForm.cateTwo = that.cateTwOptions[0].tagLevelGroupId;
            that.getThreeLevel(that.cateForm.cateTwo);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 获取三级分类
     */
    getThreeLevel(twoId) {
      const that = this;
      let para = {
        tagLevelGroupId: twoId
      };
      that.cateTableData = [];
      getRequest('/tagLevel/handThirdLevel', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            resData.result.forEach(function(ele, index) {
              ele.inputValue = '';
              ele.editAble = false;
            });
            that.cateTableData = resData.result;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    getUrlParams() {
      const that = this;
      // 获取标签库中传递的搜索字段
      that.tagSearch = !!that.$route.query.searchName ? that.$route.query.searchName : '';
      // 获取标签库传递过来的分类 id
      that.currentGroupId = !!that.$route.query.tagLevelGroupId ? that.$route.query.tagLevelGroupId : 0;
      // 获取页码
      that.currentPage = !!that.$route.query.currentPage ? parseInt(that.$route.query.currentPage) : 1;
      document.getElementById('app').style.zIndex = 'auto';
      that.getTagList();
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        const that = this;
        that.getUrlParams();
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    const that = this;
    that.getUrlParams();
  },
  components: {
    navCrumb,
    tagCategory
  }
};
</script>
<style lang="scss" scoped>
.cate-dialog {
  .el-form {
    .el-button--text {
      margin-left: 10px;
      vertical-align: middle;
    }
  }

  .el-select {
    width: 226px;
  }

  .el-input {
    width: 226px;
  }
}

.input-label {
  position: absolute;
  right: 210px;
  top: 2px;
  color: #909399;
  font-size: 12px;
}
</style>
