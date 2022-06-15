/* eslint-disable */
var gamebox = document.getElementById("gamebox");
var birdHitPipe = false;
var gameStart = false;

window.onresize = function() {
    setGameArea();
}
var setGameArea = function() {
    var winWidth = document.documentElement.clientWidth || documnt.body.clientWidth;
    document.getElementsByTagName('html')[0].style.fontSize = winWidth/125 + 'px';
    document.body.style.fontSize = (document.documentElement.clientWidth || document.body.clientWidth) / 100 + "px";
    document.getElementById("gamebox").style.width = (document.documentElement.clientWidth || document.body.clientWidth) * 0.8 + "px";
    document.getElementById("gamebox").style.height = parseInt(document.documentElement.clientWidth || document.body.clientWidth) * 0.4 + "px";
    //console.log(document.documentElement.clientWidth||document.body.clientWidth+"px")
}
setGameArea();

/* birdbird */
var Bird = function() {
    var speed = 0;
    var birdEle = document.getElementById("bird");
    var birdWind = document.getElementById("birdWind");
    var playing = false;
    var birdWidthPercent = 6;
    var birdHeightPercent = 12;


    this.getBirdInfo = function() {
        return {
            birdEle: birdEle,
            widthPercent: birdWidthPercent,
            heightpercent: birdHeightPercent
        };
    }

    this.init = function() {
        birdEle.style.top = "30%";
        birdEle.style["-webkit-transform"] = "rotate(0deg)";
        birdWind.style["-webkit-transform"] = "rotate(-45deg)";
        document.onclick = function() {
            if (!birdHitPipe)
                speed = -3;
        }
        document.onkeydown = function(e) {
            if (e.key === ' ' && !birdHitPipe)
                speed = -3;
            return false;
        }
    }

    this.clear = function() {}

    this.go = function() {
        if (!gameStart) return;
        speed += 0.28; //console.log(birdEle.style.top)
        birdEle.style.top = parseFloat(birdEle.style.top) + speed + "%";
        var angelF = (speed / 5 > 1) ? 1 : (speed / 5);

        birdEle.style["-webkit-transform"] = "rotate(" + angelF * 90 + "deg)";
        birdWind.style["-webkit-transform"] = "rotate(" + (angelF * 90 - 45) + "deg)/*  scaleX(" + (angelF/1) + ") */";
    }
}

/* PIPEPIPE */
var Pipe = function() {
    var comingPipes = [];
    var passPipes = [];
    var actingPipe = null;
    var playing = false;
    var speed = 0.5;
    var pipeWidth = 8;

    function createPipe() {
        var pipeTop = document.createElement("div");
        var pipeBtm = document.createElement("div");
        var pipeTopHeightPercent = Math.ceil(Math.random() * 30 + 8);
        var pipeBtmHeightPercent = 100 - pipeTopHeightPercent - 50;
        var pipeTopSizeHeightPercent = parseFloat((6 / pipeTopHeightPercent) * 100);
        var pipeBtmSizeHeightPercent = parseFloat((6 / pipeBtmHeightPercent) * 100);
        pipeTop.className = "pipe pipeTop";
        pipeTop.style.width = pipeWidth
        pipeTop.style.height = pipeTopHeightPercent + "%";
        pipeTop.style.left = "100%";

        pipeTop.innerHTML = "<div class='pipeSize' style='height:" + pipeTopSizeHeightPercent + "%'></div>";
        pipeBtm.className = "pipe pipeBtm";
        pipeBtm.style.width = pipeWidth
        pipeBtm.style.height = pipeBtmHeightPercent + "%";
        pipeBtm.style.left = "100%";
        pipeBtm.innerHTML = "<div class='pipeSize' style='height:" + pipeBtmSizeHeightPercent + "%'></div>";
        gamebox.appendChild(pipeTop);
        gamebox.appendChild(pipeBtm);
        return {
            "pipeTop": pipeTop,
            "pipeBtm": pipeBtm
        };
    }

    function createOrNot() {
        if (comingPipes.length == 0) return true;
        //console.log(parseInt(comingPipes[comingPipes.length-1].pipeTop.style.left)+"<br>"+parseInt(comingPipes[comingPipes.length-1].pipeTop.clientWidth*6))
        if (parseFloat(comingPipes[comingPipes.length - 1].pipeTop.style.left) < 75) {
            return true;
        } else {
            return false;
        }

    }

    //管子分类
    function pipesClassify() {

        if (actingPipe != null && parseFloat(actingPipe.pipeTop.style.left) < 20 - pipeWidth) {
            //actingPipe.pipeTop.style.background = "yellow";
            passPipes.push(actingPipe);
            actingPipe = null;
            score.innerHTML = parseInt(score.innerHTML) + 1;
        }

        if (parseFloat(comingPipes[0].pipeTop.style.left) < 20 + 6) {
            actingPipe = comingPipes.shift();
            //actingPipe.pipeTop.style.background = "red";
        }



        for (var i = passPipes.length-1; i >= 0; i--) {
            if (parseFloat(passPipes[i].pipeTop.style.left) < 0 - pipeWidth) {
                //passPipes[i].pipeTop.parentNode.removeChild(passPipes[i].pipeTop); 
                //passPipes[i].pipeBtm.parentNode.removeChild(passPipes[i].pipeBtm);
                delPipe(passPipes[i]);
                passPipes.splice(i, 1);
            }
        }

    }

    //move everypipe
    function movePipe(pipeObj) {
        pipeObj.pipeTop.style.left = parseFloat(pipeObj.pipeTop.style.left) - speed + "%";
        pipeObj.pipeBtm.style.left = parseFloat(pipeObj.pipeBtm.style.left) - speed + "%";
    }

    //delete pipe
    function delPipe(pipeObj) {
        pipeObj.pipeTop.parentNode.removeChild(pipeObj.pipeTop);
        pipeObj.pipeBtm.parentNode.removeChild(pipeObj.pipeBtm);
    }

    this.getActingPipe = function() {
        return actingPipe;
    }

    this.init = function() {
        for (var i = 0; i < comingPipes.length; i++) {
            delPipe(comingPipes[i]);
            comingPipes[i] = null;
        }
        for (var i = 0; i < passPipes.length; i++) {
            delPipe(passPipes[i]);
            passPipes[i] = null;
        }
        comingPipes.length = 0;
        passPipes.length = 0;
        actingPipe && delPipe(actingPipe);actingPipe=null;

    }

    this.clear = function() {}

    this.go = function() {
        if (!gameStart || birdHitPipe) return;
        if (createOrNot()) {
            comingPipes[comingPipes.length] = createPipe();
        }
        for (var i = 0; i < comingPipes.length; i++) {
            //console.log(comingPipes[i].pipeTop.style.left+"   "+ speed)
            movePipe(comingPipes[i])
        }
        for (var i = 0; i < passPipes.length; i++) {
            //console.log(passPipes[i].pipeTop.style.left+"   "+ speed)
            movePipe(passPipes[i])
        }

        actingPipe && movePipe(actingPipe);
        pipesClassify();


    }
}


