<template>
  <div>
    <input id="excel-upload-input" :ref="'excel-upload-input' + currentIndex" type="file" accept=".xlsx, .xls, .csv" class="c-hide excel-upload-input" @change="handkeFileChange" />
    <div id="drop">
      <el-button style="margin-left:16px;" size="mini" type="text" @click.stop="handleUpload" :disabled="tagItemStatus == 2 || tagItemStatus == 4 || tagItemStatus == 5 || tagItemStatus == 6 ? true : false">
        <span class=" inline-block">点击导入会员</span
        ><!-- p-r-8 -->
      </el-button>
      <el-button size="mini" type="text" @click.stop="handleDownload" v-if="tagItemStatus == 8">
        <span class="p-l-8 border-l-dcdfe6 color-e55858">上传完成,下载失败会员清单</span>
      </el-button>
      <div class="excel-upload__tip">只能上传一个excle文件（2003版本以上），且数据不超过5000条</div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import XLSX from 'xlsx';
import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  props: {
    currentIndex: {
      type: [String, Number]
    },
    currentExcelTagItemId: String,
    status: {
      type: [String, Number]
    },
    excelBodyData: Array,
    excelHeader: Array
    // failHead: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // },
    // failData: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      loading: false,
      useIndex: null,
      tagItemId: '', // 当前标签值 id
      tagItemStatus: this.status, // 当前标签值的状态
      excelData: {
        header: null,
        results: null,
        name: null
      },
      failedData: []
    };
  },
  methods: {
    generateDate({ header, results, fileName }) {
      this.excelData.header = header;
      this.excelData.results = results;
      this.excelData.name = fileName;
      this.$emit('on-selected-file', this.excelData);
      this.$emit('selectIndex', this.useIndex);
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!');
        return;
      }
      const itemFile = files[0]; // only use files[0]
      this.readerData(itemFile);
      e.stopPropagation();
      e.preventDefault();
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    handleUpload() {
      const that = this;
      // if (!!that.excelHeader&&!!that.excelHeader.length) {
      if (that.excelBodyData.length > 0) {
        that
          .$confirm('目前操作没有结束，点击其他导入现有数据不会保存，\n 确认要离开吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(() => {
            // 先清空原有数据
            that.$emit('clearOldData', that.currentIndex);
            document.getElementsByClassName('excel-upload-input')[that.useIndex].click();
          })
          .catch(() => {});
        return false;
      }
      document.getElementsByClassName('excel-upload-input')[that.useIndex].click();
    },
    handkeFileChange(e) {
      const files = e.target.files;
      const itemFile = files[0]; // only use files[0]
      if (!itemFile) {
        return;
      }
      this.readerData(itemFile);
      this.$refs['excel-upload-input' + this.currentIndex].value = null; // fix can't select the same excel
    },
    readerData(itemFile) {
      const that = this;
      let fileName = itemFile.name;
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const fixedData = this.fixdata(data);
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        if (Object.keys(worksheet).indexOf('!ref') == -1) {
          that.$message.error({
            duration: 1000,
            message: '文档内容为空'
          });
          return false;
        }
        const header = this.get_header_row(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);
        if (results.length > 5000) {
          that.$message.error({
            duration: 1000,
            message: '上传数据大于 5000 条,请重新上传文件'
          });
          return false;
        }
        this.generateDate({ header, results, fileName });
      };
      reader.readAsArrayBuffer(itemFile);
    },
    fixdata(data) {
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

    /**
     * 导出 excel
     */
    handleDownload() {
      const that = this;
      const para = {
        tagItemId: that.tagItemId
      };
      getRequest('/memberTag/queryImportErrorData', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              let header = Object.keys(resData.result[0]);
              //获取数据后执行 excel 导出
              that.exportExcel(header, resData.result);
            } else {
              that.$message.error({
                duration: 1000,
                message: '暂无失败数据'
              });
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);
          // that.$message.error({
          //   duration: 1000,
          //   message: error.message
          // });
        });
    },

    /**
     * 导出 excel 方法
     */
    exportExcel(header, currentExcelData) {
      const that = this;
      /* eslint-disable */
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vendor/Export2Excel');
        const tHeader = header; // ['phoneNum']
        const filterVal = header; //['phoneNum']
        const list = currentExcelData;
        if (!list.length) {
          that.$message.error({
            duration: 1000,
            message: '数据为空'
          });
          return false;
        }
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '导出列表');
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  watch: {
    currentIndex: function(newdata, oldData) {
      this.useIndex = newdata;
    },
    // failData: function(newdata,oldData){
    //   console.log("watch:",newdata)
    //   this.failedData = newdata
    // },
    currentExcelTagItemId: function(newdata, oldData) {
      this.tagItemId = newdata;
    },

    status: function(newdata, oldData) {
      this.tagItemStatus = newdata;
    }
  },
  mounted() {
    this.useIndex = this.currentIndex;
    // this.failedData = this.failData
    this.tagItemId = this.currentExcelTagItemId;
  }
};
</script>

<style scoped>
#excel-upload-input {
  display: none;
  z-index: -9999;
}
#drop {
  /*border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;*/
  margin: 0 auto;
  /*font-size: 24px;*/
  /*border-radius: 5px;*/
  /*text-align: center;*/
  /*color: #bbb;*/
  position: relative;
}

.excel-upload__tip {
  margin-left: 16px;
  font-size: 12px;
  color: #909399;
}

.color-e55858 {
  color: #e55858;
}
</style>
