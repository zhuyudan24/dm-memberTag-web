<template>
  <!-- 标签模板配置 -->
  <div class="tag-config">
    <div v-for="(parent, pindex) in templateData" :key="pindex">
      <!-- 1.选项控件 -->
      <template v-if="parent.templateCode == 'tag001'">
        <div class="m-b-20" :key="'tag1' + pindex">
          <div class="checkboxOption-wrap__body__checkAll border-box tag-mode">
            <el-checkbox :indeterminate="parent.isIndeterminate" v-model="parent.checkAll" @change="handleCheckAllChange($event, parent)">全选</el-checkbox>
          </div>
          <div class="checkboxOption-wrap__body__options border-box tag-options">
            <!-- @change="handleCheckedChange($event, parent)" -->
            <el-checkbox-group v-model="parent.checkeditems" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item, index) in parent.options" :label="item.key" :key="item.key + index">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>

      <!-- 2.数字范围 -->
      <template v-if="parent.templateCode == 'tag003'">
        <div class="m-b-20" :key="'tag2' + pindex">
          <el-input v-model="parent.numRange[0]" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字" @blur="blurFrom($event, parent)"></el-input>
            <label> - </label>
          <el-input v-model="parent.numRange[1]" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字" @blur="blurTo($event, parent)"></el-input>
        </div>
      </template>

      <!-- 2.数字范围区间等等 -->
      <template v-if="parent.templateCode == 'com001'">
        <div class="m-b-20" :key="'tag2' + pindex">
          <el-select v-model="parent.symbol" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in parent.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <div style="display: inline-block" v-if="parent.symbol == '区间'">
            <el-input v-model="parent.numRange[0]" @keyup.native="handleNumRangeEnd($event)" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字"></el-input>
              <label>-</label>
            <el-input v-model="parent.numRange[1]" @keyup.native="handleNumRangeEnd($event)" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字"></el-input>
          </div>
          <div style="display: inline-block" v-if="parent.symbol != '区间'">
            <el-input v-model="parent.num" @keyup.native="handleNumRangeEnd($event)" class="select-wrap-input" style="width: 100px;margin-right: 0;" placeholder="请输入数字"></el-input>
          </div>

          <!-- <label class="label-tip">注：如果起始值为空则视为小于等于最大输入值；如果最大值为空则视为大于等于最小输入值！</label> -->
        </div>
      </template>
      <!-- 3.时间属性-固定时段/相对时段+最近+之后 -->
      <template v-if="parent.templateCode == 'tag014'">
        <div class="m-b-20" :key="'tag3' + pindex">
          <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
          <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
          <!-- 固定时段 -->
          <div class="m-t-18 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
            <el-date-picker
              v-model="parent.dateRangeValue"
              type="daterange"
              :editable="false"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd"
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
                 <el-checkbox v-model="parent.timeChecked" @change="currentDayChange($event, parent)">
                  当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}
                </el-checkbox>
                <!-- <el-radio v-model="parent.timeChecked" label="1" @change="currentDayChange($event, parent)"> 当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}</el-radio> -->
                <!-- <el-checkbox v-model="parent.timeChecked"><label class="inline-block middle">当{{parent.timeRadio==1?'天':parent.timeRadio==2?'月':'年'}}</label></el-checkbox> -->
              </div>
              <div class="m-t-20">
                <label class="inline-block w-98"></label>
                <el-checkbox v-model="parent.timeAfterChecked">

                </el-checkbox>
                <!-- <el-radio v-model="parent.timeChecked" label="2">{{ '' }}</el-radio> -->
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
                ></el-input>
                <template v-if="parent.timeRadio == 1">
                  <label class="inline-block middle label-unit m-l-8">天</label>
                  <label class="inline-block middle label-tip">正整数，最大365</label>
                </template>
                <template v-if="parent.timeRadio == 2">
                  <label class="inline-block middle label-unit m-l-8">月</label>
                  <label class="inline-block middle label-tip">正整数，最大24</label>
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
        <div class="m-b-20" :key="'tag4' + pindex">
          <label class="inline-block middle label-unit">最近</label
          ><el-input v-model="parent.timeRecent" placeholder="请输入" class="w-90 m-r-20 m-l-20" @blur="value => toEditInput(value, 'timeRecent', parent)"></el-input
          ><label class="inline-block middle label-unit">天</label>
        </div>
      </template>
      <!-- 5.之后 天 -->
      <template v-if="parent.templateCode == 'tag006'">
        <div class="m-b-20" :key="'tag5' + pindex">
          <label class="inline-block middle label-unit">之后</label
          ><el-input v-model="parent.timeAfter" placeholder="请输入" class="w-90 m-r-20 m-l-20" @blur="value => toEditInput(value, 'timeAfter', parent)"></el-input
          ><label class="inline-block middle label-unit">天</label>
        </div>
      </template>
      <!-- 6.属于/不属于 -->
      <template v-if="parent.templateCode == 'tag002'">
        <div class="m-b-20" :key="'tag6' + pindex">
          <el-radio v-model="parent.computeRadio" label="in">属于</el-radio>
          <el-radio v-model="parent.computeRadio" label="notIn">不属于</el-radio>
        </div>
      </template>
      <!-- 7.固定时段/最近 -->
      <template v-if="parent.templateCode == 'tag004'">
        <div class="m-b-20" :key="'tag7' + pindex">
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
              format="yyyy-MM-dd"
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
        <div class="m-b-20" :key="'tag8' + pindex">
          <div><el-input v-model="parent.addInputValue" placeholder="请输入" class="w-184 m-r-8"></el-input><el-button class="middle" type="text" @click.stop="addInputVal(parent)">添加</el-button></div>
          <div class="m-t-18 add-tags-wrap">
            <template v-for="(item, index) in parent.addTags">
              <span :key="item.value + index" class="el-tag el-tag--small">{{ item.value }}<i class="el-tag__close el-icon-close" @click="delInputVal(index, parent)"></i></span>
            </template>
          </div>
        </div>
      </template>
      <!-- 9.输入搜索下拉多选 添加值 -->
      <template v-if="parent.templateCode == 'tag008'">
        <div class="m-b-20" :key="'tag9' + pindex">
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
        <div class="m-b-20" :key="'tag10' + pindex">
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
        <div class="m-b-20" :key="'tag11' + pindex">
          <vue-gic-store-new :options="parent.uuidOptions" :uuid.sync="parent.uuid" ref="storeNew" :isAdd="parent.isAdd"> </vue-gic-store-new>
        </div>
      </div>
      <!-- 12.多选项( 全部选项/已选选项 ) -->
      <template v-if="parent.templateCode == 'tag009'">
        <div class="multiple-select-wrap m-b-20" :key="'tag12' + pindex">
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
        <div class="multiple-select-wrap city-select-wrap m-b-20" :key="'tag13' + pindex">
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
                        <div class="city-checkbox border-box border-t-e4e7ed" :key="item.provinceId + index">
                          <el-checkbox :label="item.provinceId" :key="item.provinceId">{{ '' }}</el-checkbox><label class="inline-block middle font-14 pointer city-name" @click.stop="toggleCity(item.provinceId, item, parent)">{{ item.provinceName }}</label>
                          <div
                            class="el-select-dropdown el-popper is-multiple"
                            style="min-width: 240px; position: absolute; top: 30px; left: 20px; transform-origin: center top 0px; z-index: 2215;"
                            x-placement="bottom-start"
                            v-if="item.showCity">
                            <div class="el-scrollbar" style="">
                              <div class="el-select-dropdown__wrap el-scrollbar__wrap" style=" margin-right: -17px;">
                                <ul class="el-scrollbar__view el-select-dropdown__list">
                                  <!--市列表-->
                                  <template v-for="(itemCity, index) in item.children">
                                    <li
                                      :key="itemCity.check + index"
                                      :class="['el-select-dropdown__item', 'city-name', !!itemCity.check ? 'selected' : '']"
                                      @click.stop="toggleClickCity(itemCity, item, parent)">
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
        <div class="m-b-20" :key="'tag14' + pindex">
          <div class="checkboxOption-wrap__body__checkAll border-box tag-mode">
            <el-checkbox :indeterminate="parent.isIndeterminate" v-model="parent.checkAll" @change="handleCheckAllChange($event, parent)">全选</el-checkbox>
          </div>
          <div class="checkboxOption-wrap__body__options border-box tag-options">
            <!-- @change="handleCheckedChange($event, parent)" -->
            <el-checkbox-group v-model="parent.checkeditems" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(item, index) in parent.options" :label="item.key" :key="item.key + index">{{ item.value }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>

      <!-- 15.时间属性(月日-月日+最近+之后) -->
      <template v-if="parent.templateCode == 'tag015'">
        <div class="m-b-20" :key="'tag15' + pindex">
          <el-radio v-model="parent.radio" label="1">固定时段</el-radio>
          <el-radio v-model="parent.radio" label="2">相对时段</el-radio>
          <!-- 固定时段 -->
          <div class="m-t-18 w-438 p-20 border-box bg-f3f6f9" v-if="parent.radio == 1">
            <vue-gic-datepicker
              v-model="parent.dateRangeValue"
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
                 <el-checkbox v-model="parent.timeChecked" @change="currentDayChange($event, parent)">
                  当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}
                </el-checkbox>
              </div>
              <div class="m-t-20">
                <label class="inline-block w-98"></label>
                <el-checkbox v-model="parent.timeAfterChecked">

                </el-checkbox>
                <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                  <el-option label="最近" value="1"></el-option>
                  <el-option label="之后" value="2"></el-option>
                </el-select>
                <el-input
                  v-model="parent.timeInput"
                  placeholder="请输入"
                  class="w-90"
                  @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                ></el-input>
                <template v-if="parent.timeRadio == 1">
                  <label class="inline-block middle label-unit m-l-8">天</label>
                  <label class="inline-block middle label-tip">正整数，最大365</label>
                </template>
                <template v-if="parent.timeRadio == 2">
                  <label class="inline-block middle label-unit m-l-8">月</label>
                  <label class="inline-block middle label-tip">正整数，最大24</label>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 16.时间属性(年月日-年月日) -->
      <template v-if="parent.templateCode == 'tag016'">
        <div class="m-b-20" :key="'tag16' + pindex">
          <el-date-picker
            v-model="parent.dateRangeValue"
            type="daterange"
            :editable="false"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            :default-time="['000000', '235959']">
          </el-date-picker>
        </div>
      </template>
      <!-- 19.时间属性(年月日时分秒-年月日时分秒) -->
      <template v-if="parent.templateCode == 'tag019'">
        <div class="m-b-20" :key="'tag17' + pindex">
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
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['000000', '235959']">
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

                <el-checkbox v-model="parent.timeChecked" @change="currentDayChange($event, parent)">
                  当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}
                </el-checkbox>
              </div>

              <div class="m-t-20">
                <label class="inline-block w-98"></label>
                <el-checkbox v-model="parent.timeAfterChecked">

                </el-checkbox>
                <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                  <el-option label="最近" value="1"></el-option>
                  <el-option label="之后" value="2" ></el-option>
                </el-select>
                <el-input
                  v-model="parent.timeInput"
                  placeholder="请输入"
                  class="w-90"
                  @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                ></el-input>
                <template v-if="parent.timeRadio == 1">
                  <label class="inline-block middle label-unit m-l-8">天</label>
                  <label class="inline-block middle label-tip">正整数，最大365</label>
                </template>
                <template v-if="parent.timeRadio == 2">
                  <label class="inline-block middle label-unit m-l-8">月</label>
                  <label class="inline-block middle label-tip">正整数，最大24</label>
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

      <template v-if="parent.templateCode == 'tag020'">
        <div class="m-b-20" :key="'tag17' + pindex">
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
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['000000', '235959']">
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

                <el-checkbox v-model="parent.timeChecked" @change="currentDayChange($event, parent)">
                  当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}
                </el-checkbox>
              </div>

              <div class="m-t-20">
                <label class="inline-block w-98"></label>
                <el-checkbox v-model="parent.timeAfterChecked">

                </el-checkbox>
                <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                  <el-option label="最近" value="1"></el-option>
                </el-select>
                <el-input
                  v-model="parent.timeInput"
                  placeholder="请输入"
                  class="w-90"
                  @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                ></el-input>
                <template v-if="parent.timeRadio == 1">
                  <label class="inline-block middle label-unit m-l-8">天</label>
                  <label class="inline-block middle label-tip">正整数，最大365</label>
                </template>
                <template v-if="parent.timeRadio == 2">
                  <label class="inline-block middle label-unit m-l-8">月</label>
                  <label class="inline-block middle label-tip">正整数，最大24</label>
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
        <div class="m-b-20" :key="'tag18' + pindex">
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
              format="yyyy-MM-dd"
              :default-time="['000000', '235959']"
              value-format="yyyyMMdd">
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
                <el-checkbox v-model="parent.timeChecked" @change="currentDayChange($event, parent)">
                  当{{ parent.timeRadio == 1 ? '天' : parent.timeRadio == 2 ? '月' : '年' }}
                </el-checkbox>
              </div>
              <div class="m-t-20">
                <label class="inline-block w-98"></label>
                <el-checkbox v-model="parent.timeAfterChecked"></el-checkbox>
                <el-select v-model="parent.timeSelect" placeholder="请选择" class="w-86 m-l-8">
                  <el-option label="最近" value="1"></el-option>
                </el-select>
                <el-input
                  v-model="parent.timeInput"
                  placeholder="请输入"
                  class="w-90"
                  @blur="value => toEditDateInput(value, parent.timeRadio, parent)"
                ></el-input>
                <template v-if="parent.timeRadio == 1">
                  <label class="inline-block middle label-unit m-l-8">天</label>
                  <label class="inline-block middle label-tip">正整数，最大365</label>
                </template>
                <template v-if="parent.timeRadio == 2">
                  <label class="inline-block middle label-unit m-l-8">月</label>
                  <label class="inline-block middle label-tip">正整数，最大24</label>
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

      <!-- 会员标签嵌入卡券选择器 com023 -->
      <!-- v-if="parent.templateCode == 'com023'" -->
      <div v-if="parent.templateCode == 'com023'">
        <vue-gic-card
          @reciver-card-list="reciverCardList"
          :disabledList="disabledList"
          :cardLimit="cardLimit"
          :cardType="cardType"
          :tag-list="tagList"
          :type="1">
        </vue-gic-card>
      </div>

      <!-- 嵌入商品选择器 -->
      <div v-if="parent.templateCode == 'com022'">
        <vue-gic-goods-selector ref="selector" @changelist="changelist"></vue-gic-goods-selector>
        <!-- <vue-gic-selector ref="selector" @changelist="changelist"></vue-gic-selector> -->
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';

