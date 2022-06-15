const { body } = document;
const scoreTxt = document.getElementById('scoreTxt');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const upgradeTip = document.getElementById('upgradeTip');
const levelTxt = document.getElementById('levelTxt');
const modelBtn = document.getElementById('modelBtn');
const gameBox = document.getElementById('gameBox');
let model = '3d';

const perspective = (function () {
  const perspective = {};
  const rotateData = { x: 0, y: 0, z: 0 };
  const translateData = { x: 0, y: 0, z: 0 };

  function setTransform() {
    if (model == '2d') return;
    gameBox.style.transform = gameBox.style.transform.replace(/rotateZ\((-?[\d\.]+)deg\)/, `rotateZ(${rotateData.z}deg)`);
    gameBox.style.transform = gameBox.style.transform.replace(/translateX\((-?[\d\.]+)px\)/, `translateX(${translateData.x}px)`);
    gameBox.style.transform = gameBox.style.transform.replace(/translateY\((-?[\d\.]+)px\)/, `translateY(${translateData.y}px)`);
  }

  perspective.turnLeft = function (xOffset, yOffset) {
    rotateData.z -= 90;
    perspective.pull(xOffset, yOffset);
  };

  perspective.turnRight = function (xOffset, yOffset) {
    rotateData.z += 90;
    perspective.pull(xOffset, yOffset);
  };

  perspective.pull = function (xOffset, yOffset) {
    /* var transDis = distance * tranZStep;
		switch ((rotateData.z % 360 + 360) % 360) {
			case 0 :
				translateData.x = 0;
				translateData.y = transDis;
				break;
		switch (rotateData.z % 360) {
			case 90 :
				translateData.x = transDis;
				translateData.y = 0;
				break;
		switch (rotateData.z % 360) {
			case 180 :
				translateData.x = 0;
				translateData.y = -transDis;
				break;
		switch (rotateData.z % 360) {
			case 270 :

				break;
		} */
    translateData.x = xOffset;
    translateData.y = yOffset;
    setTransform();
  };

  perspective.changeModel = function () {
    if (model == '2d') {
      gameBox.style.transform = '';
      body.style.perspective = '';
    } else {
      body.style.perspective = '500px';
      gameBox.style.transform = 'rotateX(60deg) rotateZ(0deg) translateX(0px) translateY(0px)';
    }
    setTransform();
  };

  perspective.init = function () {
    rotateData.x = 60;
    rotateData.z = 0;
    translateData.z = 0;
    gameBox.style.transform = 'rotateX(60deg) rotateZ(0deg) translateX(0px) translateY(0px)';
    perspective.changeModel();
  };

  perspective.clear = function () {
    rotateData.x = 0;
    rotateData.z = 0;
    translateData.z = 0;
    setTransform();
  };
  perspective.init();
  return perspective;
}());

