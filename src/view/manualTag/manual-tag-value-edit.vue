<template>
  <div class="manualTagEdit-wrap common-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="manualTagEdit-wrap__title">{{ tagInfo.tagName }}</div>

        <div class="tag-value-wrapper">
          <el-table :data="tagValTableData">
            <el-table-column width="50" class-name="tag-cell" label-class-name="tag-head"><!-- 占位用 --></el-table-column>
            <el-table-column label="标签值" prop="tagItemName" min-width="200" class-name="tag-cell" label-class-name="tag-head"></el-table-column>
            <el-table-column label="操作" min-width="100" class-name="tag-cell" label-class-name="tag-head">
              <template slot-scope="scope">
                <!-- 正在上传中 -->
                <div v-if="scope.row.status === 4 || scope.row.status === 6" class="uploading">
                  <span>正在上传</span>
                  <span class="uploading-progress">
                  <el-progress
                    :percentage="scope.row.percent">
                  </el-progress>
                </span>
                </div>
                <!-- 初始状态和导入完成状态 -->
                <template v-else>
                  <el-button type="text" size="small" class="m-r-20" :disabled="scope.row.status === 5" @click="showImportPop(scope.$index, scope.row)">
                    导入会员
                  </el-button>
                  <span class="upload-state" v-if="uploadedTag.includes(scope.row.tagItemId) || scope.row.errorCount > 0">
                    <!-- 导入完成 -->
                    <span v-show="uploadedTag.includes(scope.row.tagItemId)" class="uploading-succ">
                      上传完成
                    </span>
                    <span v-show="scope.row.errorCount > 0" class="download-failed">
                      <span :class="['download-failed-btn', {disabled: scope.row.status === 5}]" @click="downloadErrorData(scope.row)">点击下载</span>
                      失败会员清单
                    </span>
                  </span>

                  <!-- 删除中的状态 -->
                  <template v-if="scope.row.status === 5">
                    <span class="color-c0c4cc">删除中...</span>
                  </template>
                  <!-- 删除的初始状态 -->
                  <template v-else>
                    <el-popover placement="top" width="300" trigger="click" v-model="scope.row.showDelPopOver">
                      <p>删除标签后，符合该标签值的会员对应标签值将同步删除。一旦删除将无法恢复，确认要删除吗？</p>
                      <div style="text-align: right; margin: 5px 0 0 0;">
                        <el-button type="text" size="mini" @click.native="scope.row.showDelPopOver = false">取消</el-button>
                        <el-button type="primary" size="mini" @click.native="delTagApi(scope.$index, scope.row)">确定
                        </el-button>
                      </div>
                      <el-button type="text" size="small" slot="reference">删除</el-button>
                    </el-popover>
                  </template>
                </template>
              </template>
            </el-table-column>
            <div class="add-tag" slot="append">
              <div class="add-tag-btn" @click="addTagValPop.isShow = true">
                <i class="iconfont icon-icon02"></i>
                添加标签值
              </div>
            </div>
          </el-table>
        </div>
        <div class="back">
          <el-button @click="back">返回手工标签列表</el-button>
        </div>
        <!-- 添加标签值 -->
        <el-dialog title="添加标签值" :visible.sync="addTagValPop.isShow" width="490px" custom-class="manual-dialog">
          <div class="add-tag-val">
            <span>标签值</span>
            <el-input placeholder="请输入" :maxlength="10" v-model.trim="addTagValPop.tagVal"></el-input>
            <label class="input-label">{{addTagValPop.tagVal.length}}/10</label>
          </div>
          <template slot="footer">
            <el-button @click="closeAddPop">取消</el-button>
            <el-button type="primary" @click="addTagVal">确定</el-button>
          </template>
        </el-dialog>
        <!-- excel导入 -->
        <el-dialog :title="importPop.title" :visible.sync="importPop.isShow" custom-class="manual-dialog">
          <div class="import">
            <div :class="['excel-icon', importPop.excelData.length > 0 ? 'excel-icon--active' : 'excel-icon--add']"  @click="handleUpload">
              <span v-show="importPop.excelData.length === 0" class="import-btn">点击上传会员</span>
            </div>
            <div class="import-cont">
              <div class="import-handle">
                <input type="file" style="display: none" accept=".xlsx, .xls, .csv" ref="upload" @change="handleFileChange">
                <template v-if="importPop.excelData.length > 0">
                  <span>{{importPop.excelName}}</span>
                  <span class="import-num">
                    已导入会员
                    <span class="color-303133">{{importPop.excelData.length}}</span>
                    人
                  </span>
                  <el-button type="text" @click="reHandleUpload">重新导入</el-button>
                </template>
              </div>
              <div class="import-tip">
                <span class="import-tip-text">只能上传一个excle文件（2003版本以上），且数据不超过5000条</span>
                <el-button type="text" @click="downloadExcelTemp">
                  <span class="font-12">下载Excel模板</span>
                </el-button>
              </div>
              <div class="clear-old">
                <el-checkbox v-model="importPop.optType">清空标签历史标记会员</el-checkbox>
                <el-tooltip content="勾选后，此前被该标签标记的会员将移除此标签，此标签标记会员以本次导入为准。">
                  <i class="iconfont icon-xinxixianshi"></i>
                </el-tooltip>
              </div>
            </div>
          </div>
          <template slot="footer">
            <el-button @click="closeImportPop">取消</el-button>
            <el-button type="primary" @click="tagItemImport">确定</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import './manualTagEdit.css';
