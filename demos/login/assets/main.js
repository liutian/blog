// 自执行函数
(function () {

  // 面板切换
  initSwitchPanel();
  // 切换账号系统
  initSwitchLoginAccessType();
  // 清除输入框内容
  initInput();
  // 切换语言
  initSwitchLang();
  // 登陆逻辑
  initSubmit();

  /*******************************************************分割线，看上面***********************************************/

  function initSubmit() {
    bindEvent('form.input-login-panel', 'submit', function (e) {
      var userNameEle = Q('.user-name input');
      var passwdEle = Q('.passwd input');
      var checkCodeEle = Q('.check-code input');
      var invalidFlag = true;

      // 阻止表单默认提交行为
      e.preventDefault();

      // 非空验证
      if (!userNameEle.value || !passwdEle.value) {
        if (!userNameEle.value) {
          _showAlert(userNameEle.parentElement, '.invalid-alert', '.empty');
        }
        if (!passwdEle.value) {
          _showAlert(passwdEle.parentElement, '.invalid-alert', '.empty');
        }
        invalidFlag = false;
      } else {// 隐藏所有提示信息
        _showAlert(userNameEle.parentElement, '.invalid-alert', '#null');
        _showAlert(passwdEle.parentElement, '.invalid-alert', '#null');
      }

      if (checkCodeEle.parentElement.style.display === 'block' && (!checkCodeEle.value || checkCodeEle.value !== '1234')) {
        if (!checkCodeEle.value) {
          _showAlert(checkCodeEle.parentElement, '.invalid-alert', '.empty');
        } else if (checkCodeEle.value !== '1234') {
          _showAlert(checkCodeEle.parentElement, '.invalid-alert', '.error');
        }
        invalidFlag = false;
      } else {// 隐藏所有提示信息
        _showAlert(checkCodeEle.parentElement, '.invalid-alert', '#null');
      }

      // 基本校验不通过
      if (invalidFlag === false) {
        return;
      }

      // 逻辑校验
      if (userNameEle.value !== 'admin' || passwdEle.value !== 'admin') {
        if (checkCodeEle.parentElement.style.display !== 'block') {
          checkCodeEle.parentElement.style.display = 'block';
        }
        if (isMobile()) {
          showModal();
        } else {
          _showAlert(Q('form'), '.error-alert', '.not-match');
        }
      } else {
        alert('登陆成功');
        // 隐藏所有提示信息
        _showAlert(Q('form'), '.error-alert', '#null');
      }
    });
  }

  // 显示提示信息
  function _showAlert(container, parentSelector, childSelector) {
    (container.querySelectorAll(parentSelector + ' > *') || []).forEach(function (ele) {
      ele.className = ele.className.replace(/\s*active\s*/ig, '');
    });

    var alertEle = container.querySelector(parentSelector + ' ' + childSelector);
    if (alertEle && alertEle.className.indexOf('active') === -1) {
      alertEle.className += ' active';
    }
  }

  function initSwitchLang() {
    // 缓存本地版本的语言文本，多语言切换
    QAll('[i18n]').forEach(function (ele) {
      var attrNameList = copyArr(ele.attributes).map(function (attr) { return attr.nodeName; });
      var findI18nText = false;
      for (let i = 0; i < attrNameList.length; i++) {
        const attr = attrNameList[i];
        if (attr.indexOf('i18n-text') !== -1) {
          if (findI18nText) {
            break;
          }
          ele.setAttribute('i18n-text-local', (ele.innerText || ele.innerHTML || '').trim());
          findI18nText = true;
        } else if (attr.indexOf('i18n-') !== -1) {
          var i18nAttrName = attr.replace(/i18n-/ig, '').split('-')[0];
          ele.setAttribute('i18n-' + i18nAttrName + '-local', ele.getAttribute(i18nAttrName));
        }
      }
    });

    bindEvent('.curr-lang', 'click', function () {
      var langEle = Q('.switch-lang');
      if (langEle.className.indexOf('active') === -1) {
        langEle.className += ' active';
      } else {
        langEle.className = langEle.className.replace(/\s*active\s*/ig, '');
      }
    });

    bindEvent('.lang-list >*', 'click', function () {
      var langEle = Q('.switch-lang');
      langEle.className = langEle.className.replace(/\s*active\s*/ig, '');
      Q('.curr-lang').innerText = this.innerText;

      // 从元素的属性中检索需要的语言版本，多语言切换
      var langType = this.getAttribute('lang-type');
      QAll('[i18n]').forEach(function (ele) {
        var attrNameList = copyArr(ele.attributes).map(function (attr) { return attr.nodeName; });
        for (let i = 0; i < attrNameList.length; i++) {
          var attr = attrNameList[i];
          var attrRegx = new RegExp('^i18n-\\w+-' + langType, 'i');
          if (attr.indexOf('i18n-text-' + langType) !== -1) {
            ele.innerText = ele.getAttribute(attr);
          } else if (attrRegx.test(attr)) {
            var i18nAttrName = attr.replace(/i18n-/ig, '').split('-')[0];
            ele.setAttribute(i18nAttrName, ele.getAttribute(attr));
          }
        }
      });
    });
  }

  function initInput() {
    bindEvent('.input-control input', 'keyup', function () {
      var iEle = this.parentElement.querySelector('.clear-text');

      if (this.value.length > 0) {
        if (iEle && window.getComputedStyle(iEle, 'display') !== 'block') {
          iEle.style.display = 'block';
        }
        var emptyEle = this.parentElement.querySelector('.invalid-alert .empty');
        emptyEle.className = emptyEle.className.replace(/\s*active\s*/ig, '');
      } else {
        iEle && (iEle.style.display = 'none');
      }
    });

    bindEvent('.input-control .clear-text', 'click', function () {
      var inputEle = this.parentElement.querySelector('input');
      inputEle.value = '';
      inputEle.focus();
      this.style.display = 'none';
    });
  }

  function initSwitchLoginAccessType() {
    bindEvent('.switch-access-type .item', 'click', function (e, eleList) {
      eleList.forEach(function (item) {
        item.className = item.className.replace(/\s*active\s*/ig, '');
      });

      this.className += ' active';
    });
  }

  function initSwitchPanel() {
    bindEvent('.scan-switch-triger,.input-switch-triger', 'click', function () {
      if (this.className.indexOf('input-switch-triger') !== -1) {
        var parent = Q('.scan-login-panel');
        if (parent.className.indexOf('active') === -1) {
          parent.className += ' active';
        }

        var otherParent = Q('.input-login-panel');
        otherParent.className = otherParent.className.replace(/\s*active\s*/ig, '');
      } else if (this.className.indexOf('scan-switch-triger') !== -1) {
        var parent = Q('.input-login-panel');
        if (parent.className.indexOf('active') === -1) {
          parent.className += ' active';
        }

        var otherParent = Q('.scan-login-panel');
        otherParent.className = otherParent.className.replace(/\s*active\s*/ig, '');
      }
    });
  }

  // 判断是否是移动端环境
  function isMobile() {
    var regex = /iphone|android|ipad/ig;
    return regex.test(navigator.userAgent);
  }

  function Q(selector) {
    return document.querySelector(selector);
  }

  function QAll(selector) {
    return document.querySelectorAll(selector);
  }

  // 通用事件绑定方法
  function bindEvent(selector, eventName, listener) {
    var eleList = typeof selector === 'string' ? QAll(selector) : selector;
    eleList = eleList.forEach ? eleList : [eleList];
    eleList.forEach(function (ele) {
      ele.addEventListener(eventName, function (e) {
        listener.apply(this, [e, eleList]);
      });
    });
  }

  function showModal(timeout) {
    var modalEle = Q('.modal');
    if (modalEle.className.indexOf('active') === -1) {
      modalEle.className += ' active';
    }

    setTimeout(function () {
      modalEle.className = modalEle.className.replace(/\s*active\s*/ig, '');
    }, timeout || 3000);
  }

  function copyArr(arr) {
    return Array.prototype.slice.apply(arr);
  }
})();




