
<template>
  <div class="attention-textAndImg-wrap">
      <span class="label-name">已选卡券：</span>
        <div class="card-container line-nowrap">
          <el-tag
            v-for="tag in middleSelection"
            :key="tag.coupCardId"
            class="el-tag--small"
            closable
            @close="handleCloseTag(tag)">
            {{ tag.cardName }}
          </el-tag>

          <el-popover
            placement="top"
            title="已选中的卡券"
            width="400"
            trigger="hover">
            <el-tag
              v-for="tag in middleSelection"
              :key="tag.coupCardId"
              class="el-tag--small el-tag-popover"
              closable
              @close="handleCloseTag(tag)">
              {{ tag.cardName }}
            </el-tag>
            <span class="card-count-box" slot="reference">
              共 {{ middleSelection.length }} 项
            </span>
          </el-popover>

        </div>
    <!-- <el-dialog title="选择卡券" :visible.sync="dialogCard" width="820px" :before-close="handleCardClose"> -->
      <div class="text-img-search clearfix">
        <div class="fl">
          <el-input placeholder="请输入卡券名/备注名" :style="type ? { width: '190px' } : ''" prefix-icon="el-icon-search" class="search-input" v-model="searchText" @change="handleChange" clearable></el-input>
          <span class="limit-text" v-if="!type">{{ limitTips }}{{ total }}张。 </span>
          <el-select v-if="type" style="width:100px" v-model="cardTypes" placeholder="卡券类型" @change="handleChange">
            <el-option v-for="item in cardTypesList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- <el-date-picker v-if="type" v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChange"></el-date-picker> -->
        </div>
        <div class="fr">
          <!-- <el-button type="primary" @click="add">新建卡券</el-button> -->
          <!-- <el-button @click="refresh">刷新列表</el-button> -->
        </div>
      </div>
      <div class="pic-list-box">
        <!-- @selection-change="handleSelectionChange" -->
          <el-table
            ref="multipleTable"
            :data="cardData"
            @select="handleSelect"
            class="card-table"
            tooltip-effect="dark"
            style="width: 100%"
            @select-all="handleSelectAll"
            cell-class-name="table-light-color">
            <el-table-column
              type="selection"
              :selectable="selectable"
              width="55">
            </el-table-column>
            <!-- <template slot-scope="scope"> -->
              <!-- <el-radio class="radio-style" :label="scope.row.coupCardId" v-model="radio" :disabled="scope.row.disabled"></el-radio> -->
            <!-- </template> -->
          <el-table-column :show-overflow-tooltip="true" min-width="100" align="left" prop="cardName" label="卡券名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="100" align="left" prop="subName" label="备注名"></el-table-column>
          <el-table-column prop="" label="有效期" min-width="130" :show-overflow-tooltip="false">
            <template slot-scope="scope">
              <div v-if="scope.row.cardEffectiveMode == 0">固定日期：<br>{{ formateDateTimeByType(scope.row.beginDate, 'yyyy-MM-dd') + '至' + formateDateTimeByType(scope.row.endDate, 'yyyy-MM-dd') }}</div>
              <div v-if="scope.row.cardEffectiveMode == 1">领取后{{ (scope.row.startDay === 0 ? '当' : scope.row.startDay) + '天，有效天数' + scope.row.limitDay }}天</div>
            </template>
          </el-table-column>
          <el-table-column prop="cardLimit" :show-overflow-tooltip="false" label="领取限制" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.cardLimit }}张/人
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="false" min-width="100" align="left" prop="storeMode" label="适用门店">
            <template slot-scope="scope">
              {{ scope.row.storeMode === 0 ? '所有门店' : scope.row.storeMode === 1 ? '部分分组' : '部分门店' }}
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="false" width="90" align="left" prop="couponStock" label="库存"></el-table-column>
        </el-table>

        <div class="pagination" v-if="total > 0">
          <el-pagination class="table-light-color" @current-change="cardCurrentChange" :current-page="cardCurrentPage" :page-size="cardPageSize" layout="prev, pager, next" :total="total"> </el-pagination>
        </div>
      </div>
      <div class="dialog-footer">
        <!-- <el-button @click="dialogCardcancel">关 闭</el-button> -->
        <!-- <el-button type="primary" @click="dialogCardConfirm">确 定</el-button> -->
      </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '../config/index.js';
