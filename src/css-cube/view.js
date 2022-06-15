var view = (function() {
	var view = {},
		cubeWrapEle = null,
		mouseHandle = false;//是否游戏已经开始，允许鼠标操控视角

	function init() {
		cubeWrapEle = document.getElementById('cubeWrap');
		//startRotateAnimate();
		initEvent();
		gamer.registerStart(view.start);
		gamer.registerReset(view.reset);
	}

	function initEvent() {

		+function() {
			var initMouseSize = {x:0,y:0},
				offset = {x:0, y:0},
				initTranInfo = {x:0,y:0,z:0,d:1},
				mouseDown = false;

			document.onmousedown = function(event) {
				var event = event||window.event;
				if (mouseHandle) {
					mouseDown = true;
					initMouseSize.x = event.clientX;
					initMouseSize.y = event.clientY;
				}
				setTimeout(function() {
					document.onmousemove = function(event) {
						var event = event||window.event;

						if (mouseHandle && mouseDown) {
							offset.x = (event.clientX - initMouseSize.x)/2;
							offset.y = (event.clientY - initMouseSize.y)/2;

							var edge = Math.sqrt(offset.x*offset.x + offset.y*offset.y);
							if (!edge) return;

							var n = [-offset.y/edge, offset.x/edge];

							initTranInfo = rotateCount.multiply(rotateCount.fromRotation([n[0], n[1], 0], edge/2),initTranInfo);

							cubeWrapEle.style.transform = rotateCount.toRotation(initTranInfo);

							initMouseSize.x = event.clientX;
							initMouseSize.y = event.clientY;							
						}
					}
				},100);

			}



			document.onmouseup = function(event) {
				mouseDown = false;

				if (mouseHandle) {
					document.onmousemove = null;
				}
			}			
		}();

	}
	

	view.reset = function() {
		mouseHandle = false;
	}

	view.start = function() {
		mouseHandle = true;
	}

	init();
	return view;
})();


//网友视角旋转方法
rotateCount = {
	fromRotation : function(xsa, ag) {
		var a = ag * (Math.PI/180);
		
		var sin = Math.sin(a/2);
		var cos = Math.cos(a/2);
		
		return {'x': xsa[0]*sin, 'y': xsa[1]*sin, 'z': xsa[2]*sin, 'd': cos};
	},
	multiply : function(rotateInfo1, rotateInfo2) {
		
		var x = rotateInfo1.d*rotateInfo2.x + rotateInfo1.x*rotateInfo2.d + rotateInfo1.y*rotateInfo2.z - rotateInfo1.z*rotateInfo2.y;
		var y = rotateInfo1.d*rotateInfo2.y + rotateInfo1.y*rotateInfo2.d + rotateInfo1.z*rotateInfo2.x - rotateInfo1.x*rotateInfo2.z;
		var z = rotateInfo1.d*rotateInfo2.z + rotateInfo1.z*rotateInfo2.d + rotateInfo1.x*rotateInfo2.y - rotateInfo1.y*rotateInfo2.x;
		var d = rotateInfo1.d*rotateInfo2.d - rotateInfo1.x*rotateInfo2.x - rotateInfo1.y*rotateInfo2.y - rotateInfo1.z*rotateInfo2.z;
		
		return {'x': x, 'y': y, 'z': z, 'd': d};
	},

	toRotation : function(rotateInfo) {
		var axis = [rotateInfo.x, rotateInfo.y, rotateInfo.z];;
		var angle = (180/Math.PI) * 2 * Math.acos(rotateInfo.d);

		return "rotate3d(" + axis[0].toFixed(10) + "," + axis[1].toFixed(10) + "," + axis[2].toFixed(10) + "," + angle.toFixed(10) + "deg)";
	},

	toRotations : function(rotateInfo) {
		var RAD2DEG = 180/Math.PI;
		
		var x = RAD2DEG * Math.atan2(2*(rotateInfo.d*rotateInfo.x + rotateInfo.y*rotateInfo.z), 1 - 2*(rotateInfo.x*rotateInfo.x + rotateInfo.y*rotateInfo.y));
		var y = RAD2DEG * Math.asin(2*(rotateInfo.d*rotateInfo.y - rotateInfo.x*rotateInfo.z));
		var z = RAD2DEG * Math.atan2(2*(rotateInfo.d*rotateInfo.z + rotateInfo.x*rotateInfo.y), 1 - 2*(rotateInfo.y*rotateInfo.y + rotateInfo.z*rotateInfo.z));
		
		if (x < 0) { x += 360; }
		if (y < 0) { y += 360; }
		if (z < 0) { z += 360; }
		
		return "rotateX(" + x.toFixed(10) + "deg) rotateY(" + y.toFixed(10) + "deg) rotate(" + z.toFixed(10) + "deg)";
	}
};