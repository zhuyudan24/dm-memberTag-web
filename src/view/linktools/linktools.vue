<!--
/**
 * 链接小工具组件(弹窗) by fairyly on 2018/06/15
 * 组件调用
 */
<linktools  :linkToolsVisible="linkToolsVisible" @linkSelect="linkSelect"/>

import Linktools from 'components/linktools/linktools.vue'

// 链接小工具参数
linkToolsVisible: false,

// methods
// linktools
showLinkDialog() {
  this.linkToolsVisible = true;
},

linkSelect(val) {
  console.log(val)
  // 关闭时隐藏
  this.linkToolsVisible = false;
}

components: {
  Linktools
}

 -->

<template>
  <!-- 链接小工具 -->
  <div class="link-tools-contain">
    <el-dialog :class="activeName == 'first' ? 'min-1026' : 'min-720'" title="链接小工具" :visible.sync="mylinkToolsVisible" :before-close="handleClose">
      <!-- 链接类型 -->
      <div class="links-types">
        <label class="types-title">链接类型:</label>
        <el-select v-model="linksType" placeholder="请选择" @change="linksTypeChange">
          <el-option v-for="item in linksTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <!-- 二级下拉 -->
        <el-select v-model="twoLevelValue" placeholder="请选择" v-if="twoLevelVisible" @change="twoLevelValueChange">
          <el-option v-for="item in twoLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <!-- 三级下拉 -->
        <div class="three-level-wrap" v-if="threeLevelVisible">
          <!-- 三级暂无单选 -->
          <!-- <el-select v-model="threeLevelValue" placeholder="请选择" v-if="threeLeveloneVisible" @change="threeLevelValueChange">
            <el-option
              v-for="item in threeLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- 商品分类链接 -->
          <treeselect
            v-if="threeLevelTreeVisible"
            v-model="threeLevelValue"
            :options="goodsCategoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有分类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            @select="goodsCategorySelect"
          />
          <!-- 搜索后出现下列 -->
          <el-select
            v-if="threeLevelSearchVisible"
            v-model="threeLevelValue"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            @change="threeLevelValueChange"
          >
            <el-option v-for="item in threeLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
      </div>

      <!-- h5 -->
      <div class="h5link-contain" v-if="h5linkVisible">
        <div class="h5link-row">
          <label class="h5link-title">名称:</label>
          <el-input v-model="h5linkObj.name" placeholder="请输入名称"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">网址:</label>
          <el-input v-model="h5linkObj.url" placeholder="请输入网址"></el-input
          ><a class="h5link-help" href="http://doc.demogic.com/doc/index.php?s=/41&page_id=441" target="_blank">【帮助文档】请联系公司技术人员查看文档配置标准链接</a>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">固定参数:</label>
          <el-input v-model="h5linkObj.fixParam" type="textarea" resize="none" :rows="4" placeholder="请输入固定参数(可选)"></el-input>
        </div>
        <div class="h5link-row">
          <label class="h5link-title">动态参数:</label>
          <!-- <el-input v-model="h5linkObj.dynamicPara" placeholder="请输入动态参数(可选)"></el-input> -->
          <el-select class="dynamic-param-select" v-model="h5linkObj.dynamicPara" multiple placeholder="请选择动态参数(可选)">
            <el-option v-for="item in h5linkObj.dynamicParaOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
      </div>

      <!-- 商品链接 -->
      <div class="goods-links-contian" v-if="goodsLinksVisible">
        <div class="links-tools-row">
          <!-- 品类 -->
          <treeselect
            v-model="category"
            :options="categoryOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            :flat="true"
            placeholder="所有品类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            no-children-text="无数据"
            :load-options="loadOptions"
            :beforeClearAll="beforeClearCategory"
            @select="categorySelect"
          />
          <!-- 分类树形结构 -->
          <treeselect
            v-model="classify"
            :options="classifyOptions"
            :normalizer="normalizer"
            :default-expand-level="1"
            placeholder="所有分类"
            noOptionsText="暂无数据"
            noResultsText="无数据"
            noChildrenText="无数据"
            :beforeClearAll="beforeClearClassify"
            @select="classifySelect"
          />
          <el-input class="links-tools-input" placeholder="请输入商品名称/货号" v-model="searchGoods" @keyup.native="value => toSearchInput(value)" clearable @clear="clearInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <!-- 商品列表 -->
        <div class="goods-link-content">
          <ul class="goods-link-list">
            <li :class="item.mallProId == selectGoodId ? 'goods-link-item goodSelect' : 'goods-link-item'" v-for="(item, index) in goodsList" @click="selectGoodLinkItem(item)" :key="item.proName + index">
              <img :src="item.mallProImageUrl" alt="商品图片" />
              <div class="inline-block goods-message">
                <p class="limit-2 pro-name">{{ item.proName }}</p>
                <p class="gray-color pro-code">货号：{{ item.proCode }}</p>
                <span class="pro-price">￥{{ item.mallProSpuPrice }}</span>
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
            :page-sizes="[9]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

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

