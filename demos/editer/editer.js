export default class Editer {
  classNamePre = 'editer';
  textBlockCls = this.classNamePre + '-text-block';
  exprInfo = null;
  placeholders = null;
  inputEle = null;
  toolBarEle = null;
  toolAddExprEle = null;
  toolDelExprEle = null;
  textAreaEle = null;
  styleEle = null;
  selection = document.getSelection();
  autoCompleSymbolTimeout = null;

  constructor(inputEle, exprInfo, placeholders) {
    if (typeof inputEle === 'string') {
      inputEle = document.querySelector(inputEle);
    }
    this.inputEle = inputEle;

    if (exprInfo) {
      this.exprInfo = exprInfo;
      this.exprInfo.same = this.exprInfo.left === this.exprInfo.right;
    } else {
      throw new Error('exprInfo params can not empty!');
    }

    if (placeholders) {
      this.placeholders = placeholders;
      this.placeholders.forEach(p => p.same = p.left === p.right);
    } else {
      throw new Error('placeholders params can not empty!')
    }

    this.initEle();
    this.bindEvent();
  }

  initEle() {
    this.inputEle.innerHTML = '';

    this.styleEle = document.createElement('style');
    const styleText = `
      .${this.textBlockCls}{
        display: inline-block;
      }
      .${this.textBlockCls}:before{
        content: attr(data-left-symbol);
      }
      .${this.textBlockCls}:after{
        content: attr(data-right-symbol);
      }
    `;
    this.styleEle.appendChild(document.createTextNode(styleText));
    document.head.appendChild(this.styleEle);

    this.textAreaEle = this.createEle('input-area');
    this.inputEle.appendChild(this.textAreaEle);

    this.toolBarEle = this.createEle('tool-bar');
    this.inputEle.appendChild(this.toolBarEle);

    this.toolAddExprEle = this.createEle('tool-add-expr', '+');
    this.toolBarEle.appendChild(this.toolAddExprEle);

    this.toolDelExprEle = this.createEle('tool-add-expr', '-');
    this.toolBarEle.appendChild(this.toolDelExprEle);
  }

  bindEvent() {
    this.textAreaEle.addEventListener('focusin', (e) => {
      this.selectContent(e);
    });
    this.textAreaEle.addEventListener('focusout', (e) => {
      this.resetPlaceholder(e);
    });
    this.textAreaEle.addEventListener('input', (e) => {
      this.textChangeCall(e);
    });
    this.textAreaEle.addEventListener('paste', (e) => {
      e.preventDefault();
    });
    this.textAreaEle.addEventListener('keydown', (e) => {
      this.convertEle(e);
    });
    this.toolAddExprEle.addEventListener('click', this.addExpr.bind(this));
    this.toolDelExprEle.addEventListener('click', this.delExpr.bind(this));
  }

  insert(expression) {
    if (expression) {
      this.parse(expression).forEach((ele) => {
        this.textAreaEle.appendChild(ele);
      })
    } else {
      this.addExpr();
    }
  }

  textChangeCall(e) {
    if (!e.target.classList.contains(this.textBlockCls)) {
      return;
    }

    const info = this.detectEleType(e.target.dataset['leftSymbol']);
    if (!info.change) {
      return;
    }

    e.target._dirty = true;
    info.change(e.target.textContent, (text) => {
      if (!e.target.parentElement) {
        return;
      }

      if (e.target._customType === this.exprInfo.type) {
        this.parse(text.trim()).forEach(item => {
          e.target.parentElement.insertBefore(item, e.target);
        });
        e.target.remove();
        this.textAreaEle.normalize();
      } else {
        e.target.textContent = text;
        e.target._dirty = false;
      }
    });
  }

  convertEle(e) {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();
    const symbol = e.target.textContent || '';
    if (symbol.length !== 1 || !e.target.parentElement.classList.contains(this.textBlockCls)) {
      return;
    }

    let info = this.detectEleType(symbol);
    this.resetTextBlock(e.target, info.type, [info.left, info.right], info.defaultText);
    this.selectEle(e.target);
  }

  addExpr() {
    const exprEle = this.createTextBlock(this.exprInfo.type, [this.exprInfo.left, this.exprInfo.right], this.exprInfo.defaultText || '', true);
    exprEle.textContent = this.exprInfo.defaultText || '  ';
    this.textAreaEle.appendChild(exprEle);
    exprEle._dirty = true;
    this.selectEle(exprEle);
  }

  delExpr(e) {
    const exprEleLink = [...this.textAreaEle.children].filter((item) => {
      return item.classList.contains(this.classNamePre + '-' + this.exprInfo.type);
    });

    if (exprEleLink.length > 1) {
      exprEleLink[exprEleLink.length - 1].remove();
      this.textAreaEle.normalize();
      if (this.textAreaEle.lastChild.nodeType === Node.TEXT_NODE) {
        this.textAreaEle.lastChild.remove();
      }
    } else {
      this.textAreaEle.innerHTML = '';
      this.addExpr();
    }
  }

  resetPlaceholder(e) {
    if (!e.target.classList.contains(this.textBlockCls)) {
      return;
    }

    const info = this.detectEleType(e.target.dataset['leftSymbol']);
    if (e.target._dirty && info.change) {
      e.target.classList.add('dirty');
      e.target.textContent = e.target._defaultText || '  ';
    }
  }

  selectContent(e) {
    if (!e.target._customType || (e.target._customType === this.exprInfo.type && e.target._dirty === false)) {
      return;
    }

    this.selection.setBaseAndExtent(e.target.firstChild, 0, e.target.firstChild, e.target.firstChild.length);
    e.preventDefault();
  }

  parse(expression) {
    const eleList = [];
    // 保存嵌套的表达式
    const exprEleStack = [];
    let currExpr, currPlaceholder, currRootText;
    for (let i = 0; i < expression.length; i++) {
      const letter = expression[i];
      if ((this.exprInfo.same && letter === this.exprInfo.left && currExpr) || (!this.exprInfo.same && letter === this.exprInfo.left)) { // 表达式开始
        // 发现表达式嵌套，在开始新的表达式之前处理_tempContent
        if (currExpr) {
          exprEleStack.push(currExpr);
          if (currExpr._tempContent) {
            currExpr.appendChild(document.createTextNode(currExpr._tempContent));
            currExpr._tempContent = '';
          }
        }
        // 处理根文本_tempContent
        if (exprEleStack.length === 0 && currRootText && currRootText._tempContent) {
          currRootText.textContent = currRootText._tempContent;
          eleList.push(currRootText);
          currRootText = null;
        }
        currExpr = this.createTextBlock(this.exprInfo.type, [this.exprInfo.left, this.exprInfo.right], this.exprInfo.defaultText || '');
        currExpr._tempContent = '';
        continue;
      } else if ((this.exprInfo.same && letter === this.exprInfo.left && !currExpr) || (!this.exprInfo.same && letter === this.exprInfo.right)) {// 表达式结束
        // 处理表达式_tempContent
        if (currExpr._tempContent) {
          currExpr.appendChild(document.createTextNode(currExpr._tempContent));
          currExpr._tempContent = '';
        } else {
          currExpr.appendChild(document.createTextNode(''));
          currExpr._tempContent = '';
        }
        const parentExpr = exprEleStack[exprEleStack.length - 1];
        // 表达式结束时将其挂载到父级表达式上
        if (parentExpr) {
          parentExpr.appendChild(currExpr);
        } else {
          eleList.push(currExpr);
        }
        currExpr = exprEleStack.pop();
        continue;
      }

      let matchPlaceHolder = false;
      for (let i = 0; i < this.placeholders.length; i++) {
        const p = this.placeholders[i];
        if ((p.same && letter === p.left && currPlaceholder) || (!p.same && letter === p.left)) {
          currPlaceholder.innerHTML = currPlaceholder._tempContent;
          currExpr.appendChild(currPlaceholder);
          currPlaceholder = null;
          matchPlaceHolder = true;
          break;
        } else if ((p.same && letter === p.right && !currPlaceholder) || (!p.same && letter === p.right)) {
          if (currExpr._tempContent) {
            currExpr.appendChild(document.createTextNode(currExpr._tempContent));
            currExpr._tempContent = '';
          }
          currPlaceholder = this.createTextBlock(p.type, [p.left, p.right], p.defaultText || '', true);
          currPlaceholder._tempContent = '';
          matchPlaceHolder = true;
          break;
        }
      }

      if (matchPlaceHolder) {
        // ...
      } else if (currPlaceholder) {
        currPlaceholder._tempContent += letter;
      } else if (currExpr) {
        currExpr._tempContent += letter;
      } else if (currRootText) {
        currRootText._tempContent += letter;
      } else {
        currRootText = document.createTextNode('');
        currRootText._tempContent = '';
      }

    }

    if (currRootText && currRootText._tempContent) {
      currRootText.textContent = currRootText._tempContent;
      eleList.push(currRootText);
    } else if (currPlaceholder) {
      throw new Error(`${currPlaceholder._customType} not closed`);
    }

    return eleList;
  }

  detectEleType(symbol) {
    if (symbol === this.exprInfo.left || symbol === this.exprInfo.right) {
      return this.exprInfo;
    } else {
      return this.placeholders.find((p) => {
        return symbol === p.left || symbol === p.right;
      });
    }
  }

  selectEle(ele) {
    if (ele.childNodes.length > 2) {
      this.selection.setBaseAndExtent(ele, 1, ele, ele.childNodes.length - 1);
    } else if (ele.firstChild && ele.firstChild.nodeType === Node.TEXT_NODE) {
      this.selection.setBaseAndExtent(ele.firstChild, 0, ele.firstChild, ele.firstChild.length0);
    } else {
      const range = this.selection.getRangeAt(0);
      range.selectNode(ele);
    }
  }

  createTextBlock(type, [symbolLeft, symbolRight], defaultText, editable = false) {
    const ele = document.createElement('div');
    ele.className = [this.classNamePre + '-' + type, this.textBlockCls].join(' ');
    ele._customType = type;
    ele._dirty = false;
    ele.setAttribute('data-left-symbol', symbolLeft || '');
    ele.setAttribute('data-right-symbol', symbolRight || '');
    ele.contentEditable = editable;
    ele.appendChild(document.createTextNode(''));
    ele._defaultText = defaultText;
    return ele;
  }

  createEle(className, innerHTML = '') {
    const ele = document.createElement('div');
    ele.style.cssText = `
      display: inline-block;
    `;
    ele.className = this.classNamePre + '-' + className;
    ele.innerHTML = innerHTML;
    return ele;
  }

  resetTextBlock(ele, type, [symbolLeft, symbolRight], defaultText) {
    ele.className = [this.classNamePre + '-' + type, this.textBlockCls].join(' ');
    ele._customType = type;
    ele._dirty = true;
    ele.setAttribute('data-left-symbol', symbolLeft || '');
    ele.setAttribute('data-right-symbol', symbolRight || '');
    ele.innerHTML = '';
    ele.appendChild(document.createTextNode(''));
    ele._defaultText = defaultText;
  }
}