/**
 * @param {*时间} date
 * @param {*转换的格式} type
 */
const formateDateTimeByType = (date, type = 'yyyy-MM-dd-HH-mm-ss') => {
  if (!date) {
    return '';
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  if (typeof date === 'string') {
    return date;
  } else {
    let year = type.indexOf('yyyy') >= 0 ? fillZero(date.getFullYear()) : '';
    let month = type.indexOf('MM') >= 0 ? '-' + fillZero(date.getMonth() + 1) : '';
    let day = type.indexOf('dd') >= 0 ? '-' + fillZero(date.getDate()) + '' : '';
    let hours = type.indexOf('HH') >= 0 ? ' ' + fillZero(date.getHours()) : '';
    let min = type.indexOf('mm') >= 0 ? ':' + fillZero(date.getMinutes()) : '';
    let sec = type.indexOf('ss') >= 0 ? ':' + fillZero(date.getSeconds()) : '';
    // log(year+month+day+hours+min+sec);
    return year + month + day + hours + min + sec;
  }
};

/**
 * 补零
 * @param {String/Number} num
 */
const fillZero = num => {
  num = num * 1;
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
};

export default {
  name: 'vue-gic-card',
  props: {
    disabledList: {
      type: Array,
      default() {
        return [];
      }
    },
    tagList: {
      type: Array
    },
    type: {
      type: Number,
      default: 0 // 0：默认旧卡券弹窗  1:新卡券弹窗
    },
    projectName: {
      type: String,
      default: ''
    },
    cardLimit: {
      type: [String, Number],
      default: 0
    },
    cardType: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    limitTips() {
      if (this.cardLimitType === 2) {
        return '领取限制领取1~100的卡券，系统已过滤，符合条件共';
      } else if (this.cardLimitType === 3) {
        return '领取限制领取<100的卡券不支持选择，系统已过滤，符合条件共';
      } else {
        return '领取限制>1的卡券不支持选择，系统已过滤，符合条件共';
      }
    }
  },

  data() {
    return {
      // 选择的卡券
      cardTags: [],
      middleSelection: [], // 中间
      multipleSelection: [], // 选中的卡券
      repProjectName: 'gic-web', // 项目名
      searchText: '',
      cardData: [],
      currentRow: null,
      firstSelect: false,
      radio: null,
      dialogCard: false,
      cardCurrentPage: 1,
      cardPageSize: 5,
      total: 0,
      cardLimitType: '',
      cardTypes: '', // 0：抵金券，1：折扣券，2：兑换券
      // eslint-disable-next-line
      cardTypesList: [{ value: null, label: '全部' }, { value: 0,label: '抵金券'}, { value: 1, label: '折扣券' }, { value: 2, label: '兑换券' }],
      date: '',
      sdate: '',
      edate: '',
      // 获取 location origin
      formateDateTimeByType
    };
  },
  methods: {
    // 删除选择的卡券
    handleCloseTag(tag) {
      let index = this.middleSelection.findIndex(el => el.coupCardId == tag.coupCardId);
      if (index > -1) {
        let row = this.middleSelection[index];
        let tag = this.cardData.find(el => el.coupCardId == row.coupCardId);
        if (tag) {
          this.$refs.multipleTable.toggleRowSelection(tag);
        }
        this.middleSelection.splice(index, 1);
      }
      this.$emit('reciver-card-list', this.middleSelection);
    },
    // 切换的卡券
    handleSelect(select, row) {
      // 如果select大于
      if (this.middleSelection.length == 0) {
        this.middleSelection.push(row);
      } else {
        // 如果不存在就增加 如果存在就减去
        let index = this.middleSelection.findIndex(el => el.coupCardId == row.coupCardId);
        if (index == -1) {
          this.middleSelection.push(row);
        } else {
          this.middleSelection.splice(index, 1);
        }
      }
      this.$emit('reciver-card-list', this.middleSelection);
    },
    handleSelectAll(val) {
      // 如果是全选 就判断里面的元素是否在middleSelection
      if (val.length) {
        val.forEach((el, index) => {
          let inx = this.middleSelection.findIndex(item => item.coupCardId == el.coupCardId);
          // 如果没有找到就
          if (inx == -1) {
            this.middleSelection.push(el);
          }
        });
      } else {
        // 去掉
        this.cardData.forEach(el => {
          let ix = this.middleSelection.findIndex(item => item.coupCardId == el.coupCardId);
          if (ix != -1) {
            this.middleSelection.splice(ix, 1);
          }
        });
      }
      this.$emit('reciver-card-list', this.middleSelection);
    },
    add() {
      window.open('/marketing/#/card/add');
    },
    refresh() {
      this.cardCurrentPage = 1;
      this.sdate = '';
      this.edate = '';
      this.getCardList();
    },
    handleCurrentChangeTable(val) {
      // 当前格发生变化时触发
      if (!val.disabled) {
        this.radio = val.coupCardId;
        this.currentRow = val;
      }
    },

    // 当前页变化
    cardCurrentChange(val) {
      this.cardCurrentPage = val;
      this.getCardList();
    },

    // 设置接收参数
    setNewData(cardFlag) {
      this.dialogCard = cardFlag;
    },
    // 清空输入
    clearInput(e) {
      this.cardCurrentPage = 1;
      this.getCardList();
    },
    //  确认
    dialogCardConfirm() {
      if (!this.currentRow || !Object.keys(this.currentRow).length || !Object.values(this.currentRow).length) {
        this.$message.error({ duration: 1000, message: '请选择卡券' });
        return;
      }
      this.$emit('selectCard', this.currentRow);
      this.currentRow = {};
      this.radio = null;
    },

    handleCardClose() {
      this.dialogCardcancel();
    },

    //  取消
    dialogCardcancel() {
      this.$confirm('确认关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: ''
      })
        .then(_ => {
          this.currentRow = {};
          this.radio = null;
          this.$emit('selectCard');
        })
        .catch(_ => {
        });
    },

    // 获取卡券列表
    getCardList() {
      let param = {
        currentPage: this.cardCurrentPage,
        pageSize: this.cardPageSize,
        searchParam: this.searchText || '',
        requestProject: this.repProjectName,
        cardLimitType: this.cardLimitType,
        cardTypes: this.cardTypes
      };
      if (this.type) {
        Object.assign(param, {
          startTime: this.sdate,
          endTime: this.edate,
          cardModule: this.type ? 'memberTag' : '' // 会员标签传
        });
      }
      this.axios
        .post(baseUrl + '/api-plug/get-coupon-list', qs.stringify(param))
        .then(res => {
          // log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode === 0) {
            if (!!resData.result) {
              if (!!resData.result.result) {
                resData.result.result.forEach((ele, index) => {
                  if (!!ele.beginDate) {
                    ele.beginDate = this.formatDate(ele.beginDate, '.');
                  }
                  if (!!ele.endDate) {
                    ele.endDate = this.formatDate(ele.endDate, '.');
                  }
                  // log(ele);
                  ele.disabled = this.disabledList.indexOf(ele.coupCardId) >= 0;
                });
                this.cardData = resData.result.result;
              } else {
                this.cardData = [];
              }
              this.total = resData.result.totalCount;
            } else {
              this.cardData = [];
              this.total = 0;
            }
            // 判断有几个 this.middleSelection
            // row 数组 表示要切换状态的卡券
            this.$nextTick(_ => {
              if (this.cardData.length) {
                this.cardData.forEach(row => {
                  let ret = this.middleSelection.findIndex(el => el.coupCardId == row.coupCardId);
                  if (ret > -1) {
                  // 如果不存在
                    this.$refs.multipleTable.toggleRowSelection(row);
                  }
                });
              }
              this.$emit('reciver-card-list', this.middleSelection);
            });
          } else {
            this.$message.error({ duration: 1000, message: resData.message });
          }
        })
        .catch(error => {
          this.$message.error({
            duration: 10000,
            message: error.message
          });
        });
    },

    formatDate(time, flag) {
      //  (0-9)年月数字的显示
      function formatDig(num) {
        return num > 9 ? '' + num : '0' + num;
      }
      let myDate = new Date(time);
      let y = myDate.getFullYear();
      let m = myDate.getMonth() + 1;
      let d = myDate.getDate();
      return y + flag + formatDig(m) + flag + formatDig(d) + flag;
    },
    // 搜索项改变
    handleChange() {
      if (this.date) {
        this.sdate = formateDateTimeByType(this.date[0], 'yyyy-MM-dd');
        this.edate = formateDateTimeByType(this.date[1], 'yyyy-MM-dd');
      } else {
        this.sdate = this.edate = '';
      }
      this.cardCurrentPage = 1;
      this.getCardList();
    }
  },
  watch: {
    type() {
      this.getCardList();
    },
    showCardDialog(newData, oldData) {
      this.setNewData(newData);
    },
    projectName(newData, oldData) {
      this.repProjectName = newData || 'gic-web';
    },
    cardLimit(newData, oldData) {
      this.cardLimitType = newData;
    },
    cardType(newData, oldData) {
      this.cardTypes = newData;
    },
    tagList: {
      immediate: true,
      handler(newval) {
        this.middleSelection = newval;
      }
    }
  },
  /* 接收数据 */
  mounted() {
    this.repProjectName = this.projectName || 'gic-web';
    this.cardLimitType = this.cardLimit;
    this.cardTypes = this.cardType;
    this.getCardList();
    this.setNewData(this.showCardDialog);
  },
  filters: {
    filterCardTips(value) {
      let result = '';
      switch (value) {
        case 1:
          result = '限制领取1张的卡券,系统已自动过滤';
          break;
        case 2:
          result = '限制领取1~100的卡券,系统已自动过滤';
          break;
        case 3:
          result = '限制领取>=100的卡券,系统已自动过滤';
          break;
        case -1:
          result = '卡券领取无限制';
          break;
        default:
          result = '卡券领取无限制';
          break;
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
#wrap {
  background: #fff;
}
.search-input {
  width: 200px;
}
.attention-textAndImg-wrap {
  .text-img-search {
    padding: 16px 10px 0;
    font-size: 14px;
    color: #292929;
    display: block;
    overflow: hidden;
    background-color: #f7faff;
    > span {
      float: left;
      margin-right: 10px;
    }

    .search-input {
      width: 200px;
    }
    .search-btn {
      margin-left: 4px;
    }
    .limit-text {
      color: #909399;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      display: inline-block;
    }
  }
  .pic-list-box {
    padding: 10px;
    background-color: #f7faff;
    .list-img {
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .card-table {
      position: relative;
      .radio-style {
        .el-radio__label {
          display: none;
        }
        /* position: absolute;
          left: 27px;
          top: 15px;*/
      }
    }
  }

  .el-table thead tr,
  .el-table thead th {
    background: #f1f3f7;
  }
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
.pic-list-box .el-table__row {
  cursor: pointer;
}
.attention-textAndImg-wrap .el-dialog__body {
  padding: 10px 20px;
}
.label-name {
  display: inline-block;
  vertical-align: middle;
  height: 36px;
  line-height: 26px;
}
.card-container {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  width: 80%;
  height: 36px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #ccc;
  .card-count-box {
    position: absolute;
    right: 0px;
    padding: 0 5px;
    height: 36px;
    line-height: 36px;
    background-color: #fff;
  }
}
</style>
