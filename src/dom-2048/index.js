
var $gameBox = $("#gameBox");

/*document.getElementById("gameBox").addEventListener("touchstart",function(event){
	alert(1);
	console.log(event.clientX);
})*/

var blockWidth = $gameBox.innerWidth()/4;
var blockHeight = $gameBox.innerHeight()/4;


var Num = function(x,y,num){
	var num = num;
	var numPre = num;
	var $ele = $("<div></div");
	var gamer = gamer;

	//创建自己ui
	var createSelf = function(){
		$ele.addClass("num");
		$ele.addClass("num"+num);
		$ele.css({
			"left" : (x+0.5)*blockWidth,
			"top" : (y+0.5)*blockHeight,
			"width" : 0,
			"height" : 0,
			"font-size" : 0,
			"opacity" : 0
		});
		$ele.html(num);
		$ele.appendTo($gameBox);

		$ele.animate({
			"left" : x*blockWidth,
			"top" : y*blockHeight,
			"width" : blockWidth,
			"height" : blockHeight,
			"font-size"	: getFontSize(num),
			"opacity" : 1
		});
	}

	//销毁自己ui
	this.destroySelf = function(x,y,fun){
		$ele.css("z-index",20)
		$ele.finish().animate({
			"left" : x*blockWidth,
			"top" : y*blockHeight,
			"opacity" : 0
		},fun);
		//$ele.remove();
		$ele.fadeOut(60,function(){
			$ele.remove();
		});
	}

	this.setNum = function(_num){
		numPre = num;
		num=_num;
	}

	//设置自己numUi
	this.setNumUi = function(){
		$ele.removeClass("num"+numPre);
		$ele.addClass("num"+num);
		$ele.css("font-size",getFontSize(num))
		$ele.html(num);
	}

	//取出数字
	this.getNum = function(){
		return num;
	}

	//走
	this.goNewSize = function (x,y){
		$ele.finish().animate({
			"left" : x*blockWidth,
			"top" : y*blockHeight
		});
	}

	function getFontSize(num){
		if(num<100){
			fontSize=80;
		}else if(num<1000){
			fontSize=60;
		}else{
			fontSize=45;
		}
		return fontSize;
	}


	createSelf();

}


//提醒者，记分员
var Reminder = function(){
	var score = 0;
	var maxNum = 0;
	var gameHandler;

	bindEvent();
	function bindEvent(){
		$("#keepGoing").click(function(){//console.log("fadeOut");
			$(".mask").fadeOut();
			gameHandler.goOn();			
		});

		
		$("#tryAgain").click(function(){
			$(".mask").fadeOut();
			gameHandler.clear();clear();
			gameHandler.loadGame();	
		});
	}

	this.setGameHandler = function(_gameHandler){
		gameHandler = _gameHandler; //console.log(gameHandler)
	}



	function clear(){
		score = 0;
		maxNum = 0;
		$("#maxNo").stop().animate({"width" : 0},function(){
			$("#maxNo").html(0).animate({"width" : "100%" })
		});
		$("#score").stop().animate({"width" : 0},function(){
			$("#score").html(0).animate({"width" : "100%" });
		});
	}


	this.updateMaxNum = function(num){
		if(num>maxNum){
			maxNum = num;
			$("#maxNo").stop().animate({"width" : 0},function(){
				$("#maxNo").html(maxNum).animate({"width" : "100%" })
			});
			if(maxNum==2048){
				this.showWinMask();
			}
		}

	}

	this.updateScore =function(numJustDel){
		score+=numJustDel*2;
		$("#score").stop().animate({"width" : 0},function(){
			$("#score").html(score).animate({"width" : "100%" });
		});
	}
	this.showWinMask = function(){
		gameHandler.stop();
		$("#maskTxt").html("you win!")
		$(".mask").show();$("#keepGoing").show();
	}
	this.showFailMask = function(){
		gameHandler.stop();
		$("#maskTxt").html("you lost!");
		$(".mask").show();$("#keepGoing").hide();
	}

}




