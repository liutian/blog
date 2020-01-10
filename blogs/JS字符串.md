### 字符串
字符串中的每个字符默认占用2字节，当遇到特殊字符时占用4个字节
> 字符串表示方式 'a' '\a' '\141' '\x61' '\u0061' '\u{61}'



### Unicode字符集
`Unicode` 中的字符是一个抽象概念，每一个抽象字符都有一个对应的名称，例如 `LATIN SMALL LETTER A`，该抽象字符的图像表现形式是 `a`，Unicode的作用就是提供一个抽象字符列表，并给每一个字符分配一个独一无二的编号称作**码点**，同时将整个编码空间平均分为17个区域称作**平面**，每个平面可以保存  **65536** 个字符，第一个平面叫基本多文种平面 `BMP`，包含了大多数现代语言的字符，也是使用频率较高的字符，其他平面叫辅助平面。整个编码空间，码点范围 `U+000000` ～ `U+10FFFF`  


### 字符编码
字符编码就是用来规定如何将码点转换为二进制序列，以及如何将二进制序列解析为对应码点，最简单的字符编码就是UTF-32，一个字符永远占用4个字节，一次读取4个字节，然后将二进制直接转换为十六进制得到的就是对应字符的码点


### UCS-2字符编码
JS在创建之初采用的是 `UCS-2` 编码，它是一个已经废弃的 **定长编码**，始终使用两个字节编码BMP中的字符。对于非BMP中的字符，无法编码。


### UTF-16
`UTF16` 是 `UCS-2` 的一个扩展，是一个 **变长编码**，单个字符默认占用2个字节，也就是一次读取2个字节，遇到 `BMP` 中的字符只需要读取一次就可以确认一个字符，编码方式和 `UCS-2` 一致，而非 `BMP` 中的字符需要读取两次才能确认一个字符，采用 `Surrogate Pairs` 的技术来进行编码。  

在 `BMP` 中，并不是所有的码点都定义了字符，存在一个空白区，`0xD800` - `0xDFFF` 这个范围内的码点没有映射任何字符，`UTF-16` 编码就是利用这一特性确认是否需要连续读取两次来确认一个字符，具体方式是将辅助平面字符对应的码点转换为20位二进制数，并将20位二进制数拆分为两份分别存储在两个2字节中称作**代理对**，前一个10位二进制数存储在 `U+D800` 到 `U+DBFF` 中称为高位代理，后一个10位二进制数存储在 `U+DC00` 到 `U+DFFF` 中成为低位代理。`UTF-16` 一次读取2个字节，并试图将其转换为基本平面字符，当遇到一个码点在 `U+D800` 到 `U+DBFF` 范围中时，就可以断定得到的字符是辅助平面的字符，在接着读取2个字节，接下来的码点在 `U+DC00` 到 `U+DFFF` 之间。   

以特殊字符😜为例，码点为 `0x01F61C`，减去 `0x10000`，结果为 `0xF61C`，换成20位二进制数是 `0000_1111_0110_0001_1100`。将这20位分两部分保存在2个2字节中得到的结果是，高位代理：`1101_1000_0011_1101`，低位代理：`1101_1110_0001_1100`，转换为16进制便是 `0xD83D` `0xDE1C`，这就是😜的UTF16编码


### UTF-8
UTF-8也是变长编码，每次读取1个字节，编码规则如下：
- 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的 `Unicode` 码。因此对于英语字母，`UTF-8` 编码和 `ASCII` 码是相同的。
- 对于 `n` 字节的符号（n > 1），第一个字节的前 `n` 位都设为1，第n + 1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。
｜ Unicode符号范围     ｜ UTF-8编码方式｜
｜     ----           ｜----         ｜
｜0000 0000-0000 007F｜ 0xxxxxxx｜
｜0000 0080-0000 07FF｜110xxxxx 10xxxxxx｜
｜0000 0800-0000 FFFF｜1110xxxx 10xxxxxx 10xxxxxx｜
｜0001 0000-0010 FFFF｜11110xxx 10xxxxxx 10xxxxxx 10xxxxxx｜
具体规则如下，左边为码点范围，右边为二进制编码形式。   
`0x0000` – `0x007F`: `0xxx_xxxx`，使用一个字节，编码7位。   
`0x0080` – `0x07FF`: `110x_xxxx`, `10xx_xxxx`，使用两个字节，编码11位。   
`0x0800` – `0xFFFF`: `1110_xxxx`, `10xx_xxxx`, `10xx_xxxx`，使用三个字节编码16位。   
`0x10000` – `0x1FFFFF`: `1111_0xxx`, `10xx_xxxx`, `10xx_xxxx`, `10xx_xxxx`，使用四个字节，编码21位。  
还是以emoji😜为例，码点为`0x1F61C`，在区间`0x10000` - `0x1FFFFF`之中，需要使用四个字节进行编码。首先将其转换为二进制，填充为21位，结果是`0_0001_1111_0110_0001_1100`，然后将这21位按照上述说明填入，结果是 `1111_0000，1001_1111，1001_1000，1001_1100`，换成16进制便是 `0xF0` `0x9F` `0x98` `0x9C`，这就是😜的UTF8编码。  


