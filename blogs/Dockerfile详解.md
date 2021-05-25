### FROM 指定基础镜像

Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令

```
FROM <image>:<tag>
```

如果 tag 没有选择，默认为 latest

除了选择现有镜像为基础镜像外，Docker 还存在一个特殊的镜像，名为 scratch。这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。如果你以 scratch 为基础镜像的话，意味着你不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在

### LABEL 设置镜像元数据

使用 LABEL 指令，可以为镜像设置元数据，例如镜像创建者或者镜像说明。旧版的 Dockerfile 语法使用 MAINTAINER 指令指定镜像创建者，但是它已经被弃用了

LABEL 命令语法：

```
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```

```
LABEL maintainer="cerberus43@gmail.com" \
version="1.0" \
description="This is a test dockerfile"
```

说明：LABEL 会继承基础镜像种的 LABEL，如遇到 key 相同，则值覆盖

### RUN 运行命令

```
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html

RUN ["可执行文件", "参数1", "参数2"]
```

注意：多行命令不要写多个 RUN，原因是 Dockerfile 中每一个指令都会建立一层，多少个 RUN 就构建了多少层镜像，会造成镜像的臃肿、多层，不仅仅增加了构件部署的时间，还容易出错。

### COPY 复制文件

```
COPY [--chown=<user>:<group>] <源路径>... <目标路径>

COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]
```

- 目标路径可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 WORKDIR 指令来指定）
- 目标路径不需要事先创建，如果目录不存在会在复制文件前先行创建缺失目录
- 使用 COPY 指令，源文件的各种元数据都会保留。比如读、写、执行权限、文件变更时间等。

<源路径>可以是多个，甚至可以是通配符，其通配符规则要满足 Go 的 filepath.Match 规则，如：

```
COPY hom* /mydir/

COPY hom?.txt /mydir/
```

在使用该指令的时候还可以加上 –chown= : 选项来改变文件的所属用户及所属组。

```
COPY --chown=devuser:devgroup files* /mydir/
```

### ADD 更高级的复制文件

解压压缩文件并把它们添加到镜像中

```
WORKDIR /app
ADD nginx.tar.gz .
```

因此在 COPY 和 ADD 指令中选择的时候，可以遵循这样的原则，所有的文件复制均使用 COPY 指令，仅在需要自动解压缩的场合使用 ADD。

### WORKDIR 指定工作目录

使用 WORKDIR 指令可以来指定工作目录（或者称为当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，WORKDIR 会帮你建立目录。

### ENV 指定容器的环境变量

使用 ENV 指令，可以设置环境变量，无论是后面的其它指令，如 RUN，还是运行时的应用，都可以直接使用这里定义的环境变量

### ARG 指定 Dockerfile 中的环境变量

```
ARG <name>[=<default value>]
```

ARG 指令定义了一个变量，用户可以在构建时使用 docker build 命令使用 `--build-arg <varname>=<value>` 标志将其传递给构建器。如果用户指定了未在 Dockerfile 中定义的构建参数，则构建会输出警告

### CMD 指定镜像启动时的命令

CMD 给出的是一个容器的默认的可执行体。也就是容器启动以后，默认的执行的命令。重点就是这个默认。意味着，如果 docker run 没有指定任何的执行命令或者 Dockerfile 里面也没有 ENTRYPOINT，那么，就会使用 CMD 指定的默认的执行命令执行。同时也从侧面说明了 ENTRYPOINT 的含义，它才是真正的容器启动以后要执行命令。

所以这句话就给出了 CMD 命令的一个角色定位，它主要作用是默认的容器启动执行命令。（注意不是“全部”作用）

这也是为什么大多数网上博客论坛说的“CMD 会被覆盖”，其实为什么会覆盖？因为 CMD 的角色定位就是默认，如果你不额外指定，那么就执行 CMD 的命令，否则呢？只要你指定了，那么就不会执行 CMD，也就是 CMD 会被覆盖。

比如，ubuntu 镜像默认的 CMD 是 /bin/bash，如果我们直接 docker run -it ubuntu 的话，会直接进入 bash。我们也可以在运行时指定运行别的命令，如 docker run -it ubuntu cat /etc/os-release。这就是用 cat /etc/os-release 命令替换了默认的 /bin/bash 命令了，输出了系统版本信息

```
CMD ["executable","param1","param2"] (exec form, this is the preferred form)	#exec格式，首选方法

CMD ["param1","param2"] (as default parameters to ENTRYPOINT)	#为ENTRYPOINT传参用法

CMD command param1 param2 (shell form)	#shell格式
```

在指令格式上，一般推荐使用 exec 格式，这类格式在解析时会被解析为 JSON 数组，因此一定要使用双引号 "，而不要使用单引号。

