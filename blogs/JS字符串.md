### 字符串
JS字符串是一组由16位值组成的不可变有序序列，也就是最小单元为2字节。对字符串的各种操作最终都是在针对这些16位值，而**非字符**，例如：'😂'.length === 2


### Unicode字符集
Unicode中的字符是一个抽象概念，每一个抽象字符都有一个对应的名称，例如LATIN SMALL LETTER A，该抽象字符的图像表现形式是a，Unicode的作用就是提供一个抽象字符列表，并给每一个字符分配一个独一无二的编号称作**码点**，同时将整个编码空间平均分为17个区域称作**平面**，每个平面可以保存65536个字符，第一个平面叫基本多文种平面（BMP），包含了大多数现代语言的字符，也是使用频率较高的字符，其他平面叫辅助平面。整个编码空间，码点范围U+000000～U+10FFFF。   


### 字符编码
字符编码就是用来规定如何将码点转换为二进制序列，以及如何将二进制序列解析为对应码点，最简单的字符编码就是UTF-32，一次读取4个字节，然后将二进制直接转换为十六进制得到的就是对应字符的码点


### UCS-2
UCS-2是一个已经废弃的定长编码，始终使用两个字节编码BMP中的字符。对于非BMP中的字符，UCS-2无法编码。JS在创建之初采用的是UCS-2编码


### UTF-16
UTF16是UCS-2的一个扩展，是一个变长编码，每次读取2个字节，BMP中的字符只需要读取一次就可以确认一个字符，编码方式和UCS-2一样，而非BMP中的字符需要读取两次才能确认一个字符，采用Surrogate Pairs的技术来进行编码。  
在BMP中，并不是所有的码点都定义了字符，存在一个空白区，0xD800 - 0xDFFF这个范围内的码点没有映射任何字符，UTF-16编码就是利用这一特性保存辅助平面字符，具体方式是将辅助平面字符对应的码点转换为20位二进制数，并将20位二进制数拆分为两份分别存储在两个2字节中称作**代理对**，前一个10位二进制数存储在U+D800到U+DBFF中称为高位代理，后一个10位二进制数存储在U+DC00到U+DFFF中成为低位代理。UTF-16一次读取2个字节，并试图将其转换为基本平面字符，当遇到一个码点在U+D800到U+DBFF范围中时，就可以断定得到的字符是辅助平面的字符，在接着读取2个字节，接下来的码点在U+DC00到U+DFFF之间。   
以emoji😜为例，码点为0x01F61C，减去0x10000，结果为0xF61C，换成20位二进制数是0000_1111_0110_0001_1100。将这20位分两部分保存在2个2字节中得到的结果是，高位代理：1101_1000_0011_1101，低位代理：1101_1110_0001_1100，转换为16进制便是0xD83D 0xDE1C，这就是😜的UTF16编码


### JS使用哪种字符编码
ECMAScript规范采用Unicode字符集，但是在es6之前采用UCS-2编码不支持辅助平面字符（当时还没有辅助平面字符），es6之后采用UTF-16编码，UCS-2是UTF-16子集。
> ES2015规范提到源代码文本使用Unicode表示。尽管ECMAScript规范没有指明源码储存和交换的方式，但通常都以UTF-8编码（在web中推荐使用的编码）


### UTF-8
UTF-8也是变长编码，每次读取1个字节，编码规则如下：
- 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。
- 对于n字节的符号（n > 1），第一个字节的前n位都设为1，第n + 1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。
｜ Unicode符号范围     ｜ UTF-8编码方式｜
｜     ----           ｜----         ｜
｜0000 0000-0000 007F｜ 0xxxxxxx｜
｜0000 0080-0000 07FF｜110xxxxx 10xxxxxx｜
｜0000 0800-0000 FFFF｜1110xxxx 10xxxxxx 10xxxxxx｜
｜0001 0000-0010 FFFF｜11110xxx 10xxxxxx 10xxxxxx 10xxxxxx｜
具体规则如下，左边为码点范围，右边为二进制编码形式。   
0x0000 – 0x007F: 0xxx_xxxx，使用一个字节，编码7位。   
0x0080 – 0x07FF: 110x_xxxx, 10xx_xxxx，使用两个字节，编码11位。   
0x0800 – 0xFFFF: 1110_xxxx, 10xx_xxxx, 10xx_xxxx，使用三个字节编码16位。   
0x10000 – 0x1FFFFF: 1111_0xxx, 10xx_xxxx, 10xx_xxxx, 10xx_xxxx，使用四个字节，编码21位。  
还是以emoji😜为例，码点为0x1F61C，在区间0x10000 - 0x1FFFFF之中，需要使用四个字节进行编码。首先将其转换为二进制，填充为21位，结果是0_0001_1111_0110_0001_1100，然后将这21位按照上述说明填入，结果是1111_0000，1001_1111，1001_1000，1001_1100，换成16进制便是0xF0 0x9F 0x98 0x9C，这就是😜的UTF8编码。  


