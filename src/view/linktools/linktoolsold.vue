<template>
  <!-- 链接小工具 -->
  <div class="link-tools-contain">
    <el-dialog :class="activeName == 'first' ? 'min-1051' : 'min-720'" title="链接小工具" :visible.sync="mylinkToolsVisible" :before-close="handleClose">
      <!-- 链接类型 -->
      <div class="links-types">
        <label class="types-title">链接类型:</label>
        <el-select v-model="linksType" placeholder="请选择" @change="linksTypeChange">
          <el-option v-for="item in linksTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-select v-model="twoLevelValue" placeholder="请选择" v-if="twoLevelVisible" @change="twoLevelValueChange">
          <el-option v-for="item in twoLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-select v-model="threeLevelValue" placeholder="请选择" v-if="threeLevelVisible" @change="threeLevelValueChange">
          <el-option v-for="item in threeLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <!-- 商品分类链接 -->
        <div class="goods-category">
          <treeselect
            v-model="goodsCategory"
            :options="goodsCategoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有品类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            @select="goodsCategorySelect"
          />
        </div>
      </div>
      <!-- h5 -->
      <div class="h5link-contain" v-if="h5linkVisible">
        <div class="h5link-row">
          <label class="h5link-title">名字:</label>
          <el-input v-model="h5linkObj.name" placeholder="请输入网址"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">网址:</label>
          <el-input v-model="h5linkObj.url" placeholder="请输入网址"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">固定参数:</label>
          <el-input v-model="h5linkObj.fixParam" type="textarea" resize="none" :rows="4" placeholder="请输入固定参数(可选)"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">动态参数:</label>
          <!-- <el-input v-model="h5linkObj.dynamicPara" placeholder="请输入动态参数(可选)"></el-input> -->
          <el-select v-model="h5linkObj.dynamicPara" multiple placeholder="请选择">
            <el-option v-for="item in dynamicParaOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
      </div>
      <!-- 商品链接 -->
      <div class="goods-links-contian">
        <div class="links-tools-row">
          <treeselect
            :value="category"
            :options="categoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有品类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            @select="categorySelect"
          />

          <treeselect
            v-model="classify"
            :options="classifyOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有分类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            @select="classifySelect"
          />
          <el-input class="links-tools-input" placeholder="请输入商品名称/货号" v-model="searchGoods" @keyup.native="value => toSearchInput(value)" clearable @clear="clearInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <!-- 商品列表 -->
        <div class="goods-link-content">
          <ul class="goods-link-list">
            <li class="goods-link-item" v-for="(item, index) in goodsList" @click="selectLinkItem(item)" :key="item.name + index">
              <img :src="item.src" alt="商品图片" />
              <div class="inline-block goods-message">
                <p class="limit-2">{{ item.name }}</p>
                <p class="gray-color">货号：{{ item.goodsNum }}</p>
                <span>￥{{ item.price }}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 分页 -->
        <div class="links-tools-page">
          <el-pagination
            @size-change="linkSizeChange"
            @current-change="linkCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 30, 40, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品链接" name="first">
          <!-- 商品链接 -->
          <div class="links-tools-row">
            <treeselect
              :value="category"
              :options="categoryOptions"
              :normalizer="normalizer"
              :default-expand-level="1"
              placeholder="所有品类"
              noOptionsText="暂无数据"
              noResultsText="无数据"
              @select="categorySelect"
            />

            <treeselect
              v-model="classify"
              :options="classifyOptions"
              :normalizer="normalizer"
              :default-expand-level="1"
              placeholder="所有分类"
              noOptionsText="暂无数据"
              noResultsText="无数据"
              @select="classifySelect"
            />
            <el-input class="links-tools-input" placeholder="请输入商品名称/货号" v-model="searchGoods" @keyup.native="value => toSearchInput(value)" clearable @clear="clearInput">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <!-- 商品列表 -->
          <div class="goods-link-content">
            <ul class="goods-link-list">
              <li class="goods-link-item" v-for="(item, index) in goodsList" @click="selectLinkItem(item)" :key="item.name + index">
                <img :src="item.src" alt="商品图片" />
                <div class="inline-block goods-message">
                  <p class="limit-2">{{ item.name }}</p>
                  <p class="gray-color">货号：{{ item.goodsNum }}</p>
                  <span>￥{{ item.price }}</span>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页 -->
          <div class="links-tools-page">
            <el-pagination
              @size-change="linkSizeChange"
              @current-change="linkCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>

        <el-tab-pane label="商品分类链接" name="second">
          <!-- 商品分类链接 -->
          <div class="goods-category">
            <treeselect
              v-model="goodsCategory"
              :options="goodsCategoryOptions"
              :normalizer="normalizer"
              :default-expand-level="1"
              placeholder="所有品类"
              noOptionsText="暂无数据"
              noResultsText="无数据"
              @select="goodsCategorySelect"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="主功能页面链接" name="third">
          <!-- 主功能页面链接 -->
          <div class="main-function-page">
            <el-tree :data="mainFunctionPage" :expand-on-click-node="false" :props="defaultMainPageProps" @node-click="mainPageNodeClick"></el-tree>
          </div>
        </el-tab-pane>

        <el-tab-pane label="自定义页面链接" name="fourth">
          <!-- 自定义页面链接 -->
          <div class="definepage">
            <ul class="definepage-ul">
              <li class="definepage-ul-li" v-for="(item, index) in definePageList" @click="definePageClick(item)" :key="item.name + index">
                {{ item.name }}
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLinkSelect">取 消</el-button>
        <el-button type="primary" @click="confirmLinkSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 使用树形插件
