import qs from 'qs';
/* eslint-disable */
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  beforeMount() {
    const that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  data() {
    return {
      templateCode: null,
      currentComputeType:'',
      currentKey: '',
      // 标签详情数据
      tagData: {
        tagId: '',
        tagName: '',
        tagDescribe: '',
        isActive: 0, // 是否实时
        inputSearch: '' // 输入搜索
      },
      tag001: {
        checkeditems: [],
        isIndeterminate: false,
        checkAll: false,
        options: [],
        compute: 'in'
      },

      // 属于/不属于(计算控件)
      tag002: {
        computeRadio: 'in'
      },

      // 数字区间
      tag003: {
        numRange: ['', '']
      },

      // 时间属性-固定时段/最近
      tag004: {
        fixedRecentRadio: '1',
        fixedRecentRangeValue: [],
        fixedRecentTimeRecent: ''
      },

      // 最近 天
      tag005: {
        timeRecent: '',
        timeType: 'lastday'
      },

      // 之后 天
      tag006: {
        timeAfter: '',
        timeType: 'afterday'
      },

      // 添加输入值
      tag007: {
        addInputValue: '',
        addTags: []
      },

      // 搜索下拉多选添加值
      tag008: {
        searchModel: [],
        searchOptions: [
          // {
          //   key: 1,
          //   value: '测试去1'
          // }
        ],
        addSelectTags: []
      },

      // 多选项( 全部选项/已选选项 )
      tag009: {
        allSelectActive: 'first',
        inputSearch: '',
        allSelectOptions: [
        ],
        selectedOptions: []
      },

      // 多选项(城市选择) ( 全部选项/已选选项 )
      tag010: {
        citySelectActive: 'first',
        isIndeterminateCity: false,
        checkAllCity: false,
        citySelectOptions: [
          {
            provinceId: 1,
            check: false,
            provinceName: '北京',
            showCity: false,
            children: [
              {
                cityId: 11,
                cityName: '北京',
                check: false
              }
            ]
          },
          {
            provinceId: 2,
            check: false,
            provinceName: '浙江',
            showCity: false,
            children: [
              {
                cityId: 21,
                cityName: '杭州',
                check: false
              },
              {
                cityId: 22,
                cityName: '温州',
                check: false
              }
            ]
          }
        ],
        checkeditemsCity: [], // 已选省
        citySelectedOptions: []
      },

      // 门店选择器
      tag011: {
        // 门店选择器参数
        uuid: '', // 新增传空，编辑必传
        // 需要的下拉 默认为全部[0,1,2,3,4,5]
        // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
        uuidOptions: [0, 1, 2, 3, 4, 5],
        isAdd: true // 新增: true, 编辑: false
      },

      // 多范围()
      tag012: {
        selectOne: 'all',
        selectTwo: 'in',
        selectLabel: '曾经消费门店',
        selectLabelTip: '注：存在其一即会员至少有一个字段值满足所选条件；所有即会员的所有字段值满足所选条件'
      },

      // 多选项值异步
      tag013: {
        checkeditems: [],
        isIndeterminate: false,
        checkAll: false,
        options: [
        ]
      },

      // 时间属性-固定时段/相对时段 年月日-年月日+最近+之后
      tag014: {
        radio: '1',
        dateRangeValue: [],

        // 相对时间
        timeRadio: '1', // 年月日
        timeChecked: '1', //当 年月日 / 最近/之后
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      // 时间属性- 月日-月日+最近+之后
      tag015: {
        radio: '1',
        dateRangeValue: [],
        // 相对时间
        timeRadio: '1', // 月日
        timeChecked: '1', //当 月日 / 最近/之后
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      // 时间属性- 年月日-年月日
      tag016: {
        dateRangeValue: []
      },
      // 时间属性- 年月日-年月日+最近
      tag017: {
        radio: '1',
        dateRangeValue: [],
        // 相对时间
        timeRadio: false, // 年月日
        timeAfterChecked: false, // 最后 最近
        timeChecked: '1', //当 年月日 / 最近
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近
        timeInput: ''
      },

      // 时间属性- 年月日-年月日
      tag019: {
        radio: '1',
        dateRangeValue: [],

        // 相对时间
        timeRadio: false, // 年月日
        timeChecked: '1', //当 年月日 / 最近/之后
        // timeCheckedTwo: false,
        timeAfterChecked: false,
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      tag020: {
        radio: '1',
        dateRangeValue: [],

        // 相对时间
        timeRadio: '1', // 年月日
        timeChecked: false,
        timeAfterChecked: false,
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近/之后
        timeInput: ''
      }
    };
  },

  methods: {
    /**
     * 关闭
     */
    closeTagShortDialog() {
      const that = this;
      that.tagShortVisible = false;
      that.resetData();
      that.$emit('hideTag');
      that.$emit('update:tagShortId', '');
      that.templateData = [];
      that.rowData = {};
      that.$emit('update:rowItemData', {});
    },

    /**
     * 重置数据
     */
    resetData() {
      const that = this;
      that.templateData.forEach(function(ele, index) {
        if (!!ele.checkeditems) {
          ele.checkeditems = [];
        }
        if (!!ele.isIndeterminate) {
          ele.isIndeterminate = false;
        }
        if (!!ele.checkAll) {
          ele.checkAll = false;
        }
        if (!!ele.numRange) {
          ele.numRange = ['', ''];
        }
        if (!!ele.fixedRecentRadio) {
          ele.fixedRecentRadio = '1';
        }
        if (!!ele.fixedRecentRangeValue) {
          ele.fixedRecentRangeValue = [];
        }
        if (!!ele.fixedRecentRangeValue) {
          ele.fixedRecentTimeRecent = '';
        }
        if (ele.templateCode == 'tag007') {
          ele.addTags = [];
        }
        if (ele.templateCode == 'tag008') {
          ele.addSelectTags = [];
        }
        if (ele.templateCode == 'tag010') {
          ele.citySelectActive = 'first';
          ele.isIndeterminateCity = false;
          ele.checkAllCity = false;
          ele.citySelectOptions = [];
          ele.citySelectedOptions = [];
        }
        if (ele.templateCode == 'tag019') {
          ele.dateRangeValue = [];
        }
      });
    },

    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     * 跳转标签详情
     */
    toTagDetail() {
      const that = this;
      that.changeRoute('/myTagDetail');
    },

    /**
     * 取消弹层
     */
    cancelDialog() {
      const that = this;
      that.closeTagShortDialog();
    },

    /**
     * 确定弹层
     */
    confirmDialog() {
      this.confirmPost();
    },
    /* eslint-disable */
    async confirmPost() {
      const that = this;
      that.postTemplateData.selectedVal = [];
      let returnFlag = true; // 判断标志
      let tagParams = [];
      
      let tagValue = {
        val: [
          {
            //选择的值 跟人群筛选器一样
            type: 'data', //类型
            data: {
              key: that.currentKey, // || that.tagData.tagId,//es字段 如果是nested 变为title.t
              compute: '', //计算属性
              value: '', //值,
              dealKey: '' //属性是需要处理的类型 比如门店 下的门店类型都需要转门店id 需要后台转换 storeWidget
            }
          }
        ],
        time: [
          {
            //时间选择 比如最近几天等
            type: '', //
            value: '' //有区间值的 逗号分隔 例如：2018-10,2019-10
          }
        ]
      };


      let code = that.templateData[0].templateCode;
      /* 多选 */
      if (code === 'tag001' && !that.templateData[0].checkeditems.length) {
        that.$message.error({ message: '请选择值' });
        return false;
      }
      if (code === 'tag001' && that.templateData.length === 1) {
        tagValue.val[0].data.compute = that.templateData[0].postCompute;
        tagValue.val[0].data.value = that.templateData[0].checkeditems.join(' ');
        that.templateData[0].options.forEach(function(ele, index) {
          if (that.templateData[0].checkeditems.indexOf(ele.key) != -1) {
            that.postTemplateData.selectedVal.push(ele.value);
          }
        });
      }
      /* 数字区间 */
      if (code === 'tag003' && (that.templateData[0].numRange[0] === '' || that.templateData[0].numRange[1] === '')) {
        this.$message.error({ message: '请填写值' });
        return false;
      }
      if (code === 'tag003' && that.templateData[0].numRange[0] - that.templateData[0].numRange[1] > 0) {
        this.$message.error({ message: '起始值必须小于等于最大值' });
        return;
      }
      if (code === 'tag003' && that.templateData.length === 1) {
        tagValue.val[0].data.compute = that.templateData[0].postCompute;
        tagValue.val[0].data.value = that.templateData[0].numRange.join(',');
        that.postTemplateData.selectedVal.push(`${that.templateData[0].numRange[0]} <= ${that.tagData.tagName} <= ${that.templateData[0].numRange[1]}`);
      }
      /* 输入添加值 */
      if (code === 'tag007' && !that.templateData[0].addTags.length) {
        that.$message.error({ message: '请添加值' });
        return false;
      }
      if (code === 'tag007' && that.templateData.length === 1) {
        tagValue.val[0].data.compute = that.templateData[0].postCompute;
        tagValue.val[0].data.value = that.templateData[0].addTags.map(item => item.value.replace(/\s/g, '')).join(' ');
        that.postTemplateData.selectedVal.push(that.templateData[0].addTags.map(item => item.value).join(','));
      }
      // 全部/已选
      if (code === 'tag009' && !that.templateData[0].selectedOptions.length) {
        that.$message.error({ message: '请添加值' });
        return false;
      }
      if (code === 'tag009' && that.templateData.length === 1) {
        tagValue.val[0].data.value = that.templateData[0].selectedOptions.map(item => item.key).join(',');
        that.postTemplateData.selectedVal.push(that.templateData[0].selectedOptions.map(item => item.value).join(','));
      }
      // 多选项(城市选择) ( 全部选项/已选选项 )
      if (code === 'tag010' && !that.templateData[0].citySelectedOptions.length) {
        that.$message.error({ message: '请添加值' });
        return false;
      }
      if (code === 'tag010' && that.templateData.length === 1) {
        tagValue.val[0].data.value = that.templateData[0].citySelectedOptions.map(item => item.cityId).join(' ');
        that.postTemplateData.selectedVal.push(that.templateData[0].citySelectedOptions.map(item => item.selected).join(','));
      }
      /* 多选异步 */
      if (code === 'tag013' && !that.templateData[0].checkeditems.length) {
        that.$message.error({ message: '请选择值' });
        return false;
      }
      let itemArr = [];
      if (code === 'tag013' && that.templateData.length === 1) {
        tagValue.val[0].data.compute = that.templateData[0].postCompute;
        that.templateData[0].options.forEach(function(ele, index) {
          if (that.templateData[0].checkeditems.indexOf(ele.key) != -1) {
            that.postTemplateData.selectedVal.push(ele.value);
            itemArr.push(ele.key);
          }
        });
        that.templateData[0].checkeditems = itemArr;
        tagValue.val[0].data.value = itemArr.join(' ');
        if (!itemArr.length) {
          returnFlag = false;
        }
      }
      /**
       * 商品选择必选
       */
      for (let i = 0; i < this.templateData.length; i++) {
        // 商品选择器
        if (this.templateData[i].templateCode == 'com022') {
          let ret = await this.confirmSelector();
          if (!this.com022.selectList || !this.com022.selectList.length) {
            this.$message.warning('商品选择器未选择条件！')
            return false;
          }
          tagValue.val[0].data.compute = this[code].postCompute;
          tagValue.val[0].data.key = this.currentKey;
          tagValue.val[0].data.dealKey = 'goodsSeletor';
          tagValue.val[0].data.value = this.com022.finalId;
          let abbr = this.translateAbbrinfo(this.com022.abbrInfo);
          this.postTemplateData.selectedVal.push(abbr.join(' '));
          this.postTemplateData.conditionList = this.com022.conditionsList;
        }
      }


      /* 年月日-年月日*/
      if (code === 'tag016' && !that.templateData[0].dateRangeValue.length) {
        that.$message.error({ message: '请选择时间' });
        return false;
      }
      if (code === 'tag016' && that.templateData.length === 1) {
        if (that.currentComputeType == 2) {
          tagValue.val[0].data.compute = 'between';
        } else {
          tagValue.val[0].data.compute = that.templateData[0].postCompute;
        }
        tagValue.val[0].data.value = that.templateData[0].dateRangeValue.join(',');
        that.postTemplateData.selectedVal.push(`${that.templateData[0].dateRangeValue[0]} 至 ${that.templateData[0].dateRangeValue[1]}`);
      }

      /* 固定/相对 年月日+最近+之后  年月日+最近  年月日时分秒-年月日时分秒 */
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019' || code === 'tag020' || code === 'tag015') && that.templateData[0].radio == 1) {
        if (!that.templateData[0].dateRangeValue || !that.templateData[0].dateRangeValue.length) {
          that.$message.error({ message: '请选择值' });
          return false;
        }
      }

      if ((code === 'tag014' || code === 'tag017' || code === 'tag019' || code === 'tag020' || code === 'tag015')) {
        for (let k of this.templateData) {
          if (!k.timeChecked && !k.timeAfterChecked && k.radio == 2) {
            let tips = k.timeRadio == 1 ? '天' : k.timeRadio == 2 ? '月' : '年';
            this.$message.warning({
              message: `相对时段的时间精度当${tips}和最近必选其一`
            });
            return false;
          }

          // 如果选择最近选项 必须添加后面的具体天数
          if (k.timeAfterChecked) {
            if (!k.timeInput) {
              let timeFlag = k.timeRadio == 1 ? '天' : k.timeRadio == 2 ? '月' : '年';
              this.$message.warning({
                message: `如果选择了相对时段的最近或之后选项，${timeFlag}为必填项！`
              });
              return false;
            }
          }
        }
      }
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019' || code === 'tag020' || code === 'tag015') && that.templateData.length === 1 && that.templateData[0].radio == 1) {
        if (that.currentComputeType == 2) {
          tagValue.val[0].data.compute = 'between';
        } else {
          tagValue.val[0].data.compute = that.templateData[0].postCompute;
        }
        tagValue.val[0].data.value = that.templateData[0].dateRangeValue.join(',');
        that.templateData[0].timeInput = '';
        if (code === 'tag019' || code === 'tag020' || code === 'tag015') {
          tagValue.val[0].data.value = that.templateData[0].dateRangeValue
            .join(',')
            .replace(/-/g, '')
            .replace(/:/g, '')
            .replace(/\s+/g, '');
        }
        that.postTemplateData.selectedVal.push(that.templateData[0].dateRangeValue[0].split(' ')[0] + '至' + that.templateData[0].dateRangeValue[1].split(' ')[0]);
        console.log(that.postTemplateData.selectedVal);
      }
      
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019' || code === 'tag020' || code === 'tag015') && that.templateData.length === 1 && that.templateData[0].radio == 2) {
        // 天
        // timeAfterChecked 最近/之后
        // timeChecked 当天/年/月
        console.log(that.templateData[0].timeRadio );
        if (that.templateData[0].timeRadio == 1) {
          /**  同时选择
           * lastdayHasToday          最近几天包含今天
           * afterdayHasToday        之后几天包含今天
           */
          if (that.templateData[0].timeChecked && that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastdayHasToday';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput}天包含当天`);
              that.templateData[0].timeInput = '';
            } else {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'afterdayHasToday';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 天包含当天`);
              that.templateData[0].timeInput = '';
            }
            that.postTemplateData.template = that.templateData;
            tagParams = that.postTemplateData;
            await this.addToTemp(tagValue, tagParams);
            return true;
          }
          //天 当天
          if (that.templateData[0].timeChecked) {
            if (that.currentComputeType == 2) {
              tagValue.val[0].data.compute = 'today';
            } else {
              tagValue.val[0].data.compute = that.templateData[0].postCompute;
            }
            tagValue.val[0].data.value = '1';
            that.postTemplateData.selectedVal.push('当天');
            that.templateData[0].timeInput = '';
          }

          // 最近/之后
          if (that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              // 最近
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastday';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput} 天`);
            } else {
              // 之后
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'afterday';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 天`);
            }
          }

        }

        // 月
        if (that.templateData[0].timeRadio == 2) {

          /**
           * lastmonthHasCurrentMonth    最近几月包含当月
           * aftermonthHasCurrentMonth    之后几月包含当月
           */
          if (that.templateData[0].timeChecked && that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastmonthHasCurrentMonth';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput} 月包含当月`);
              that.templateData[0].timeInput = '';
            } else {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'aftermonthHasCurrentMonth';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 月包含当月`);
              that.templateData[0].timeInput = '';
            }
            that.postTemplateData.template = that.templateData;
            tagParams = that.postTemplateData;
            await this.addToTemp(tagValue, tagParams);
            return true;
          }
          //月 当月
          if (that.templateData[0].timeChecked) {
            if (that.currentComputeType == 2) {
              tagValue.val[0].data.compute = 'currentMonth';
            } else {
              tagValue.val[0].data.compute = that.templateData[0].postCompute;
            }
            tagValue.val[0].data.value = '1';
            that.postTemplateData.selectedVal.push('当月');
            that.templateData[0].timeInput = '';
          }
          // 最近/之后
          if (that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              // 最近
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastmonth';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput} 月`);
            } else {
              // 之后
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'aftermonth';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 月`);
            }
          }
        }

        // 年
        if (that.templateData[0].timeRadio == 3) {
          /**
           * lastyearHasCurrentYear      最近几年包含当年
           * afteryearHasCurrentYear      之后几年包含当年
           */
          if (that.templateData[0].timeChecked && that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastyearHasCurrentYear';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput} 天包含当年`);
              that.templateData[0].timeInput = '';
            } else {
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'afteryearHasCurrentYear';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 天包含当年`);
              that.templateData[0].timeInput = '';
            }
            that.postTemplateData.template = that.templateData;
            tagParams = that.postTemplateData;
            await this.addToTemp(tagValue, tagParams);
            return true;
          }
          //年 当年
          if (that.templateData[0].timeChecked) {
            if (that.currentComputeType == 2) {
              tagValue.val[0].data.compute = 'currentYear';
            } else {
              tagValue.val[0].data.compute = that.templateData[0].postCompute;
            }
            tagValue.val[0].data.value = '1';
            that.postTemplateData.selectedVal.push('当年');
            that.templateData[0].timeInput = '';
          }
          // 最近/之后
          if (that.templateData[0].timeAfterChecked) {
            if (that.templateData[0].timeSelect == 1) {
              // 最近
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'lastyear';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`最近 ${that.templateData[0].timeInput} 年`);
            } else {
              // 之后
              if (that.currentComputeType == 2) {
                tagValue.val[0].data.compute = 'afteryear';
              } else {
                tagValue.val[0].data.compute = that.templateData[0].postCompute;
              }
              tagValue.val[0].data.value = String(that.templateData[0].timeInput);
              that.postTemplateData.selectedVal.push(`之后 ${that.templateData[0].timeInput} 年`);
            }
          }
        }
      }
     
      // 数字区间 = >= <= qu区间
      if (code == 'com001') {
        for (let k of this.templateData) {
          if (k.templateCode == 'com001') {
            // tagValue.val[0].data.compute = k.symbol;
            tagValue.val[0].data.compute = k.symbol == '区间' ? 'between' : k.symbol;
            if (k.symbol != '区间') {
              if (!k.num) {
                this.$message.warning({
                  message: '请完善区间值！'
                });
                return false;
              }
              tagValue.val[0].data.value = k.num;
            } else {
              if (!k.numRange[0] || !k.numRange[1]) {
                this.$message.warning({
                  message: '请完善区间值！'
                });
                return false;
              }
              tagValue.val[0].data.value = `${k.numRange[0]},${k.numRange[1]}`;
            }
            let computeSymbol = tagValue.val[0].data.compute == 'between' ? '区间' : tagValue.val[0].data.compute;
            this.postTemplateData.selectedVal.push(`${computeSymbol}${tagValue.val[0].data.value}`);
          }
        }
      }

      /* 属于/不属于+ 选项 */

      if (that.templateData.length == 2) {
        for (let ele of that.templateData) {
          // 选项
          if (ele.templateCode === 'tag001') {
            if (!ele.checkeditems.length) {
              returnFlag = false;
            }
            tagValue.val[0].data.value = ele.checkeditems.join(' ');
            ele.options.forEach(function(el, ind) {
              if (ele.checkeditems.indexOf(el.key) != -1) {
                that.postTemplateData.selectedVal.push(el.value);
              }
            });
          }
          // 属于/不属于
          if (ele.templateCode === 'tag002') {
            tagValue.val[0].data.compute = ele.computeRadio;
            if (ele.computeRadio == 'in') {
              that.postTemplateData.selectedVal.unshift('属于');
            } else {
              that.postTemplateData.selectedVal.unshift('不属于');
            }
          }
          // 数字区间
          if (ele.templateCode === 'tag003') {
            if (ele.numRange[0] < 0 || ele.numRange[1] < 0) {
              this.$message.warning({
                message: '数字区间不能小于0！'
              });
              return;
            }
            if (ele.numRange[0] === '' || ele.numRange[1] === '') {
              returnFlag = false;
            }
            if (ele.numRange[0] > ele.numRange[1]) {
              returnFlag = false;
            }
            tagValue.val[0].data.compute = ele.postCompute;
            tagValue.val[0].data.value = ele.numRange.join(',');
            that.postTemplateData.selectedVal.push(`${ele.numRange[0]} <= ${that.tagData.tagName} <= ${ele.numRange[1]}`);
          }
          // 固定/最近
          if (ele.templateCode === 'tag004') {
            if (ele.fixedRecentRadio == 1 && !ele.fixedRecentRangeValue.length) {
              returnFlag = false;
            }
            if (ele.fixedRecentRadio == 2 && !ele.fixedRecentTimeRecent) {
              returnFlag = false;
            }

            if (ele.fixedRecentRadio == 1) {
              tagValue.time[0].type = 'between';
              tagValue.time[0].value = ele.fixedRecentRangeValue.join(',');
              that.postTemplateData.selectedVal.push(`时间范围为${ele.fixedRecentRangeValue[0]} 至 ${ele.fixedRecentRangeValue[1]}`);
            }
            // tagValue.val[0].data.compute = ele.postCompute;
            if (ele.fixedRecentRadio == 2) {
              tagValue.time[0].type = 'lastday';
              tagValue.time[0].value = String(ele.fixedRecentTimeRecent);
              that.postTemplateData.selectedVal.push(`时间范围为最近 ${ele.fixedRecentTimeRecent} 天`);
            }
          }
          // 最近 天
          if (ele.templateCode === 'tag005') {
            if (ele.timeRecent === '') {
              returnFlag = false;
            }
            tagValue.time[0].type = ele.timeType;
            tagValue.time[0].value = String(ele.timeRecent);
            that.postTemplateData.selectedVal.push(`时间范围为最近 ${ele.timeRecent} 天`);
          }
          // 之后 天
          if (ele.templateCode === 'tag006') {
            if (ele.timeAfter === '') {
              returnFlag = false;
            }
            tagValue.time[0].type = ele.timeType;
            tagValue.time[0].value = String(ele.timeAfter);
            that.postTemplateData.selectedVal.push(`时间范围为之后 ${ele.timeAfter} 天`);
          }
          // 下拉搜索添加值
          if (ele.templateCode === 'tag008') {
            if (!ele.addSelectTags.length) {
              returnFlag = false;
            }
            tagValue.val[0].data.value = ele.addSelectTags.map(item => item.key).join(' ');
            that.postTemplateData.selectedVal.push(ele.addSelectTags.map(item => item.value).join(','));
          }
          // 多选项(城市选择) ( 全部选项/已选选项 )
          if (ele.templateCode === 'tag010') {
            if (!ele.citySelectedOptions.length) {
              returnFlag = false;
            }
            tagValue.val[0].data.value = ele.citySelectedOptions.map(item => item.cityId).join(' ');
            that.postTemplateData.selectedVal.push(ele.citySelectedOptions.map(item => item.selected).join(','));
          }
          // 门店
          if (ele.templateCode === 'tag011') {
            returnFlag = await that.$refs.storeNew[0].isStoreSave();
            let StoreConfigData = await that.$refs.storeNew[0].getStoreConfig();
            that.postTemplateData.selectedVal.push(`${StoreConfigData.name} ${StoreConfigData.list.map(item => item.name).join(',')}`);
            tagValue.val[0].data.value = ele.uuid;
            tagValue.val[0].data.dealKey = 'storeWidget';
            // ele.isAdd  = true;
          }
          // 所有/存在其一 - 属于不属于
          if (ele.templateCode === 'tag012') {
            if (ele.selectOne == 'all' && ele.selectTwo == 'in') {
              tagValue.val[0].data.compute = 'allIn';
              that.postTemplateData.selectedVal.unshift('所有属于');
            }
            if (ele.selectOne == 'all' && ele.selectTwo == 'notin') {
              tagValue.val[0].data.compute = 'notIn';
              that.postTemplateData.selectedVal.unshift('所有不属于');
            }
            if (ele.selectOne == 'in' && ele.selectTwo == 'in') {
              tagValue.val[0].data.compute = 'in';
              that.postTemplateData.selectedVal.unshift('存在其一属于');
            }
            if (ele.selectOne == 'in' && ele.selectTwo == 'notin') {
              tagValue.val[0].data.compute = 'notAllIn';
              that.postTemplateData.selectedVal.unshift('存在其一不属于');
            }
          }
          // 多选项值异步
          if (ele.templateCode === 'tag013') {
            if (!ele.checkeditems.length) {
              returnFlag = false;
            }
            tagValue.val[0].data.value = ele.checkeditems.join(' ');
            ele.options.forEach(function(el, ind) {
              if (ele.checkeditems.indexOf(el.key) != -1) {
                that.postTemplateData.selectedVal.push(el.value);
              }
            });
            that.postTemplateData.selectedVal.push(that.postTemplateData.selectedVal.join(','));
          }
        }
      }

      /**
       * 曾经消费门店 有三个条件
       */
      if (this.templateData.length == 3) {
        for (let tem of this.templateData) {
          if (tem.templateCode === 'tag002') {
            tagValue.val[0].data.compute = tem.computeRadio;
            let belong = tem.computeRadio != 'notIn' ? '属于' : '不属于';
            this.postTemplateData.selectedVal.push(belong);
          }
          if (tem.templateCode === 'tag011') {
            returnFlag = await that.$refs.storeNew[0].isStoreSave();
            let StoreConfigData = await that.$refs.storeNew[0].getStoreConfig();
            this.postTemplateData.selectedVal.push(`${StoreConfigData.name} ${StoreConfigData.list.map(item => item.name).join(',')}`);
            tagValue.val[0].data.value = tem.uuid;
            tagValue.val[0].data.dealKey = 'storeWidget';
            // ele.isAdd  = true;
          }
          if (tem.templateCode === 'tag004') {
            if (tem.fixedRecentRadio == 1 && !tem.fixedRecentRangeValue.length) {
              returnFlag = false;
            }
            if (tem.fixedRecentRadio == 2 && !tem.fixedRecentTimeRecent) {
              returnFlag = false;
            }

            if (tem.fixedRecentRadio == 1) {
              tagValue.time[0].type = 'between';
              tagValue.time[0].value = tem.fixedRecentRangeValue.join(',');
              that.postTemplateData.selectedVal.push(`时间范围为${tem.fixedRecentRangeValue[0]} 至 ${tem.fixedRecentRangeValue[1]}`);
            }
            // tagValue.val[0].data.compute = ele.postCompute;
            if (tem.fixedRecentRadio == 2) {
              tagValue.time[0].type = 'lastday';
              tagValue.time[0].value = String(tem.fixedRecentTimeRecent);
              that.postTemplateData.selectedVal.push(`时间范围为最近 ${tem.fixedRecentTimeRecent} 天`);
            }
          }
          if (tem.templateCode === 'tag016') {
            if (!tem.dateRangeValue.length) {
              this.$message.warning({
                message: '请完善标签值设置！'
              });
              return false;
            }
            tagValue.time[0].value = tem.dateRangeValue.join(',');
            this.postTemplateData.selectedVal.push(`${tem.dateRangeValue[0]} 至 ${tem.dateRangeValue[1]}`);
          }
        }
      }

      if (!returnFlag) {
        that.$message.error({ message: '请完善标签值' });
        return false;
      }

      /**
       * 卡券
       * 待领取卡券       pendingCard
       * 已过期指定卡券   expiredCard
       * 已领取卡券       receivedCard
       * 已核销指定卡券   writeOffCard
       */
    
      if (this.templateData.length) {
        if (code === 'com023') {
          tagValue.val[0].data.compute = this[code].postCompute;
          tagValue.val[0].data.dealKey = "card";
          tagValue.val[0].data.key = this.currentKey;
          tagValue.val[0].data.value = this.cardListData.map(el => el.coupCardId).join(' ');
          this.postTemplateData.selectedVal = this.cardListData.map(el => el.cardName).join(' ');
        }
      }
      

      // 门店参数修改
      that.templateData.forEach(function(ele, index) {
        if (ele.templateCode == 'tag011') {
          ele.isAdd = false;
        }
      });

      if (this.templateData.length == 1) {
        for (let i = 0; i < this.templateData.length; i++) {
          if (this.templateData[i].templateCode == 'tag011') {
            returnFlag = await that.$refs.storeNew[0].isStoreSave();
            let StoreConfigData = await that.$refs.storeNew[0].getStoreConfig();
            that.postTemplateData.selectedVal.push(`${StoreConfigData.name} ${StoreConfigData.list.map(item => item.name).join(',')}`);
            tagValue.val[0].data.value = this.templateData[i].uuid;
            tagValue.val[0].data.dealKey = 'storeWidget';
          }
        }
      }
      
      that.postTemplateData.template = that.templateData;
      tagParams = that.postTemplateData;
      if (Array.isArray(tagParams.selectedVal) && tagParams.selectedVal.length) {
        tagParams.selectedVal = tagParams.selectedVal.map(el => el.replace(/(null|undefined)/g, ''));
      }
      // console.log(this.postTemplateData.conditionList);
      await this.addToTemp(tagValue, tagParams);
      return true;
    },

    // 保存商品选择器选择的条件
    translateAbbrinfo(list) {
      return list.map(el => {
        el = el.map((item, i) => {
          let strNodes = item.childNames.join(',');
          item = `${el[i].optName}${item.typeName}包含${strNodes}`
          return item;
        });
        el = el.join(' ');
        return el;
      });
    },

    /**
     * 确定弹层---添加到暂存架 api
     */
    addToTemp(tagValue, tagParams) {
      const that = this;
      const para = {
        tagId: that.tagShortId || this.tagId,
        tagValue: JSON.stringify(tagValue), // 标签选择保存值
        tagParams: JSON.stringify(tagParams) // 标签前端选择
      };
      postRequest('/member-tag-value/add.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            this.successAdd = true;
            if (that.tabActive != 'second') {
              // 如果是在暂存架修改标签值
              showMsg.showmsg('添加成功', 'success');
            }
            // 清除之前的
            this.resetOptions();
            that.closeTagShortDialog();
            // 如果来源是 会员标签编辑的时候
            // if (that.fromFlag == 'memberGroup') {
              let sendObj = {
                tagId: that.tagShortId || this.tagId,
                tagValue: JSON.stringify(tagValue),
                tagParams: JSON.stringify(tagParams),
                tagName: that.tagData.tagName,
                isActive: that.tagData.isActive,
                templateCode: this.templateCode
              };
              console.log(sendObj);
              this.$emit('returnTagData', sendObj);
            // }
            // 更新暂存架
            // that.$emit('updateTemp');
          }
        })
        .catch(function(error) {
          
        });
    },

    /**
     * 全选
     */
    handleCheckAllChange(val, item) {
      if (val) {
        item.checkeditems = [];
        item.options.forEach(function(el, index) {
          item.checkeditems.push(el.key);
        });
      } else {
        item.checkeditems = [];
      }
      item.isIndeterminate = false;
    },

    /**
     * 单选
     */
    handleCheckedChange(value, item) {
      let vBackUp = JSON.parse(JSON.stringify(value));
      let checkedCount = value.length;
      // 判断有删除,添加新值的情况
      if (checkedCount >= item.options.length) {
        item.checkeditems = [];
        item.checkeditems = item.options.map(el => {
          if (vBackUp.includes(el.key)) return el.key;
        });
        checkedCount = item.checkeditems.length;
      }
      item.checkAll = checkedCount === item.options.length;
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.options.length;
    },

    /**
     * 数字区间
     */
    blurFrom(e, item) {
      const that = this;
      let value = !Number(e.target.value.replace(/[^.\d]/g, '')) ? '0' : Number(e.target.value.replace(/[^.\d]/g, ''));
      let reg = /^[0-9]+$/;
      if (!!value && !reg.test(value)) {
        value = Number(value).toFixed(2);
      }
      // 判断输入
      /* let v1 = item.numRange[0];
      let v2 = item.numRange[1]; */
      item.numRange[0] = value;
      that.$forceUpdate();
    },
    blurTo(e, item) {
      const that = this;
      let value = !Number(e.target.value.replace(/[^.\d]/g, '')) ? '0' : Number(e.target.value.replace(/[^.\d]/g, ''));
      let reg = /^[0-9]+$/;
      if (!!value && !reg.test(value)) {
        value = Number(value).toFixed(2);
      }
      /* let t1 = item.numRange[0];
      let t2 = item.numRange[1]; */
      item.numRange[1] = value;
      that.$forceUpdate();
    },

    /**
     * 最近,之后 天输入
     */
    toEditInput(e, tag, item) {
      let newNum;
      newNum = !!parseInt(String(e.target.value).replace(/[^\d]/g, '')) ? parseInt(String(e.target.value).replace(/[^\d]/g, '')) : 1;
      if (newNum <= 0) {
        newNum = 1;
      }
      if (newNum > 365) {
        newNum = 365;
      }
      item[tag] = newNum;
    },

    /**
     * 天/月/年 RadioChange
     */
    timeRadioChange(e, parent) {
      // 每次改变选择,清空原有的值
      parent.timeInput = '';
    },

    /**
     * 天/月/年 当天改变
     */
    currentDayChange(e, parent) {
      // if (e) {
      //   parent.timeInput = '';
      // }
    },

    /**
     * 天/月/年输入
     */
    toEditDateInput(e, radio, parent) {
      let newNum;
      newNum = !!parseInt(String(e.target.value).replace(/[^\d]/g, '')) ? parseInt(String(e.target.value).replace(/[^\d]/g, '')) : 1;
      if (newNum <= 0) {
        newNum = 1;
      }
      // 天
      if (newNum > 365 && radio == 1) {
        newNum = 365;
      }
      // 月
      if (newNum > 24 && radio == 2) {
        newNum = 12;
      }
      // 年
      if (newNum > 3 && radio == 3) {
        newNum = 2;
      }
      parent.timeInput = newNum;
    },

    /**
     * 添加输入值
     */
    addInputVal(item) {
      const that = this;
      if (!item.addInputValue.trim()) {
        that.$message.error({
          duration: 1000,
          message: '请输入值'
        });
        return false;
      }
      var tagsMap = null;
      if (!!item.addTags.length) {
        tagsMap = item.addTags.map(item => item.value);
      }
      if (!!tagsMap && tagsMap.indexOf(item.addInputValue) !== -1) {
        that.$message.error({
          duration: 1000,
          message: '输入值已存在'
        });
        return false;
      }
      item.addTags.push({
        value: item.addInputValue
      });
      item.addInputValue = '';
    },

    /**
     * 删除输入值
     */
    delInputVal(index, item) {
      item.addTags.splice(index, 1);
    },

    /**
     * 输入搜索值
     */
    remoteMethod: _debounce(function(query) {
      const that = this;
      that.getClerk(query);
    }, 500),

    remoteMethodFocus(e, parent, pindex) {
      const that = this;
      that.remoteParent = parent;
      that.pindex = pindex;
    },
    /* eslint-disable */
    changeRemoteMethod(e, parent) {
    },

    /**
     * 获取 导购 --- api
     */
    getClerk(name, parent) {
      const that = this;
      const para = {
        name: name,
        requestProject: 'member-tag'
      };
      that.axios
        .post(`${that.baseUrl}/api-plug/search-clerk`, qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.remoteParent.searchOptions = resData.result;
            that.$forceUpdate();
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
     * 添加已选的搜索值
     */
    addSearchSelectVal(item) {
      const that = this;
      if (!item.searchModel.length) {
        that.$message.error({
          duration: 1000,
          message: '请选择值'
        });
        return false;
      }
      let tagsMap = null;
      if (!!item.addSelectTags.length) {
        tagsMap = item.addSelectTags.map(item => item.value);
      }
      item.searchOptions.forEach(function(ele, index) {
        if (!!tagsMap && tagsMap.indexOf(ele.value) != -1) {
          // that.$message.error({
          //   duration: 1000,
          //   message: "输入值已存在"
          // })
          // that.tagData.searchModel = [];
          return false;
        }
        if (item.searchModel.indexOf(ele.key) != -1) {
          item.addSelectTags.push(ele);
        }
      });
      item.searchModel = [];
      item.searchOptions = [];
    },

    /**
     * 删除已添加的搜索值
     */
    delSearchSelectVal(index, item) {
      const that = this;
      item.addSelectTags.splice(index, 1);
    },

    /**
     *  多选项( 全部选项/已选选项 )
     */
    allSelectChange(e, index, item, parent) {
      const that = this;
      if (!!e) {
        parent.selectedOptions.push(item);
      } else {
        if (!!parent.selectedOptions.length) {
          parent.selectedOptions.forEach(function(ele, index) {
            if (ele.id == item.id) {
              parent.selectedOptions.splice(index, 1);
            }
          });
        }
      }
    },

    /**
     * 删除已选择的值
     */
    delallSelectVal(index, item, parent) {
      const that = this;
      parent.selectedOptions.splice(index, 1);
      parent.allSelectOptions.forEach(function(ele, index) {
        if (ele.id == item.id) {
          ele.check = false;
        }
      });
    },

    /**
     * 搜索选项值
     */
    /* eslint-disable */
    toSearchInput: _debounce(function(e, code) {

    }, 500),

    getSearchSelectOptions(value) {

    },

    /**
     * 多选项 城市选择( 全部选项/已选选项 )
     */
    cityCheckAllChange(val, parent) {
      if (val) {
        parent.checkeditemsCity = []; // 避免追加重复 id
        parent.citySelectedOptions = []; // 避免已选数据中追加重复
        parent.citySelectOptions.forEach(function(el, index) {
          el.check = true; // 全选后需要统一设置 check 字段,后面选择 市 会用到
          parent.checkeditemsCity.push(el.provinceId);
          el.children.forEach(function(child, key) {
            child.check = true;
            child.selected = child.cityName + '-' + el.provinceName;
            child.pId = el.provinceId;
            parent.citySelectedOptions.push(child);
          });
        });
      } else {
        parent.checkeditemsCity = [];
        parent.citySelectedOptions = [];
        parent.citySelectOptions.forEach(function(el, index) {
          el.check = false; // 全选后需要统一设置 check 字段,后面选择 市 会用到
          el.children.forEach(function(child, key) {
            child.check = false;
          });
        });
      }
      parent.isIndeterminateCity = false;
    },

    /**
     * 多选项 城市选择( 全部选项/已选选项 )- 单个选择
     */
    citySelectChange(value, parent) {
      let cityCount = value.length;
      parent.checkAllCity = cityCount === parent.citySelectOptions.length;
      parent.isIndeterminateCity = cityCount > 0 && cityCount < parent.citySelectOptions.length;
      // 重新根据已选的 id 来添加已选的数据
      parent.citySelectedOptions = [];
      parent.citySelectOptions.forEach(function(ele, index) {
        if (value.indexOf(ele.provinceId) != -1) {
          ele.check = true;
          ele.children.forEach(function(child, key) {
            child.check = true;
            child.selected = child.cityName + '-' + ele.provinceName;
            child.pId = ele.provinceId;
            parent.citySelectedOptions.push(child);
          });
        } else {
          ele.check = false;
          ele.children.forEach(function(child, key) {
            child.check = false;
          });
        }
      });
    },

    /**
     * 多选项 城市选择( 全部选项/已选选项 )-显示/隐藏 市 列表
     */
    toggleCity(id, item, parent) {
      const that = this;
      item.showCity = item.showCity === true ? false : true;
      parent.citySelectOptions.forEach(function(ele, index) {
        if (ele.provinceId != id) {
          ele.showCity = false;
        }
      });
      document.addEventListener(
        'mousedown',
        function(e) {
          that.hideCity(e, parent);
        },
        false
      );
      // 请求当前省下的所有市
      // that.getCityList(id,item)
    },

    /**
     * 多选项 城市选择( 全部选项/已选选项 )-点击市
     */
    toggleClickCity(item, pItem, parent) {
      const that = this;
      item.check = !!item.check ? false : true;
      pItem.children.forEach(function(ele, index) {
        // 如果有未选的,当前省就不是全选,全选也不是全选了,要从全选的 model中删除
        if (!ele.check && !!pItem.check) {
          pItem.check = false;
          parent.checkeditemsCity.splice(parent.checkeditemsCity.indexOf(pItem.provinceId), 1);
          parent.checkAllCity = false;
          parent.isIndeterminateCity = !!parent.checkeditemsCity.length ? true : false;
        }
      });
      let arrValues = pItem.children.map(el => el.check);
      // 如果当前省的所有市都选了
      if (arrValues.indexOf(false) == -1) {
        pItem.check = true;
        parent.checkeditemsCity.push(pItem.provinceId);
      } else {
        if (parent.checkeditemsCity.indexOf(pItem.provinceId) != -1) {
          parent.checkeditemsCity.splice(parent.checkeditemsCity.indexOf(pItem.provinceId), 1);
        }
      }
      // 再去判断全选
      let selectedCount = parent.checkeditemsCity.length;
      parent.checkAllCity = selectedCount === parent.citySelectOptions.length;
      parent.isIndeterminateCity = selectedCount > 0 && selectedCount < parent.citySelectOptions.length;
      // 重新设置 已选数据
      parent.citySelectedOptions = [];
      parent.citySelectOptions.forEach(function(ele, index) {
        ele.children.forEach(function(child, ind) {
          if (!!child.check) {
            child.selected = child.cityName + '-' + ele.provinceName;
            child.pId = ele.provinceId;
            parent.citySelectedOptions.push(child);
          }
        });
      });
      that.$forceUpdate();
    },

    /**
     * 多选项 城市选择 - 删除已选择的值
     */
    delcitySelectVal(index, item, parent) {
      const that = this;
      parent.citySelectedOptions.splice(index, 1);
      parent.citySelectOptions.forEach(function(ele, index) {
        if (item.pId == ele.provinceId) {
          ele.check = false;
        }
        ele.children.forEach(function(el, ind) {
          if (el.cityId == item.cityId) {
            el.check = false;
            // ele.check = false
          }
        });
      });
      if (parent.checkeditemsCity.indexOf(item.pId) != -1) {
        parent.checkeditemsCity.splice(parent.checkeditemsCity.indexOf(item.pId), 1);
      }
      // 再去判断全选
      let selectedCount = parent.checkeditemsCity.length;
      parent.checkAllCity = selectedCount === parent.citySelectOptions.length;
      parent.isIndeterminateCity = selectedCount > 0 && selectedCount < parent.citySelectOptions.length;
    },

    /**
     * 多选项 城市选择 - 获取省下所有市
     */
    getCityList(id, item) {
      const that = this;
      item.children = [];
      let childCheck = false;
      if (!!item.check) {
        childCheck = true;
      }
      item.children.push({
        id: 11,
        name: '杭州',
        check: childCheck
      });
      that.$forceUpdate();
    },

    /**
     * 多选项 城市选择 - 隐藏省下所有市
     */
    hideCity(e, parent) {
      if (e.target.className.indexOf('city-name') == -1) {
        parent.citySelectOptions.forEach(function(ele, index) {
          ele.showCity = false;
        });
      }
    },

    /**
     * 多选项 城市选择 - 获取省市 --- api
     */
    getcityData() {
      const that = this;
      const para = {
        requestProject: 'member-tag'
      };
      that.axios
        .post(`${that.baseUrl}/api-plug/dict-district-tree`, qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.check = false;
              ele.showCity = false;
              ele.children.forEach(function(el, ind) {
                el.check = false;
              });
            });
            that.tag010.citySelectOptions = resData.result;
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
     * 根据返回的标签详情字段判断显示的模板
     */
    checkTagTemplate(template) {
      const that = this;
      // 每次获取标签详情都要先清空循环数据
      that.templateData = [];
      that.postCompute = null;
      let newTemp = JSON.parse(template);
      if (!!newTemp) {
        let newTempVal = newTemp.val[0];
        let newTime = newTemp.time;
        this.currentComputeType =newTempVal.compute.computeType >> 0;
        // 计算控件
        if (parseInt(newTempVal.compute.computeType) === 0 && !!newTempVal.compute.computeWidgetId) {
          // setTimeout(function(){
          that.getTemplateCodeById(newTempVal.compute.computeWidgetId);
          // },0)
        }
        // 固定计算属性(最后保存用到)
        if (parseInt(newTempVal.compute.computeType) === 1) {
          that.postCompute = newTempVal.compute.compute;
        }
        if (!!newTempVal.valWidgetId) {
          setTimeout(_ => {
            that.getTemplateCodeById(newTempVal.valWidgetId);
          }, 50);
        }
        if (!!newTime.length) {
          if (parseInt(newTempVal.compute.computeType) === 1) {
            setTimeout(function() {
              newTime.forEach(function(ele, index) {
                if (!!ele.timeWidgetId) {
                  that.getTemplateCodeById(ele.timeWidgetId);
                }
              });
            }, 60);
            return;
          }
          newTime.forEach(function(ele, index) {
            if (!!ele.timeWidgetId) {
              that.getTemplateCodeById(ele.timeWidgetId);
            }
          });
        }
      }
    },

    /**
     * 根据 template 中 id 获取控件中模板 code --- api
     */
    async getTemplateCodeById(id) {
      const that = this;
      const para = {
        widgetId: id
      };
      getRequest('/memberTag/findWidget', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // 返回字段否追加对应 模板数据对象上
            for (let key in resData.result) {
              that[resData.result.templateCode][key] = resData.result[key];
            }
            // 如果是城市
            if (resData.result.templateCode === 'tag010') {
              that.getcityData();
            }
            if (resData.result.templateCode === 'com001') {
              // console.log(this.templateData);
            }
            // 如果是给了 计算属性值
            if (!!that.postCompute) {
              that[resData.result.templateCode].postCompute = that.postCompute;
            }
            // 如果直接给需要字段
            if (parseInt(resData.result.sourceFlag) === 0) {
              resData.result.widgetValues = JSON.parse(resData.result.widgetValues);
              that[resData.result.templateCode].options = resData.result.widgetValues;
            }
            // 如果通过 url 获取
            if (parseInt(resData.result.sourceFlag) === 1) {
              resData.result.widgetParam = JSON.parse(resData.result.widgetParam);
              that.getAsyncList(resData.result.widgetParam[0].value, that[resData.result.templateCode]);
              if (resData.result.templateCode === 'tag009' || resData.result.templateCode === 'tag010') {
                that.searchFlag = true;
              }
              return false;
            }
            that.templateData.push(that[resData.result.templateCode]);

            /**
             * 这里处理编辑回显数据
             * 这里拿到编辑的数据 然后把tagValue的value值传解析传给模板的v-model
             * 写一个方法 把模板code定位配置code来处理这么多的模板
             */
            setTimeout(_ => {
              this.templateCode = this.templateData.map(el => el.templateCode);
              
              if (this.templateDataList.editCondition) {
                this.replaceTemplateValue();
              } else {
              // 如果不是编辑状态
                this.resetOptions();
              }
            }, 200);

            
            // 获取已存数据
            // that
            //   .getExistData(that.tagData.tagId)
            //   .then(item => {
            //     that.templateData = item;
            //   })
            //   .catch(function(error) {
            //     console.log(error);
            //   });
            if (resData.result.templateCode === 'tag009' || resData.result.templateCode === 'tag010') {
              that.searchFlag = true;
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    calculateProvinceCount(target) {
      target.citySelectOptions = target.citySelectOptions.map((item, index) => {
        item.children = item.children.map((el , i) => {
          let city = target.citySelectedOptions.find(element => element.cityId == el.cityId);
          if (city) {
            el.check = true;
          }
          return el;
        });
        let isAllCheckitem = item.children.every(el => el.check);
        if (isAllCheckitem) {
          target.checkeditemsCity.push(item.provinceId);
        }
        return item;
      });
    },

        /**
     * 重置条件添加的时候是空的
     */
    resetOptions() {
      // let tagValue = JSON.parse(this.templateDataList.tagValue);
      switch (this.templateDataList.templateCode) {
        case 'tag003':
          this.templateData[0].numRange = [];
          break;
        case 'tag007':
          this.templateData[0].addTags = [];
          break;
      }
    },

    /**
     * 将tagValue 替代模板数据的v-model
     */
    replaceTemplateValue() {
      let tagValue = JSON.parse(this.templateDataList.tagValue);
      let tagParams = JSON.parse(this.templateDataList.tagParams);
      let value = null;
      // let radio = null;
      let selectVal = null;
      let checkedCount = null;

      // console.log(this.templateDataList);
      // console.log(this.templateDataList.templateCode);
      // console.log(this.templateData);

      // compute 是计算属性的区间值 value是选中的值
      for(let i = 0; i < this.templateDataList.templateCode.length; i++) {
        switch (this.templateDataList.templateCode[i]) {
          case 'tag003':
            value = tagValue.val[0].data.value.split(',');
            this.templateData[0].numRange = value;
            break;
          case 'tag007':
            value = tagValue.val[0].data.value.split(' ');
            this.templateData[0].addTags = value.map(el => ({ value: el }));
            break;


          // 城市选择
          case 'tag010':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag010') {
                value = tagValue.val[0].data.value.split(' ');
                selectVal = tagParams.selectedVal[1].split(',');
                value.forEach((item, index) => {
                  this.templateData[i].citySelectedOptions.push({
                    selected: selectVal[index],
                    cityName: selectVal[index],
                    cityId: item
                  });
                });
                setTimeout(_ => {
                  this.calculateProvinceCount(this.templateData[i]);
                }, 100);
              }
            }
            break;

          //  组合 属于和多选框
          case 'tag001':
            value = tagValue.val[0].data.value.split(' ');
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag001') {
                this.templateData[i].checkeditems = value;
              }
            }
            checkedCount = this.templateData[i].checkeditems.length;
            this.templateData[i].checkAll = checkedCount == this.templateData[i].options.length;
            this.templateData[i].isIndeterminate = checkedCount > 0 && checkedCount < this.templateData[i].options.length;
            break;

          case 'tag013':
            value = tagValue.val[0].data.value.split(' ');
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag013') {
                this.templateData[i].checkeditems = value;
              }
            }
            checkedCount = this.templateData[i].checkeditems.length;
            this.templateData[i].checkAll = checkedCount == this.templateData[i].options.length;
            this.templateData[i].isIndeterminate = checkedCount > 0 && checkedCount < this.templateData[i].options.length;
            break;
          // 属于不属于 从newTagVal里面比较
          case 'tag002':
            this.templateData[0].computeRadio = tagParams.template[0].computeRadio;
            break;
          case 'tag015':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag015') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                this.templateData[i].timeChecked = templateDate.timeChecked;
                if (templateDate.dateRangeValue.length) {
                  this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                } else {
                  this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                }
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;
            
          case 'tag012':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag012') {
                this.templateData[i].selectOne = tagParams.template[0].selectOne;
                this.templateData[i].selectTwo = tagParams.template[0].selectTwo;
              }
            }
            break;
          case 'tag008':

            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag008') {
                // 这里有多个value
                value = tagValue.val[0].data.value.split(',');
                selectVal = tagParams.selectedVal[1].split(',');
                selectVal.forEach((el, inx) => {
                  this.templateData[i].addSelectTags.push({
                    value: selectVal[inx],
                    id: value[inx]
                  });
                });

              }
            }
            break;
          // 门店
          case 'tag011':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag011') {
                value = tagValue.val[0].data.value;
                this.templateData[i].isAdd = false;
                this.templateData[i].uuid = value;
              }
            }
            break;

          case 'tag004':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag004') {
                let type = tagValue.time[0].type;
                // 最近时间（lastday） 和 固定时段
                if (type == 'lastday') {
                  this.templateData[i].fixedRecentRadio = '2';
                  let recentlyDays = tagValue.time[0].value;
                  this.templateData[i].fixedRecentTimeRecent = recentlyDays;
                } else {
                  let time = tagValue.time[0].value.split(',');
                  this.templateData[i].fixedRecentRadio = '1';
                  this.templateData[i].fixedRecentRangeValue = time;
                }
              }
            }
            break;

          case 'tag017':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag017') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                this.templateData[i].timeChecked = templateDate.timeChecked;
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          case 'tag016':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag016') {
                this.templateData[i].dateRangeValue = tagValue.time[0].value.split(',');
              }
            }
            break;

          case 'tag019':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag017') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                this.templateData[i].timeChecked = templateDate.timeChecked;
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          case 'tag014':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag017') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                this.templateData[i].timeChecked = templateDate.timeChecked;
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          // 之后的天数
          case 'tag006':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag006') {
                let afterDays = tagValue.time[0].value;
                this.templateData[i].timeAfter = afterDays;
              }
            }
            break;

          // 卡券
          case 'com023':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'com023') {
                value = tagValue.val[0].data.value.split(' ');
                selectVal = tagParams.selectedVal.split(' ');
                selectVal.forEach((el, ix) => {
                  this.tagList.push({
                    cardName: el,
                    coupCardId: value[ix]
                  });
                });
              }
            }
            break;

          case 'com001':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'com001') {
                if (tagParams.selectedVal.indexOf('区间') != -1) {
                  // 存在区间
                  this.templateData[i].symbol = '区间';
                  this.templateData[i].numRange = tagValue.val[0].data.value.split(',')
                } else {
                  this.templateData[i].symbol = tagParams.selectedVal.slice(0, 1);
                  this.templateData[i].num = tagValue.val[0].data.value;
                }
              }
            }
            break;
        }
      }
    },


    /**
     * 判断是否包含一个数组包含另一个数组
     */
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (!b.length) {
        return false;
      }
      if (a.length < b.length) return false;
      let aStr = a.toString();
      for (let i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) return false;
      }
      return true;
    },

    /**
     * 获取当前标签数据 --- api
     */
    getAsyncList(url, data) {
      const that = this;
      const para = {
        key: that.tagData.tagType == 1 ? that.tagData.tagId : that.currentKey,
        requestProject: 'member-tag'
      };
      that.axios
        .post(that.baseUrl + url, qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (that.tagData.tagType != 1 && that.currentKey != 'tag') {
            if (resData.errorCode == 0) {
              
              data.options = resData.result;
              that.templateData.push(data);
              that.getExistData(that.tagData.tagId).then(items => {
                items.forEach(function(ele, index) {
                  if (ele.templateCode == 'tag013') {
                    ele.options = data.options;
                    let idOptions = data.options.map(el => el.key);
                    let checkFlag = true;
                    data.options.forEach(function(el, index) {
                      if (ele.checkeditems.indexOf(el.key) != -1) {
                        checkFlag = false; // 如果已选值中存在 options中
                      }
                    });
                    let checkedCount = ele.checkeditems.length;
                    if (that.isContained(ele.checkeditems, idOptions)) {
                      ele.checkAll = true;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    if (checkFlag && data.options.length < checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    if (!checkFlag && data.options.length >= checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = true;
                      return false;
                    }
                    if (checkFlag && data.options.length >= checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    // ele.checkAll = checkedCount === data.options.length;
                    // ele.isIndeterminate = checkedCount > 0 && checkedCount < data.options.length;
                  }
                });
                that.templateData = items;
              });
              return;
            }
          } else {
            // errorCode 差异问题
            if (resData.errorCode == 1) {
              data.options = resData.result;
              that.templateData.push(data);
              that.getExistData(that.tagData.tagId).then(items => {
                items.forEach(function(ele, index) {
                  if (ele.templateCode == 'tag013') {
                    ele.options = data.options;
                    let idOptions = data.options.map(el => el.key);
                    let checkFlag = true;
                    data.options.forEach(function(el, index) {
                      if (ele.checkeditems.indexOf(el.key) != -1) {
                        checkFlag = false; // 如果已选值中存在 options中
                      }
                    });
                    let checkedCount = ele.checkeditems.length;
                    if (that.isContained(ele.checkeditems, idOptions)) {
                      ele.checkAll = true;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    if (checkFlag && data.options.length < checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    if (!checkFlag && data.options.length >= checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = true;
                      return false;
                    }
                    if (checkFlag && data.options.length >= checkedCount) {
                      ele.checkAll = false;
                      ele.isIndeterminate = false;
                      return false;
                    }
                    // ele.checkAll = checkedCount === data.options.length;
                    // ele.isIndeterminate = checkedCount > 0 && checkedCount < data.options.length;
                  }
                });
                that.templateData = items;
              });
              return;
            }
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 获取当前标签已存数据 --- api
     */
    async getExistData(tagId) {
      const that = this;
      return new Promise(function(resolve, reject) {
        const para = {
          tagId: tagId
        };
        getRequest('/member-tag-value/findOne.json', para)
          .then(res => {
            const resData = res.data;
            if (resData.errorCode == 1) {
              if (!resData.result || resData.result.tagParams == '[]') {
                if (!!Object.keys(that.rowData).length) {
                  resolve(JSON.parse(that.rowData.tagParams).template);
                  return false;
                }
                reject(new Error('返回数据为空'));
                return false;
              }
              resolve(JSON.parse(resData.result.tagParams).template);
              return;
            } else {
              reject(new Error(resData.message));
            }
          })
          .catch(function(error) {
            reject(new Error(error.message));
          });
      });
    },

    /**
     * 获取当前标签数据 --- api
     */
    async getTagData(tagId) {
      const that = this;
      that.searchFlag = false; // 默认不显示搜索框
      const para = {
        tagId: tagId
      };
      getRequest('/memberTag/getTagById', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // console.log(resData);
            that.tagData.tagId = resData.result.tagId;
            that.tagData.tagName = resData.result.tagName;
            that.tagData.tagDescribe = resData.result.tagDescribe;
            that.tagData.isActive = resData.result.isActive;
            that.tagData.tagType = resData.result.tagType;
            // 获取 columnKey
            // if (!!resData.result.columnKey) {currentComputeType
            that.currentKey = resData.result.columnKey;
            // }else {
            //   that.currentKey = resData.result.tagId;
            // }
            let templateObj = resData.result.template;
            if (!!templateObj) {
              that.checkTagTemplate(templateObj.templateContent);
            }
            return;
          }
          // errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error)
        });
    }
  },

  components: {},
  beforeDestroy() {
    document.removeEventListener('mousedown', function() {});
  }
};