### ASCII
ASCII一共规定了128个字符的编码，比如空格SPACE是32（二进制00100000），大写的字母A是65（二进制01000001）。这128个符号（包括32个不能打印出来的控制符号），只占用了一个字节的后面7位，最前面的一位统一规定为0


### 如何得到正确的字符串长度
`[...'😜'].length` 或者 `Array.from('😜').length`  这两种方式都会使用到字符串迭代器，而字符串迭代器能够正确识别Unicode字符  
```
var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; 
 
function countSymbols(string) {
  // 把代理对改为一个BMP的字符.
  return string.replace(regexAstralSymbols, '_').length;
}

countSymbols('😜'); 
```


### 为何两个字符看起来一样比较时却不相等
es6引入了**字符组合**的概念，一个普通字符和修饰字符可以在视觉上组合成一个字符，常用来表示欧洲语言中语调符号和重音符号，例如：Å 该字符由两个编码单元组成 **\u0041\u030A** 前一个代表A字母，后一个代表语调符号。同时Unicode字符集又为这些字符组合形式提供了单独的合成字符，Å对应的合成字符码点为 **\u212B**，这就造成来两个字符视觉上表现一致但是程序比较时不一致，因为比较操作针对的是字符**码点**，为了解决该问题可以通过字符串的实例方法 **normalize** 该方法可以将视觉和语义相同但是码点不相同的字符转化为相同的码点
```
var first = '\u212B';         // "Å"
var second = '\u0041\u030A';  // "Å"

console.log(first + ' and ' + second + ' are' + ((first === second)? '': ' not') + ' the same.');

console.log(first + ' and ' + second + ' can' + ((first.normalize('NFC') === second.normalize('NFC'))? '': ' not') + ' be normalized');
```


### 字符串表示方式
'a' '\a' '\141' '\x61' '\u0061' '\u{61}'


### 如何正确遍历字符串
es6为字符串提供遍历接口，并且可以正确处理非BMP字符，传统for不会调用字符串遍历器接口，所以无法正确遍历包含非BMP字符。通过for ... of 或者 Array.from 可以调用遍历器从而正确遍历字符串


### API备忘录
- **charAt** 可以返回指定位置的字符
- **link** `'谷歌'.link('https://google.com')  ==>  <a href="https://google.com">谷歌</a>`
- **anchor** `'锚点在这里'.anchor('here') ==>  <a name="here">锚点在这里</a>`
- **includes**  **startsWith**  **endsWith**  **padStart** **padEnd**
- **codePointAt** **charCodeAt** 返回指定位置字符的码点，codePointAt可以识别辅助平面的字符，但是索引参数必须是字符的头一个位置，否则无法识别
- **String.fromCharCode** **String.fromCodePoint** 可以将unicode码点映射为字符，可以传多个参数最终返回一个字符串，每一个参数映射为一个字符


### 标签模板
标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数
```
let name = 'tom';
let age = 10;

function say(word){
  console.log('raw world:' + word.raw);
}

say`name: ${name} age: ${age}`
// 等价于
say(['name: ',' age: '],name,age);
```


### 通过标签模版来实现过滤html字符串恶意字符
```
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
```


### 使用模版字符串来实现一个模版编译器
```
function compile(template) {
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  template = template
  .replace(evalExpr, '`); \n echo( $1 ); \n echo(`')
  .replace(expr, '`); \n $1 \n echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";

    function echo(html){
      output += html;
    }

    ${ template}

    return output;
  })`;

  return script;
}

let template = `
  <ul>
    <% for(let i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
    <% } %>
  </ul>
`;

let parse = eval(compile(template));

parse({ supplies: ["broom", "mop", "cleaner"] });
```

### 扩展资源
- https://home.unicode.org/
- https://codepoints.net/