var cubeAni = (function() {

  var AniLine = function(timer, initPos, finalPos, color, duration, glow) {
  
    this.timer = timer;
    this.ctx = timer.ctx;
  
    this.initPos = initPos;
    this.finalPos = finalPos;
    this.currentPos = initPos;
    this.dis = [this.finalPos[0]-this.initPos[0], this.finalPos[1]-this.initPos[1]];
    this.opacity = 1;
    this.show = false;
    this.duration = duration;
  
    // calculate
    this.color = color;
    this.percent = 0;
    this.nexts = [];
    //console.log(this);
    this.glow = glow;
  
    // this.glow 是后面加的需求，横穿的发光的线
    var cvs = document.createElement('canvas');
      ctx = cvs.getContext('2d');
    if (this.glow) {
  
      cvs.width = 600;
      cvs.height = 50;
  
      ctx.fillStyle = 'rgba(54,141,207,0.2)'
      for (var i =0 ; i< 600; i++) {
        ctx.beginPath();
        ctx.arc(i, 25, 2*i/600, 0, 2*Math.PI);
        ctx.fill();
      }
      this.offLineCvs = cvs;
    } else {
      cvs.width = 50;
      cvs.height = 50;
  
      var grd=ctx.createRadialGradient(25, 25,0,25, 25, 25);
      grd.addColorStop(0,'rgba(54,141,207,0.25)');
      grd.addColorStop(1,'rgba(54,141,207,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(25, 25, 25, 0, 2*Math.PI);
      ctx.fill();
      this.offLineCvs = cvs;
    }
  }
  
  AniLine.prototype.clock = function(detal) { //console.log(detal);
    if (this.percent < 1) {
      this.percent += (detal/this.duration); 
      this.percent = this.percent > 1?1:this.percent;		
      this.currentPos = [this.initPos[0] + this.dis[0]*this.percent, this.initPos[1] + this.dis[1]*this.percent];
      //console.log(this.currentPos);
    } else if (this.show) {
      this.show += detal/2000;
      this.show = this.show > 0.8? 0.8: this.show;
    } else {
      this.opacity -= detal/1000; //console.log(this.opacity)
      this.opacity = this.opacity < 0 ? 0: this.opacity;
    }
  
    if (this.glow) {
      this.ctx.globalAlpha = this.opacity;
      this.ctx.fillStyle = 'rgba(54,141,207,0.2)';
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(this.offLineCvs, this.currentPos[0]-600,this.currentPos[1]-25);
  
      this.ctx.globalAlpha = this.opacity/2;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.initPos[0], this.initPos[1]);
      this.ctx.lineTo(parseInt(this.currentPos[0]), parseInt(this.currentPos[1]));
      this.ctx.stroke();
    } else {
  
      this.ctx.globalAlpha = this.show? this.show/4: this.opacity;
      this.ctx.drawImage(this.offLineCvs, this.currentPos[0]-25,this.currentPos[1]-25);
  
      this.ctx.globalAlpha = this.show? this.show: this.opacity;
      this.ctx.strokeStyle = this.color;
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.initPos[0], this.initPos[1]);
      this.ctx.lineTo(parseInt(this.currentPos[0]), parseInt(this.currentPos[1]));
      this.ctx.stroke();		
    }
  
  
  
    if (this.percent === 1) {
      this.percent = 2;
      this.next();
    }
  }
  
  AniLine.prototype.setNext = function(next) {
    this.nexts.push(next);
  }
  
  AniLine.prototype.next = function() {
    this.nexts.forEach(function(next) {next.start()});
  }
  
  AniLine.prototype.start = function() {
    this.timer.add(this);
  }
  
  AniLine.prototype.destory = function() {
    this.timer.remove(this);
  }
  
  function aniGo() {
    var lineDatas = {
        'lines1':[
          {'initPos': [461, 155], 'finalPos': [563, 103], 'color': 'rgb(43, 78, 106)', 'duration':300},//1
          {'initPos': [563, 103], 'finalPos': [692, 116], 'color': 'rgb(45, 78, 105)', 'duration':300},//2
          {'initPos': [692, 116], 'finalPos': [596, 168], 'color': 'rgb(111, 178, 229)', 'duration':300},//3
          {'initPos': [596, 168], 'finalPos': [461, 155], 'color': 'rgb(96, 166, 223)', 'duration':300},//4
          {'initPos': [563, 103], 'finalPos': [563, 250], 'color': 'rgb(5, 36, 62)', 'duration':300},//5
          {'initPos': [692, 116], 'finalPos': [692, 181], 'color': 'rgb(113, 180, 231)', 'duration':300},//6
          {'initPos': [596, 168], 'finalPos': [596, 368], 'color': 'rgb(108, 177, 231)', 'duration':300},//7
          {'initPos': [461, 155], 'finalPos': [462, 269], 'color': 'rgb(109, 174, 223)', 'duration':300},//8
  
  
          {'initPos': [692, 314], 'finalPos': [596, 368], 'color': 'rgb(44, 118, 179)', 'duration':300},//9
          {'initPos': [596, 368], 'finalPos': [461, 356], 'color': 'rgb(51, 137, 208)', 'duration':300}//9
        ],
        'lines2':[
          {'initPos': [309, 339], 'finalPos': [462, 269], 'color': 'rgb(43, 78, 106)', 'duration':300},//1
          {'initPos': [462, 269], 'finalPos': [656, 286], 'color': 'rgb(23, 70, 109)', 'duration':300},//2
          {'initPos': [656, 286], 'finalPos': [503, 360], 'color': 'rgb(39, 121, 190)', 'duration':300},//3
          {'initPos': [503, 360], 'finalPos': [309, 339], 'color': 'rgb(51, 137, 208)', 'duration':300},//4
          {'initPos': [462, 269], 'finalPos': [462, 356], 'color': 'rgb(55, 140, 210)', 'duration':300},//5
          {'initPos': [656, 286], 'finalPos': [656, 486], 'color': 'rgb(84, 156, 214)', 'duration':300},//6
          {'initPos': [503, 360], 'finalPos': [503, 600], 'color': 'rgb(77, 156, 219)', 'duration':300},//7
          {'initPos': [309, 339], 'finalPos': [309, 529], 'color': 'rgb(43, 78, 106)', 'duration':300}//8
        ],
        'lines3':[
          {'initPos': [503, 272], 'finalPos': [692, 181], 'color': 'rgb(34, 92, 140)', 'duration':300},//1
          {'initPos': [692, 181], 'finalPos': [941, 205], 'color': 'rgb(39, 66, 86)', 'duration':300},//2
          {'initPos': [941, 205], 'finalPos': [747, 296], 'color': 'rgb(94, 156, 201)', 'duration':300},//3
          {'initPos': [747, 296], 'finalPos': [503, 272], 'color': 'rgb(72, 148, 211)', 'duration':300},//4
          {'initPos': [692, 181], 'finalPos': [692, 314], 'color': 'rgb(113, 180, 231)', 'duration':300},//5
          {'initPos': [941, 205], 'finalPos': [941, 405], 'color': 'rgb(89, 142, 182)', 'duration':300},//6
          {'initPos': [747, 296], 'finalPos': [747, 676], 'color': 'rgb(67, 145, 209)', 'duration':300},//7
          {'initPos': [503, 272], 'finalPos': [503, 372], 'color': 'rgb(56, 141, 210)', 'duration':300}//8
        ],
        'horizontal':{'initPos': [0, 588], 'finalPos': [2003, 588], 'color': 'rgb(56, 141, 210)', 'duration': 800}
      },
      lines1 = [],
      lines2 = [],
      lines3 = [],
      lineData;
  
    for (var i = 0; i < lineDatas.lines1.length; i++) {
      lineData = lineDatas.lines1[i];
      lines1.push(new AniLine(timer, lineData.initPos, lineData.finalPos, lineData.color, lineData.duration));
    }
    for (var i = 0; i < lineDatas.lines2.length; i++) {
      lineData = lineDatas.lines2[i];
      lines2.push(new AniLine(timer, lineData.initPos, lineData.finalPos, lineData.color, lineData.duration));
    }
    for (var i = 0; i < lineDatas.lines3.length; i++) {
      lineData = lineDatas.lines3[i];
      lines3.push(new AniLine(timer, lineData.initPos, lineData.finalPos, lineData.color, lineData.duration));
    }
  
    var horizontal = new AniLine(timer, lineDatas.horizontal.initPos, lineDatas.horizontal.finalPos, lineDatas.horizontal.color, lineDatas.horizontal.duration, true);
    //horizontal.start();
  
    //console.log(lines1[0]);
    lines1[0].setNext(lines1[1]);
    lines1[0].setNext(lines1[4]);
    lines1[1].setNext(lines1[2]);
    lines1[1].setNext(lines1[5]);
    lines1[2].setNext(lines1[3]);
    lines1[2].setNext(lines1[6]);
    lines1[3].setNext(lines1[7]);
  
    lines1[5].setNext(lines1[8]);
    lines1[8].setNext(lines1[9]);
  
    lines1[0].start();
  
    lines2[0].setNext(lines2[1]);
    lines2[0].setNext(lines2[4]);
    lines2[1].setNext(lines2[2]);
    lines2[1].setNext(lines2[5]);
    lines2[2].setNext(lines2[3]);
    lines2[2].setNext(lines2[6]);
    lines2[3].setNext(lines2[7]);
    setTimeout(function() {lines2[0].start();}, 1200);
  
    lines3[0].setNext(lines3[1]);
    lines3[0].setNext(lines3[4]);
    lines3[1].setNext(lines3[2]);
    lines3[1].setNext(lines3[5]);
    lines3[2].setNext(lines3[3]);
    lines3[2].setNext(lines3[6]);
    lines3[3].setNext(lines3[7]);
  
    lines2[7].setNext({start: function() {
  
      setTimeout(function() {
        lines1.forEach(function(line) {line.show = 0.001});
        lines2.forEach(function(line) {line.show = 0.001});
        lines3.forEach(function(line) {line.show = 0.001});			
      }, 100);
  
      setTimeout(function() {
        horizontal.start();
      }, 1500);
  
      setTimeout(function() {
        //document.getElementById('matrixWrap').className += ' ani-over';
        $('#matrixBg').fadeTo(2000, 1);
        $('#cubeCanvas').fadeTo(2000, 0);
      }, 2000);
  
      setTimeout(function() {
        lines1.forEach(function(line) {line.destory()});
        lines2.forEach(function(line) {line.destory()});
        lines3.forEach(function(line) {line.destory()});
        timer.destory();
      },4000);
    }});
    setTimeout(function() {lines3[0].start();}, 600);
  }
  
  
  //var matrixWrap = document.getElementById('matrixWrap');
  var cvs = document.querySelectorAll('canvas')[0];
  var ctx = cvs.getContext('2d');
  var timer = TIME.getTimer(cvs, ctx, 'cube', aniGo);
  
  timer.start();
  })();
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  