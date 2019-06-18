<template>
    <div>
      <!--弹框-->
      <el-dialog
        title="添加适用单品"
        :visible.sync="dialogGoodsVisible"
        width="516px"
        :before-close="handleClose">
        <div class="dialogwrap">
          <div class="good-input">
            <el-input v-model="goodsInput" placeholder="请输入商品货号，多个货号之间用空格隔开"></el-input>
            <el-button class="add-btn" @click="addGoods">添加</el-button>
          </div>
          <div class="good-clear">
            <div class="flex-1">已添加{{goodsList.length}}件商品</div>
            <el-button class="flex-1" type="text" @click="delGoods">全部清除</el-button>
          </div>
          <div class="good-list">
            <ul class="goods-ul">
              <li v-for="(item,index) in goodsList">
                <img :src="item.goodsImg" :alt="item.name"/>
                <div class="good-info">
                  <div class="good-name">{{item.name}}</div>
                  <div class="good-num">{{item.googsNum}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="cancle">取 消</el-button>
         </span>
      </el-dialog>
      <!--弹框end-->
    </div>
</template>

<script>
import { getRequest } from '../../api/api';
export default {
  name: "add-goods",
  props:{
    goodShow: Boolean,
    projectName: String
  },
  data() {
    return {
      dialogGoodsVisible: false, // 默认隐藏
      goodsInput: '', //输入框
      repProjectName: 'gic-clique', //当前所在项目名
      // 商品列表
      goodsList: [
        {
          id: '1',
          name: '长裤ESS70305261',
          googsNum: 'ESS70222169',
          goodsImg: 'https://pic01-10001430.image.myqcloud.com/d8ef8432-2aed-4fa6-ab7c-a54b1e58f7ff'
        },
        {
          id: '2',
          name: '长裤ESS70305261',
          googsNum: 'ESS70222169',
          goodsImg: 'https://pic01-10001430.image.myqcloud.com/d8ef8432-2aed-4fa6-ab7c-a54b1e58f7ff'
        },
        {
          id: '3',
          name: '长裤ESS70305261',
          googsNum: 'ESS70222169',
          goodsImg: 'https://pic01-10001430.image.myqcloud.com/d8ef8432-2aed-4fa6-ab7c-a54b1e58f7ff'
        },
         {
          id: '4',
          name: '长裤ESS70305261',
          googsNum: 'ESS70222169',
          goodsImg: 'https://pic01-10001430.image.myqcloud.com/d8ef8432-2aed-4fa6-ab7c-a54b1e58f7ff'
        }
      ]
    }
  },
  methods: {
    // 确定
    confirm() {
      var that = this
      // 触发父组件返回添加商品
      that.$emit('selectGoods')
    },

    // 关闭
    handleClose(){
      var that = this
      that.cancle();
    },
    // 取消
    cancle() {
      var that = this
      that.$confirm('确认关闭?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: ''
        }).then(() => {
          console.log("点击确认")
          that.$emit('selectGoods')
        }).catch(() => {
           console.log("取消 取消关闭")
        });
    },
    // 添加
    addGoods() {
      var that = this

      that.goodsList.push({})
    },

    // 清除
    delGoods() {
      var that = this
      that.goodsList = []
    }
  },
  watch: {
    goodShow: function(newData,oldData){
      var that = this;
      // console.log("新数据:",newData,oldData)
      that.dialogGoodsVisible = newData
    },
    projectName: function(newData,oldData){
      var that = this;
      // console.log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-clique';
    },
  },
  created() {
    // this.selectReplayStyle()
    console.log('create1')
  },
  beforeMount() {
    console.log('beforeMount1')
  },
  /* 接收数据 */
  mounted(){
    var that = this;
    // 项目名
    that.repProjectName = that.projectName || 'gic-clique';

    that.dialogGoodsVisible = that.goodShow;
  },

}
</script>

<style lang="less" scoped>
  .el-dialog__wrapper {
    /deep/ .el-dialog__body {
      padding: 15px 0px;
    }
  }
  .dialogwrap{
    position: relative;
    &:before{
      position: absolute;
      left: 0px;
      top: -15px;
      right: 0px;
      content: '';
      border-bottom: 1px solid #dedede;
    }



    .good-input {
      margin-bottom: 15px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .el-input {
      width: 384px;
    }

    .add-btn {
      margin-left: 5px;
    }

    .good-clear {
      display: flex;
      justify-content: space-between;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: #F5F6FA;
      .flex-1 {
        flex: 1;
        &+.flex-1 {
          text-align: right;
        }
      }
    }

    .good-list {
      height: 300px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .goods-ul {
      li {
        display: flex;
        border-bottom: 1px solid #e6eaeb;
        position: relative;
        cursor: pointer;
        padding: 10px 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        img {
          width: 58px;
          height: 58px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .good-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          div {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }

</style>
