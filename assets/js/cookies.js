// Работа с куками
export default class Cookies {

  setCookie(name, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1000 * 60 * 60 * 24));
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() +  "; path=/";
  }

  // возвращает cookie с именем name, если есть, если нет, то undefined
  getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  deleteCookie() {
    this.setCookie(name, "", {
      expires: -1
    })
  }
}
