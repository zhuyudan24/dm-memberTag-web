<!--
    标签详情-缩写版
    <tagShortDetail :tagShortId="tagShortDetailId" :showTagDetail="showTagDetail" @hideTag="handleHideTag" @updateTemp="updateTemp"></tagShortDetail>
    import tagShortDetail from '@/components/tagShortDetail.vue';
    data() {
      return {
        showTagDetail: false, // 标签详情缩小版显示/隐藏
      }
    },
    methods: {
      /**
       * 显示标签详情缩小版
       */
      handleShowTag() {
        const that = this
        that.showTagDetail = true
      },

      /**
       * 隐藏标签详情缩小版
       */
      handleHideTag(val){
        const that = this
        that.showTagDetail = false
      },

      /**
       * 子组件添加到暂存架-更新暂存架
       */
      updateTemp(){
        const that = this
        that.$refs.tagTemp.getTagList();
      },
    },
    components: {
      tagShortDetail
    }
 -->
<template>
  <div>
    <el-dialog :visible.sync="tagShortVisible" width="543px" class="tagShort-dialog" :modal-append-to-body="false" :append-to-body="false" :before-close="closeTagShortDialog">
      <div slot="title" class="dialog-title">
        <div class="checkboxOption-wrap__head__title inline-block top">
          {{ tagData.tagName }}
          <span class="realtime-span">{{ tagData.isActive == 1 ? '实时' : '非实时' }}</span>
        </div>
      </div>
      <div class="tags-content">
        <div class="tags-content-wrap m-b-26" v-if="false">
          <div class="checkboxOption-wrap__head__describe inline-block top fr">
            <el-input v-if="false" placeholder="请输入关键字搜索" prefix-icon="el-icon-search" v-model="tagData.inputSearch" @keyup.native="value => toSearchInput(value)"> </el-input
            ><!-- searchFlag -->
            <el-input v-if="false" placeholder="请输入关键字搜索" prefix-icon="el-icon-search" v-model="tagData.inputSearch" @keyup.native="value => toSearchInput(value, 'city')"> </el-input>
          </div>
        </div>
        <div class="checkboxOption-wrap__body">
          <!-- <div class="checkboxOption-wrap__body__title">标签值设置</div> -->
          <div v-for="(parent, pindex) in templateData" :key="pindex">
            <!-- 1.选项控件 -->
            <template v-if="parent.templateCode == 'tag001'">
              <div class="m-b-20">
                <div class="checkboxOption-wrap__body__checkAll border-box">
                  <el-checkbox :indeterminate="parent.isIndeterminate" v-model="parent.checkAll" @change="handleCheckAllChange($event, parent)">全选</el-checkbox>
                </div>
                <div class="checkboxOption-wrap__body__options border-box">
                  <el-checkbox-group v-model="parent.checkeditems" @change="handleCheckedChange($event, parent)">
                    <el-checkbox v-for="(item, index) in parent.options" :label="item.key" :key="item.key + index">{{ item.value }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </template>
            <!-- 2.数字范围 -->
            <template v-if="parent.templateCode == 'tag003'">
              <div class="m-b-20">
                <el-input v-model="parent.numRange[0]" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字" @blur="blurFrom($event, parent)"></el-input
                ><!-- @keyup.native="(value) => toInputFrom(value)" -->
                <label> - </label>
                <el-input v-model="parent.numRange[1]" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字" @blur="blurTo($event, parent)"></el-input>
                <!-- <label class="label-tip">注：如果起始值为空则视为小于等于最大输入值；如果最大值为空则视为大于等于最小输入值！</label> -->
              </div>
            </template>
            <!-- 3.时间属性-固定时段/相对时段+最近+之后 -->
            <template v-if="parent.templateCode == 'tag014'">
              <div class="m-b-20">
                <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
                <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
                <!-- 固定时段 -->
                <div class="m-t-18 w-438 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
                  <el-date-picker
                    v-model="parent.dateRangeValue"
                    type="daterange"
                    :editable="false"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyyMMdd"
                    value-format="yyyyMMdd"
                    :default-time="['000000', '235959']"
                    ><!-- :picker-options="pickerOptions"  -->
                  </el-date-picker>
                </div>
                <!-- 相对时段 -->
                <div class="relative-range m-t-18 border-box" v-if="parent.radio != 1">
                  <div>
                    <div>
                      <label class="inline-block w-98 label-unit">时间精度</label>
                      <el-radio-group v-model="parent.timeRadio" @change="timeRadioChange($event, parent)">
                        <el-radio label="1">天</el-radio>
                        <el-radio label="2">月</el-radio>
                        <el-radio label="3">年</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="1" @change="currentDayChange($event, parent)"> 当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeChecked"><label class="inline-block middle">当{{parent.timeRadio==1?'天':parent.timeRadio==2?'月':'年'}}</label></el-checkbox> -->
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="2">{{ '' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeCheckedTwo"> </el-checkbox> -->
                      <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                        <el-option label="最近" value="1"></el-option>
                        <el-option label="之后" value="2"></el-option>
                      </el-select>
                      <el-input
                        v-model="parent.timeInput"
                        placeholder="请输入"
                        class="w-90"
                        @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                        :disabled="parent.timeChecked == 1 ? true : false"
                      ></el-input>
                      <template v-if="parent.timeRadio == 1">
                        <label class="inline-block middle label-unit m-l-8">天</label>
                        <label class="inline-block middle label-tip">正整数，最大365</label>
                      </template>
                      <template v-if="parent.timeRadio == 2">
                        <label class="inline-block middle label-unit m-l-8">月</label>
                        <label class="inline-block middle label-tip">正整数，最大12</label>
                      </template>
                      <template v-if="parent.timeRadio == 3">
                        <label class="inline-block middle label-unit m-l-8">年</label>
                        <label class="inline-block middle label-tip">正整数，最大2</label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 4.最近 天 -->
            <template v-if="parent.templateCode == 'tag005'">
              <div class="m-b-20">
                <label class="inline-block middle label-unit">最近</label
                ><el-input v-model="parent.timeRecent" placeholder="请输入" class="w-90 m-r-20 m-l-20" @blur="value => toEditInput(value, 'timeRecent', parent)"></el-input
                ><label class="inline-block middle label-unit">天</label>
              </div>
            </template>
            <!-- 5.之后 天 -->
            <template v-if="parent.templateCode == 'tag006'">
              <div class="m-b-20">
                <label class="inline-block middle label-unit">之后</label
                ><el-input v-model="parent.timeAfter" placeholder="请输入" class="w-90 m-r-20 m-l-20" @blur="value => toEditInput(value, 'timeAfter', parent)"></el-input
                ><label class="inline-block middle label-unit">天</label>
              </div>
            </template>
            <!-- 6.属于/不属于 -->
            <template v-if="parent.templateCode == 'tag002'">
              <div class="m-b-20">
                <el-radio v-model="parent.computeRadio" label="in">属于</el-radio>
                <el-radio v-model="parent.computeRadio" label="notIn">不属于</el-radio>
              </div>
            </template>
            <!-- 7.固定时段/最近 -->
            <template v-if="parent.templateCode == 'tag004'">
              <div class="m-b-20">
                <el-radio v-model="parent.fixedRecentRadio" label="1">固定时段</el-radio>
                <el-radio v-model="parent.fixedRecentRadio" label="2">最近时段</el-radio>
                <!-- 固定时段 -->
                <div class="m-t-18 w-500 h-80 fixed-date-picker border-box bg-f3f6f9">
                  <label class="inline-block middle label-unit m-r-8" v-if="parent.fixedRecentRadio == 1">时间范围</label
                  ><el-date-picker
                    v-model="parent.fixedRecentRangeValue"
                    v-if="parent.fixedRecentRadio == 1"
                    type="daterange"
                    :editable="false"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyyMMdd"
                    value-format="yyyyMMdd"
                    :default-time="['000000', '235959']"
                    ><!-- :picker-options="pickerOptions"  -->
                  </el-date-picker>
                  <div v-if="parent.fixedRecentRadio == 2">
                    <label class="inline-block middle label-unit m-r-8">最近</label
                    ><el-input v-model="parent.fixedRecentTimeRecent" placeholder="请输入" class="w-90 m-r-8" @blur="value => toEditInput(value, 'fixedRecentTimeRecent', parent)"></el-input
                    ><label class="inline-block middle label-unit">天</label>
                  </div>
                </div>
              </div>
            </template>
            <!-- 8.输入添加值 -->
            <template v-if="parent.templateCode == 'tag007'">
              <div class="m-b-20">
                <div><el-input v-model="parent.addInputValue" placeholder="请输入" class="w-184 m-r-8"></el-input><el-button class="middle" type="text" @click.stop="addInputVal(parent)">添加</el-button></div>
                <div class="m-t-18 add-tags-wrap">
                  <template v-for="(item, index) in parent.addTags">
                    <span class="el-tag el-tag--small" :key="item.value + index">{{ item.value }}<i class="el-tag__close el-icon-close" @click="delInputVal(index, parent)"></i></span>
                  </template>
                </div>
              </div>
            </template>
            <!-- 9.输入搜索下拉多选 添加值 -->
            <template v-if="parent.templateCode == 'tag008'">
              <div class="m-b-20">
                <div class="add-search-select">
                  <el-select
                    size="small"
                    v-model="parent.searchModel"
                    multiple
                    filterable
                    remote
                    placeholder="请输入关键词"
                    :reserve-keyword="false"
                    :remote-method="remoteMethod"
                    @focus="remoteMethodFocus($event, parent, pindex)"
                    @change="changeRemoteMethod($event, parent)"
                    class="el-select--small"
                  >
                    <el-option v-for="item in parent.searchOptions" :key="item.key" :label="item.value" :value="item.key"> </el-option> </el-select
                  ><el-button class="m-l-8 middle" type="text" @click.stop="addSearchSelectVal(parent)">添加</el-button>
                </div>
                <div class="m-t-18 add-tags-wrap">
                  <template v-for="(item, index) in parent.addSelectTags">
                    <span class="el-tag el-tag--small" :key="item.value + index">{{ item.value }}<i class="el-tag__close el-icon-close" @click="delSearchSelectVal(index, parent)"></i></span>
                  </template>
                </div>
              </div>
            </template>
            <!-- 10.存在其一/所有,/属于不属于 -->
            <template v-if="parent.templateCode == 'tag012'">
              <div class="m-b-20">
                <el-select v-model="parent.selectOne" placeholder="请选择" class="w-98">
                  <el-option label="所有" value="all"></el-option>
                  <el-option label="存在其一" value="in"></el-option> </el-select
                ><label class="inline-block middle label-unit m-l-8">{{ tagData.tagName }}</label
                ><el-select v-model="parent.selectTwo" placeholder="请选择" class="w-98 m-l-8">
                  <el-option label="属于" value="in"></el-option>
                  <el-option label="不属于" value="notin"></el-option> </el-select
                ><!-- <label
                class="inline-block middle label-tip m-l-8"
                >{{parent.selectLabelTip}}</label> -->
              </div>
            </template>
            <!-- 11.门店选择器 -->
            <div v-if="parent.templateCode == 'tag011'">
              <div class="m-b-20">
                <vue-gic-store-new :options="parent.uuidOptions" :isAdd="parent.isAdd" :uuid.sync="parent.uuid" ref="storeNew"></vue-gic-store-new>
              </div>
            </div>
            <!-- 12.多选项( 全部选项/已选选项 ) -->
            <template v-if="parent.templateCode == 'tag009'">
              <div class="multiple-select-wrap m-b-20">
                <!-- <div class="multiple-select-wrap__search w-184">
                  <el-input
                    placeholder="请输入关键字搜索"
                    prefix-icon="el-icon-search"
                    v-model="parent.inputSearch"
                    @keyup.native="(value) => toSearchInput(value)">
                  </el-input>
                </div> -->
                <div class="multiple-select-wrap__body">
                  <div class="multiple-select-wrap__tab">
                    <el-tabs v-model="parent.allSelectActive">
                      <el-tab-pane label="全部选项" name="first">
                        <div class="all-select-options">
                          <template v-for="(item, index) in parent.allSelectOptions">
                            <el-checkbox :key="item.check + index" v-model="item.check" @change="allSelectChange($event, index, item, parent)">{{ item.name }}</el-checkbox>
                          </template>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane :label="'已选选项(' + parent.selectedOptions.length + ')'" name="second">
                        <div class="slected-opyions">
                          <template v-for="(item, index) in parent.selectedOptions">
                            <span class="el-tag el-tag--small" :key="item.name + index">{{ item.name }}<i class="el-tag__close el-icon-close" @click="delallSelectVal(index, item, parent)"></i></span>
                          </template>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </div>
            </template>
            <!-- 13.多选项 城市选择( 全部选项/已选选项 ) -->
            <template v-if="parent.templateCode == 'tag010'">
              <div class="multiple-select-wrap city-select-wrap m-b-20">
                <!-- <div class="multiple-select-wrap__search w-184">
                  <el-input
                    placeholder="请输入关键字搜索"
                    prefix-icon="el-icon-search"
                    v-model="parent.inputSearch"
                    @keyup.native="(value) => toSearchInput(value,'city')">
                  </el-input>
                </div> -->
                <div class="multiple-select-wrap__body">
                  <div class="multiple-select-wrap__tab">
                    <el-tabs v-model="parent.citySelectActive">
                      <el-tab-pane label="全部选项" name="first">
                        <div class="all-select-options">
                          <div class="city-checkbox city-checkbox-all border-box">
                            <el-checkbox :indeterminate="parent.isIndeterminateCity" v-model="parent.checkAllCity" @change="cityCheckAllChange($event, parent)">全选</el-checkbox>
                          </div>
                          <el-checkbox-group v-model="parent.checkeditemsCity" @change="citySelectChange($event, parent)">
                            <template v-for="(item, index) in parent.citySelectOptions">
                              <div class="city-checkbox border-box border-t-e4e7ed" :key="'check' + index">
                                <el-checkbox :label="item.provinceId" :key="item.provinceId">{{ '' }}</el-checkbox
                                ><label class="inline-block middle font-14 pointer city-name" @click.stop="toggleCity(item.provinceId, item, parent)"
                                  >{{ item.provinceName }} <i class="el-icon-caret-bottom"></i
                                ></label>
                                <div
                                  class="el-select-dropdown el-popper is-multiple"
                                  style="min-width: 240px; position: absolute; top: 30px; left: 20px; transform-origin: center top 0px; z-index: 2215;"
                                  x-placement="bottom-start"
                                  v-if="item.showCity"
                                >
                                  <div class="el-scrollbar" style="">
                                    <div class="el-select-dropdown__wrap el-scrollbar__wrap" style=" margin-right: -17px;">
                                      <ul class="el-scrollbar__view el-select-dropdown__list">
                                        <!--市列表-->
                                        <template v-for="(itemCity, index) in item.children">
                                          <li
                                            :key="itemCity.cityName + index"
                                            :class="['el-select-dropdown__item', 'city-name', !!itemCity.check ? 'selected' : '']"
                                            @click.stop="toggleClickCity(itemCity, item, parent)"
                                          >
                                            <span class="city-name">{{ itemCity.cityName }}</span>
                                          </li>
                                        </template>
                                      </ul>
                                    </div>
                                    <div class="el-scrollbar__bar is-horizontal">
                                      <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                                    </div>
                                    <div class="el-scrollbar__bar is-vertical">
                                      <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
                                    </div>
                                  </div>
                                  <!---->
                                  <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
                                </div>
                              </div>
                            </template>
                          </el-checkbox-group>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane :label="'已选选项(' + parent.citySelectedOptions.length + ')'" name="second">
                        <div class="slected-opyions city-slected-opyions">
                          <template v-for="(item, index) in parent.citySelectedOptions">
                            <span :key="item.selected + index" class="el-tag el-tag--small">{{ item.selected }}<i class="el-tag__close el-icon-close" @click="delcitySelectVal(index, item, parent)"></i></span>
                          </template>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </div>
            </template>
            <!-- 14.选项控件异步 -->
            <template v-if="parent.templateCode == 'tag013'">
              <div class="m-b-20">
                <div class="checkboxOption-wrap__body__checkAll border-box">
                  <el-checkbox :indeterminate="parent.isIndeterminate" v-model="parent.checkAll" @change="handleCheckAllChange($event, parent)">全选</el-checkbox>
                </div>
                <div class="checkboxOption-wrap__body__options border-box">
                  <el-checkbox-group v-model="parent.checkeditems" @change="handleCheckedChange($event, parent)">
                    <el-checkbox v-for="(item, index) in parent.options" :label="item.key" :key="item.key + index">{{ item.value }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </template>
            <!-- 15.时间属性(月日-月日+最近+之后) -->
            <template v-if="parent.templateCode == 'tag015'">
              <div class="m-b-20">
                <div class="">
                  <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
                  <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
                </div>
                <!-- 固定时段 -->
                <div class="m-t-18 w-438 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
                  <vue-gic-datepicker
                    v-model="parent.monthDayRange"
                    type="daterange"
                    :editable="false"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="MMdd"
                    value-format="MMdd"
                  >
                  </vue-gic-datepicker>
                </div>
                <!-- 相对时段 -->
                <div class="relative-range m-t-18 border-box" v-if="parent.radio != 1">
                  <div>
                    <div>
                      <label class="inline-block w-98 label-unit">时间精度</label>
                      <el-radio-group v-model="parent.timeRadio" @change="timeRadioChange($event, parent)">
                        <el-radio label="1">天</el-radio>
                        <el-radio label="2">月</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="1" @change="currentDayChange($event, parent)"> 当{{ parent.timeRadio == 1 ? '天' : '月' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeChecked"><label class="inline-block middle">当 {{parent.timeRadio==1?'天':'月'}}</label></el-checkbox> -->
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="2">{{ '' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeCheckedTwo"> </el-checkbox> -->
                      <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                        <el-option label="最近" value="1"></el-option>
                        <el-option label="之后" value="2"></el-option>
                      </el-select>
                      <el-input
                        v-model="parent.timeInput"
                        placeholder="请输入"
                        class="w-90"
                        @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                        :disabled="parent.timeChecked == 1 ? true : false"
                      ></el-input>
                      <template v-if="parent.timeRadio == 1">
                        <label class="inline-block middle label-unit m-l-8">天</label>
                        <label class="inline-block middle label-tip">正整数，最大365</label>
                      </template>
                      <template v-if="parent.timeRadio == 2">
                        <label class="inline-block middle label-unit m-l-8">月</label>
                        <label class="inline-block middle label-tip">正整数，最大12</label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 16.时间属性(年月日-年月日) -->
            <template v-if="parent.templateCode == 'tag016'">
              <div class="m-b-20">
                <el-date-picker
                  v-model="parent.dateRangeValue"
                  type="daterange"
                  :editable="false"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyyMMdd"
                  value-format="yyyyMMdd"
                  :default-time="['000000', '235959']"
                  ><!-- :picker-options="pickerOptions"  -->
                </el-date-picker>
              </div>
            </template>
            <!-- 19.时间属性(年月日时分秒-年月日时分秒) -->
            <template v-if="parent.templateCode == 'tag019'">
              <div class="m-b-20">
                <div class="">
                  <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
                  <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
                </div>
                <!-- 固定时段 -->
                <div class="m-t-18 w-438 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
                  <el-date-picker
                    v-model="parent.dateRangeValue"
                    type="daterange"
                    :editable="false"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyyMMdd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  >
                  </el-date-picker>
                </div>
                <!-- 相对时段 -->
                <div class="relative-range m-t-18 border-box" v-if="parent.radio != 1">
                  <div>
                    <div>
                      <label class="inline-block w-98 label-unit">时间精度</label>
                      <el-radio-group v-model="parent.timeRadio" @change="timeRadioChange($event, parent)">
                        <el-radio label="1">天</el-radio>
                        <el-radio label="2">月</el-radio>
                        <el-radio label="3">年</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="1" @change="currentDayChange($event, parent)"> 当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeChecked"><label class="inline-block middle">当{{parent.timeRadio==1?'天':parent.timeRadio==2?'月':'年'}}</label></el-checkbox> -->
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="2">{{ '' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeCheckedTwo"> </el-checkbox> -->
                      <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                        <el-option label="最近" value="1"></el-option>
                        <el-option label="之后" value="2"></el-option>
                      </el-select>
                      <el-input
                        v-model="parent.timeInput"
                        placeholder="请输入"
                        class="w-90"
                        @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                        :disabled="parent.timeChecked == 1 ? true : false"
                      ></el-input>
                      <template v-if="parent.timeRadio == 1">
                        <label class="inline-block middle label-unit m-l-8">天</label>
                        <label class="inline-block middle label-tip">正整数，最大365</label>
                      </template>
                      <template v-if="parent.timeRadio == 2">
                        <label class="inline-block middle label-unit m-l-8">月</label>
                        <label class="inline-block middle label-tip">正整数，最大12</label>
                      </template>
                      <template v-if="parent.timeRadio == 3">
                        <label class="inline-block middle label-unit m-l-8">年</label>
                        <label class="inline-block middle label-tip">正整数，最大2</label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 17.时间属性(年月日-年月日 + 最近) -->
            <template v-if="parent.templateCode == 'tag017'">
              <div class="m-b-20">
                <div class="">
                  <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
                  <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
                </div>
                <!-- 固定时段 -->
                <div class="m-t-18 w-438 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
                  <el-date-picker
                    v-model="parent.dateRangeValue"
                    type="daterange"
                    :editable="false"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyyMMdd"
                    value-format="yyyyMMdd"
                    :default-time="['000000', '235959']"
                    ><!-- :picker-options="pickerOptions"  -->
                  </el-date-picker>
                </div>
                <!-- 相对时段 -->
                <div class="relative-range m-t-18 border-box" v-if="parent.radio != 1">
                  <div>
                    <div>
                      <label class="inline-block w-98 label-unit">时间精度</label>
                      <el-radio-group v-model="parent.timeRadio" @change="timeRadioChange($event, parent)">
                        <el-radio label="1">天</el-radio>
                        <el-radio label="2">月</el-radio>
                        <el-radio label="3">年</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="1" @change="currentDayChange($event, parent)"> 当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}</el-radio>
                      <!--  <el-checkbox v-model="parent.timeChecked"><label class="inline-block middle">当{{parent.timeRadio==1?'天':parent.timeRadio==2?'月':'年'}}</label></el-checkbox> -->
                    </div>
                    <div class="m-t-20">
                      <label class="inline-block w-98"></label>
                      <el-radio v-model="parent.timeChecked" label="2">{{ '' }}</el-radio>
                      <!-- <el-checkbox v-model="parent.timeCheckedTwo"> </el-checkbox> -->
                      <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                        <el-option label="最近" value="1"></el-option>
                      </el-select>
                      <el-input
                        v-model="parent.timeInput"
                        placeholder="请输入"
                        class="w-90"
                        @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                        :disabled="parent.timeChecked == 1 ? true : false"
                      ></el-input>
                      <template v-if="parent.timeRadio == 1">
                        <label class="inline-block middle label-unit m-l-8">天</label>
                        <label class="inline-block middle label-tip">正整数，最大365</label>
                      </template>
                      <template v-if="parent.timeRadio == 2">
                        <label class="inline-block middle label-unit m-l-8">月</label>
                        <label class="inline-block middle label-tip">正整数，最大12</label>
                      </template>
                      <template v-if="parent.timeRadio == 3">
                        <label class="inline-block middle label-unit m-l-8">年</label>
                        <label class="inline-block middle label-tip">正整数，最大2</label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog" class="el-button--default">取 消</el-button>
        <!-- <el-button plain @click="toTagDetail">标签详情</el-button> -->
        <router-link v-if="fromFlag !== 'memberGroup'" :to="{ path: '/myTagDetail', query: { tagId: tagShortId } }" class="el-button el-button--default el-button--large is-plain">详情</router-link>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import qs from 'qs';
import tagDetails from './tagDetail/mixin/index';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'tagShortDetail',
  mixins: [tagDetails],
  props: {
    showTagDetail: Boolean,
    tagShortId: String,
    fromFlag: String, // memberGroup: 会员分组-我的标签列表用; mytag: 我的标签列表用
    tabActive: String, // tab 名字.我的标签列表/暂存架
    rowItemData: {
      // 当前选择的数据
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      tagShortVisible: false,
      testData: {
        val: [
          {
            compute: {
              computeType: 0, //0控件选择计算数据 1固定(比如固定是包含)
              computeWidgetCode: '计算控件code',
              compute: 'type为1时候'
            },
            valWidget: '', //控件id 跟人群筛选器一样
            describeRemark: '描述备注'
          }
        ],
        time: [
          {
            timeWidgetCode: '时间控件code-前端定义',
            describeRemark: '描述备注'
          }
        ]
      },
      templateCode: '', // 当前模板 code
      searchFlag: false, // 搜索框默认不显示
      postCompute: '', // 参数
      currentKey: null, // 参数
      currentComputeType: '', // 当前标签的计算 type
      // 发送总数据
      postTemplateData: {
        selectedVal: [],
        template: []
      },
      // 标签总数据
      templateData: [],
      // 选项控件数据
      tag001: {
        checkeditems: [],
        isIndeterminate: false,
        checkAll: false,
        options: [
          // {
          //   value: 1,
          //   key: '男'
          // }
        ],
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
          // {
          //   id: 1,
          //   check: false,
          //   name: '欧时力'
          // }
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
        isAdd: true
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
          // {
          //   value: 1,
          //   key: '男'
          // }
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
        monthDayRange: [],
        // 相对时间
        timeRadio: '1', // 月日
        timeChecked: '1', //当 月日 / 最近/之后
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      // 时间属性- 年月日时分秒-年月日时分秒
      tag016: {
        dateRangeValue: []
      },
      // 时间属性- 年月日-年月日+最近
      tag017: {
        radio: '1',
        dateRangeValue: [],
        // 相对时间
        timeRadio: '1', // 年月日
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
        timeRadio: '1', // 年月日
        timeChecked: '1', //当 年月日 / 最近/之后
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      // 标签详情数据
      tagData: {
        tagId: '',
        tagName: '',
        tagDescribe: '',
        isActive: 0, // 是否实时
        inputSearch: '' // 输入搜索
      },
      rowData: {},
      baseUrl: '' // url
    };
  },
  watch: {
    showTagDetail: function(newVal) {
      this.tagShortVisible = newVal;
    },
    tagShortId: function(newVal) {
      const that = this;
      if (!newVal) {
        return false;
      }
      that.getTagData(newVal);
    },

    /* eslint-disable */
    fromFlag: function(newVal) {

    },
    rowItemData: function(newVal) {
      const that = this;
      that.rowData = newVal;
    }
  },
  mounted() {
    const that = this;
    that.tagShortVisible = that.showTagDetail;
    // that.getcityData();
    // document.getElementById('app').style.zIndex = 1;
    // that.getTagData(that.tagShortId)
    that.rowData = that.rowItemData;
  }
};
</script>
<style lang="scss" scoped>
@import './tagDetail/index.scss';
</style>
