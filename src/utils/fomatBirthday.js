export function fomatBirthday(val) {
  if(val) {
    let date = new Date(val);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0'+ (date.getDate()): date.getDate());
    return Y+M+D;
  }else {
    return ''
  }
}

