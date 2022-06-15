var gamer = (function() {
	var gamer = {},
		startBtn = document.getElementById('startBtn'),
		resetBtn = document.getElementById('reset'),
		startCallbacks = [],
		resetCallbacks = [],
		timeEle = document.getElementById('time'),
		successTxt = document.getElementById('successTxt');

	function init() {
		//cube.reset(300, 3, 'cool');
		reset();
		initEvent();
	}

	function initEvent() {
		startBtn.addEventListener('click', function() {
			start();
		});
		resetBtn.addEventListener('click', function() {
			reset();
		});
	}

	var timer = (function() {
		var timer = {},
			timeT = 0,
			totalSec = 0;

		//从毫秒转换成时间对象，该对象形如{day:'',hour:'',minute:'',second:''}
		function getTime(millisecond){

			var second = 1000,
				minute = 60*second,
				hour = 60*minute,
				day = 24*hour,
				millisecond = parseInt(millisecond),
				timeInfo = {};

			//补0
			function addZero(num) {
				if (num < 10) {
					return '0' + num.toString();
				}
				return num;
			}

			timeInfo.day = parseInt(millisecond / day, 10);
			millisecond -= timeInfo.day * day;
			timeInfo.hour = parseInt(millisecond / hour, 10);
			millisecond -= timeInfo.hour * hour;
			timeInfo.minute = parseInt(millisecond / minute, 10);
			millisecond -= timeInfo.minute * minute;
			timeInfo.second = parseInt(millisecond / second, 10);
			millisecond -= timeInfo.second * second;
			timeInfo.hour = addZero(timeInfo.hour);
			timeInfo.minute = addZero(timeInfo.minute);
			timeInfo.second = addZero(timeInfo.second);
			return timeInfo;
		}


		timer.clearTick = function() {
			clearInterval(timeT);
			totalSec = 0;
		}

		timer.startTick = function() {
			totalSec = 0;
			timeEle.innerHTML = '00:00:00';
			
			var timeObj = null;
			timeT = setInterval(function() {
				totalSec += 1000;
				timeObj = getTime(totalSec);
				timeEle.innerHTML = timeObj.hour + ':' + timeObj.minute + ':' + timeObj.second;
			},1000);
		}

		return timer;
	})();

	function reset() {
		//view.reset();
		startBtn.style.display = 'block';
		timeEle.style.top = '-30px';
		successTxt.style.display = 'none';

		timer.clearTick();

		for (var command in resetCallbacks) {
			resetCallbacks[command]();
		}
	}

	function start() {
		startBtn.style.display = 'none';
		timeEle.style.top = '10px';
		successTxt.style.display = 'none';

		timer.startTick();
		for (var command in startCallbacks) {
			startCallbacks[command]();
		}

	}

	gamer.init = function() {
		init();
	}

	gamer.success = function() {
		successTxt.style.display = 'block';
		timer.clearTick();
	}

	gamer.registerStart = function(callback) {
		//todo: 判断是否存在
		startCallbacks.push(callback);
	}

	gamer.registerReset = function(callback) {
		//todo: 判断是否存在
		resetCallbacks.push(callback);
	}

	return gamer;
})();