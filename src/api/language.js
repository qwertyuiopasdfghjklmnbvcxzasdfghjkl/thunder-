/**
 * 国际化语言接口
 */
import api from '@/api'

let domain = process.env.NODE_ENV === 'development' ?'https://gcox.com/':''
// let domain =null
let language = {}

const getLanguage = function (lang, success, error) {
  api.get(`${domain}api/v2/language/${lang}?domain=gcox`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
language.getLanguage = getLanguage

export default language
