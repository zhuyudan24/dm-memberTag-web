/*
 * 时间日期转换
 * @param: "10:00-22:00"/ new Date()
 */

export default {
  /*
   * let storeBusinessTime="10:00-22:00"  to
   */
  timeToDate: function(val) {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let day = date.getDate();

    let d = [];
    let newArr = [];
    let dArr = val.split('-');
    dArr.forEach(function(ele, index) {
      newArr.push(ele.split(':'));
    });
    d = [new Date(y, m, day, newArr[0][0], newArr[0][1]), new Date(y, m, day, newArr[1][0], newArr[1][1])];
    return d;
  },

  dateToTime(val) {
    //  (0-9)年月数字的显示
    function formatDig(num) {
      return num > 9 ? '' + num : '0' + num;
    }
    let t;
    let t1 = formatDig(new Date(val[0]).getHours()) + ':' + formatDig(new Date(val[0]).getMinutes());
    let t2 = formatDig(new Date(val[1]).getHours()) + ':' + formatDig(new Date(val[1]).getMinutes());
    t = t1 + '-' + t2;
    return t;
  },

  /**
   * 时间戳转时间
   * @param timestamp
   * 调用方法 timeToDateTime(timestamp 参数,年月日连接符(-/.))
   */
  timeToDateTime(timestamp, sym) {
    //格式化 timestamp 返回年月日时分秒
    function formatNumber(n) {
      //对于小于 10 的数字返回 0[1-9]
      n = n.toString();
      return n[1] ? n : '0' + n;
    }
    if (timestamp != null) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      // console.log(timestamp);
      return [year, month, day].map(formatNumber).join(sym || '-') + ' ' + [h, m, s].map(formatNumber).join(':');
    }
    return '--';
  }
};
