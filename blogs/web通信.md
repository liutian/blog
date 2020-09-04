### Fetch API 
fetch基于promise，支持async/await，语法简洁，更语义化，缺点：
- fetch只对网络错误报错，http状态码错误不报错
- fetch不支持abort，无法终止
- fetch不支持超时控制，使用setTimeout和Promise.reject实现的超时控制不能阻止请求过程继续在后台运行，造成了流量的浪费
- fetch没有原生检测请求进度的方式，XHR可以
- 默认情况下fetch不发送cookie，除非手动配置