import XLSX from 'xlsx';
import navCrumb from '@/components/nav/nav.vue';
import { export_json_to_excel } from '@/vendor/Export2Excel';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postRequest } from '@/api/api';
/**
 * 通过excel导入会员的业务逻辑 2019-5-27
 * 轮询接口的实现方式
 *  refreshTag用来保存需要轮询的标签值tagItemIndex索引和tagItemId ID
 *  页面打开后，会调用getValueData根据取到的标签值的状态，将需要轮询的标签值存入refreshTag中，然后开始轮询
 *  添加和删除标签值后，会重新调用getValueData，执行上一步操作
 *  当有标签值状态更新后，会将refreshTag中对应的标签值移除
 *  当refreshTag中无数据时，终止轮询。
 * */
export default {
  name: 'manual-tag-value-edit',
  data() {
    return {
      // 编辑标签的时候,获取标签的 id
      tagId: '',
      // 标签的基本信息
      tagInfo: {
        tagName: '',
        tagDescribe: '',
        tagLevelGroupId: '',
        tagLevelGroupName: ''
      },

      // 添加标签值的弹窗的相关数据
      addTagValPop: {
        isShow: false,
        tagVal: '',
      },

      // excel导入的弹窗的相关数据
      importPop: {
        isShow: false,
        // 标签值的索引
        tagItemIndex: '',
        // 标签值的id
        tagItemId: '',
        // false=0: 不删除, true=1: 删除
        optType: false,
        title: '',
        // 当前上传 excel 的表格名字
        excelName: '',
        // 当前上传 excel 内容的数据
        excelData: [],
        // 当前上传 excel 表头的数据
        excelHeader: []
      },

      // 标签值列表的数据
      tagValTableData: [],
      // 需要查询进度的标签值索引和id
      // 每次获取标签值列表时更新、标签值有新的状态时更新
      refreshTag: [],
      // 需要显示上传完成的标签值id
      uploadedTag: [],
      timer: null
    };
  },
  computed: {
    // 面包屑参数
    navpath() {
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
          path: `/member-tag`
        },
        // {
        //   name: '手工标签列表',
        //   path: '/manualTagList'
        // },
        {
          name: '标签值设置',
          path: ''
        }
      ];
    }
  },
  methods: {
    // 返回手工标签列表
    back() {
      const levelGroupInfo = {
        id: this.tagInfo.tagLevelGroupId,
        name: this.tagInfo.tagLevelGroupName
      };
      localStorage.setItem('groupId', JSON.stringify(levelGroupInfo));
      this.$router.push('/member-tag');
    },

    // 取消添加标签值
    closeAddPop() {
      this.addTagValPop.isShow = false;
      this.addTagValPop.tagVal = '';
    },

    // 添加标签值
    addTagVal() {
      if (this.addTagValPop.tagVal.length === 0) {
        this.$message.error({
          duration: 1000,
          message: '请输入标签值'
        });
        return false;
      }
      if (this.tagValTableData.some(item => item.name === this.addTagValPop.tagVal)) {
        this.$message.error({
          duration: 1000,
          message: '标签值已存在'
        });
        return false;
      }
      this.addTagItem('', this.addTagValPop.tagVal);
      this.closeAddPop();
    },

    // 添加和编辑标签值
    addTagItem(tagItemId, tagItemName) {
      const para = {
        tagItemId: tagItemId,
        tagItemName: tagItemName,
        tagId: this.tagId
      };

      getRequest('/memberTag/saveHandTagItem', para).then(res => {
        const { errorCode } = res.data;
        if (errorCode === 1) {
          showMsg.showmsg('添加成功', 'success');
          this.getValueData();
          return;
        }
        errMsg.errorMsg(res.data);
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 删除标签值
    delTagApi(index, item) {
      const para = {
        tagItemId: item.tagItemId
      };
      this.refreshTag.push({
        tagItemIndex: index,
        tagItemId: item.tagItemId
      });
      getRequest('/memberTag/delHandTagItem', para).then(res => {
        const { errorCode } = res.data;
        if (errorCode === 1) {
          item.delStatus = 0;
          this.handleRefreshTag();
          return;
        }
        errMsg.errorMsg(res.data);
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 获取标签值列表
    getValueData() {
      const para = {
        tagId: this.tagId
      };
      getRequest('/memberTag/queryHandTagItem', para).then((res) => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          /**
           * 前端自定义的扩展字段
           * 为了实现一个标签值的数据上传中另一个标签值仍可以上传的功能
           * 上传完毕后，扩展字段需要重置
           * */
          this.refreshTag = [];
          result.forEach((ele, index) => {
            ele.showDelPopOver = false;
            // 上传进度百分比值
            ele.percent = 0;
            // 4 删除中 5删除项 6 处理中
            if (ele.status === 4 || ele.status === 5 || ele.status === 6) {
              this.refreshTag.push({tagItemIndex: index, tagItemId: ele.tagItemId});
            }
          });
          this.tagValTableData = result;
          this.handleRefreshTag();
          return;
        }
        errMsg.errorMsg(res.data);
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 显示导入会员的弹窗
    showImportPop(index, row) {
      // 状态为删除中，不可以导入会员
      this.importPop.isShow = true;
      this.importPop.tagItemIndex = index;
      this.importPop.tagItemId = row.tagItemId;
      this.importPop.title = `${row.tagItemName}-导入会员`
    },

    // 关闭导入会员的弹窗
    closeImportPop() {
      this.importPop.isShow = false;
      this.resetImportData();
    },

    // 重置导入的表格数据
    resetImportData() {
      this.importPop.excelName = '';
      this.importPop.excelData = [];
      this.importPop.excelHeader = [];
      this.importPop.optType = false;
    },

    // 点击上传文件、
    handleUpload() {
      if (this.importPop.excelData.length !== 0) return;
      this.reHandleUpload();
    },
    // 重新导入按钮
    reHandleUpload() {
      this.$refs.upload.click();
    },

    // 处理上传的表格
    handleFileChange(e) {
      const files = e.target.files[0];
      // 校验.xlsx, .xls, .csv格式的文件
      const reg = /(\.(xlsx|xls|csv))$/;
      if (!files) return;
      if (!reg.test(files.name)) {
        this.$message.warning({
          duration: 1000,
          message: '仅支持上传xlsx、xls、csv格式的文件'
        });
        e.target.value = '';
        return;
      }
      this.importPop.excelName = files.name;
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const fixedData = this.fixData(data);
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        if (Object.keys(worksheet).indexOf('!ref') === -1) {
          this.$message.error({
            duration: 1000,
            message: '文档内容为空'
          });
          return false;
        }
        this.importPop.excelHeader = this.get_header_row(worksheet);
        this.importPop.excelData = XLSX.utils.sheet_to_json(worksheet);
        if (this.importPop.excelData.length > 5000) {
          this.$message.error({
            duration: 1000,
            message: '单次上传数据不能超过 5000 条,请重新上传文件'
          });
        }
      };
      reader.readAsArrayBuffer(files);
    },

    fixData(data) {
      let o = '';
      let l = 0;
      const w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },

    get_header_row(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet['!ref']);
      let C;
      const R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },

    uploadExcel() {
      // 上传之前，不需要根据是否勾选“清空标签历史标记会员”进行拦截 2019-05-22
      return;
      if (this.importPop.optType) {
        this.$confirm('勾选此选项则清空之前有此标签会员身上的标签，以本次导入会员为准；否则本次导入和之前已有数据去重添加。请慎重选择！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(this.tagItemImport);
        return;
      }
      this.tagItemImport()
    },

    // 导入数据到服务端
    tagItemImport() {
      if (this.importPop.excelData.length === 0) {
        this.$message.error({
          duration: 1000,
          message: '导入数据有为空或者数据异常'
        });
        return;
      }
      this.$refs.upload.value = '';
      this.refreshTag.push({
        tagItemIndex: this.importPop.tagItemIndex,
        tagItemId: this.importPop.tagItemId
      });
      const para = {
        tagItemId: this.importPop.tagItemId,
        data: JSON.stringify(this.importPop.excelData)
      };
      postRequest('/memberTag/uploadHandTagItemImport', para).then((res) => {
        const { errorCode } = res.data;
        errorCode === 1 ? this.handTagItemImport() : errMsg.errorMsg(res.data);
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 服务端处理导入数据
    handTagItemImport() {
      let {tagItemId, optType } = this.importPop;
      optType = optType ? 1 : 0;

      getRequest('/memberTag/dealHandTagItemImport', { tagItemId, optType }).then((res) => {
        const { errorCode } = res.data;
        if (errorCode === 1) {
          // 关闭上传的弹窗
          this.closeImportPop();
          // 查询上传进度
          this.handleRefreshTag();
        } else {
          errMsg.errorMsg(res.data);
        }
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    handleRefreshTag() {
      // 根据refreshTag的tagItemIndex比对tagValueTableData的tagItemId是否相同，如果相同，就操作tagValueTableData的数据，不同就不操作
      // 新增和删除标签值完成后，重新执行getValueData方法，刷新标签值列表数据，重启轮询
      // 当refreshTag的length为0时，终止轮询
      if (this.refreshTag.length === 0) return;
      let allPro = [];
      this.refreshTag.forEach(item => {
        allPro.push(this.getImportReport(item.tagItemIndex, item.tagItemId));
      })
      Promise.all(allPro).then(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.handleRefreshTag, 1000);
      })
    },
    // 查询上传、删除的进度
    getImportReport(tagItemIndex, tagItemId) {
      return getRequest('/memberTag/getImportReport', { tagItemId }).then((res) => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          // 0 删除 1正常 2导入中 3 导入完成 4 删除中 5删除项 6 处理中 7 异常 8 处理成功
          switch (result.status) {
            case 0:
              // 已删除
              if (this.tagValTableData[tagItemIndex].tagItemId === tagItemId) {
                this.refreshTag = this.refreshTag.filter(item => item.tagItemId !== tagItemId)
                this.getValueData();
              }
              break;
            case 5:
              // 删除进行中
              if (this.tagValTableData[tagItemIndex].tagItemId === tagItemId) {
                this.tagValTableData[tagItemIndex].status = 5;
              }
              break;
            case 4:
            case 6:
              // 导入进行中
              if (this.tagValTableData[tagItemIndex].tagItemId === tagItemId) {
                this.tagValTableData[tagItemIndex].status = result.status;
                const num = parseInt((result.totalNum - result.needExec) / result.totalNum * 100);
                this.tagValTableData[tagItemIndex].percent = num === 100 ? 99 : num;
              }
              break;
            case 8:
              // 导入完成
              if (this.tagValTableData[tagItemIndex].tagItemId === tagItemId) {
                this.tagValTableData[tagItemIndex].status = result.status;
                // 已经上传完成的标签值不在轮询
                this.refreshTag = this.refreshTag.filter(item => item.tagItemId !== tagItemId);
                this.uploadedTag.push(tagItemId);
                // 上传的错误数量
                this.tagValTableData[tagItemIndex].errorCount = result.needError;
                // 重置百分比为0
                this.tagValTableData[tagItemIndex].percent = 0;
              }
              break;
            default:
              if (this.tagValTableData[tagItemIndex].tagItemId === tagItemId) {
                this.tagValTableData[tagItemIndex].status = result.status;
                // 已经上传完成的标签值不在轮询
                this.refreshTag = this.refreshTag.filter(item => item.tagItemId !== tagItemId);
                // 重置错误数量、百分比为0
                this.tagValTableData[tagItemIndex].errorCount = 0;
                this.tagValTableData[tagItemIndex].percent = 0;
              }
              break;
          }
        } else {
          errMsg.errorMsg(res.data);
        }
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 下载上传失败的会员清单
    downloadErrorData(row) {
      const {status, tagItemId} = row;
      if (status === 5) return;
      getRequest('/memberTag/queryImportErrorData', { tagItemId }).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          if (result && result.length) {
            const header = Object.keys(result[0]);
            //获取数据后执行 excel 导出
            const data = result.map(item => header.map(key => item[key]));
            export_json_to_excel(header, data, '导出列表');
          } else {
            this.$message.error({
              duration: 1000,
              message: '暂无失败数据'
            });
          }
          return;
        }
        errMsg.errorMsg(res.data);
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 导出 excel 模板
    downloadExcelTemp() {
      const tHeader = ['手机号', '卡号'];
      const data = [
        ['17098078224', 'jhdm2018071315'],
        ['13100000055', 'jhdm20180608000000003']
      ];
      export_json_to_excel(tHeader, data, '导入 excel 模板');
    },

    // 获取三级分类列表
    getOptionsThree(tagLevelGroupId) {
      getRequest('/tagLevel/handThirdLevel', { tagLevelGroupId }).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          let tagGroup = result.filter(item => item.tagLevelGroupId === this.tagInfo.tagLevelGroupId);
          if (tagGroup.length > 0) {
            this.tagInfo.tagLevelGroupName = tagGroup[0].levelName;
          }
        }
      }).catch(error => {
        this.$message.error({
          duration: 1000,
          message: error.message
        });
      });
    },

    // 编辑时获取当前标签数据
    getTagData(tagId) {
      getRequest('/memberTag/getTagById', { tagId }).then(res => {
        const { errorCode, result } = res.data;
        if (errorCode === 1) {
          this.tagInfo = {
            tagName: result.tagName,
            tagLevelGroupId: result.tagLevelGroupId,
            tagDescribe: result.tagDescribe
          }
          // 获取标签值列表
          this.getValueData();
          this.getOptionsThree(result.tagTwoLevelGroupId);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  },
  mounted() {
    const tagId = this.$route.query.tagId;
    localStorage.removeItem('groupId');
    if (tagId) {
      this.tagId = tagId;
      this.getValueData();
      this.getTagData(tagId);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  components: {
    navCrumb
  }
}
</script>
<style lang="less" scoped>
  .manualTagEdit-wrap {
    padding-bottom: 56px;
  }
  .right-box {
    padding: 0 !important;
    min-height: 68vh;
    .manualTagEdit-wrap__title {
      margin-bottom: 0;
      padding: 22px 24px 18px;
      width: 100%;
      font-size: 16px;
      color: #303133;
      border-bottom: 2px solid #EDEFF2;
    }
    .tag-value-wrapper {
      padding: 24px;
    }
    .back {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 56px;
      background: #fff;
      border-top: 1px solid #DCDFE6;
    }
    .add-tag {
      border-bottom: 1px solid #E4E7ED;
      .add-tag-btn {
        margin: 0 auto;
        width: 100px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        font-size: 14px;
        color: #909399;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
    }
    .add-tag-val {
      position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;
      width: 375px;
      span {
        margin-right: 10px;
        flex: 1 1 55px;
        font-size: 14px;
      }
      .input-label{
        position: absolute;
        top: 0;
        right: 10px;
        z-index: 1;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #C0C4CC;
        height: 100%;
      }
    }
    .import {
      display: flex;
      align-items: start;

      .excel-icon {
        margin-right: 10px;
        width: 40px;
        height: 40px;
        color: #606266;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        .import-btn {
          display: block;
          width: 100px;
          transform: translate(50px, 4px);
        }
      }
      .excel-icon--add {
        cursor: pointer;
        background-image: url('../../../static/img/add.svg');
        &:hover {
          color: #1890FF;
          background-image: url("../../../static/img/add-hover.svg");
        }
      }
      .excel-icon--active {
        background-image: url('../../../static/img/excel.svg');
      }

      .import-cont {
        width: 520px;

        .import-handle {
          display: flex;
          align-items: center;
          height: 22px;
          font-size: 14px;
          color: #606266;

          .import-num {
            margin-left: 24px;
            padding-right: 15px;
            margin-right: 12px;
            color: #909399;
            border-right: 1px solid #DCDFE6;
          }
        }

        .import-tip {
          font-size: 12px;
          color: #909399;
          .import-tip-text {
            margin-right: 10px;
            padding-right: 15px;
            border-right: 1px solid #DCDFE6;
          }
        }

        .clear-old {
          margin-top: 24px;
          font-size: 14px;
          color: #606266;

          .icon-xinxixianshi {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
    .uploading {
      color: #909399;
      font-size: 14px;
      .uploading-progress {
        padding: 0 0 0 10px;
        display: inline-block;
        width: 200px;
      }
    }
    .upload-state {
      padding: 0 20px 0 0;
      .uploading-succ {
        color: #909399;
      }
      .download-failed {
        color: #909399;
        .download-failed-btn {
          padding: 0 10px 0 5px;
          color: #f5222d;
          cursor: pointer;
          &:hover {
            color: #dc535b;
          }
        }
        .disabled {
          color: #fba6aa;
          cursor: not-allowed;
          &:hover {
            color: #fba6aa
          }
        }
      }
    }
  }
</style>
