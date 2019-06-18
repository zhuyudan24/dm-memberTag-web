<template>
  <div class="memberGroupDetail-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="memberGroupDetail-wrap__info m-b-20">
          <span class="group-name">{{ groupName }}</span>
          <span class="group-total m-l-20 p-l-20">
            覆盖人数
            <span>{{ separator(total) }}</span>
            人
          </span>
        </div>
        <div class="memberGroupDetail-wrap__head">
          <span class="tag-selected-title">筛选标签</span>
          <!--            <div class="inline-block tag-cell-wrap flex-1">-->
          <!--              <template v-for="(item, index) in selectedTagData">-->
          <!--                <span v-if="index != 0" class="p-lr-18" :key="index">并且</span>-->
          <!--                <span class="tag-cell inline-block border-box color-606266" :key="index + item.tagValueId">-->
          <!--                  <span>{{ item.tagName }}</span>-->
          <!--                  <span v-if="item.tagParams">【选择:{{ item.tagParams.selectedVal.join(',') }}】</span>-->
          <!--                </span>-->
          <!--              </template>-->
          <selected-tags-list :tagsList="selectedTagData" />
          <!--            </div>-->
        </div>
        <div class="memberGroupDetail-wrap__table">
          <el-table v-loading="loading" @sort-change="sortChange" :data="memberGroupDetailData" style="width: 100%">
            <div v-for="item in selectedFields" :key="item.code">
              <el-table-column
                :sortable="
                  item.code == 'name' ||
                  item.code == 'grade' ||
                  item.code == 'status' ||
                  item.code == 'channel' ||
                  item.code == 'createCardStoreName' ||
                  item.code == 'cardNo' ||
                  item.code == 'forzenStatus' ||
                  item.code == 'mainStoreName' ||
                  item.code == 'costCategory'
                    ? false
                    : 'custom'
                "
                :prop="item.code"
                :fixed="item.code == 'name' ? true : false"
                :label="item.name"
              >
                <template slot-scope="scope">
                  <!-- 基本信息 -->
                  <template v-if="item.code == 'name'">
                    <div @click="linkDetail(scope.row.memberId, scope.row.isWeixinMember)" style="cursor: pointer;" class="tablecontent-cell">
                      <el-popover placement="top-start" width="400" height="180" trigger="hover" @show="showSingleInfo(scope.row.memberId)">
                        <div class="pointer" @click="linkDetail(scope.row.memberId, scope.row.isWeixinMember)">
                          <div class="singelinfo flex">
                            <div class="singelinfo-img">
                              <img width="100" height="100" :src="scope.row.thirdImgUrl ? scope.row.thirdImgUrl : require('../../assets/group/member_img.png')" alt="" />
                            </div>
                            <div class="singelinfo-content flex-1 pLeft10 pRight10">
                              <span class="lheigth0">
                                {{ scope.row.memberName }}
                                <span
                                  :title="singleInfo.status == 0 ? '取消关注公众号' : singleInfo.status == 1 ? '已关注公众号' : '未关注公众号'"
                                  class="channelicon fr"
                                  :class="singleInfo.status == 0 ? 'gzhiconcanclegray' : singleInfo.status == 1 ? 'gzhicon' : 'gzhicongray'"
                                ></span>
                                <span
                                  :title="singleInfo.wxStatus == 0 ? '未使用小程序' : singleInfo.wxStatus == 1 ? '使用过小程序' : ''"
                                  class="channelicon fr m-r-6"
                                  :class="singleInfo.wxStatus == 0 ? 'xcxicongray' : singleInfo.wxStatus == 1 ? 'xcxicon' : ''"
                                ></span>
                              </span>
                              <p class="lheigth0">
                                <span class="evl-right">{{ singleInfo.sex }}</span>
                                <span class="evl-right">{{ singleInfo.age }}</span>
                                <span :title="singleInfo.cardNo">{{ singleInfo.cardNo }}</span>
                              </p>
                              <p class="lheigth0">
                                <span>{{ singleInfo.mainStoreName }}</span>
                              </p>
                              <div class="singelinfo-cost flex">
                                <div class="singelinfo-costitem flex-1">
                                  <p>{{ singleInfo.costFee }}</p>
                                  <p>消费总额</p>
                                </div>
                                <div class="singelinfo-costitem flex-1">
                                  <p>{{ singleInfo.costTimes }}</p>
                                  <p>消费次数</p>
                                </div>
                                <div class="singelinfo-costitem">
                                  <p>{{ singleInfo.lastCost }}</p>
                                  <p>最近消费</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="singelinfo-jl flex mBottom20 mTop20">
                            <a class="singelinfo-jlitem flex-1">消费记录 ({{ singleInfo.numOfSale }})</a>
                            <a class="singelinfo-jlitem flex-1">营销记录 ({{ singleInfo.numOfmarket }})</a>
                            <a class="singelinfo-jlitem flex-1">卡券记录 ({{ singleInfo.couponCount }})</a>
                          </div>
                        </div>
                        <span slot="reference">
                          <span class="table-member__img inline-block middle border-box m-r-8">
                            <img :src="scope.row.thirdImgUrl ? scope.row.thirdImgUrl : require('../../assets/group/member_img.png')" />
                          </span>
                          <span>{{ scope.row.memberName }}</span>
                        </span>
                      </el-popover>
                    </div>
                  </template>
                  <!-- 会员等级 -->
                  <template v-if="item.code == 'grade'">
                    {{ scope.row.gradeName }}
                  </template>
                  <!-- 状态 -->
                  <template v-if="item.code == 'status'">
                    <span
                      :title="scope.row.wxStatus == 0 ? '未使用小程序' : scope.row.wxStatus == 1 ? '已使用小程序' : ''"
                      class="channelicon"
                      :class="scope.row.wxStatus == 0 ? 'xcxicongray' : scope.row.wxStatus == 1 ? 'xcxicon' : ''"
                    ></span>
                    <span
                      :title="scope.row.status == 0 ? '取消关注公众号' : scope.row.status == 1 ? '已关注公众号' : '未关注公众号'"
                      class="channelicon"
                      :class="scope.row.status == 0 ? 'gzhiconcanclegray' : scope.row.status == 1 ? 'gzhicon' : 'gzhicongray'"
                    ></span>
                  </template>
                  <!-- 关联渠道 -->
                  <template v-if="item.code == 'channel'">
                    <span class="channelicon" :class="scope.row.channelTaobao == 0 ? 'taobaoicongray' : scope.row.channelTaobao == 1 ? 'taobaoicon' : ''"></span>
                    <span class="channelicon" :class="scope.row.channelJd == 0 ? 'jdicongray' : scope.row.channelJd == 1 ? 'jdicon' : ''"></span>
                    <span class="channelicon" :class="scope.row.channelWei == 0 ? 'vipicongray' : scope.row.channelWei == 1 ? 'vipicon' : ''"></span>
                  </template>
                  <!-- 开卡时间 -->
                  <template v-if="item.code == 'crateCardDateString'">
                    <div>{{ scope.row.crateCardDateString }}</div>
                  </template>
                  <!-- 新增时间 -->
                  <template v-if="item.code == 'createTime'">
                    <div>{{ scope.row.createTime | formatTimeYMD }}</div>
                    <div>{{ scope.row.createTime | formatTimeHMS }}</div>
                  </template>
                  <!-- 关注时间 -->
                  <template v-if="item.code == 'attentionDate'">
                    <div>{{ scope.row.attentionTime | formatTimeYMD }}</div>
                    <div>{{ scope.row.attentionTime | formatTimeHMS }}</div>
                  </template>
                  <!-- 消费总额 -->
                  <template v-if="item.code == 'costAll'">
                    <span>
                      {{ scope.row.costFee }}
                    </span>
                  </template>
                  <!-- 消费次数 -->
                  <template v-if="item.code == 'costTimes'">
                    <div>{{ scope.row.costTimes }}</div>
                  </template>
                  <!-- 最近消费时间 -->
                  <template v-if="item.code == 'lastCostTime'">
                    <div>{{ scope.row.lastCostTime | formatTimeYMD }}</div>
                  </template>
                  <!-- 客单件 -->
                  <template v-if="item.code == 'avgCost'">
                    {{ scope.row.avgCost }}
                  </template>
                  <!-- 连带率 -->
                  <template v-if="item.code == 'avgNumber'">
                    {{ scope.row.avgNumber }}
                  </template>
                  <!-- 消费品类 -->
                  <template v-if="item.code == 'costCategory'">
                    {{ scope.row.costCategory }}
                  </template>
                  <!-- 平均折扣 -->
                  <template v-if="item.code == 'discountRate'">
                    {{ scope.row.discountRate }}
                  </template>
                  <!-- 取关时间 -->
                  <template v-if="item.code == 'cancelAttentionTime'">
                    <div>{{ scope.row.cancelAttentionTime | formatTimeYMD }}</div>
                    <div>{{ scope.row.cancelAttentionTime | formatTimeHMS }}</div>
                  </template>
                  <!-- 年龄 -->
                  <template v-if="item.code == 'age'">
                    {{ scope.row.age }}
                  </template>
                  <!-- 生日 -->
                  <template v-if="item.code == 'birthday'">
                    {{ scope.row.birthdayMD }}
                  </template>
                  <!-- 储值总额 -->
                  <template v-if="item.code == 'storedValueAll'">
                    {{ scope.row.storedValueAll }}
                  </template>
                  <!-- 储值余额 -->
                  <template v-if="item.code == 'storedValueCurrent'">
                    {{ scope.row.storedValueCurrent }}
                  </template>
                  <!-- 累计积分 -->
                  <template v-if="item.code == 'pointsAll'">
                    {{ scope.row.pointsAll }}
                  </template>
                  <!-- 积分余额 -->
                  <template v-if="item.code == 'pointsCurrent'">
                    {{ scope.row.pointsCurrent }}
                  </template>
                  <!-- 主门店 -->
                  <template v-if="item.code == 'mainStoreName'">
                    {{ scope.row.mainStoreName }}
                  </template>
                  <!-- 开卡门店 -->
                  <template v-if="item.code == 'createCardStoreName'">
                    {{ scope.row.openStoreName }}
                  </template>
                  <!-- 会员卡号 -->
                  <template v-if="item.code == 'cardNo'">
                    {{ scope.row.cardNo }}
                  </template>
                  <!-- 会员状态 -->
                  <template v-if="item.code == 'frozenStatus'">
                    <span class="dm-status--success" v-if="scope.row.frozenStatus == 0">正常</span>
                    <span class="dm-status--warning" v-if="scope.row.frozenStatus == 1">冻结</span>
                  </template>
                  <!-- 最近消费 -->
                  <template v-if="item.code == 'lastCost'">
                    {{ scope.row.lastCost }}
                  </template>
                  <!-- 最高单笔（应收） -->
                  <template v-if="item.code === 'highCost'">
                    <span>{{scope.row.highCost}}</span>
                  </template>
                  <!-- 消费总额（实付） -->
                  <template v-if="item.code === 'costFeePaid'">
                    <span>{{scope.row.costFeePaid}}</span>
                  </template>
                  <!-- 最近消费（实付） -->
                  <template v-if="item.code === 'lastCostPaid'">
                    <span>{{scope.row.lastCostPaid}}</span>
                  </template>
                  <!-- 最高单笔（实付） -->
                  <template v-if="item.code === 'highCostPaid'">
                    <span>{{scope.row.highCostPaid}}</span>
                  </template>
                </template>
              </el-table-column>
            </div>
            <el-table-column label-class-name="table-header__handle">
              <template slot="header">
                <span>操作</span>
                <i class="el-icon-setting" @click="showDefined"></i>
              </template>
              <template slot-scope="scope">
                <a
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  v-if="scope.row.isWeixinMember"
                  :href="'/member/#/wechatmemberDetail?memberId=' + scope.row.memberId + '&channel=wxMember&fromPage=memberGroup'"
                  class="el-button el-button--text"
                  >查看</a
                >
                <a
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  v-else
                  :href="'/member/#/posmemberDetail?memberId=' + scope.row.memberId + '&channel=posMember&fromPage=memberGroup'"
                  class="el-button el-button--text"
                  >查看</a
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block common-wrap__page text-right" v-if="memberGroupDetailData.length != 0">
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
    <!-- 自定义字段列表 -->
    <userDefined :fieldsData="memberFields" :selectedData="selectedUserDefined" :showUserDefined="showUserDefined" @hideUserDefined="hideUserDefined" @confirmUserDefined="confirmUserDefined"> </userDefined>
  </div>