// import the component
import Treeselect from '@riophae/vue-treeselect';
export default {
  name: 'links',
  props: ['linkToolsVisible'],
  data() {
    return {
      // ---------------------------
      twoLevelVisible: true,
      threeLevelVisible: true,
      // 链接类型
      linksType: '',
      linksTypeOptions: [
        {
          id: '1',
          value: 'shoplink',
          label: '商城链接'
        },
        {
          id: '2',
          value: 'memberlink',
          label: '会员功能链接'
        },
        {
          id: '3',
          value: 'definelink',
          label: '自定义页面'
        },
        {
          id: '4',
          value: 'h5link',
          label: 'H5页面'
        },
        {
          id: '5',
          value: 'otherlink',
          label: '其他小程序'
        }
      ],
      // 二级数据
      twoLevelValue: '',
      twoLevelOptions: [
        {
          id: '1',
          value: 'shoplink',
          label: '商城链接'
        }
      ],
      // 三级数据
      threeLevelValue: '',
      threeLevelOptions: [
        {
          id: '1',
          value: 'shoplink',
          label: '商城链接'
        }
      ],

      // h5link
      h5linkVisible: false,
      h5linkObj: {
        name: '',
        url: '',
        fixParam: '',
        dynamicPara: '',
        dynamicParaOptions: []
      },
      // ---------------------------
      activeName: 'first',
      mylinkToolsVisible: this.linkToolsVisible,
      // 商品/分类/页面
      selectType: 1, // 1:商品 ; 2:分类; 3/4:页面
      // 品类
      searchGoods: '',
      category: null,
      categoryOptions: [
        {
          key: 'a',
          name: 'a',
          subOptions: [
            {
              key: 'aa',
              name: 'aa'
            }
          ]
        }
      ],
      normalizer(node /*, id */) {
        // there is an extra `id` argument,
        // which could be useful if you have multiple instances
        // of vue-treeselect that share the same `normalizer` function
        return {
          id: node.key,
          label: node.name,
          children: node.subOptions
        };
      },
      goodsList: [
        {
          id: '111',
          name: '美商海盗船Gaming系列 K70 RGB Rapidfire',
          goodsNum: 'errerr',
          src: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
          price: 567
        },
        {
          id: '112',
          name: '美商海盗船Gaming系列 K70 RGB Rapidfire',
          goodsNum: 'errerr',
          src: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
          price: 567
        },
        {
          id: '113',
          name: '美商海盗船Gaming系列 K70 RGB Rapidfire',
          goodsNum: 'errerr',
          src: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
          price: 567
        },
        {
          id: '112',
          name: '美商海盗船Gaming系列 K70 RGB Rapidfire',
          goodsNum: 'errerr',
          src: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
          price: 567
        },
        {
          id: '113',
          name: '美商海盗船Gaming系列 K70 RGB Rapidfire',
          goodsNum: 'errerr',
          src: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
          price: 567
        }
      ],
      // 分页
      currentPage: 1, // 当前页
      pageSize: 20, // 一页显示的个数
      total: 0, // 总数

      // 分类
      classify: null,
      classifyOptions: [
        {
          key: 'b',
          name: 'b',
          subOptions: [
            {
              key: 'bb',
              name: 'bb'
            }
          ]
        }
      ],

      // 商品分类
      goodsCategory: null,
      goodsCategoryOptions: [
        {
          key: 'a',
          name: 'a',
          subOptions: [
            {
              key: 'aa',
              name: 'aa'
            },
            {
              key: 'a1',
              name: 'a1'
            },
            {
              key: 'a2',
              name: 'a2'
            }
          ]
        }
      ],

      // 主功能页面
      mainFunctionPage: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultMainPageProps: {
        children: 'children',
        label: 'label'
      },
      //自定义页面
      definePageList: [
        {
          id: '111',
          name: '测试1',
          src: ''
        },
        {
          id: '112',
          name: '测试2',
          src: ''
        },
        {
          id: '113',
          name: '测试3',
          src: ''
        },
        {
          id: '114',
          name: '测试4',
          src: ''
        },
        {
          id: '115',
          name: '测试5',
          src: ''
        },
        {
          id: '116',
          name: '测试6',
          src: ''
        },
        {
          id: '117',
          name: '测试7',
          src: ''
        },
        {
          id: '118',
          name: '测试8',
          src: ''
        },
        {
          id: '119',
          name: '测试9',
          src: ''
        }
      ]
    };
  },
  methods: {
    // --------------------------------------------------
    // 选择类型改变
    /* eslint-disable */
    linksTypeChange: function(e) {
      /* var that = this;
      console.log(e); */
    },
    // twoLevelValueChange
    /* eslint-disable */
    twoLevelValueChange(e) {
      /* var that = this;
      console.log(e); */
    },
    // threeLevelValueChange
    /* eslint-disable */
    threeLevelValueChange(e) {
      // var that = this;
      // console.log(e);
    },

    // 取消操作
    cancelLinkSelect() {
      let that = this;
      that.$confirm('确认关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: ''
      })
        .then(() => {
          console.log('点起确认');
          that.$emit('linkSelect');
        })
        .catch(() => {
          console.log('取消 取消关闭');
        });
    },

    // 确认操作
    confirmLinkSelect() {
      var that = this;
      console.log(that.linksType, that.twoLevelValue, that.threeLevelValue);
      // 触发父组件方法,传递参数
      that.$emit('linkSelect');
    },

    // --------------------------------------------------
    handleClick(tab, event) {
      console.log(tab, event);
      var that = this;
      switch (that.activeName) {
        case 'first':
          that.selectType = 1;
          break;
        case 'second':
          that.selectType = 2;
          break;
        case 'third':
          that.selectType = 3;
          break;
        case 'fourth':
          that.selectType = 3;
          break;
      }

      console.log(that.selectType);
    },

    // -------------------------------------------
    //选择树形节点方法

    // categorySelect
    categorySelect(node, id) {
      var that = this;
      console.log(node, id);
      // 重新获取商品列表
      that.getGoodsList();
    },
    // classifySelect
    classifySelect(node, id) {
      var that = this;
      console.log(node, id);
      // 重新获取商品列表
      that.getGoodsList();
    },

    // 商品分类 goodsCategorySelect
    goodsCategorySelect(node, id) {
      var that = this;
      console.log(node, id);
      // 调用 确认/取消 弹窗
      that.selectLinkItem();
    },

    // --------------------------------------------

    // 关闭
    handleClose(done) {
      var that = this;
      that
        .$confirm('确认关闭？')
        .then(_ => {
          done();
          that.mylinkToolsVisible = false;
          console.log(this.mylinkToolsVisible);
          that.$emit('linkSelect');
        })
        .catch(_ => {});
    },

    // 分页
    linkSizeChange(val) {
      var that = this;
      console.log(`每页 ${val} 条`, that.pageSize);
      that.pageSize = val;
    },

    // 页码变化触发
    linkCurrentChange(val) {
      var that = this;
      console.log(`当前页: ${val}`, that.currentPage);
      that.currentPage = val;
    },

    // 选择商品链接,弹窗提示
    selectLinkItem(item) {
      var that = this;
      console.log(item);
      // 判断是商品/分类/页面
      var selectTypeName = null;
      switch (that.selectType) {
        case 1:
          selectTypeName = '商品';
          break;
        case 2:
          selectTypeName = '分类';
          break;
        case 3:
          selectTypeName = '页面';
          break;
        case 4:
          selectTypeName = '页面';
          break;
      }

      console.log(that.selectType, selectTypeName);
      that
        .$confirm('确认选择' + selectTypeName, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        })
        .then(() => {
          // that.$emit('linkSelect')
          this.$message({
            type: 'success',
            message: '确定'
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消'
          // });
        });
      // that.$emit('linkSelect')
    },

    // 搜索输入
    toSearchInput: function(value) {
      var that = this;
      console.log(that.searchGoods, value);
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
      }
    },
    // 清空输入
    clearInput: function(e) {
      var that = this;
      console.log(e, that.searchGoods);
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
      }
    },

    // 获取商品列表
    /* eslint-disable */
    getGoodsList() {

    },

    // 主功能页面链接
    mainPageNodeClick: function(data) {
      var that = this;
      console.log(data);
      // 弹窗提示
      that.selectLinkItem();
    },

    // 自定义页面链接
    definePageClick(data) {
      var that = this;
      console.log(data);
      // 弹窗提示
      that.selectLinkItem();
    }
  },

  watch: {
    linkToolsVisible(val) {
      console.log(val);
      this.mylinkToolsVisible = val; //新增linkToolsVisible的watch，监听变更并同步到linkToolsVisible上
    }
  },

  mounted() {
    console.log('00000');
  },

  components: {
    Treeselect
  }
};
</script>

