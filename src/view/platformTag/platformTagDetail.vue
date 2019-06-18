<template>
  <div class="myTagDetail-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="checkboxOption-wrap">
          <div class="checkboxOption-wrap__head">
            <div class="checkboxOption-wrap__head__title">
              {{ tagData.tagName }}
              <span class="realtime-span border-box">{{ tagData.isActive == 1 ? '实时' : '非实时' }}</span>
            </div>
            <div class="checkboxOption-wrap__head__describe">{{ tagData.tagDescribe }}</div>
          </div>
          <div class="checkboxOption-wrap__body">
            <div class="checkboxOption-wrap__body__title">标签值设置</div>
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
                  <div>
                    <el-radio v-model="parent.fixedRecentRadio" label="1">固定时段</el-radio>
                    <el-radio v-model="parent.fixedRecentRadio" label="2">最近时段</el-radio>
                  </div>
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
                  <div>
                    <el-input v-model="parent.addInputValue" placeholder="请输入" class="w-184 m-r-8"></el-input><el-button class="middle" type="text" @click.stop="addInputVal(parent)">添加</el-button>
                  </div>
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
                  <vue-gic-store-new :options="parent.uuidOptions" :uuid.sync="parent.uuid" ref="storeNew" :isAdd="parent.isAdd"> </vue-gic-store-new>
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
                          <div class="all-select-options all-select-options__city">
                            <div class="city-checkbox city-checkbox-all border-box">
                              <el-checkbox :indeterminate="parent.isIndeterminateCity" v-model="parent.checkAllCity" @change="cityCheckAllChange($event, parent)">全选</el-checkbox>
                            </div>
                            <el-checkbox-group v-model="parent.checkeditemsCity" @change="citySelectChange($event, parent)">
                              <template v-for="(item, index) in parent.citySelectOptions">
                                <div :key="item.provinceId + index" class="city-checkbox border-box border-t-e4e7ed">
                                  <el-checkbox :label="item.provinceId" :key="item.provinceId">{{ '' }}</el-checkbox
                                  ><label class="inline-block middle font-14 pointer city-name" @click.stop="toggleCity(item.provinceId, item, parent)">{{ item.provinceName }}</label>
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
                                              :key="itemCity.check + index"
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
                              <span class="el-tag el-tag--small" :key="item.selected + index"
                                >{{ item.selected }}<i class="el-tag__close el-icon-close" @click="delcitySelectVal(index, item, parent)"></i
                              ></span>
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
                  <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
                  <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
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
        <!-- <checkboxOption ></checkboxOption> -->
        <!-- <checkbox-option-async ></checkbox-option-async> -->

        <div class="myTagDetail-wrap__btn">
          <el-button type="primary" v-if="tagFlag" @click="addTemporary">
            {{ !!addTempFlag ? '更新标签选项' : '添加到暂存架' }}
          </el-button>
          <el-button type="primary" v-if="!tagFlag" :disabled="!!addFlag ? true : false" @click="addMytag">
            {{ !!addFlag ? '已添加至我的标签库' : '添加至我的标签库' }}
          </el-button>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 标签详情缩写版 -->
    <!-- <tagShortDetail :fromFlag="fromFlag"  :tagShortId.sync="tagShortDetailId" :showTagDetail="showTagDetail" @hideTag="handleHideTag" @updateTemp="updateTemp"></tagShortDetail> -->
    <!-- 暂存架 -->
    <!-- <tag-temporary ref="tagTemp" @showShortDetail="showShortDetail"></tag-temporary> -->
  </div>