如果使用 shell 格式的话，实际的命令会被包装为 sh -c 的参数的形式进行执行。比如 `MD echo $HOME` 在实际执行中，会将其变更为： `CMD [ "sh", "-c", "echo $HOME" ]` 这就是为什么我们可以使用环境变量的原因，因为这些环境变量会被 shell 进行解析处理

Docker 不是虚拟机，容器中的应用都应该以前台执行，而不是像虚拟机、物理机里面那样，用 systemd 去启动后台服务，容器内没有后台服务的概念。

### ENTRYPOINT 指定容器入口命令

ENTRYPOINT 才是正统地用于定义容器启动以后的执行体的，其实我们从名字也可以理解，这个是容器的“入口”。

```
ENTRYPOINT ["executable", "param1", "param2"] (exec form, preferred)	#exec格式，首选方法

ENTRYPOINT command param1 param2 (shell form)	#shell格式
```

先看 exec 命令行模式，也就是带中括号的。如果 docker run 命令后面有东西，那么后面的全部都会作为 ENTRYPOINT 的参数。如果 docker run 后面没有额外的东西，但是 CMD 有，那么 CMD 的全部内容会作为 ENTRYPOINT 的参数，这同时是 CMD 的第二种用法。这也是网上说的 ENTRYPOINT 不会被覆盖。当然如果要在 docker run 里面覆盖，也是有办法的，使用--entrypoint 即可。

```
FROM alpine

ENTRYPOINT ["echo"]

CMD ["CMD"]
```

```
docker build -t entrypoint-test:v1 .

#会打印出CMD中定义的输出“CMD”
docker run --rm entrypoint-test:v1
$CMD

#会打印出docker run中传入的“docker run”覆盖CMD中的定义
docker run --rm entrypoint-test:v1 docker run
$docker run
```

第二种是 shell 模式的。在这种模式下，任何 docker run 和 CMD 的参数都无法被传入到 ENTRYPOINT 里。所以官网推荐第一种用法。

```
FROM alpine

ENTRYPOINT echo

CMD ["CMD"]
```

```
docker build -t entrypoint-test:v2 .

#不会打印出CMD中定义的“CMD”
docker run --rm entrypoint-test:v2
$

#不会打印出docker run中传入的“docker run”
docker run --rm entrypoint-test:v2 docker run
$
```

一般还是会用 ENTRYPOINT 的中括号形式作为 docker 容器启动以后的默认执行命令，里面放的是不变的部分，可变部分比如命令参数可以使用 CMD 的形式提供默认版本，也就是执行 docker run 里面没有任何参数时使用的默认参数。如果我们想用默认参数，就直接 docker run，如果想用其他参数，就在 docker run 后面加想要的参数。

### EXPOSE 暴露端口

EXPOSE 指令是声明运行时容器提供服务端口，这只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务

### VOLUME 定义匿名卷

为了防止运行时用户忘记将动态文件所保存目录挂载为卷，在 Dockerfile 中，我们可以事先指定某些目录挂载为匿名卷，这样在运行时如果用户不指定挂载，其应用也可以正常运行，不会向容器存储层写入大量数据

### ONBUILD

当我们在一个 Dockerfile 文件中加上 ONBUILD 指令，该指令对利用该 Dockerfile 构建镜像（A 镜像）不会产生实质性影响。

但是当我们编写一个新的 Dockerfile 文件来基于 A 镜像构建一个镜像（比如为 B 镜像）时，这时构造 A 镜像的 Dockerfile 文件中的 ONBUILD 指令就生效了，在构建 B 镜像的过程中，首先会执行 ONBUILD 指令指定的指令，然后才会执行其它指令。

利用 ONBUILD 指令,实际上就是相当于创建一个模板镜像，后续可以根据该模板镜像创建特定的子镜像，需要在子镜像构建过程中执行的一些通用操作就可以在模板镜像对应的 Dockerfile 文件中用 ONBUILD 指令指定。 从而减少 Dockerfile 文件的重复内容编写。

### Dockerfile 最佳实践

#### 理解上下文 context

如果注意，会看到 docker build 命令最后有一个.。.表示当前目录，而 Dockerfile 就在当前目录，因此不少人以为这个路径是在指定 Dockerfile 所在路径，这么理解其实是不准确的。如果对应上面的命令格式，你可能会发现，这是在指定上下文路径 context。那么什么是上下文呢？

首先我们要理解 docker build 的工作原理。Docker 在运行时分为 Docker 引擎（也就是服务端守护进程）和客户端工具。Docker 的引擎提供了一组 REST API，被称为 Docker Remote API，而如 docker 命令这样的客户端工具，则是通过这组 API 与 Docker 引擎交互，从而完成各种功能。因此，虽然表面上我们好像是在本机执行各种 docker 功能，但实际上，一切都是使用的远程调用形式在服务端（Docker 引擎）完成。也因为这种 C/S 设计，让我们操作远程服务器的 Docker 引擎变得轻而易举。