<style lang="scss" scoped>
.el-tab-pane {
  min-height: 200px;
}

.vue-treeselect {
  display: inline-block;
}

.inline-block {
  display: inline-block;
}

.goods-link-content {
  padding: 15px 0 20px 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  .goods-link-list {
    font-size: 0;
    li:nth-child(3n + 3) {
      margin-right: 0;
    }
  }
}
.goods-link-item {
  display: inline-block;
  width: 310px;
  padding: 0 10px;
  height: 110px;
  border: 1px solid #e7e7eb;

  margin-right: 7px;
  margin-bottom: 10px;
  cursor: pointer;
}
.goods-link-item img {
  width: 80px;
  height: 80px;
  display: inline-block;
  margin-top: 10px;
}

.goods-message {
  width: 65%;
  margin-top: 10px;
  vertical-align: top;
  margin-left: 5px;
  white-space: normal;
  word-break: break-all;
}

.limit-2 {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: pre-wrap;
  word-break: break-all;
  overflow: hidden;
}

/* .links-tools-row {
  overflow: hidden;
} */

/* 分页 */
.links-tools-page {
  text-align: right;
}

.goods-category {
  height: 300px;
  overflow: auto;
}

/* 主功能 */
.main-function-page {
  height: 300px;
  overflow: auto;
}

/* 自定义 */
.definepage {
  height: 300px;
  overflow: auto;
  .definepage-ul {
    li {
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      &:hover {
        background: #f5f5f8;
      }
    }
  }
}

/************************************************/
.links-types {
  .types-title {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
}

/* 商品链接 */
.goods-links-contian {
  margin-top: 10px;
}

/* h5链接 */
.h5link-row {
  width: 100%;
  margin-top: 10px;

  label {
    display: inline-block;
    width: 80px;
    text-align: right;
  }

  .el-input,
  .el-textarea {
    width: 450px;
  }

  .el-textarea {
    vertical-align: top;
  }
}
</style>