const gamer = (function () {
  const gamer = {};
  let dirNow = 0; let // 0 up 1 right 2 down 3 left
    dirPre = 0;
  const gridNo = { col: 19, row: 19 };
  const center = { x: 9, y: 9 };
  const bodyArr = new Array();
  const gridSize = { w: 0, h: 0 };
  const food = {
    t: 0, l: 0, k: 1, ele: null,
  }; const // size of food and food elem
    foodScoreOfKind = [1, 2, 4, 8, 10];

  gamer.init = function () {
    dirNow = 0;
    dirPre = 0;
    gameBox.className = 'xx';
    gameBox.style.width = (document.documentElement.clientHeight || document.body.clientHeight) && `${560}px`;
    gameBox.style.height = gameBox.style.width;
    gridSize.w = parseFloat(gameBox.clientWidth / gridNo.row);
    gridSize.h = parseFloat(gameBox.clientHeight / gridNo.col);

    gameBox.innerHTML = '';
    for (var i = gridNo.row - 1; i >= 0; i--) {
      for (let j = gridNo.col - 1; j >= 0; j--) {
        const grid = createBlock(i, j);
        grid.innerHTML = '';
        grid.className = 'grid';
        gameBox.appendChild(grid);
      }
    }

    bodyArr.length = 0;
    for (var i = 0; i < 5; i++) {
      createSnakeBody(Math.floor(gridNo.col / 2), Math.floor(gridNo.row / 2 + 4 - i));
    }
    food.ele = createBlock(0, 0);
    createFood();
  };

  function createSnakeBody(x, y) {
    const newBody = {};

    newBody.l = x;// 左边格子
    newBody.t = y;// 上边格子数
    newBody.ele = createBlock(x, y);
    newBody.ele.className = 'snakeHead block';

    bodyArr.length > 0 ? bodyArr[0].ele.className = 'snakeBody block' : '';
    for (let i = bodyArr.length; i > 0; i--) {
      bodyArr[i] = bodyArr[i - 1];
      bodyArr[i].ele.setAttribute('alt', i);
    }
    bodyArr[0] = newBody;
  }

  function createFood() {
    food.l = parseInt(Math.random() * gridNo.row);
    food.t = parseInt(Math.random() * gridNo.col);
    while (checkNewSizeType(food.l, food.t) != 3) {
      createFood();
      return;
    }
    food.k = parseInt(Math.random() * 5 + 1);
    food.ele.className = `food food${food.k} block`;
    food.ele.style.width = `${gridSize.w}px`;
    food.ele.style.height = `${gridSize.h}px`;
    food.ele.style.left = `${food.l * gridSize.w}px`;
    food.ele.style.top = `${food.t * gridSize.h}px`;
  }

  function createBlock(x, y) {
    const elem = document.createElement('div');

    elem.style.width = `${gridSize.w}px`;
    elem.style.height = `${gridSize.h}px`;
    elem.style.left = `${x * gridSize.w}px`;
    elem.style.top = `${y * gridSize.h}px`;
    elem.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span>';
    elem.className = 'block';
    gameBox.appendChild(elem);
    return elem;
  }

  function removeBody() {
    gameBox.removeChild(bodyArr[bodyArr.length - 1].ele);
    bodyArr[bodyArr.length - 1] = null;
    bodyArr.length -= 1;
  }

  function getFood() {
    handler.addScore(foodScoreOfKind[food.k - 1]);
    createFood();
  }

  function checkNewSizeType(leftGrid, topGrid) {
    let sizeType = 0; // 正常
    for (let i = bodyArr.length - 1; i >= 0; i--) {
      if (leftGrid == bodyArr[i].l && topGrid == bodyArr[i].t) {
        sizeType = 1; // 在蛇身体
        return sizeType;
      }
    }
    if (leftGrid < 0 || topGrid < 0 || leftGrid > gridNo.row - 1 || topGrid > gridNo.col - 1) {
      sizeType = 2; // 出墙
      return sizeType;
    }
    if (leftGrid == food.l && topGrid == food.t) {
      // alert("left"+ left +" food.l     "+food.l+ "  top "+ top +" food.t     "+food.t)
      sizeType = 3; // 食物
      return sizeType;
    }
    return sizeType;
  }

  gamer.move = function () {
    const newSize = {};

    if (dirNow == (dirPre - 2) || dirNow == (dirPre + 2)) {
      dirPre = dirNow;
      return;
    }
    switch (dirNow) {
      case 0:
        newSize.l = bodyArr[0].l;
        newSize.t = bodyArr[0].t - 1;
        break;
      case 1:
        newSize.l = bodyArr[0].l + 1;
        newSize.t = bodyArr[0].t;
        break;
      case 2:
        newSize.l = bodyArr[0].l;
        newSize.t = bodyArr[0].t + 1;
        break;
      case 3:
        newSize.l = bodyArr[0].l - 1;
        newSize.t = bodyArr[0].t;
				// alert(bodyArr[0].l-gridSize.w);
    }

    let isDie = false;
    switch (checkNewSizeType(newSize.l, newSize.t)) {
      case 0:
        isDie = false;
        removeBody();
        break;
      case 1:
        isDie = true;
        break;
      case 2:
        isDie = true;
        break;
      case 3: // alert(3333)
        isDie = false;
        getFood();
        break;
    }

    if (!isDie) {
      createSnakeBody(newSize.l, newSize.t);
      if (dirNow - dirPre == 1 || dirNow - dirPre == -3) {
        perspective.turnLeft((center.x - newSize.l) * gridSize.w, (center.y - newSize.t) * gridSize.h);
      } else if (dirNow - dirPre == -1 || dirNow - dirPre == 3) {
        perspective.turnRight((center.x - newSize.l) * gridSize.w, (center.y - newSize.t) * gridSize.h);
      } else {
        perspective.pull((center.x - newSize.l) * gridSize.w, (center.y - newSize.t) * gridSize.h);
      }
    } else {
      bodyArr[0].ele.className += ' boom';
      gameBox.className += ' boom';
      handler.gameover();
    }

    dirPre = dirNow;
  };

  gamer.changeDir = function (dir3d) { // 3d model -1 left 1 right
    dirNow = dirPre + dir3d;
    dirNow = (dirNow + 4) % 4;
  };

  gamer.setDir = function (dir2d) { // 2d model 0 up 1 right 2 down 3 left
    dirNow = dir2d;
  };

  gamer.upgrade = function (level) {

  };

  return gamer;
}());

