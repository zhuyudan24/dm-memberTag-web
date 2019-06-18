/* 后台返回消息提示 */
import { Message } from 'element-ui';

// 后台返回异常提示

export default {
  errorMsg: function(response) {
    let local = window.location.origin;
    if (local.indexOf('localhost')) {
      local = 'http://gicdev.demogic.com';
    }
    if (response.errorCode != 1) {
      if (response.errorCode == 401) {
        window.location.href = local + '/gic-web/#/';
        return false;
      }
      Message.error({
        duration: 1000,
        message: response.message
      });
    }
  }
};