</template>
<script>
/* eslint-disable */
import qs from 'qs';
import navCrumb from '@/components/nav/nav.vue';
import checkboxOption from '@/components/tags/checkboxOption.vue';
import checkboxOptionAsync from '@/components/tags/checkboxOptionAsync.vue';
import tagTemporary from '@/components/tagTemporary.vue';
import tagShortDetail from '@/components/tagShortDetail.vue';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'myTagDetail',
  data() {
    return {
      showTagDetail: false, // 标签详情缩小版显示/隐藏
      tagShortDetailId: '', // 标签详情缩写版 id
      fromFlag: 'myTag', // 参数--来源标志

      tagId: '', // 获取当前标签的 id
      tagFlag: false, // 判断是否添加暂存架还是添加我的标签库的标志,true: 暂存库,false: 我的标签
      addFlag: false, // 是否添加到我的标签库

      templateCode: '', // 当前模板 code
      addTempFlag: false, // 是否已经添加到暂存架

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
          // },
          // {
          //   value: 2,
          //   key: '女'
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
          // },
          // {
          //   id: 2,
          //   check: false,
          //   name: '伊芙丽'
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
          // {
          //   value: 1,
          //   key: '男'
          // },
          // {
          //   value: 2,
          //   key: '女'
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
      // 时间属性- 年月日-年月日
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

      baseUrl: '' // url
    };
  },
  computed: {
    // 面包屑参数
    navpath() {
      let navSign = this.$route.query.navSign;
      /* eslint-disable */
      let obj =
        navSign == 'platformTag'
          ? { name: '平台标签列表', path: '/platformTagList' }
          : navSign == 'manualTag'
            ? { name: '手工标签列表', path: '/manualTagList' }
            : { name: '我的标签列表', path: '/myTagList' };
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
          name: '会员标签',
          path: ''
        },
        obj,
        {
          name: '标签详情',
          path: ''
        }
      ];
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
  methods: {
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
     * 添加至我的标签库
     */
    addMytag() {
      const that = this;
      let para = {
        tagId: that.tagId
      };

      getRequest('/enterpriseMemberTag/addByTagId', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.addFlag = true;
            // that.$router.go(-1)
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
     * 确定添加
     */

    addTemporary() {
      this.addTemporaryPost();
    },

    /* eslint-disable */
    async addTemporaryPost() {
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
        that.$message.error({ message: '请填写值' });
        return false;
      }
      if (code === 'tag003' && that.templateData[0].numRange[0] > that.templateData[0].numRange[1]) {
        that.$message.error({ message: '起始值必须小于等于最大值' });
        return false;
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
        tagValue.val[0].data.value = that.templateData[0].addTags.map(item => item.value).join(' ');
        that.postTemplateData.selectedVal.push(that.templateData[0].addTags.map(item => item.value).join(','));
      }

      // 全部/已选
      if (code === 'tag009' && !that.templateData[0].selectedOptions.length) {
        that.$message.error({ message: '请添加值' });
        return false;
      }
      if (code === 'tag009' && that.templateData.length === 1) {
        tagValue.val[0].data.value = that.templateData[0].selectedOptions.map(item => item.key).join(' ');
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
        // tagValue.val[0].data.value = that.templateData[0].checkeditems.join(' ')

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

      /* 年月日时分秒-年月日时分秒*/
      // if (code === 'tag019' && !that.templateData[0].dateRangeValue.length) {
      //   that.$message.error({ message: '请选择时间'})
      //   return false;
      // }
      // if (code === 'tag019' && that.templateData.length ===1) {
      //   if (that.currentComputeType == 2) {
      //     tagValue.val[0].data.compute = 'between';
      //   }else {
      //     tagValue.val[0].data.compute = that.templateData[0].postCompute;
      //   }
      //   tagValue.val[0].data.value = that.templateData[0].dateRangeValue.join(',').replace(/-/g,'').replace(/:/g,'').replace(/\s+/g,'')
      //   that.postTemplateData.selectedVal.push(`${that.templateData[0].dateRangeValue[0]} 至 ${that.templateData[0].dateRangeValue[1]}`)
      // }

      /* 固定/相对 年月日+最近+之后  年月日+最近*/
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019') && that.templateData[0].radio == 1 && !that.templateData[0].dateRangeValue.length) {
        that.$message.error({ message: '请选择值' });
        return false;
      }
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019') && that.templateData[0].radio == 2 && that.templateData[0].timeChecked == 2 && !that.templateData[0].timeInput) {
        that.$message.error({ message: '请填写值' });
        return false;
      }
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019') && that.templateData.length === 1 && that.templateData[0].radio == 1) {
        if (that.currentComputeType == 2) {
          tagValue.val[0].data.compute = 'between';
        } else {
          tagValue.val[0].data.compute = that.templateData[0].postCompute;
        }
        tagValue.val[0].data.value = that.templateData[0].dateRangeValue.join(',');
        that.templateData[0].timeInput = '';

        if (code === 'tag019') {
          tagValue.val[0].data.value = that.templateData[0].dateRangeValue
            .join(',')
            .replace(/-/g, '')
            .replace(/:/g, '')
            .replace(/\s+/g, '');
        }
        // that.postTemplateData.selectedVal.push(`${that.templateData[0].dateRangeValue[0]} 至 ${that.templateData[0].dateRangeValue[1]}`)
        that.postTemplateData.selectedVal.push(that.templateData[0].dateRangeValue[0].split(' ')[0] + '至' + that.templateData[0].dateRangeValue[1].split(' ')[0]);
      }
      if ((code === 'tag014' || code === 'tag017' || code === 'tag019') && that.templateData.length === 1 && that.templateData[0].radio == 2) {
        // 天
        if (that.templateData[0].timeRadio == 1) {
          //天 当天
          if (that.templateData[0].timeChecked == 1) {
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
          if (that.templateData[0].timeChecked == 2) {
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
          //月 当月
          if (that.templateData[0].timeChecked == 1) {
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
          if (that.templateData[0].timeChecked == 2) {
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
          //年 当年
          if (that.templateData[0].timeChecked == 1) {
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
          if (that.templateData[0].timeChecked == 2) {
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

      /* 时间属性- 月日-月日+最近+之后 */
      if (code === 'tag015' && that.templateData[0].radio == 1 && !that.templateData[0].monthDayRange.length) {
        that.$message.error({ message: '请选择值' });
        return false;
      }
      if (code === 'tag015' && that.templateData[0].radio == 2 && that.templateData[0].timeChecked == 2 && !that.templateData[0].timeInput) {
        that.$message.error({ message: '请填写值' });
        return false;
      }
      if (code === 'tag015' && that.templateData.length === 1 && that.templateData[0].radio == 1) {
        if (that.currentComputeType == 2) {
          tagValue.val[0].data.compute = 'between';
        } else {
          tagValue.val[0].data.compute = that.templateData[0].postCompute;
        }
        tagValue.val[0].data.value = that.templateData[0].monthDayRange.join(',');
        that.postTemplateData.selectedVal.push(`${that.templateData[0].monthDayRange[0]} 至 ${that.templateData[0].monthDayRange[1]}`);
      }
      if (code === 'tag015' && that.templateData.length === 1 && that.templateData[0].radio == 2) {
        // 天
        if (that.templateData[0].timeRadio == 1) {
          //天 当天
          if (that.templateData[0].timeChecked == 1) {
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
          if (that.templateData[0].timeChecked == 2) {
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
          //月 当月
          if (that.templateData[0].timeChecked == 1) {
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
          if (that.templateData[0].timeChecked == 2) {
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
      }

      /* 属于/不属于+ 选项 */

      if (that.templateData.length == 2) {
        // that.templateData.forEach(function(ele,index){
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
            console.log(ele.citySelectedOptions);
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
            // ele.isAdd = true;
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
        //
        // })
      }
      if (!returnFlag) {
        that.$message.error({ message: '请完善标签值' });
        return false;
      }
      // 门店参数修改
      that.templateData.forEach(function(ele, index) {
        if (ele.templateCode == 'tag011') {
          ele.isAdd = false;
        }
      });
      that.postTemplateData.template = that.templateData;
      tagParams = that.postTemplateData;
      that.addToTemp(tagValue, tagParams);
    },

    /**
     * 确定---添加到暂存架 api
     */
    addToTemp(tagValue, tagParams) {
      let that = this;
      let para = {
        tagId: that.tagShortId,
        tagValue: JSON.stringify(tagValue), // 标签选择保存值
        tagParams: JSON.stringify(tagParams) // 标签前端选择
      };

      postRequest('/member-tag-value/add.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.addTempFlag = true;
            // that.resetData()
            // that.changeRoute('/myTagList')
            // 更新暂存架
            that.updateTemp();
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
      let checkedCount = value.length;
      let vBackUp = JSON.parse(JSON.stringify(value));
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
      let value = !Number(e.target.value.replace(/[^.\d]/g, '')) ? '' : Number(e.target.value.replace(/[^.\d]/g, ''));
      let reg = /^[0-9]+$/;
      if (!!value && !reg.test(value)) {
        value = Number(value).toFixed(2);
      }
      // 判断输入
      // let v1 = item.numRange[0];
      // let v2 = item.numRange[1];
      // if (!Number(v2) || Number(v1) >= Number(v2)) {
      //   item.numRange[0] = value
      //   item.numRange[1] = Number((!!Number(v1)? Number(v1):0) + 1)
      //   that.$forceUpdate();

      //   return;
      // }
      item.numRange[0] = value;
      that.$forceUpdate();
    },
    blurTo(e, item) {
      const that = this;
      let value = !Number(e.target.value.replace(/[^.\d]/g, '')) ? '' : Number(e.target.value.replace(/[^.\d]/g, ''));
      let reg = /^[0-9]+$/;
      if (!!value && !reg.test(value)) {
        value = Number(value).toFixed(2);
      }
      // let t1 = item.numRange[0];
      // let t2 = item.numRange[1];
      // if ((!Number(t1) && Number(t1)!=0) || (Number(t1) >= Number(t2))) {
      //   item.numRange[0] = Number(t2) - 1 >=0? (Number(Number(t2) - 1)): !!Number(t1)? Number(t1): Number(0);
      //   var newValue = null;
      //   newValue = !!Number(t1)? (Number(t1)+1) : 1;
      //   item.numRange[1] = value || newValue

      //   if (Number(t1) > Number(t2)&& !Number(t2)) {
      //     item.numRange[1] = Number(t1) +1
      //   }
      //   if (Number(t1) > Number(t2)&& !!Number(t1) && !!Number(t2)) {
      //     item.numRange[0] = Number(t2) -1
      //   }
      //   that.$forceUpdate();
      //   return
      // }

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
      if (e) {
        parent.timeInput = '';
      }
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
      if (newNum > 12 && radio == 2) {
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
      let tagsMap = null;
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
      // that.tagData.searchOptions.push()
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
            // resData.result.forEach(function(ele,index){
            //   ele.key = ele.
            // })
            // console.log(that.remoteParent.searchOptions,that.templateData[that.pindex])
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
      item.addSelectTags.splice(index, 1);
    },

    /**
     *  多选项( 全部选项/已选选项 )
     */
    allSelectChange(e, index, item, parent) {
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
      const that = this;
    }, 500),

    getSearchSelectOptions(value) {
      const that = this;
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
      // console.log(id,item)
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
        that.currentComputeType = parseInt(newTempVal.compute.computeType);
        // 计算控件
        if (parseInt(newTempVal.compute.computeType) === 0 && !!newTempVal.compute.computeWidgetId) {
          that.getTemplateCodeById(newTempVal.compute.computeWidgetId);
        }
        // 固定计算属性(最后保存用到)
        if (parseInt(newTempVal.compute.computeType) === 1) {
          that.postCompute = newTempVal.compute.compute;
        }

        if (!!newTempVal.valWidgetId) {
          setTimeout(function() {
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
    getTemplateCodeById(id) {
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

            // 如果是给了 计算属性值
            if (!!that.postCompute) {
              that[resData.result.templateCode].postCompute = that.postCompute;
            }
            // console.log(resData.result.sourceFlag)
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
            // 获取已存数据
            that.getExistData(that.tagData.tagId);
            if (resData.result.templateCode === 'tag009' || resData.result.templateCode === 'tag010') {
              that.searchFlag = true;
            }
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
     * 判断是否包含一个数组包含另一个数组
     */
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (a.length < b.length) return false;
      if (!b.length) {
        return false;
      }
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
      let para = {
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
              that.getExistData(that.tagData.tagId, data.options);
              return;
            }
          } else {
            if (resData.errorCode == 1) {
              data.options = resData.result;
              that.templateData.push(data);
              that.getExistData(that.tagData.tagId, data.options);
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
    getExistData(tagId, newOptions) {
      const that = this;
      let para = {
        tagId: tagId
      };

      getRequest('/member-tag-value/findOne.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!resData.result || resData.result.tagParams == '[]') {
              that.addTempFlag = false;
              return false;
            }
            // 查看该标签是否在暂存架中
            that.addTempFlag = true;
            let items = JSON.parse(resData.result.tagParams).template;
            if (!!newOptions) {
              items.forEach(function(ele, index) {
                if (ele.templateCode == 'tag013') {
                  ele.options = newOptions;
                  let idOptions = newOptions.map(el => el.key);
                  let checkFlag = true;
                  newOptions.forEach(function(el, index) {
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
                  if (checkFlag && newOptions.length < checkedCount) {
                    ele.checkAll = false;
                    ele.isIndeterminate = false;
                    return false;
                  }
                  if (!checkFlag && newOptions.length >= checkedCount) {
                    ele.checkAll = false;
                    ele.isIndeterminate = true;
                    return false;
                  }
                  if (checkFlag && newOptions.length >= checkedCount) {
                    ele.checkAll = false;
                    ele.isIndeterminate = false;
                    return false;
                  }
                  // ele.checkAll = checkedCount === newOptions.length;
                  // ele.isIndeterminate = checkedCount > 0 && checkedCount < newOptions.length;
                }
              });
            }
            that.templateData = items;
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
     * 获取当前标签数据 --- api
     */
    getTagData(tagId) {
      const that = this;
      that.searchFlag = false; // 默认不显示搜索框
      let para = {
        tagId: tagId
      };

      getRequest('/memberTag/getTagById', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tagData.tagId = resData.result.tagId;
            that.tagData.tagName = resData.result.tagName;
            that.tagData.tagDescribe = resData.result.tagDescribe;
            that.tagData.isActive = resData.result.isActive;
            that.tagData.tagType = resData.result.tagType;
            // 获取 columnKey
            // if (!!resData.result.columnKey) {
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
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /*
     *
     *暂存架/标签详情缩略版方法
     */

    /**
     * 显示标签详情缩小版
     */
    handleShowTag() {
      that.showTagDetail = true;
    },

    /**
     * 隐藏标签详情缩小版
     */
    handleHideTag(val) {
      that.showTagDetail = false;
    },

    /**
     * 子组件暂存架-点击名字显示标签详情缩略版
     */
    showShortDetail(val) {
      const that = this;
      that.showTagDetail = true;
      that.tagShortDetailId = val;
    },

    /**
     * 子组件添加到暂存架-更新暂存架
     */
    updateTemp() {
      const that = this;
      that.$refs.tagTemp.getTagList();
      that.$refs.tagTemp.showTagList();
      that.updataTagDetail(); // that.tagShortDetailId
    },

    /**
     * 子组件更新暂存架-更新标签详情
     */
    updataTagDetail() {
      const that = this;
      that.getTagData(that.tagId);
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        window.location.reload();
      },
      // 深度观察监听
      deep: true
    }
  },

  /* eslint-disable */
  updated() {
  },

  mounted() {
    const that = this;
    that.tagFlag = that.$route.fullPath.indexOf('notMyTag') == -1 ? true : false;
    // 获取标签的 id 和一个判断是否添加暂存架还是添加我的标签库的标志
    if (!!that.$route.query.tagId) {
      that.tagId = that.$route.query.tagId;
      that.tagShortId = that.$route.query.tagId;
      that.getTagData(that.tagId);
      document.getElementById('app').style.zIndex = 1;
    }
    // 是否有添加我的标签库标志
    that.addFlag = !!that.$route.query.addFlag ? true : false;
  },
  components: {
    navCrumb,
    checkboxOption,
    checkboxOptionAsync,
    tagShortDetail,
    tagTemporary
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', function() {});
    document.getElementById('app').style.zIndex = 'auto';
  },
  destroyed() {
    document.removeEventListener('mousedown', function() {});
    document.getElementById('app').style.zIndex = 'auto';
  }
};
</script>
<style lang="scss" scoped>
.myTagDetail-wrap__btn {
  margin-top: 80px;
}

.relative-range {
  width: 526px;
  height: 191px;
  padding: 19px;
  background: #f3f6f9;
}

.label-unit {
  font-size: 14px;
  color: #606266;
}

.label-tip {
  display: inline-block;
  vertical-align: middle;
  padding-left: 14px;
  font-size: 13px;
  color: #909399;
}

.w-438 {
  width: 438px;
}

.w-526 {
  width: 526px;
}

.h-80 {
  height: 80px;
}

.border-t-e4e7ed {
  border-bottom: 1px solid #e4e7ed;
}

.el-select-dropdown__item.selected:hover {
  background-color: #f5f7fa;
}

.fixed-date-picker {
  padding: 20px;
}

.bg-f3f6f9 {
  background: #f3f6f9;
}

.add-tags-wrap {
  width: 380px;
  height: 110px;
  padding: 0 8px;
  overflow-y: auto;
  white-space: pre-wrap;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .el-tag {
    margin-top: 8px;
    margin-right: 8px;
    /*background: none;
    background-color: none;
    border: none;
    font-size: 14px;
    color: #606266;

    .el-tag__close {
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      color: #fff;
      background: #DCDFE6;
    }*/
  }
}

.add-search-select {
  .el-select {
    line-height: 32px;

    span {
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
  }
}

.all-select-options {
  .el-checkbox {
    margin-right: 16px;
    line-height: 32px;
    & + .el-checkbox {
      margin-left: 0;
    }
  }

  &.all-select-options__city {
    .el-checkbox-group {
      max-height: 500px;
      overflow-y: auto;
    }
  }
}

.slected-opyions {
  .el-tag {
    margin-top: 8px;
    margin-right: 8px;
    /*background: none;
    background-color: none;
    border: none;
    font-size: 14px;
    color: #606266;

    .el-tag__close {
      width: 14px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      color: #fff;
      background: #DCDFE6;
    }*/
  }

  &.city-slected-opyions {
    font-size: 0;
    .el-tag {
      margin: 0 10px 10px 0;
      /*background: #F4F4F5;
      border: 1px solid rgba(233,233,235,1);
      font-size: 12px;
      color: #909399;

      .el-tag__close {
        width: 14px;
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        color: #fff;
        background: #DCDFE6;
      }*/
    }
  }
}

.city-checkbox {
  position: relative;
  height: 50px;
  line-height: 50px;
  padding: 0 8px;

  &.city-checkbox-all {
    background: #f1f3f7;
  }
}
</style>