/* gamehandlergamehandler */
var gameHandler = {
    startBtn: document.getElementById("startBtn"),
    retryBtn: document.getElementById("retryBtn"),
    gameoverBox: document.getElementById("gameoverBox"),
    gameObjs: {
        bird: new Bird(),
        pipe: new Pipe()
    },
    GameT: 0,
    init: function() {
        //this.bindingEvent();
        birdHitPipe = false;
        document.getElementById("score").innerHTML = 0;
        this.startBtn.style.display = "block";
        for (var i in this.gameObjs) {
            this.gameObjs[i].init();
        }
        this.startMove();
    },
    bindingEvent: function() {
        var that = this;
        this.startBtn.onclick = function() {
            //stopMove();
            //init();
            gameStart = true;
            this.style.display = "none";
        }
        this.retryBtn.onclick = function() {
            that.gameoverBox.style.display = "none";
            this.style.display = "none";
            that.init();
            //this.startMove();
        }
        document.addEventListener('keydown', (e) => {
          if (!gameStart && e.key === ' ') {
            this.retryBtn.onclick();
            this.startBtn.onclick();
          }
        });
    },
    startMove: function() {
        clearTimeout(this.GameT);
        var that = this; //dd
        this.GameT = setInterval(function() {
            for (var i in that.gameObjs) {
                that.gameObjs[i].go();
                gameStart && that.isDie();
            }
        }, 30);
    },
    stopMove: function() {
        clearInterval(this.GameT);
    },
    isDie: function() {
        birdInfo = this.gameObjs.bird.getBirdInfo();
        actingPipe = this.gameObjs.pipe.getActingPipe();
        if (parseFloat(birdInfo.birdEle.style.top) > 85 - birdInfo.heightpercent) {
            this.stopMove();
            gameStart = false;
            birdHitPipe || this.gameover();
        } else if (actingPipe != null) {
            if (parseFloat(birdInfo.birdEle.style.top) < parseFloat(actingPipe.pipeTop.style.height)) {
                birdHitPipe = true;
                this.gameover();
            }
            if (parseFloat(birdInfo.birdEle.style.top) + birdInfo.heightpercent > 100 - parseFloat(actingPipe.pipeBtm.style.height) - 15) {

                birdHitPipe = true;
                this.gameover();
            }
        }
    },
    startGame: function() {},
    pauseGame: function() {},
    gameover: function() {
        this.gameStart = false;
        this.gameoverBox.style.display = "block";
        this.retryBtn.style.display = "block";
    }
}
gameHandler.bindingEvent();
gameHandler.init();
