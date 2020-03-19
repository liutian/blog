import Editor from './editer.js';

const exprList = [
  '[`属性A`中包含"值1"]',
  '[`属性值`中不包含"值1"]',
  '[`属性A`不在"值1","值2"中]',
  '[`属性A`在"值1","值2"中]',
  '[`属性A`不等于"值1"]',
  '[`属性A`等于”值1"]',
  '[且]',
  '[或]',
  '["属性值A"大于"属性值B"]',
  '["属性值A"小于"属性值B"]',
  '[拼接`属性A`+"⾃定义字符串"]',
  '[替换`属性A`中的"men"为"male"]',
  '["值2"加"值1"]',
  '["值2"减"值1"]',
  '["值2"乘"值1"]',
  '["值2"除"值1"]',
  '[`属性值`中最大值]',
  '[`属性值`中最小值]',
  '[`属性值`总和]'
];
let selectCallback, selectorEle, editer;

main();

function main() {
  editer = new Editor('#editer',
    { type: 'expr', left: '[', right: ']', defaultText: '表达式...', change: propertySearch }, [
    { type: 'property', left: '`', right: '`', defaultText: '属性...' },
    { type: 'value', left: '"', right: '"', defaultText: '值...' },
  ]);
  editer.insert('["值"包含`属性`]');

  selectorEle = document.body.querySelector('#selector');
  selectorEle.addEventListener('click', selectExpr);
  fillResult(exprList);
}

function propertySearch(text, cb) {
  const result = exprList.filter(item => item.includes(text));
  if (result.length > 0) {
    fillResult(result);
    selectCallback = cb;
  }
}

function selectExpr(e) {
  if (e.target.tagName.toLowerCase() !== 'li') {
    return;
  }

  if (selectCallback) {
    selectCallback(e.target.textContent);
    fillResult(exprList);
    selectCallback = null;
  } else {
    editer.insert(e.target.textContent);
  }
}

function fillResult(result = []) {
  selectorEle.innerHTML = '';
  result.forEach(s => {
    const liEle = document.createElement('li');
    liEle.textContent = s;
    selectorEle.appendChild(liEle);
  });
}