</template>
<script>
import './memberGroupDetail.less';
import navCrumb from '@/components/nav/nav.vue';
import userDefined from '@/components/userDefined.vue';
import selectedTagsList from '@/components/selected-tags-list.vue';
import errMsg from '@/common/js/error';
import { getRequest } from '@/api/api';
export default {
  name: 'memberGroupDetail',
  data() {
    return {
      loading: true,
      // 自定义字段列表是否显示
      showUserDefined: false,
      memberFields: [], // 所有自定义字段
      selectedUserDefined: [], // 已选的自定义字段
      selectedFields: [], // 已选的自定义字段对象集合

      groupName: '分组名称',
      groupIsRealTime: 1,
      // 分组中已选标签
      selectedTagData: [],
      // memberGroupDetailData 表格
      sortableFlag: false, // 表格可排序
      memberGroupDetailData: [],
      memberGroupDetailDataBack: [],
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 头像缩略信息
      singleInfo: {
        sex: 0,
        age: 0,
        cardNo: 0,
        mainStoreName: 'dd',
        costFee: 0,
        costTimes: 0,
        lastCost: 0,
        numOfSale: 0,
        numOfmarket: 0,
        couponCount: 0,
        status: 0,
        wxStatus: 0,
        phoneStatus: 0,
        authStatus: 0
      },
      baseUrl: '',
      sortFiled: '',
      order: ''
    };
  },
  computed: {
    // 面包屑参数
    navpath() {
      console.log(window.location.origin, 'origin');
      return [
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
          name: '会员分组',
          path: '/memberGroupList'
        },
        {
          name: '会员分组详情',
          path: ''
        }
      ];
    }
  },

  filters: {
    formatTimeYMD(time) {
      if (time && time > 0) {
        let arr = time.toString().split('');
        const y = arr.splice(0, 4).join('');
        const m = arr.splice(0, 2).join('');
        const d = arr.splice(0, 2).join('');
        return y + '-' + m + '-' + d;
      } else {
        return '--';
      }
    },
    formatTimeHMS(time) {
      if (time && time > 0) {
        let arr = time.toString().split('');
        arr.splice(0, 8);
        const h = arr.splice(0, 2).join('');
        const m = arr.splice(0, 2).join('');
        const s = arr.splice(0, 2).join('');
        return h + ':' + m + ':' + s;
      } else {
        return '--';
      }
    }
  },

  methods: {
    /**
     * 千位分隔符
     * */
    separator(num) {
      let reg = /\d{1,3}(?=(\d{3})+$)/g;
      num = num + '';
      return num.replace(reg, '$&,');
    },
    /**
     * 排序
     */
    sortChange({ column, prop, order }) {
      console.log(prop, order);
      this.sortFiled = prop;
      this.order = order == 'descending' ? 'desc' : 'asc';
      this.getGroupDetail();
    },
    /**
     * 获取分组的标签明细
     */
    getTagValueDtoList() {
      let that = this;
      let memberTagGroupId = that.$route.query.memberTagGroupId;
      let params = {
        memberTagGroupId
      };
      getRequest('/member-tag-group/findOneDetial.json', params)
        .then(res => {
          console.log(res, 'tagValueDtoList');
          that.groupName = res.data.result.tagGroupDto.groupName;
          that.groupIsRealTime = res.data.result.tagGroupDto.isRealTime;
          let list = res.data.result.tagValueDtoList;
          list.forEach(li => {
            li.tagParams && (li.tagParams = JSON.parse(li.tagParams));
          });
          this.selectedTagData = list;
        })
        .catch(e => {
          console.log(e, 'error of getTagValueDtoList');
        });
    },

    /**
     * 弹层显示
     */
    showDefined() {
      const that = this;
      that.showUserDefined = true;
    },

    /**
     * 取消选择-弹层隐藏
     */
    hideUserDefined(flag) {
      this.showUserDefined = flag;
    },

    /**
     * 确认选择-弹层隐藏
     */
    confirmUserDefined(data) {
      console.log(data);
      if (data.length < 1) {
        this.$message.error({
          duration: 1000,
          message: '请选择自定义字段'
        });
        return false;
      }
      this.loading = true;
      let fields = data.join(',');
      this.selectedUserDefined = data;
      this.showUserDefined = false;
      // 修改已选字段对象
      this.selectedFields = [];
      this.selectedFields = this.memberFields.filter(item => this.selectedUserDefined.includes(item.code));
      this.saveFieldsList(fields).then(() => {
        this.loading = false;
      });
    },

    /**
     * 列表自定义字段选择保存
     */
    saveFieldsList(fields) {
      const para = {
        pageName: 'memberSign',
        fields
      };
      return this.axios.post(`${this.baseUrl}/api-member/update-fields?requestProject=memberTag`, para);
    },

    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getGroupDetail();
    },

    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getGroupDetail();
    },

    /**
     * 获取分组详情 系统异常？？？？
     */
    getGroupDetail(list) {
      const that = this;
      let memberTagGroupId = that.$route.query.memberTagGroupId;
      let params = {
        memberTagGroupId,
        pageNum: that.currentPage,
        pageSize: that.pageSize,
        sortColName: that.sortFiled,
        sortType: that.order
      };
      getRequest('/member-tag-member/findMemberList.json', params)
        .then(res => {
          that.total = res.data.result.page.totalCount;
          that.memberGroupDetailData = res.data.result.page.result;
          let defaultFieldsArr = res.data.result.fieldsStr.split(',');
          if (list) {
            list.forEach(function(ele, index) {
              if (!!ele.check || defaultFieldsArr.indexOf(ele.code) > -1) {
                that.selectedUserDefined.push(ele.code);
                that.selectedFields.push(ele);
              }
            });
          }
          that.loading = false;
        })
        .catch(e => {
          console.log(e, 'error of get group detail');
          that.loading = false;
        });
    },
    /**
     * 点击信息跳转分组详情
     */
    linkDetail(memberId, isWeixinMember) {
      window.open(
        !!isWeixinMember
          ? `${window.location.origin}/member/#/wechatmemberDetail?memberId=${memberId}&channel=wxMember&fromPage=memberGroup`
          : `${window.location.origin}/member/#/posmemberDetail?memberId=${memberId}&channel=posMember&fromPage=memberGroup`
      );
    },

    /**
     * 获取头像处显示信息
     */
    showSingleInfo(memberId) {
      console.log(memberId);
      const that = this;
      const para = {
        memberId: memberId
      };
      that.singleInfo = '';
      that.axios
        .post(`${that.baseUrl}/api-member/load-member-single-info?requestProject=memberTag`, para)
        .then(res => {
          const resData = res.data;
          if (resData.errorCode == 0) {
            // showMsg.showmsg('保存成功','success')
            let ret = resData.result.memberSingle;
            that.singleInfo = {
              ...ret,
              sex: ret.sex == 0 ? '性别未知' : ret.sex == 1 ? '男' : '女',
              age: ret.age != 0 ? ret.age : '年龄未知',
              cardNo: !!ret.cardNo ? ret.cardNo : '无会员卡',
              mainStoreName: !!ret.mainStoreName ? ret.mainStoreName : '主门店未知'
            };
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
     * 获取自定义列表字段
     */
    getFieldsList() {
      const that = this;
      const para = {
        pageName: 'memberSign'
      };
      that.selectedUserDefined = [];
      that.selectedFields = [];
      that.axios
        .post(`${that.baseUrl}/api-member/find-member-fields?requestProject=memberTag`, para)
        .then(res => {
          console.log(res, '自定义列表字段');
          const resData = res.data;
          if (resData.errorCode == 0) {
            // showMsg.showmsg('保存成功','success')
            that.memberFields = resData.result; // 保存所有自定义列表字段
            that.getGroupDetail(resData.result);
            // resData.result.forEach(function(ele,index){
            //   if (!!ele.check) {
            //     that.selectedUserDefined.push(ele.code)
            //     that.selectedFields.push(ele)
            //   }
            // });
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
    }
  },
  beforeMount() {
    var that = this;
    var host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  mounted() {
    this.getTagValueDtoList();
    // 获取自定义字段
    this.getFieldsList();
    // this.getGroupDetail();
    document.getElementById('app').style.zIndex = 'auto';
  },
  components: {
    navCrumb,
    userDefined,
    selectedTagsList
  }
};
</script>
<style lang="scss" scoped>
.memberGroupDetail-wrap__head {
  font-size: 14px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 24px;
  .tag-selected-title {
    display: inline-block;
    width: 60px;
    padding-top: 10px;
  }
  .real-time {
    padding: 3px 4px;
    border-radius: 4px;
    color: #fff;
    background: #1890ff;
  }

  .tag-cell-wrap {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .tag-cell {
    padding: 0 10px;
    margin-bottom: 10px;
    line-height: 36px;
    background: #ebeef5;
    border-radius: 2px;
  }
}

.memberGroupDetail-wrap__info {
  .group-name {
    font-size: 18px;
    font-weight: bold;
  }
  .group-total {
    font-size: 14px;
    color: #666;
    border-left: 1px solid #aaa;
    span {
      padding: 0 3px;
      font-size: 16px;
      color: #303133;
      font-weight: bold;
    }
  }
}

.memberGroupDetail-wrap__table {
  position: relative;
  font-size: 14px;
  color: #606266;
  .defined-btn {
    padding: 0;
    width: 65px;
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      margin-left: 10px;
      font-size: 20px;
      color: #999;
    }
    &:hover i {
      color: #666;
    }
  }

  .channelicon {
    width: 20px;
    height: 20px;
    display: inline-block;
  }
  /* 已使用小程序 */
  .xcxicon {
    background: url('../../assets/group/status@xcx.png') no-repeat 50%;
  }
  /* 未使用小程序 */
  .xcxicongray {
    background: url('../../assets/group/status@xcxgray.png') no-repeat 50%;
  }
  /* 已关注公众号 */
  .gzhicon {
    background: url('../../assets/group/status@gzh.png') no-repeat 50%;
  }
  /* 取消关注公众号 */
  .gzhiconcanclegray {
    background: url('../../assets/group/status@gzhcanclegray.png') no-repeat 50%;
  }
  /* 未关注 */
  .gzhicongray {
    background: url('../../assets/group/status@gzhgray.png') no-repeat 50%;
  }
  /* 淘宝 */
  .taobaoicon {
    background: url('../../assets/group/channel@taobao.png') no-repeat 50%;
  }
  .taobaoicongray {
    background: url('../../assets/group/channel@taobaogray.png') no-repeat 50%;
  }
  /* 京东 */
  .jdicon {
    background: url('../../assets/group/channel@jd.png') no-repeat 50%;
  }
  .jdicongray {
    background: url('../../assets/group/channel@jdgray.png') no-repeat 50%;
  }
  /* 唯品会 */
  .vipicon {
    background: url('../../assets/group/channel@vip.png') no-repeat 50%;
  }
  .vipicongray {
    background: url('../../assets/group/channel@vipgray.png') no-repeat 50%;
  }

  [class^='dm-status--']:before {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 7px;
    vertical-align: middle;
    content: ' ';
    background-color: #d9d9d9;
    border-radius: 50%;
  }

  .dm-status--success:before {
    background-color: #52c41a;
  }
}

.table-member__img {
  width: 40px;
  height: 40px;
  // line-height: 40px;
  text-align: center;
  // background: #F3F6F9;
  img {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    border-radius: 4px;
  }

  i {
    font-size: 30px;
    color: #dfe6f0;
  }
}
</style>