### ASCII
`ASCII` 一共规定了128个字符的编码，比如空格 `SPACE` 是32（二进制`00100000`），大写的字母 `A` 是 `65`（二进制`01000001`）。这128个符号（包括32个不能打印出来的控制符号），只占用了一个字节的后面7位，最前面的一位统一规定为0


### JS使用哪种字符编码
`ECMAScript` 从一开始就规定字符串中的字符采用 `Unicode` 字符集进行存储和表示， `ES2015` 之前采用 `UCS-2` 编码（不支持辅助平面字符，因为当时还没有辅助平面字符），`ES2015` 之后采用 `UTF-16` 编码，`UCS-2` 是 `UTF-16` 子集。
> `ES2015` 规范提到源代码文本使用 `Unicode` 表示。尽管 `ECMAScript` 规范没有指明源码储存和交换的方式，但通常都以 `UTF-8` 编码（在web中推荐使用的编码）


### UTF-8 UTF-16 UTF-32比较
| 分类   | 优点                             | 缺点                                                   |
| ------ | -------------------------------- | ------------------------------------------------------ |
| UTF-8  | 适合以英文为主的文本适合网络传输 | 不适合非英文为主的文本                                 |
| UTF-16 | 适合大部分语言文本               | 有大小端排序问题不适合网络传输，以英文为主文本浪费空间 |
| UTF-32 | 编码简单                         | 不适合网络传输，有排序问题，以英文为主文本浪费空间     |


### 如何得到正确的字符串长度
- `[...'😜'].length`
- `Array.from('😜').length`


### 如何正确遍历字符串
`ES2015` 为字符串提供遍历接口，并且可以正确处理非 `BMP` 字符，传统 `for` 不会调用字符串遍历器接口，而且字符串的 `length` 无法识别非 `BMP`字符，所以无法正确遍历包含非 `BMP` 字符。通过 `for ... of` 或者 `Array.from` `[...str]` 可以调用遍历器从而正确遍历字符串


### 为何两个字符看起来一样比较时却不相等
es6引入了 **字符组合** 的概念，一个普通字符和修饰字符可以在视觉上组合成一个字符，常用来表示欧洲语言中语调符号和重音符号，例如：`Å` 该字符由两个编码单元组成 **\u0041\u030A** 前一个代表A字母，后一个代表语调符号。同时 `Unicode` 字符集又为这些字符组合形式提供了单独的合成字符，`Å` 对应的合成字符码点为 **\u212B**，这就造成来两个字符视觉上表现一致但是程序比较时不一致，因为比较操作针对的是字符 **码点**，为了解决该问题可以通过字符串的实例方法 **normalize** 该方法可以将视觉和语义相同但是码点不相同的字符转化为相同的码点
```
var first = '\u212B';         // "Å"
var second = '\u0041\u030A';  // "Å"

console.log(first + ' and ' + second + ' are' + ((first === second)? '': ' not') + ' the same.');

console.log(first + ' and ' + second + ' can' + ((first.normalize('NFC') === second.normalize('NFC'))? '': ' not') + ' be normalized');
```


### API备忘录
- 常用API：`split` `replace` `includes` `indexOf` `search` `startsWith` `endsWith` `padStart` `padEnd`  
- `codePointAt` `charCodeAt` 返回指定位置字符的码点，codePointAt可以识别辅助平面的字符，但是索引参数必须是字符的头一个位置，否则无法识别
- `String.fromCharCode` `String.fromCodePoint` 可以将unicode码点映射为字符，可以传多个参数最终返回一个字符串，每一个参数映射为一个字符
- `link` 用法 `'谷歌'.link('https://google.com')  ==>  <a href="https://google.com">谷歌</a>`
- `anchor` 用法 `'锚点在这里'.anchor('here') ==>  <a name="here">锚点在这里</a>`


### 标签模板
标签模板其实不是模板，而是函数调用的一种特殊形式。“**标签**”指的就是函数，紧跟在后面的模板字符串就是它的参数
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
- https://github.com/SamHwang1990/blog/issues/2