当我们进行镜像构建的时候，并非所有定制都会通过 RUN 指令完成，经常会需要将一些本地文件复制进镜像，比如通过 COPY 指令、ADD 指令等。而 docker build 命令构建镜像，其实并非在本地构建，而是在服务端，也就是 Docker 引擎中构建的。那么在这种客户端/服务端的架构中，如何才能让服务端获得本地文件呢？

这就引入了上下文的概念。当构建的时候，用户会指定构建镜像上下文的路径，docker build 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎。这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件。如果在 Dockerfile 中这么写：

```
COPY ./package.json /app/
```

这并不是要复制执行 docker build 命令所在的目录下的 package.json，也不是复制 Dockerfile 所在目录下的 package.json，而是复制 上下文（context） 目录下的 package.json。

因此，COPY 这类指令中的源文件的路径都是相对路径。这也是初学者经常会问的为什么 COPY ../package.json /app 或者 COPY /opt/xxxx /app 无法工作的原因，因为这些路径已经超出了上下文的范围，Docker 引擎无法获得这些位置的文件。如果真的需要那些文件，应该将它们复制到上下文目录中去。

现在就可以理解刚才的命令 docker build -t nginx:v3 .中的这个.，实际上是在指定上下文的目录，docker build 命令会将该目录下的内容打包交给 Docker 引擎以帮助构建镜像。

理解构建上下文对于镜像构建是很重要的。context 过大会造成 docker build 很耗时，镜像过大则会造成 docker pull/push 性能变差以及运行时容器体积过大浪费空间资源。

一般来说，应该会将 Dockerfile 置于一个空目录下，或者项目根目录下。如果该目录下没有所需文件，那么应该把所需文件复制一份过来。如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 .gitignore 一样的语法写一个.dockerignore，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。

那么为什么会有人误以为 . 是指定 Dockerfile 所在目录呢？这是因为在默认情况下，如果不额外指定 Dockerfile 的话，会将上下文目录下的名为 Dockerfile 的文件作为 Dockerfile。

这只是默认行为，实际上 Dockerfile 的文件名并不要求必须为 Dockerfile，而且并不要求必须位于上下文目录中，比如可以用-f ../Dockerfile.php 参数指定某个文件作为 Dockerfile。

#### 使用多段构建

在多阶段构建下，你可以在 Dockerfile 中使用多个 FROM 声明，每个 FROM 声明可以使用不同的基础镜像， 并且每个 FROM 都使用一个新的构建阶段。你可以选择性的将文件从一个阶段复制到另一个阶段， 删除你不想保留在最终镜像中的一切。我们来调整上面的 Dockerfile 以使用多阶段构建做个示例。

```
FROM golang:1.7.3
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN go get -d -v golang.org/x/net/html
COPY app.go .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=0 /go/src/github.com/alexellis/href-counter/app .
CMD ["./app"]
```

你只需要一个 Dockerfile 文件即可，也不需要单独的构建脚本，只需要运行 docker build。

最终的结果是与前面一样的极小的结果，但是复杂性大大降低，你不需要创建任何中间镜像， 也根本不需要将任何文件提取到本地系统。

它是如何工作的？第二个 FROM 指令使用 alpine:latest 镜像作为基础开始一个新的构建阶段， COPY --from=0 的行将前一个阶段的结果复制到新的阶段，GO SDK 及所有中间产物被抛弃，并没有保存在最终镜像中。

默认情况下，构建阶段没有命名，使用它们的整数编号引用它们，从第一个 FORM 以 0 开始计数。 但是你可以使用给 FORM 指令添加一个 as <NAME>为其构建阶段命名。

```
FROM golang:1.7.3 as builder
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN go get -d -v golang.org/x/net/html
COPY app.go    .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /go/src/github.com/alexellis/href-counter/app .
CMD ["./app"]
```

#### 构建缓存

在镜像的构建过程中 docker 会遍历 Dockerfile 文件中的所有指令，顺序执行。对于每一条指令，docker 都会在缓存中查找是否已存在可重用的镜像，否则会创建一个新的镜像

我们可以使用 docker build --no-cache 跳过缓存

ADD 和 COPY 将会计算文件的 checksum 是否改变来决定是否利用缓存
RUN 仅仅查看命令字符串是否命中缓存，如 RUN apt-get -y update 可能会有问题
如一个 node 应用，可以先拷贝 package.json 进行依赖安装，然后再添加整个目录，可以做到充分利用缓存的目的。

```
FROM node:10-alpine as builder

WORKDIR /code

ADD package.json /code
# 此步将可以充分利用 node_modules 的缓存
RUN npm install --production

ADD . /code

RUN npm run build
```
