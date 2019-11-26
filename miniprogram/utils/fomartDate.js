module.exports = (date) => {
  let fomatter = 'yyyy-MM-dd mm:hh:ss';
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'm+': date.getMinutes(),
    'h+': date.getHours(),
    's+': date.getSeconds(),
  }
  if (/(y+)/.test(fomatter)) {
    fomatter = fomatter.replace(RegExp.$1, date.getFullYear())
  }
  for (let v in o) {
    if (new RegExp('('+v+')').test(fomatter)) {
      fomatter = fomatter.replace(RegExp.$1,o[v].toString().length == 1 ? '0' + o[v] : o[v])
    }
  }
  return fomatter;
}