// import vueGicSelector from '@/components/selector/index.vue';
import tagDetails from '@/components/tagDetail/mixin/index';
import VueGicCard from '@/components/card/card';
import { getTagType, findWidget, findOndJson } from '@/request/tagConfig';

// 两个数字区间 numRange [0, 1]
const templateCode = ['tag001', 'tag002', 'tag003', 'tag004', 'tag005', 'tag006', 'tag007', 'tag008', 'tag009', 'tag010', 'tag011', 'tag012', 'tag013', 'tag014', 'tag015', 'tag016', 'tag017', 'tag018'];

/**
 * checkeditems 多选框
 */
const templateCodeKeyWords = ['checkeditems', '', 'numRange', '', '', '', '', '', '', '', '', '', '', '', 'monthDayRange', '', '', ''];

const RegTest = /^\d+$/;

export default {
  name: 'tag-config',

  props: {
    tagId: String,
    templateDataList: Object
  },

  mixins: [tagDetails],

  components: {
    VueGicCard
    // vueGicSelector
  },

  data() {
    return {
      select: {
        expends: true
      },
      templateCode: null,
      timeAfterChecked: '',
      tagList: [],
      // 卡券
      disabledList: [],
      cardLimit: [],
      cardType: null,
      postTemplateData: {
        selectedVal: [],
        template: []
      },
      currentComputeType: '',
      templateData: [],
      id: '',
      searchFlag: false,
      // 标签详情数据
      tagData: {
        tagId: '',
        tagName: '',
        tagDescribe: '',
        isActive: 0, // 是否实时
        inputSearch: '' // 输入搜索
      },
      com001: {
        options: [],
        numRange: ['', ''],
        symbol: '',
        num: ''
      },
      tag001: {
        checkeditems: [],
        isIndeterminate: false,
        checkAll: false,
        options: [],
        compute: 'in'
      },

      // 多选项值异步
      tag013: {
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
        allSelectOptions: [],
        selectedOptions: []
      },

      // 多选项(城市选择) ( 全部选项/已选选项 )
      tag010: {
        citySelectActive: 'first',
        isIndeterminateCity: false,
        checkAllCity: false,
        citySelectOptions: [],
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

      // 时间属性-固定时段/相对时段 年月日-年月日+最近+之后
      tag014: {
        radio: '1',
        dateRangeValue: [],

        // 相对时间
        timeRadio: '1', // 年月日
        timeChecked: false,
        timeAfterChecked: false,
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近/之后
        timeInput: ''
      },
      // 时间属性- 月日-月日+最近+之后
      tag015: {
        radio: '1',
        dateRangeValue: [],
        // 相对时间
        timeRadio: '1', // 年月日
        timeChecked: false,
        timeAfterChecked: false,
        // timeCheckedTwo: false,
        timeSelect: '1', // 最近
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
        timeChecked: false,
        timeAfterChecked: false,
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
        timeChecked: false,
        timeAfterChecked: false,
        // timeCheckedTwo: false,
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
      },
      // 商品选择器
      com022: {
        selectList: [],
        conditionsList: [],
        abbrInfo: '',
        finalId: null
      },
      // 卡券选择器
      com023: {

      },
      cardListData: []
    };
  },
  watch: {
    tagId: {
      immediate: true,
      handler(newval) {
        this.id = newval;
      }
    }
  },

  methods: {
    changelist() {
      this.select.expends = true;
    },
    // 获取商品选择器的缩略信息
    async confirmSelector() {
      let flag = await this.$refs.selector[0].collectConditions();
      if (flag == false) {
        this.$message.warning('商品选择器条件不能为空！');
        return false;
      } else {
        // this.select.expends = !flag.filterAbbrInfo.length;
        this.com022.selectList = flag.conditions;
        this.com022.abbrInfo = flag.filterAbbrInfo;
        this.com022.conditionsList = flag.conditionList;
        this.com022.finalId = flag.id;
      }
      return true;
    },
    // 格式化输入的字符
    handleNumRangeStart(eve) {
      let value = eve.target.value;
      if (!RegTest.test(value)) {
        this.$message.warning({
          message: '只能输入正数！'
        })
        eve.target.value = '';
      }
    },
    handleNumRangeEnd(eve) {
      let value = eve.target.value;
      if (!RegTest.test(value)) {
        this.$message.warning({
          message: '只能输入正数！'
        })
        eve.target.value = '';
      }
    },
    handleCheckedCitiesChange(value) {
      this.templateData.forEach(item => {
        if (item.templateCode == 'tag001' || item.templateCode == 'tag013') {
          let checkedCount = value.length;
          item.checkAll = checkedCount === item.options.length;
          item.isIndeterminate = checkedCount > 0 && checkedCount < item.options.length;
        }
      });
    },
    // 卡券
    selectCard(val) {
      this.cardTags = val;
    },
    reciverCardList(list) {
      this.cardListData = list;
    },
    saveConfirm() {
      return new Promise((resolve, reject) => {
        this.confirmPost().then(res => {
          resolve(res);
        });
      });
    },
    /**
     * 获取 templateData
     */
    transformConfigvalue(item) {
      // 通过index来对应
      let index = templateCode.findIndex(el => el === item.templateCode);
      return item[templateCodeKeyWords[index]];
    },
    getTemplateData() {
      return this.templateData.map(el => ({
        ...el,
        templateValue: this.transformConfigvalue(el)
      }));
    },

    //查看标签的配置项
    async _getTagType(id) {
      const param = {
        tagId: id,
        requestProject: 'gic-member-tag-web'
      };
      getTagType(param)
        .then(res => {
          if (res.errorCode == 1) {
            const data = res.result;
            this.templateObj = {
              columnKey: data.columnKey,
              template: data.template
            };
            // syo 关键点 修改实时以及key
            this.tagData.tagId = data.tagId;
            this.tagData.tagType = data.tagType;
            this.tagData.tagName = data.tagName;
            this.currentKey = data.columnKey;
            this.tagData.isActive = data.isActive;
            if (!!this.templateObj.template) {
              // 检查模板code
              this.checkTemplageCode(this.templateObj.template.templateContent);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 检查模板code
     */
    checkTemplageCode(template) {
      this.templateData = [];
      let middleTemplate = JSON.parse(template);
      if (middleTemplate) {
        // 模板对象
        let templateVal = middleTemplate.val[0];
        let newTime = middleTemplate.time;

        this.currentComputeType = templateVal.compute.computeType >> 0;
        if (this.currentComputeType === 0 && !!templateVal.compute.computeWidgetId) {
          this.getTemplateCodeById(templateVal.compute.computeWidgetId);
        }
        // 固定计算属性(最后保存用到)
        if (this.currentComputeType === 1) {
          this.postCompute = templateVal.compute.compute;
        }

        // 门店
        if (!!templateVal.valWidgetId) {
          setTimeout(_ => {
            this.getTemplateCodeById(templateVal.valWidgetId);
          }, 50);
        }
        if (!!newTime.length) {
          if (this.currentComputeType === 1) {
            setTimeout(_ => {
              newTime.forEach((ele, index) => {
                if (!!ele.timeWidgetId) {
                  this.getTemplateCodeById(ele.timeWidgetId);
                }
              });
            }, 200);
          } else {
            setTimeout(_ => {
              newTime.forEach((ele, index) => {
                if (!!ele.timeWidgetId) {
                  this.getTemplateCodeById(ele.timeWidgetId);
                }
              });
            }, 200);
          }
        }
      }
    },
    /**
     * 根据模板的id获取控件的模板code ---
     */
    getTemplateCodeById(id) {
      const param = {
        widgetId: id,
        requestProject: 'gic-member-tag-web'
      };
      findWidget(param)
        .then(res => {
          if (res.errorCode == 1) {
            let data = res.result;
            for (let key in data) {
              if (data.templateCode == 'com023') {
                this[data.templateCode][key] = data[key];
              }
              this[data.templateCode][key] = data[key];
            }
            // 如果是城市
            if (data.templateCode === 'tag010') {
              this.getcityData();
            }
            // 如果是给了 计算属性值
            if (!!this.postCompute) {
              // this[data.templateCode] = Object.create(null);
              this[data.templateCode].postCompute = this.postCompute;
            }
            // 如果直接给需要字段
            if (data.sourceFlag >> 0 === 0) {
              data.widgetValues = JSON.parse(data.widgetValues);
              // this[data.templateCode] = Object.create(null);
              this[data.templateCode].options = data.widgetValues;
            }
            // 如果通过 url 获取
            if (data.sourceFlag >> 0 === 1) {
              data.widgetParam = JSON.parse(data.widgetParam);
              this.getAsyncList(data.widgetParam[0].value, this[data.templateCode]);
              if (data.templateCode === 'tag009' || data.templateCode === 'tag010') {
                this.searchFlag = true;
              }
              setTimeout(_ => {
                if (this.templateDataList.editCondition) {
                  this.asyncTemplateList();
                }
              }, 200);
              return false;
            }
            // 调整商品选择器顺序
            if (data.templateCode == 'com022') {
              setTimeout(_ => {
                this.templateData.push(this[data.templateCode]);
              }, 200);
            } else {
              this.templateData.push(this[data.templateCode]);
            }


            /**
             * 这里处理编辑回显数据
             * 这里拿到编辑的数据 然后把tagValue的value值传解析传给模板的v-model
             * 写一个方法 把模板code定位配置code来处理这么多的模板
             */
            setTimeout(_ => {
              this.templateCode = this.templateData.map(el => el.templateCode);
              if (this.templateDataList.editCondition) {
                this.templateDataList.templateCode = this.templateCode;
                this.replaceTemplateValue();
              }
            }, 200);

            // 获取已存数据
            // this.getExistData(this.tagData.tagId);
            if (data.templateCode === 'tag009' || data.templateCode === 'tag010') {
              this.searchFlag = true;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    asyncTemplateList() {
      let tagValue = JSON.parse(this.templateDataList.tagValue);
      // let tagParams = JSON.parse(this.templateDataList.tagParams);
      let value = null;
      let checkedCount = null;

      for (let tem of this.templateData) {
        switch (tem.templateCode) {
          case 'tag013':
            value = tagValue.val[0].data.value.split(' ');
            tem.checkeditems = value;
            checkedCount = tem.checkeditems.length;
            tem.checkAll = checkedCount == tem.options.length;
            tem.isIndeterminate = checkedCount > 0 && checkedCount < tem.options.length;
            break;
        }
      }
    },

    /**
     * 城市
     */
    getcityData() {
      const para = { requestProject: 'member-tag' };
      this.axios
        .post(`${this.baseUrl}/api-plug/dict-district-tree`, qs.stringify(para))
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            data.forEach((el, index) => {
              el.check = false;
              el.showCity = false;
              el.children.forEach((item, ind) => {
                item.check = false;
              });
            });
            this.tag010.citySelectOptions = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 获取当前标签数据
     */
    getAsyncList(url, data) {
      const para = {
        key: this.tagData.tagType == 1 ? this.tagData.tagId : this.currentKey,
        requestProject: 'gic-member-tag-web'
      };
      this.axios.post(`${this.baseUrl}${url}`, qs.stringify(para))
        .then(res => {
          let resData = res;
          if (this.tagData.tagType != 1 && this.currentKey != 'tag') {
            if (resData.data.errorCode == 0) {
              data.options = resData.data.result;
              this.templateData.push(data);
              // this.getExistData(this.tagData.tagId, data.options);
              return;
            }
          } else {
            if (resData.data.errorCode == 1) {
              data.options = resData.data.result;
              this.templateData.push(data);
              // this.getExistData(this.tagData.tagId, data.options);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

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
     * 获取当前标签已存数据
     */
    getExistData(tagId, newOptions) {
      let that = this;
      const param = {
        tagId: tagId,
        requestProject: 'gic-member-tag-web'
      };
      findOndJson(param)
        .then(res => {
          if (res.errorCode == 1) {
            if (!res.result || res.tagParams == '[]') {
              this.addTempFlag = false;
              return false;
            }
            // 查看该标签是否在暂存架中
            this.addTempFlag = true;
            let items = JSON.parse(res.result.tagParams).template;
            if (!!newOptions) {
              items.forEach(function(ele, index) {
                if (ele.templateCode == 'tag013') {
                  ele.options = newOptions;
                  let idOptions = newOptions.map(el => el.key);
                  let checkFlag = true;
                  newOptions.forEach((el, index) => {
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
                }
              });
            }
            this.templateData = items;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // this.templateData[i] = target
    calculateProvinceCount(target) {
      let arr = [];
      target.citySelectedOptions.forEach(el => {
        if (arr.findIndex(item => el.cityId == item.cityId) == -1) {
          arr.push(el);
        }
      });

      target.citySelectedOptions = arr;

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
     * 将tagValue 替代模板数据的v-model
     */
    replaceTemplateValue() {
      let tagValue = JSON.parse(this.templateDataList.tagValue);
      let tagParams = JSON.parse(this.templateDataList.tagParams);
      let value = null;
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
            value = tagValue.val[0].data.value.split(' ');

            selectVal = tagParams.selectedVal[1].split(',');
            selectVal.forEach((item, index) => {
              this.templateData[i].citySelectedOptions.push({
                selected: selectVal[index],
                cityName: selectVal[index],
                cityId: item
              });
            });
            setTimeout(_ => {
              this.calculateProvinceCount(this.templateData[i]);
            }, 20);
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
                console.log(this.templateData[i].checkeditems);
                this.templateData[i].checkeditems = value;
              }
            }
            checkedCount = this.templateData[i].checkeditems.length;
            this.templateData[i].checkAll = checkedCount == this.templateData[i].options.length;
            this.templateData[i].isIndeterminate = checkedCount > 0 && checkedCount < this.templateData[i].options.length;
            break;
          // 属于不属于 从newTagVal里面比较
          case 'tag002':
            if (tagParams.template[0].selectTwo) {
              this.templateData[0].computeRadio = tagParams.template[0].selectTwo;
            } else {
              this.templateData[0].computeRadio = tagParams.template[0].computeRadio;
            }
            break;

          case 'tag015':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag015') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                if (this.templateData[i].radio == 1) {
                  if (templateDate.dateRangeValue && templateDate.dateRangeValue.length) {
                    this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                  } else {
                    this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                  }
                } else {
                  // 相对时段
                  this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                  this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                  this.templateData[i].timeChecked = templateDate.timeChecked;
                  this.templateData[i].dateRangeValue = [];
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
                // 判断是那个时间段
                // 固定时段
                this.templateData[i].radio = templateDate.radio; // 时段
                if (this.templateData[i].radio == 1) {
                  if (templateDate.dateRangeValue && templateDate.dateRangeValue.length) {
                    this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                  } else {
                    this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                  }
                } else {
                  // 相对时段
                  this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                  this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                  this.templateData[i].timeChecked = templateDate.timeChecked;
                  this.templateData[i].dateRangeValue = [];
                }
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          case 'tag016':
            this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
            break;

          case 'tag019':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag019') {
                let templateDate = tagParams.template[0];
                // 判断是那个时间段
                // 固定时段
                this.templateData[i].radio = templateDate.radio; // 时段
                if (this.templateData[i].radio == 1) {
                  if (templateDate.dateRangeValue && templateDate.dateRangeValue.length) {
                    this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                  } else {
                    this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                  }
                } else {
                  // 相对时段
                  this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                  this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                  this.templateData[i].timeChecked = templateDate.timeChecked;
                  this.templateData[i].dateRangeValue = [];
                }
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          case 'tag020':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag020') {
                let templateDate = tagParams.template[0];
                // 判断是那个时间段
                // 固定时段
                this.templateData[i].radio = templateDate.radio; // 时段
                if (this.templateData[i].radio == 1) {
                  if (templateDate.dateRangeValue && templateDate.dateRangeValue.length) {
                    this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                  } else {
                    this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                  }
                } else {
                  // 相对时段
                  this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                  this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                  this.templateData[i].timeChecked = templateDate.timeChecked;
                  this.templateData[i].dateRangeValue = [];
                }
                // 如果有最近选项必有 timeInput
                if (this.templateData[i].timeAfterChecked) {
                  this.templateData[i].timeInput = tagValue.val[0].data.value;
                }
              }
            }
            break;

          case 'tag014':
            for (let i = 0; i < this.templateData.length; i++) {
              if (this.templateData[i].templateCode === 'tag014') {
                let templateDate = tagParams.template[0];
                this.templateData[i].radio = templateDate.radio; // 时段
                if (this.templateData[i].radio == 1) {
                  if (templateDate.dateRangeValue && templateDate.dateRangeValue.length) {
                    this.templateData[i].dateRangeValue = templateDate.dateRangeValue;
                  } else {
                    this.templateData[i].dateRangeValue = tagValue.val[0].data.value.split(',');
                  }
                } else {
                  // 相对时段
                  this.templateData[i].timeRadio = templateDate.timeRadio; // 天 月 年
                  this.templateData[i].timeAfterChecked = templateDate.timeAfterChecked;
                  this.templateData[i].timeChecked = templateDate.timeChecked;
                  this.templateData[i].dateRangeValue = [];
                }
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

          case 'com022':
            for (let i = 0; i < tagParams.template.length; i++) {
              if (tagParams.template[i].templateCode == 'com022') {
                this.$refs.selector[0].conditions = JSON.parse(JSON.stringify(tagParams.template[i].conditionsList));
              }
            }
            // this.confirmSelector();
            // this.select.expends = false;
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
                // 老数据是按照两个区间值来做的 所以强行当成老数据来做
                if (tagParams.selectedVal[0].indexOf('区间') != -1) {
                  // 存在区间
                  this.templateData[i].symbol = '区间';
                  this.templateData[i].numRange = tagValue.val[0].data.value.split(',');
                } else if (tagParams.template[0].symbol == void 0) {
                  this.templateData[i].symbol = '区间';
                  this.templateData[i].numRange = tagParams.template[0].numRange;
                } else {
                  this.templateData[i].symbol = tagParams.template[0].symbol;
                  this.templateData[i].num = tagValue.val[0].data.value;
                }
              }
            }
            break;
        }
      }
    },
    /**
     * 重置条件添加的时候是空的
     */
    resetOptions() {
      if (this.templateData.length) {
        for (let tem of this.templateData) {
          switch(tem.templateCode) {
            case 'tag003':
              tem.numRange = [];
              break;
            case 'tag007':
              tem.addTags = [];
              break;
          }
        }
      }
    }
  },

  create() {
    this.templateObj = {};
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      this.baseUrl = 'http://gicdev.demogic.com';
    } else {
      this.baseUrl = host;
    }
  },
  mounted() {
    // 存在id
    if (this.id) {
      this._getTagType(this.id);
    }
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
      max-height: 300px;
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
.tag-mode {
  padding: 10px;
  background-color: #ebeef5;
  color: #909399;
}
.tag-options {
  padding: 20px 10px;
  border-bottom: 1px solid rgba(220, 223, 230, 1);
}


</style>
