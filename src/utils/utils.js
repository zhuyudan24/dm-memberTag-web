/*获取url参数*/

/**
 * ?name=zhangsan&age=23
 * @param {} name url 参数名
 * getParamsByName(age) 23
 */
export function getParamsByName(attr) {
  let ret = RegExp(`[?&]${attr}=([^&]*)`).exec(window.location.href);
  return ret && decodeURIComponent(ret[1].replace(/\+/g, ' '));
}


/**
 * 人群筛选器 返回具体筛选条件的个数
 * @param {}
 * return 筛选条件的个数
 */
export function normalizePeople(jsonStr) {
  if (!jsonStr) {
    return 0;
  }
  let ret = 0;
  const jsonObj = JSON.parse(jsonStr);
  if (jsonObj.list && jsonObj.list.length) {
    // 如果是一个对象 
    jsonObj.list.forEach(ele => {
      // 如果list在ele里面 表示里面包含list数组
      if ('list' in ele) {
        if (ele.list && ele.list.length) {
          ret += ele.list.length;
        }
      } else {
        ret += 1;
      }
    });
  }
  return ret;
}

/**
 * 时间格式转换
 * 20181010101010 转换成2018-10-10 10:10:10
 * @param { timeStr } 要转换的时间
 * @param { type } 要转换的格式
 */

export function formatLongTime(timeStr, type) {
  if (!timeStr) {
    return '--';
  }
  timeStr = '' + timeStr;
  let regTest = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/g;
  if (type == 1) {
    return timeStr.replace(regTest, function(match, p, p1, p2, p3, p4, p5){
      return [p, p1, p2].join('-') + ' ' + [p3, p4, p5].join(':');
    });
  } else {
    return timeStr.replace(/^(\d{4})(\d{2})(\d{2})$/g, function(match, p, p1, p2){
      return [p, p1, p2].join('-');
    });
  }
}

/**
 * 生日时间转换
 * @param {}
 */
export function paddingBorth(str) {
  if (!str) {
    return '--';
  }
  str = '' + str;
  // 如果是10月之前补位
  if (str.length == 3) {
    str = 0 + str;
  }
  return str.replace(/^(\d{2})(\d{2})$/g, function(match, p , p1) {
    return [p, p1].join('-');
  });
}