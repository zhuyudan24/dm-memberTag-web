<!--
    会员分组组件
    <member-group :selectedArr="selectedArr" @selectGroup="selectGroup"></member-group>

    methods: {
      /**
       * 选择分组后子组件触发的事件
       */
      selectGroup(data) {
        const that = this
      }
    }
 -->
<template>
  <div class="member-group-wrap">
    <el-table
      ref="multipleTable"
      :data="tagTableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        label="分组名称"
        width="150px"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover">
            <span>{{ scope.row.descipe }}</span>
            <a slot="reference" class="pointer" :href="'/memberGroupDetail?id='+scope.row.id">{{ scope.row.name }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="是否实时"
        >
        <template slot-scope="scope">
          {{scope.row.isRealTime == 1? '实时':'非实时'}}
        </template>
      </el-table-column>
      <el-table-column
        label="最近更新时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.recentUpdateDate | formatTimeYMD }}
          <p>{{ scope.row.recentUpdateDate | formatTimeHMS  }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="更新频率"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.updateRate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        >
        <template slot-scope="scope">
          {{scope.row.state == 1? '有效':'失效'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="peopleCover"
        label="覆盖人数"
        width="150px"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.peopleCover | formatNum }} 人
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="createTime"
        label="创建时间"
        width="150px"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createTime | formatTimeYMD }}
          <p>{{ scope.row.createTime | formatTimeHMS }}</p>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="recentUpdateDate"
        label="到期时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.recentUpdateDate | formatTimeYMD }}
          <p>{{ scope.row.recentUpdateDate | formatTimeHMS }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <a :href="'/member-tag/#/memberGroupDetail'+scope.row.id" class="edit-btn el-button--text">详情</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

  export default {
    name: "memberGroup",
    props: {
      tagLibName: {
        type: String
      },
      selectedArr: Boolean
    },
    data() {
      return {
        // 标签列表数据
        tagTableData: [
          {
            id: 1,
            descipe: '标签列表数据',
            name: '123',
            isRealTime: 1,
            recentUpdateDate: '2018-09-30 14:30:28',
            updateRate: '-',
            state: 1,
            peopleCover: '456566',
            createTime: '2018-09-30 14:30:28',
            expiredTime: '2018-09-30 14:30:28',
            popVisible: false,
          }
        ],

        // 已选的对象
        multipleSelection: [],
      }
    },
    filters: {
      formatTimeYMD(data) {
        console.log(data,data != '--' ? data.split(' ')[0] : '--')
        return data != '--' ? data.split(' ')[0] : '--';
      },
      formatTimeHMS(data) {
        return data != '--' ? data.split(' ')[1] : '--';
      },
      formatNum(data){
        const reg=/\d{1,3}(?=(\d{3})+$)/g;
        return (data + '').replace(reg, '$&,');
      }
    },
    methods: {
      /**
       * 选择分组后
       */
      handleSelectionChange(val) {
        const that = this
        console.log(val)
        that.$emit('selectGroup',val)
      },

    },
    mounted() {
      const that = this
      that.multipleSelection = that.selectedArr;
    }
  }
</script>
<style lang="scss" scoped>
  .member-group-wrap {
    padding-top: 20px;
    background: #fff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
