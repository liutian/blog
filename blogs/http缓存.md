# http缓存

浏览器在请求时不会带上If-Modified-Since，并带上Cache-Control:no-cache和Pragma:no-cache，这是为了告诉服务端说我请给我一份最新的内容。


<META HTTP-EQUIV="Pragma" CONTENT="no-store">


强缓存和协商缓存。强缓存如果命中缓存不需要和服务器端发生交互，而协商缓存不管是否命中都要和服务器端发生交互，强制缓存的优先级高于协商缓存。具体内容下文介绍