### 脚本执行方式
- 通过文件路径执行：绝对路径 /home/xxx/hello.sh  相对路径 ./hello.sh ；前提条件：当前用户必须对文件有执行权限
- 通过解释器命令执行：bash hello.sh ; 该方式不需要文件有执行权限
- 通过source命令执行：source hello.sh ; 该方式和解释器命令执行的区别是：脚本在当前进程中执行不需要系统新建进程

### 变量声明赋值和使用
- 声明：declare [参数] <变量名> ; declare var1
- 赋值：<变量名>=<变量值> ; var1=value1
- 声明并赋值：<变量名>=<变量值> ; var1=value1
- 使用：$<变量名> ; echo  $var1
- 变量拼接：echo \$a\$b\$c

### 单引号、双引号、反引号
- 推荐大家在绝大部分场景下使用双引号来包裹字符内容 ； 比如变量赋值 ：address="Shanghai   China"
- 内容中有特殊字符比如$.. 如有原封不动完整输出时，才需要单引号 ; 比如输出内容：echo 'total  price $100'
- 希望将命令结果作为内容的一部分，可以把命令用反引号包裹，更推荐使用\$()；比如 echo -e "ls -ali: \n\n\`ls -ali\`"  等价于 echo -e "ls -ali: \n\n$(ls -ali)"

### 变量作用域范围
- 全局变量：默认类型，在当前进程中都可以访问；比如远程终端会话中声明的变量在整个会话中都可以访问，但是新开一个远程终端就无法访问，因为这两个终端对应了两个进程；如果脚本不是通过source方式执行，在脚本中声明的变量在整个脚本执行期间都可以访问
- 局部变量：只能在函数中可以访问，声明方式 function fn() {  local  var1=value1  }
- 环境变量：只能在父子进程中访问，声明方式 export <变量名> ; 注意进程之间必须存在继承关系，可以是子父关系，也可以是祖先关系

### 获取用户输入的内容
- read [参数] <变量名> 将用户输入的内容赋值给变量
- 参数 -s 隐藏用户输入的内容，类似输入密码的功能
- 参数 -t 限定用户输入的时间，超过时间自动结束命令
- 参数 -p 在用户输入内容前在控制台输出一些内容

### 特殊变量
- $0：执行当前脚本的文件名
- $n：n为大于0的整数，代表当前脚本或者函数的参数
- $#：脚本或者函数参数数量
- $*：将脚本或者函数的所有参数拼接而成的字符串
- $@：将脚本或者函数的所有参数保存在一个数组中
- $?：上一次命令/脚本退出状态码，或者函数返回值
- \$\$：当前进程号

### 流程控制
- if语句
```
if [[ $1 == “hello” ]]; then
...
fi
```
- if else 语句
```
if [[ $1 == "hello" ]]; then
...
else
...
fi
```
- if else if 语句
```
if [[ $1 == "hello" ]]; then
...
elif [[ $1 == "ni hao" ]]; then
...
fi
```
- if else if else 语句
```
if [[ $1 == "hello" ]]; then
...
elif [[ $1 =="ni hao" ]]; then
...
else
...
fi
```
[[ -* file ]]文件判断：-e 文件是否存在； -d 是否是目录； -f 是否是普通文件；-r 文件是否可读；-w 文件是否可写；-x 文件是否可执行；-s 文件是否有内容

[[ num1 ... num2]]数字比较：-gt 大于；-lt小于；-ge大于等于；-le 小于等于；-eq 等于；-ne 不等于

[[ $a = $b]] 判断变量是否相等；[[ $a ]] 相当于 [[ -n $a ]] 判断变量是否非空或者非0 ；[[ -z $a ]] 判断变量为空
- for in
```
for i in 1 2 4 5 6;do
echo "$i"
done

list="1 2 3 4 5 6"
for i in $list;do
echo "$i"
done

for filepath in filepath/*;do
echo "$filepath"
done

for file in $(ls);do
echo "$file"
done

for i in $*;do
echo "$i"
done
```
- for ...
```
for (( i = 0;i < 100;i ++ )) ;do
echo "$i"
done
```
- while
```
i=0
while (( i < 100 )); do
echo "$i"
i=$(($i + 1))
done
```

### 定义和使用函数
```
function hello ( ) {
  echo "hello $1"
}

hello test
```

### 数值计算
```
num=$((1 + 2))
```

### 命令替换
```
file=$(ls -al)
```

### 重定向符号
- 标准输入重定向  
```
代码为 0 ，使用 < 或 << ； /dev/stdin -> /proc/self/fd/0 
0代表：/dev/stdin

向一个文件添加多行内容
cat > a.txt << eof
aa
bb
cc
...
eof
```
- 标准输出重定向
```
代码为 1 ，使用 > 或 >> ； /dev/stdout -> /proc/self/fd/1 
1代表：/dev/stdout

ls -ali > list.txt
cat a.txt > b.txt
echo -e "hello\n你好" > file.log
```
- 标准错误输出重定向
```
代码为 2 ，使用 2> 或 2>> ； /dev/stderr -> /proc/self/fd/2 
2代表：/dev/stderr

ls -ali 2> list.txt
同时将错误输出和标准输出合并
ls -ali &> list.txt
```