var handler = (function () {
  const handler = {};
  let gameT;
  const timeGap = 300;
  let score = 0;
  let level = 1;
  let running = false;
  let pauseStatus = false;

  handler.init = function () {
    gamer.init();
    bindEvent();
    handler.addScore(0);
    modelBtn.innerHTML = '2D';
    perspective.init();
  };

  function restart() {
    running = true;
    gamer.init();
    score = 0;
    startBtn.innerHTML = 'Start';
    perspective.init();
    handler.addScore(0);
    level = 0;
    upgrade();
    clearInterval(gameT);
    go();
  }

  function bindEvent() {
    startBtn.onclick = function () {
      if (running) {
        go();
      } else {
        restart();
      }
    };

    pauseBtn.onclick = function () {
      pause();
    };

    modelBtn.onclick = function () {
      model = (model == '3d' ? '2d' : '3d');
      changeModel();
    };

    document.onkeydown = function (event) {
      const keycode = event.which || event.keyCode;
		    switch (keycode) {
		        case 1:
		        case 38:
		        case 269: // up
		            model == '2d' ? gamer.setDir(0) : '';
		            break;
		        case 40:
		        case 2:
		        case 270: // down
   		             model == '2d' ? gamer.setDir(2) : '';
		            break;
		        case 37:
		        case 3:
		        case 271: // left
   		            model == '2d' ? gamer.setDir(3) : gamer.changeDir(-1);
		            return 0;
		            break;
		        case 39:
		        case 4:
		        case 272: // right
		            model == '2d' ? gamer.setDir(1) : gamer.changeDir(1);
		            return 0;
		            break;
		        case 13: // enter
		        	go();
		            return 0;
		            break;
		        case 339: // exit
		            pause();
		            break;

		        case 340: // back
		            return 0;
		            break;
		    }
    };
  }

  function changeModel() {
    if (model == '2d') {
      modelBtn.innerHTML = '3D';
    } else {
      modelBtn.innerHTML = '2D';
    }
    perspective.changeModel();
    if (running) {
      setTimeout(() => {
        if (!pauseStatus) {
          clearInterval(gameT);
          go();
        }
      }, 2000);
    }
  }

  function pause() {
    if (!running) return;
    pauseStatus = true;
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'block';
    clearInterval(gameT);
  }

  function go() {
    pauseStatus = false;
    pauseBtn.style.display = 'block';
    startBtn.style.display = 'none';
    gameoverTxt.style.display = 'none';
    clearInterval(gameT);
    gameT = setInterval(() => {
      gamer.move();
    }, timeGap);
  }

  function upgrade(level) {
    upgradeTip.innerHTML = `level: ${level}`;
    levelTxt.innerHTML = `level: ${level}`;
    setTimeout(() => { upgradeTip.style.display = 'none'; }, 1000);
    gamer.upgrade(level);
  }

  handler.gameover = function () {
    startBtn.innerHTML = 'Retry';
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    gameoverTxt.style.display = 'block';
    running = false;
    clearInterval(gameT);
  };

  handler.addScore = function (scoreadd) {
    score += scoreadd;
    scoreTxt.innerHTML = `score: ${score}`;
  };

  return handler;
}());

handler.init(gamer);