// import axios from 'axios'
import qs from 'qs';

export default {
  name: 'links',
  props: ['linkToolsVisible'],
  data() {
    return {
      activeName: 'first',
      // ---------------------------
      twoLevelVisible: false, // 二级下拉
      threeLevelVisible: false, // 三级整个
      // 链接类型
      linksType: '',
      linksTypeOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
        // {
        //   id: '2',
        //   value: 'memberlink',
        //   label: '会员功能链接'
        // },
        // {
        //   id: '3',
        //   value: 'definelink',
        //   label: '自定义页面'
        // },
        // {
        //   id: '4',
        //   value: 'h5link',
        //   label: 'H5页面'
        // },
        // {
        //   id: '5',
        //   value: 'otherlink',
        //   label: '其他小程序'
        // }
      ],
      // 二级数据
      twoLevelValue: '',
      twoLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // 三级数据
      threeLeveloneVisible: false, // 三级中第一个下拉单选
      threeLevelTreeVisible: false, // 三级中第二个下拉树形结构
      threeLevelSearchVisible: false, // 三级中第三个搜索下拉
      threeLevelValue: '',
      threeLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // h5link
      h5linkVisible: false,
      h5linkObj: {
        name: '',
        url: '',
        fixParam: '',
        dynamicPara: '',
        dynamicParaOptions: [
          // 2018.6.12 动态参数目前让写页面
          {
            value: 'openid',
            label: 'openid'
          },
          {
            value: 'unionid',
            label: 'unionid'
          },
          {
            value: 'wxOpenid',
            label: 'wxOpenid'
          },
          {
            value: 'appkey',
            label: 'appkey'
          },
          {
            value: 'enterpriseId',
            label: 'enterpriseId'
          },
          {
            value: 'appid',
            label: 'appid'
          },
          {
            value: 'memberID',
            label: 'memberID'
          }
        ]
      },
      // ---------------------------
      // ---------------------------
      // 父组件传递的 props
      mylinkToolsVisible: this.linkToolsVisible,

      // 商品链接
      goodsLinksVisible: false,
      searchGoods: '',
      category: null,
      // 品类
      categoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [ {
        //     key: 'aa',
        //     name: 'aa',
        //   } ],
        // }
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

      // 商品列表数据
      selectGoodId: '',
      goodsList: [
        // {
        //   id:'111',
        //   proName: '美商海盗船Gaming系列 K70 RGB Rapidfire',
        //   proCode: "errerr",
        //   mallProImageUrl: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
        //   mallProSpuPrice: 567
        // }
      ],
      // 分页
      currentPage: 1, // 当前页
      pageSize: 9, // 一页显示的个数
      total: 0, // 总数

      // 分类
      classify: null,
      classifyOptions: [
        // {
        //   key: 'b',
        //   name: 'b',
        //   subOptions: [ {
        //     key: 'bb',
        //     name: 'bb',
        //   } ],
        // }
      ],

      // 商品分类
      goodsCategory: null,
      goodsCategoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [
        //     {
        //       key: 'aa',
        //       name: 'aa',
        //     }
        //   ],
        // }
      ],

      // 保存需要的参数
      oneLevelTypeValue: '',
      twoLevelSelectValue: '',
      threeLevelSelectValue: '',

      // 触发传递的对象
      selectLinkObj: {
        name: '',
        url: ''
      }
    };
  },
  methods: {
    // --------------------------------------------------
    // 选择类型改变 (一级选择,保存选择类型)
    linksTypeChange: function(e) {
      let that = this;
      let selectOneItem = '';
      that.linksTypeOptions.forEach(function(ele, inde) {
        if (ele.linkId == e) {
          selectOneItem = ele;
        }
      });
      // 保存选择的类型
      that.oneLevelTypeValue = selectOneItem.type;
      // 判断出现下拉内容/h5部分
      // 如果是 h5,二级,三级隐藏,
      let type = selectOneItem.type == 5 ? true : false;
      that.setOneLevelVisible(type, selectOneItem);
      // 每次修改选择类型,清空已选择的值
      that.selectLinkObj.name = '';
      that.selectLinkObj.url = '';
      that.twoLevelSelectValue = '';
      that.threeLevelSelectValue = '';
    },

    // set onelevel visible
    setOneLevelVisible(type, selectOneItem) {
      let that = this;
      if (type) {
        that.h5linkVisible = true; // h5 链接参数输入部分显示
        that.twoLevelVisible = false; // 二级部分隐藏
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
      } else {
        // 不是 h5,显示二级,隐藏三级
        that.h5linkVisible = false; // h5 链接参数输入部分隐藏
        that.twoLevelVisible = true; // 二级部分显示
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
        that.twoLevelValue = ''; // 清空二级数据
        that.threeLevelValue = ''; // 清空三级数据

        // 获取二级列表数据
        that.getLinksList(selectOneItem.linkId, 2);
      }
    },

    // twoLevelValueChange (二级选择,保存选择类型)
    twoLevelValueChange(e) {
      let that = this;
      let selectTwoItem = '';
      that.twoLevelOptions.forEach(function(ele, index) {
        if (e == ele.linkId) {
          selectTwoItem = ele;
        }
      });
      // 判断是否结束, 1:结束;
      if (selectTwoItem.type == 1 || selectTwoItem.type == 4 || selectTwoItem.type == 6) {
        that.threeLevelVisible = false; // 三级部分隐藏
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = ''; // 清空门店签到
        that.threeLevelSelectValue = ''; //清空商品分类
        that.selectLinkObj.name = '';
        that.selectLinkObj.url = '';
        // 如果选择商品链接
        if (selectTwoItem.type == 4) {
          that.getGoodsList(); // 获取商品列表
          that.getGoodsCategory(); // 获取商品品类
          that.getGoodsClassify(); // 获取商品分类

          that.threeLevelVisible = false; // 三级部分隐藏
          that.goodsLinksVisible = true; // 商品链接列表部分显示
          return false;
        }

        that.twoLevelOptions.forEach(function(ele, index) {
          if (e == ele.value) {
            that.selectLinkObj.name = ele.label;
            that.selectLinkObj.url = ele.content;
          }
        });
      } else {
        // 判断三级中下拉/下拉树形/搜索下拉
        that.goodsLinksVisible = false; // 商品列表隐藏
        that.threeLevelVisible = true; // 三级部分显示
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = '';
        that.threeLevelSelectValue = '';
        let twoType = selectTwoItem.type;
        // 判断三级显示的下拉组件
        that.setThreeVisible(twoType, selectTwoItem);

        // 如果是门店,直接返回,需要输入后搜索出现下拉列表
        if (twoType == 2) {
          that.twoLevelSelectValue = 'sign';
          return false;
        }
        if (twoType == 3) {
          that.twoLevelSelectValue = 'goodsCate';
          that.getGoodsClassify();
          return false;
        }
        // 获取三级列表数据
        that.getLinksList(selectTwoItem.linkId, 3, twoType);
      }
    },

    // set threelevel visible
    setThreeVisible(type, selectTwoItem) {
      let that = this;
      switch (type) {
        // 如果下拉显示
        case 0: // 单选
          that.threeLeveloneVisible = true; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
          break;
        case 2: // 搜索下拉
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = true; // 三级中第三个搜索下拉
          // 设置链接 门店签到
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
          break;
        case 3: // 树形结构
          that.threeLevelValue = null;
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = true; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
          // 设置链接 商品分类
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
          break;
      }
    },

    // 获取商品品类
    getGoodsCategory() {
      let that = this;
      let para = {
        filterGoods: 1,
        parentId: 'tb-cid-11'
      };
      that.axios
        .post('http://gicdev.demogic.com:9310/api-mall/list_mall_goods_category', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          let onelevelCategory = '';
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              if (ele.parentId == '-1') {
                ele.subOptions = [];
                ele.key = ele.mallCategoryId;
                onelevelCategory = ele;
                resData.result.splice(index, 1);
              }
            });
            let list = resData.result;
            let lists = resData.result;

            list.forEach(function(ele, index) {
              if (ele.isLeaf == 0) {
                ele.subOptions = null;
              }
              ele.key = ele.mallCategoryId;
              lists.forEach(function(el, ind) {
                el.key = el.mallCategoryId;
                if (el.parentId == ele.mallCategoryId) {
                  ele.subOptions = [];
                  ele.subOptions.push(el);
                  list.splice(ind, 1);
                }
              });
            });

            list.forEach(function(ele, index) {
              onelevelCategory.subOptions.push(ele);
            });
            that.categoryOptions = [];
            that.categoryOptions.push(onelevelCategory);
            return false;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取商品分类
    getGoodsClassify() {
      let that = this;
      let para = {};
      that.axios
        .post('http://gicdev.demogic.com:9310/api-mall/list_mall_goods_tag_tree', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            let list = [resData.result];
            // let lists = resData.result;

            // list.forEach(function(ele,index) {
            //    ele.subOptions = [];
            //    ele.name = ele.tagName;
            //    ele.key = ele.mallProTagId;
            //    lists.forEach(function(el,ind) {
            //       ele.name = ele.tagName;
            //       ele.key = ele.mallProTagId;
            //       if(el.parentId == ele.mallProTagId ){
            //         ele.subOptions.push(el)
            //       }
            //    })
            // })
            // that.goodsCategoryOptions = [];
            // that.classifyOptions = [];
            // list.forEach(function(ele,index){
            //   if (ele.parentId == '-1') {
            //     that.goodsCategoryOptions.push(ele);
            //     that.classifyOptions.push(ele);
            //   }
            // })

            list.forEach(function(ele, index) {
              ele.name = ele.tagName;
              ele.key = ele.mallProTagId;
              if (!!ele.childTagList) {
                ele.subOptions = that.checkChildren(ele.childTagList);
              }
            });

            that.goodsCategoryOptions = list;
            that.classifyOptions = list;
            // that.classifyOptions = list;
            // console.log(that.goodsCategoryOptions)
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    checkChildren(childTagList) {
      let that = this;
      if (!!childTagList) {
        childTagList.forEach(function(ele, index) {
          ele.name = ele.tagName;
          ele.key = ele.mallProTagId;
          if (!!ele.childTagList) {
            ele.subOptions = that.checkChildren(ele.childTagList);
          }
        });
      }
      // console.log(childTagList)
      return childTagList;
    },

    // threeLevelValueChange
    /* eslint-disable */
    threeLevelValueChange(e) {
      let that = this;
      // 门店签到
      // that.selectLinkObj.url = that.selectLinkObj.url +'?' + that.threeLevelValue
    },

    // -------------------------------------------
    // 选择树形节点方法

    // 商品链接部分 categorySelect
    categorySelect(node, id) {
      let that = this;
      that.category = node.key;
      // 重新获取商品列表
      that.getGoodsList();
    },
    beforeClearCategory(node, id) {
      let that = this;
      that.category = null;
      // 重新获取商品列表
      that.getGoodsList();
    },

    loadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      // We just use `setTimeout()` here to simulate an async operation
      // instead of requesting a real API server for demo purpose.
      let that = this;
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        if (parentNode.key) {
          that.getChildrenNode(parentNode, parentNode.key);
        }
      }
    },

    // 获取子节点方法
    getChildrenNode(parentNode, parentId) {
      let that = this;
      let para = {
        filterGoods: 1,
        parentId: parentId
      };
      that.axios
        .post('http://gicdev.demogic.com:9310/api-mall/list_mall_goods_category', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            parentNode.subOptions = resData.result;
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // classifySelect  分类
    classifySelect(node, id) {
      let that = this;
      that.classify = node.key;
      // 重新获取商品列表
      that.getGoodsList();
    },
    beforeClearClassify(node, id) {
      let that = this;
      that.classify = null;
      // 重新获取商品列表
      that.getGoodsList();
    },

    // 商品分类 goodsCategorySelect
    /* eslint-disable */
    goodsCategorySelect(node, id) {
      let that = this;
      // 调用
      // that.selectLinkItem()
    },

    // --------------------------------------------

    // 关闭
    handleClose(done) {
      let that = this;
      that
        .$confirm('确认关闭？')
        .then(_ => {
          done();
          that.mylinkToolsVisible = false;
          that.$emit('linkSelect');
        })
        /* eslint-disable */
        .catch(_ => {

        });
    },

    // 分页
    linkSizeChange(val) {
      let that = this;
      that.pageSize = val;
      // 请求商品列表
      that.getGoodsList();
    },

    // 页码变化触发
    linkCurrentChange(val) {
      let that = this;
      that.currentPage = val;
      // 请求商品列表
      that.getGoodsList();
    },

    // 选择商品链接
    selectGoodLinkItem(item) {
      let that = this;
      that.selectGoodId = item.mallProId;
      // 调用函数传递链接/名字
      that.selectLinkItem(item);
    },

    // 选择链接以后调用函数
    selectLinkItem(item) {
      let that = this;
      that.selectLinkObj.name = item.proName;
      that.selectLinkObj.url = item.mallProImageUrl;
      // that.$emit('linkSelect')
    },

    // 搜索输入
    toSearchInput: function(value) {
      let that = this;
      // 搜索重置当前页 为 1
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
      }
    },
    // 清空输入
    clearInput: function(e) {
      let that = this;
      // 搜索重置当前页 为 1
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
      }
    },

    // 获取商品列表
    getGoodsList() {
      let that = this;
      let para = {
        pageNum: that.currentPage,
        searchparams: that.searchGoods || '',
        pageSize: that.pageSize,
        // 品类
        mallCategoryId: that.category,
        tagId: that.classify // 分类
      };

      // that.currentPage = 1;
      // that.pageSize = 10;
      // that.total = 50;

      that.axios
        .post('http://gicdev.demogic.com:9310/api-mall/page-mall-goods', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.goodsList = resData.result.result;
            that.total = resData.result.totalCount;
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 搜索后出现下拉列表
    // 搜索
    remoteMethod(query) {
      let that = this;
      if (query !== '') {
        // 获取搜索列表数据
        that.getStoreList(query, that.threeLevelValue);
      } else {
        that.threeLevelOptions = [];
      }
    },

    // 取消操作
    cancelLinkSelect() {
      let that = this;
      this.$confirm('确认关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: ''
      })
        .then(() => {
          that.$emit('linkSelect');
        })
        /* eslint-disable */
        .catch(() => {
        });
    },

    // 确认操作
    confirmLinkSelect() {
      let that = this;
      // 如果选择 h5 判断选择的链接
      if (that.oneLevelTypeValue == 5) {
        if (!that.h5linkObj.name.trim() || !that.h5linkObj.url.trim()) {
          that.$message.error({
            duration: 1000,
            message: '请填写链接内容'
          });
          return;
        }
        that.selectLinkObj.name = that.h5linkObj.name;
        that.selectLinkObj.url = that.h5linkObj.url + '?' + that.h5linkObj.fixParam + '&' + that.h5linkObj.dynamicPara;
        // that.selectLinkObj.fixParam = that.h5linkObj.fixParam;
        // that.selectLinkObj.dynamicPara = that.h5linkObj.dynamicPara;
        // 触发父组件方法,传递参数
        that.transData();
        return;
      }

      // 如果门店签到
      if (that.twoLevelSelectValue == 'sign') {
        if (!that.checkTwoLevel(that.twoLevelSelectValue)) {
          return false;
        }
        return false;
      }
      // 如果是商品分类
      if (that.twoLevelSelectValue == 'goodsCate') {
        if (!that.checkTwoLevel(that.twoLevelSelectValue)) {
          return false;
        }
        return false;
      }
      if (!!that.selectLinkObj.name && !!that.selectLinkObj.url) {
        // 触发父组件方法,传递参数
        that.transData();
      } else {
        that.$message.error({
          duration: 1000,
          message: '请选择链接'
        });
      }
    },

    checkTwoLevel(v) {
      let that = this;
      if (!that.threeLevelValue || !that.threeLevelValue.length) {
        that.$message.error({
          duration: 1000,
          message: '请选择' + (v == 'sign' ? '门店' : '商品分类')
        });
        return false;
      }
      that.selectLinkObj.url = that.selectLinkObj.url + '?' + that.threeLevelValue;
      // 触发父组件方法,传递参数
      that.transData();
    },

    // 重置所有组件
    resetAll() {
      let that = this;
      that.h5linkVisible = false;
      that.linksType = '';
      that.twoLevelVisible = false; // 二级下拉
      that.threeLevelVisible = false; // 三级整个
      that.goodsLinksVisible = false; // 商品列表隐藏
      that.twoLevelValue = ''; // 清空所有选择的
      that.twoLevelSelectValue = '';
      that.threeLevelValue = ''; // 清空所有选择的

      that.selectLinkObj = {
        url: '',
        name: ''
      };
      that.currentPage = 1;
      that.total = 0;
      that.pageSize = 9;
      that.searchGoods = '';
      that.classify = null;
      that.category = null;

      that.h5linkObj.name = '';
      that.h5linkObj.url = '';
      that.h5linkObj.fixParam = '';
      that.h5linkObj.dynamicPara = '';
    },

    // 触发父组件方法,传递参数
    transData() {
      let that = this;
      that.$emit('linkSelect', that.selectLinkObj);
      that.resetAll();
    },

    // 获取一级列表
    getLinksList(parentId, num, twoType) {
      let that = this;
      // 如果不传传的显示类型,设置
      twoType = twoType ? twoType : '';

      let para = {
        parentId: parentId
      };

      that.axios
        .post('http://gicdev.demogic.com:9310/api-plug/list-link-data', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.setLevelListOptions(parentId, resData.result, num, twoType);
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    setLevelListOptions(parentId, result, num, twoType) {
      let that = this;
      // 设置一级
      if (parentId == 0) {
        result.forEach(function(ele, index) {
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId;
        });

        that.linksTypeOptions = result;
        return;
      }
      // 设置二级
      if (num == 2 && result[0]) {
        result.forEach(function(ele, index) {
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId;
        });
        that.twoLevelOptions = result;
        return;
      }

      // 设置三级
      // if (num == 3 && result[0]) {
      //   // 如果是分类
      //   if (twoType == 3) {
      //     return false;
      //   }
      //   // 如果是单选下拉
      //   if (twoType == 0) {
      //     result.forEach(function(ele,index){
      //       ele.id = ele.linkId;
      //       ele.label = ele.name;
      //       ele.value = ele.linkId
      //     })
      //     that.threeLevelOptions = result
      //   }

      //   console.log("获取三级类型: ",that.threeLevelOptions)
      //   return;
      // }
    },

    // 获取门店列表
    getStoreList(query, threeLevelValue) {
      let that = this;
      let para = {
        searchParam: query,
        selectedIds: threeLevelValue.toString(),
        flag: null
      };

      that.axios
        .post('http://gicdev.demogic.com:9310/api-plug/query-store-by-code-name', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.id = ele.storeId;
              ele.label = ele.storeName;
              ele.value = ele.storeId;
            });
            that.threeLevelOptions = resData.result;
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    toLogin() {
      let that = this;
      let para = {
        loginName: 'damogic',
        password: '1',
        eid: 'ff808081593917d90159398ec6340012'
      };

      that.axios
        .post('http://gicdev.demogic.com:9310/api-auth/do-login', qs.stringify(para))
        .then(res => {
          that.getLinksList(0, 1);
        })
        /* eslint-disable */
        .catch(function(error) {
        });
    }
  },

  watch: {
    linkToolsVisible(val) {
      this.mylinkToolsVisible = val; // 新增linkToolsVisible的watch，监听变更并同步到linkToolsVisible上
    }
  },

  mounted() {
    let that = this;
    that.toLogin();
    // that.getLinksList(0)
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
  vertical-align: top;
}

/*  .vue-treeselect /deep/ .vue-treeselect__single-value {
    color: #ff0000;
   }*/

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
  padding: 10px 10px;
  /*height: 110px;*/
  border: 1px solid #e7e7eb;
  margin-right: 7px;
  margin-bottom: 10px;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.goods-link-item img {
  width: 80px;
  height: 80px;
  display: inline-block;
  /*margin-top: 10px;*/
}

.goods-message {
  width: 65%;
  /*margin-top: 10px;*/
  vertical-align: top;
  margin-left: 5px;
  white-space: normal;
  word-break: break-all;
  font-size: 14px;
}

.links-tools-row {
  /*overflow: hidden;*/
  font-size: 0;
  .vue-treeselect + .vue-treeselect {
    margin-left: 10px;
  }
}

/* 分页 */
.links-tools-page {
  text-align: right;
}

.goods-category {
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
  font-size: 0;

  .types-title {
    display: inline-block;
    width: 80px;
    text-align: right;
    font-size: 14px;
    padding-right: 5px;
  }

  .el-select.el-select--large + .el-select.el-select--large {
    margin-left: 10px;
  }

  /* 三级 wrap */
  .three-level-wrap {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
}

/* 商品链接 */
.goods-links-contian {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  .goods-link-item {
    &:hover {
      border: 1px solid #409eff;
    }

    &.goodSelect {
      border: 1px solid #409eff;
    }

    .limit-2 {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      white-space: pre-wrap;
      word-break: break-all;
      overflow: hidden;
      line-height: 18px;
    }

    .pro-name {
      color: #303133;
    }

    .pro-code {
      margin: 0 5px;
    }

    .gray-color {
      color: #909399;
      font-size: 14px;
      line-height: 18px;
    }

    .pro-price {
      color: #303133;
    }
  }
}

/* h5链接 */
.h5link-row {
  width: 100%;
  margin-top: 22px;

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

  .h5link-help {
    padding-left: 10px;
    font-size: 10px;
    color: #5073fd;
  }

  .dynamic-param-select {
    vertical-align: top;
  }
}

/* tab linktools*/

.link-tools-contain /deep/ {
  .el-tabs__content {
    overflow: auto;
  }

  .el-dialog__body {
    border-bottom: 1px solid #e7e7eb;
  }

  .el-dialog__footer {
    padding: 10px 20px;
  }

  .el-tree {
    .el-tree-node {
      padding: 8px 0;
    }
  }

  .el-dialog {
    /*min-width: 1051px;*/

    .el-dialog__header {
      border-bottom: 1px solid #e7e7eb;
    }
  }

  .min-720 {
    .el-dialog {
      min-width: 720px;
    }
  }

  .min-1026 {
    .el-dialog {
      min-width: 1026px;
    }
  }

  .links-tools-input {
    width: 217px;
    vertical-align: top;
    float: right;
  }

  .vue-treeselect__single-value {
    line-height: 40px;
  }

  /* 不显示每页显示几个 */
  .el-pagination__sizes {
    display: none;
  }

  .vue-treeselect {
    width: 217px;
    font-size: 14px;

    .vue-treeselect__control {
      height: 40px;
      /*line-height: 36px;*/
      cursor: pointer;
    }

    .vue-treeselect__placeholder {
      line-height: 40px;
      font-size: 13.3333px;
    }

    .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
      cursor: pointer;
    }
  }

  .vue-treeselect__control-arrow {
    display: none;
  }

  .vue-treeselect__control-arrow-container {
    position: relative;
  }

  .vue-treeselect__control-arrow-container:after,
  .vue-treeselect__control-arrow-container:before {
    border: 6px solid transparent;
    border-left: 6px solid #fff;
    width: 0;
    height: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -6px;
    content: ' ';
    margin-top: -3px;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 52%;
  }

  .vue-treeselect--focused .vue-treeselect__control-arrow-container:after,
  .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    margin-top: -6px;
    -webkit-transform: rotateZ(-90deg);
    -moz-transform: rotateZ(-90deg);
    -o-transform: rotateZ(-90deg);
    transform: rotateZ(-90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 47%;
  }

  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 0;
  }
}
</style>