var GameHandler = function(reminder){
	var reminder = reminder,
		numArr = [],
		$gameBox = $("#gameBox"),
		sumNum = 0,
		stop = false;//个数		

	reminder.setGameHandler(this);

	//初始设置
	this.initGame =function(){
		for(var i=0;i<4;i++){
			numArr[i]=[];
			for(var j=0;j<4;j++){
				numArr[i][j]=null;
			}
		}
		this.loadGame();
		bindEvent();
	}

	//加载游戏
	this.loadGame=function(){
		/*reminder.updateMaxNum(addNum(2048));
		reminder.updateMaxNum(addNum(1024));
		reminder.updateMaxNum(addNum(4));
		reminder.updateMaxNum(addNum(8));
		reminder.updateMaxNum(addNum(1024));
		reminder.updateMaxNum(addNum(64));
		reminder.updateMaxNum(addNum(1024));
		reminder.updateMaxNum(addNum(512));
		reminder.updateMaxNum(addNum(32));
		reminder.updateMaxNum(addNum(8));
		reminder.updateMaxNum(addNum(1024));*/

		
		reminder.updateMaxNum(addNum());
		reminder.updateMaxNum(addNum());
		reminder.updateMaxNum(addNum());

	}
	//清除
	this.clear = function(){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(numArr[i][j]!==null){
					numArr[i][j].destroySelf();
				}
				numArr[i][j]=null;
			}
		}
		sumNum=0;
	}

	//stop停止操作
	this.stop = function(){
		stop = true;
	}
	//stop停止操作
	this.goOn = function(){
		stop = false;
	}
	//添加新的数字块
	function addNum(testNum){//console.log(11);
		if(sumNum==16){
			gameOver();return;
		}

		var num = (Math.floor(Math.random()*1.3)+1)*2,
			resEmptyBlockNo=16-sumNum,
			nowEmptyBlock = 1,
			theRandomBlock = Math.floor(Math.random()*resEmptyBlockNo)+1;//console.log(theRandomBlock);

		

		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(numArr[i][j]!==null){
					continue;
				}else if(nowEmptyBlock==theRandomBlock){
					break;
				}else{
					nowEmptyBlock++;	
				}
			}
			if(nowEmptyBlock==theRandomBlock&&j!=4){
				if(testNum){
					numArr[i][j] = new Num(i,j,testNum);break;
				}else{
					numArr[i][j] = new Num(i,j,num);break;
				}
			}
		}			
	

		sumNum++;	
		return num;
	}

	//删除数字块
	function delNum(){

	}

	//事件绑定
	function bindEvent(){
		$(document).keydown(function(event){
		  switch(event.keyCode) {
		  	case 1:
		  	case 38:
		  	case 269: //up 
		            move(2);
		            break;

		    case 2:
		    case 40:
	        case 270: //down
		            move(0);
	           		break;
		    case 3:
		    case 37:
	        case 271: //left 
		            move(1);
	           		break;
		    case 2:
		    case 39:
	        case 272: //right
		            move(3);
	           		break;

		  }
		});
	}


	//移动块
	function move(dir){
		if(stop)return;//停止操作
		var dir = dir;
		var numHandleNow;
		var numCompare;
		var newSize=[];
		var newSizeForDel=[];
		var beenMove = false;
		//var numHandleNow;
		for(var i=0; i<4; i++){
			var k = 3;
			for(var j=2; j>=0; j--){

					switch(dir){
						case 0 :
							numHandleNow = numArr[i][j];
							initSize = [i,j];
							numCompare = numArr[i][k];
							newSize = [i,k-1];
							newSizeForDel = [i,k];
							break;

						case 1 :
							numHandleNow = numArr[3-j][i];
							initSize = [3-j,i];
							numCompare = numArr[3-k][i];
							newSize = [3-k+1,i];
							newSizeForDel = [3-k,i];
							break;

						case 2 :
							numHandleNow = numArr[i][3-j];
							initSize = [i,3-j];
							numCompare = numArr[i][3-k];
							newSize = [i,3-k+1];
							newSizeForDel = [i,3-k];
							break;

						case 3 :
							numHandleNow = numArr[j][i];
							initSize = [j,i];
							numCompare = numArr[k][i];
							newSize = [k-1,i];
							newSizeForDel = [k,i];
							break;

					}
					if(numHandleNow===null){
						continue;
					}
					if(numCompare!==null){
						if(numCompare.getNum()!=numHandleNow.getNum()){//数字不相等
							k--;
							numHandleNow.goNewSize(newSize[0],newSize[1]);
							numArr[initSize[0]][initSize[1]] = null;
							numArr[newSize[0]][newSize[1]] = numHandleNow;//console.log(numArr[newSize[0]][newSize[1]].getNum)
							if(initSize[0]!=newSize[0]||initSize[1]!=newSize[1]){
								beenMove=true;//移动过
							}
						}else{//相等
							reminder.updateScore(numCompare.getNum());
							numCompare.setNum(numCompare.getNum()*2);
							reminder.updateMaxNum(numCompare.getNum());
							numHandleNow.destroySelf(newSizeForDel[0],newSizeForDel[1],(function(numObj){
								return function(){
									numObj.setNumUi();
								}
							})(numCompare));
							numArr[initSize[0]][initSize[1]] = null;
							numHandleNow=null;
							k--;			
							beenMove = true;//移动过
							sumNum--;//总数减一;				
						}

						continue;
					}else{
						numHandleNow.goNewSize(newSizeForDel[0],newSizeForDel[1]);
						numArr[newSizeForDel[0]][newSizeForDel[1]] = numHandleNow;
						numArr[initSize[0]][initSize[1]] = null;
						beenMove=true;//移动过
					}


			}
		}
		if(beenMove){
			addNum();
		}else if(!beenMove&&sumNum==16){
			for(var i=0;i<4;i++){
				for(var j=0;j<4;j++){
					if(j<3&&numArr[i][j].getNum()==numArr[i][j+1].getNum()){//console.log(1)
						return;
					}
					if(i<3&&numArr[i][j].getNum()==numArr[i+1][j].getNum()){//console.log(7)
						return;
					}
				}
			}
			reminder.showFailMask();
			//gameOver();//addNum();
		}

	}

	//测试用
	function printfNum(){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				test.innerHTML+=numArr[j][i]+"   ";
			}
			test.innerHTML+="<br>";
		}
		test.innerHTML+="<hr>"
	}

	//游戏结束
	function gameOver(){
		//alert("你是逗B");
		//$("<div style='display:none;font-size:300px; z-index:1000; color:#abcedf; width:100%; position:absolute; text-align:center;top:100px;'>你是逗B</div>").appendTo("body").stop().fadeIn(1000).fadeOut();;
		reminder.showFailMask();
	}

	//游戏胜利
	function winGame(){}


	


}

$(function(){
	var reminder = new Reminder();
	var game = new GameHandler(reminder);
	game.initGame();	
})
