在了解噪声之前，我对随机的认识，仅仅停留在 Math.random。它很有用，比如 H5 里的简单抽奖程序，或者随机选取一张卡片... 而最近工作中需要实现一些的随机图像效果，让我发现这个函数能做的事十分有限。之后我偶然了解到噪声这一种随机形式，它很完美的解决了我的问题。于是我想写这一篇文章，希望可以让一些前端同学，特别是工作上涉及较多效果还原的前端同学了解噪声，或许在这之后，你会对设计师设计稿上这些随意元素，有更多的想法。

设计师经常会在他们的设计中添加一些随意元素，这是一种很棒的设计技巧。但是对于前端实现来说，这类设计元素的还原大多数情况会让我们感到无能为力，因为基础 Api 提供的都是规律的几何形状（圆，矩形等...），常常最后，这些效果都只好妥协使用切图还原，我们不能做更多优化，更不能通过增加动画表现更多的设计想法，这一直是大多数同学前端还原的空白领域。

![设计稿中的随意元素](http://km.oa.com/files/photos/pictures//20190701//1561967450_40.png)

上面这些图片都是从一些真实设计稿中截取的，其中很容易找到我所说的随机元素，它们给设计增添神秘感和科技感，但是它们好像很难用传统的前端设计还原技巧制作。而这些，恰恰非常适合使用噪声来实现。

噪声算法经过多年发展已经非常成熟，而且有很多种分类 Perlin噪声， Simplex噪声，Wavelet噪声，本篇文章里边出现的噪声默认指的是 Perlin 噪声，不会深入介绍具体噪声算法，主要目的是向没有接触过这个领域的前端同学作一个启发式的介绍。

## 随机的线
先来解决一个简单的问题：画出一根随意的线。这似乎很简单，我们用 Math.random 生成一系列的点，然后把他们连接起来

![随机线1](http://km.oa.com/files/photos/pictures//20190701//1561917496_24.png)

```javascript
for (let i = 0; i < POINTCOUNT; i++) {
  const y = HEIGHT / 2 + (Math.random() - 0.5) * 2 * MAXOFFSET;
  const point = {
    x: i * STEP,
    y
  };
  POINTS.push(point);
}
...
ctx.moveTo(POINTS[0].x, POINTS[0].y);

for (let i = 1; i < POINTS.length; i++) {
  const point = POINTS[i];
  ctx.lineTo(point.x, point.y);
}
ctx.stroke();
```

但是这没有什么特别的，像是刻意画出来的折线图。直线让我们的图像很生硬，下面我们做点小改良，我们在两个随机点间找两个控制点，用贝塞尔曲线再次将随机点连起来：

![随机线2](http://km.oa.com/files/photos/pictures//20190630//1561904983_50.png)

```javascript
for (let i = 0; i < POINTS.length - 1; i++) {
  const point = POINTS[i];
  const nextPoint = POINTS[i + 1];

  ctx.bezierCurveTo(
    controlPoints[i][1].x, 
    controlPoints[i][1].y, 
    controlPoints[i + 1][0].x, 
    controlPoints[i + 1][0].y,
    nextPoint.x,
    nextPoint.y
  );
}
ctx.stroke();
```
这次自然多了，我们这一步做的事情很关键，虽然这不是噪声算法的本身，但是其中的思想是一样的。上面例子的随机点，我们可以理解为随机特征，单个随机特征是没有意义的。之后我们用直线连接起来，它们整体看起来依然没有联系，但是我们将他们平滑地串联起来之后，它们互相之前形成了一个完整的图案，得到了一种自然的随机效果。这也是我学习完噪声的主观理解——噪声主要解决的问题，就是让互不相关的随机特征，产生某种平滑地过渡或联系。

好，到这里我们停下来，想想大自然，放松一下。想想云、河流、山脉... 这些、都是大自然里各种随机事件，日积月累创造出来的。这里的关键，就是“日积月累”，也就是说不会平白无故地出现一片云、不会突然就出现一条河，他们都是一点一点演变而来的，所以在这些随机事件中是“平滑”变换的。

## 柏林噪声

在现代游戏和影视作品中，已经有能力逼真地还原这些自然元素了。它们并不是也不可能使用大量建模软件制作，而是用代码生成的，这里用到的关键技术，就是噪声算法。这种算法重要的部分，就是在随机特征中的插值算法，在随机特征中间的值能平滑过度，以模拟大自然中这种演变的结果。

Ken Perlin 早在1983年正在参与制作迪士尼的动画电影《TRON》，就是为了实现这种自然的纹理效果，提出了 Perlin 噪声，Perlin 噪声很成功，他也因此获得了奥斯卡科技成果奖。

我们上面例子为了在随机特征间平滑过度使用了贝塞尔曲线，而柏林噪声则使用了更加科学复杂的插值方法：

```
f(t)=t*t*t*(t*(t*6-15)+10)
```

有兴趣可以自行查阅其中实现细节。柏林噪声经过发展演变出了很多变形实现，包括后来柏林噪声的优化版本 simplex 噪声，本文侧重于介绍噪声的使用，下文其中一些实现，默认使用就是柏林噪声。

## 噪声函数的使用

噪声函数的使用方法都是接受一个点，然后返回一个 -1 到 1 的结果，随机特征长度单位为 1，所以在使用噪声函数之前，需要注意单位的转换。
比如，你有一个 1000 x 1000 的画布，想要使用噪声对应每个像素的随机值，那就首先就要定义想应用多少个随机方格，如果应用 n x n 个方格，那在获取随机值之前，就需要对坐标进行转换

```
scale = 1000 / n;

nx = x / scale;
ny = y / scale;

pointRandom = noise2D(nx, ny);
```

js 实现的噪声工具：
[https://github.com/josephg/noisejs](https://github.com/josephg/noisejs)
[https://github.com/jwagner/simplex-noise.js](https://github.com/jwagner/simplex-noise.js)

## 随机集
噪声接受相同的参数总是能返回相同的结果，所以通常要预设一个随机集，目的就是为了生成固定的随机特征点，然后平滑的随机结果将在这些随机特征点中插值产生。当中的实现不做讨论，有些噪声工具默认已经设置好了一个随机集，也可以自定义不同的种子来生成不同的随机效果，上一个噪声工具 noisejs 可以这样简单定义即可：

```javascript
noise.seed(Math.random());
```

## 一维噪声
一维噪声可以这样简单理解，将随机集分配到 x 轴上整数位上，通过平滑插值函数计算连续变换的随机值。这个说法可能和具体 Perlin 噪声不完全一样，但是基本思路可以这样简单理解

![一维噪声](http://km.oa.com/files/photos/pictures//20190701//1561915204_58.png)

简单从结果上来讲就是给定一个坐标，你将得到一个随机值，如果给定连续的坐标，你将可以得到连续的随机值，而不是像 Math.random() 那样得到互不相关的错落的值。

### 一维噪声示例
下面的例子是使用一维噪声制作的一个鸡蛋的效果，先在圆上取固定的等分的点，它们分别通过 noise 获取到一个随机偏移，然后再结合时间，让偏移随着时间平滑地改变：

[https://codepen.io/chiunhauyou/pen/LkjvYw](https://codepen.io/chiunhauyou/pen/LkjvYw)

![egg](http://km.oa.com/files/photos/pictures//20190701//1561918259_86.png)

比如下面这个火的效果，火焰尾部摇曳的效果的偏移，就是一维噪声结合时间偏移实现的

[https://codepen.io/gnauhca/pen/wxKMEg](https://codepen.io/gnauhca/pen/wxKMEg)

![fire](http://km.oa.com/files/photos/pictures//20190630//1561905144_41.png)

一维噪声这种随时间偏移的效果，还可以通过把时间作为二维噪声函数的 y 参数实现。

## 二维噪声
二维噪声通过定义一个二维的方格，上一步定义的固定的随机集会被分布在这些方格顶点上，而每一个顶点的随机特征是一个梯度向量，然后，计算方格内的点周围四个顶点到方格内一个点（也就是需要求噪声值的点，下图中黄色的点）的向量，用他们与梯度向量点乘，最后使用插值函数进行插值得到该点对应的随机噪声值。

![二维噪声1](http://km.oa.com/files/photos/pictures//20190630//1561905202_91.png)


下面图像是使用 webGL 应用 2D 噪声函数生成的，白色代表 1，黑色代表 -1，这是 5 * 5 方格的效果。这里不用关心 webgl，我们只要关心如何定义适用自己问题的方格，还有获取对应的连续的随机值。

![二维噪声2](http://km.oa.com/files/photos/pictures//20190630//1561905236_71.png)


这里侧重的是介绍噪声使用，具体实现方法可以自己点击下面参考链接了解。使用方法很简单：

```javascript
// 这里除 100 是为了以一百个像素为单位应用一个噪声方格
let randomValue = noise.simplex2(x / 100, y / 100); 
```

### 二维噪声示例
噪声函数获取的随机值就很自由了，它可以用来定义各种你需要的变量，比如下面这个例子，平滑地随机值被用作定义粒子的速度向量从而实现既随机又连续的运动效果：

```javascript
function calculateField() {
  for(let x = 0; x < columns; x++) {
    for(let y = 0; y < rows; y++) {
      let angle = noise.simplex3(x/20, y/20, noiseZ) * Math.PI * 2;
      let length = noise.simplex3(x/40 + 40000, y/40 + 40000, noiseZ) * 0.5;
      field[x][y].setLength(length);
      field[x][y].setAngle(angle);
    }
  }
}
```
>生成向量一个随机角度，和向量长度，这里使用 simplex3 三维噪声实际上第三个参数是被用作二维的偏移量

[https://codepen.io/DonKarlssonSan/pen/aLRVbw](https://codepen.io/DonKarlssonSan/pen/aLRVbw)

![二维噪声示例1](http://km.oa.com/files/photos/pictures//20190630//1561905258_38.png)

如果保留运动痕迹，则可以得到更炫酷的效果

```javascript
// 使用半透明清楚画布
function drawBackground(alpha) {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha || 0.07})`;
  ctx.fillRect(0, 0, w, h);
}
```

[https://codepen.io/DonKarlssonSan/pen/QqzWYj](https://codepen.io/DonKarlssonSan/pen/QqzWYj)

![二维噪声示例2](http://km.oa.com/files/photos/pictures//20190630//1561905272_18.png)


### 二维噪声示例（svg）
通过把几个不同频率的 Perlin 噪声相叠加，这项技术叫做分形噪声，可以实现更多纹理，比如水流，山川。
SVG 中有一个这种噪声的滤镜应用，feTurbulence，对比普通我们熟知的 css 滤镜，它很容易被人忽略，但是它却能实现很多意想不到的效果：

```html
<feTurbulence type="turbulence" baseFrequency="0.01 .1" numOctaves="1" result="turbulence" seed="53" />
```

* numOctaves 噪声叠加数
* seed 随机种子
* type 噪声类型

feTurbulence 实际上是在每个像素上应用得到的噪声值，从而得到颜色值，然后可以结合其他滤镜，将这些随机颜色转换成其他随机表现，如像素偏移，可以使用 feTurbulence 滤镜实现一些自然纹理，还有倒影效果。

![feTurbulence 滤镜输出](http://km.oa.com/files/photos/pictures//20190630//1561908644_68.png)


[https://codepen.io/yoksel/pen/yqZYbK](https://codepen.io/yoksel/pen/yqZYbK)

![二维噪声示例（svg）](http://km.oa.com/files/photos/pictures//20190630//1561905295_31.png)


[https://wow.techbrood.com/fiddle/31650](https://wow.techbrood.com/fiddle/31650)


![二维噪声示例（svg）2](http://km.oa.com/files/photos/pictures//20190701//1561916408_64.png)

> 这里的噪声叠加在频率和振幅上有一定的约束，它们是自相似的，参考[https://thebookofshaders.com/13](https://thebookofshaders.com/13)

## 三维噪声

三维噪声实际上就只是在二维噪声基础上又增加一个纬度，定义一个三维的随机顶点集，在三维方格当中的三维坐标，将会对应得到一个噪声值，同样也是连续的。

三维噪声获取的随机值可以转换成一个三维点在其法向向量方向的偏移，从而实现一种随机的起伏变形。在 webGL 当中，这一步这通常在顶点着色器当中完成，顶点着色器会对所有定义的顶点执行：

```c
float addLength = maxLength * cn(normalize(position) * 2.9 + time * 0.9); // 计算随机值
vec3 newPosition = position + normal * addLength; // 转换为法向向量方向上的偏移值
```
[https://codepen.io/gnauhca/pen/RyNZBx?](https://codepen.io/gnauhca/pen/RyNZBx?)

![三维噪声1](http://km.oa.com/files/photos/pictures//20190630//1561905334_92.png)

在片元着色器中，则可以应用使用噪声制作纹理：

[https://codepen.io/timseverien/pen/bWXvxE](https://codepen.io/timseverien/pen/bWXvxE)

![三维噪声2](http://km.oa.com/files/photos/pictures//20190630//1561905354_79.png)


就像之前提到的噪声被设计出来的一开始的目的，就是应用在影视/游戏作品当中模拟自然效果的，所以，使用 webGL 制作海洋，山川这种效果，也自然不在话下：
[https://codepen.io/matikbird/pen/xVvqWQ](https://codepen.io/matikbird/pen/xVvqWQ)
![三维噪声3](http://km.oa.com/files/photos/pictures//20190630//1561905372_92.png)
![三维噪声4](http://km.oa.com/files/photos/pictures//20190701//1561917061_17.png)

当然这不仅需要熟练使用噪声，还需要掌握 webGL，虽然一开始我们介绍了噪声在 canvas/svg 中的使用方法，但是，现在 webGL 已经被电脑端手机端浏览器广泛支持，结合 webGL ，噪声能发挥它更大价值。

## 结语

噪声的应用十分广泛，是图形学领域的重要知识，在三维程序扮演重要的角色。但是噪声不是三维图形领域的专属，学习使用噪声，在 canvas svg css 这些基础的前端技术上应用，也能实现一些意想不到的效果，当某一天设计师又输出了一个类似这种随机特征的效果图，不妨直接找到设计师沟通。说不定这些效果，就是用某个图像处理软件使用噪声生成的。如果获取到生成的参数，在前端也是有可能实现的，通过结合时间偏移，说不定就能实现一个很棒的动画。


参考资料
[https://blog.csdn.net/qq_34302921/article/details/80849139](https://blog.csdn.net/qq_34302921/article/details/80849139)
[https://codepen.io/DonKarlssonSan/post/particles-in-simplex-noise-flow-field](https://codepen.io/DonKarlssonSan/post/particles-in-simplex-noise-flow-field)
[https://thebookofshaders.com/13/?lan=ch](https://thebookofshaders.com/13)