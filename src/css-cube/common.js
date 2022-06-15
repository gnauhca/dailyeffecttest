cube_floor_num = 3;// 魔方的层数

rotateDir = {
	'y': {
			'sizeEdges': [
				{'face': 'front', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'back', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'left', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
			],
			'faceUp': {'face': 'bottom', 'rotateDegree': 0},
			'faceBottom': {'face': 'up', 'rotateDegree': 2}
		},
	'x': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'back', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'front', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'right', 'rotateDegree': 0},
			'faceBottom': {'face': 'left', 'rotateDegree': 0}
		},
	'z': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'row', 'stackDir': '-1', 'readDir': '-1'},
				{'face': 'left', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'front', 'rotateDegree': 0},
			'faceBottom': {'face': 'back', 'rotateDegree': 0}
		},
};
//rotateDegree: 转多少个90(顺时针)度才能做成旋转层floor的顶面，底面 旋转层的底面是他的顶面向Y轴旋转180度做成的
//floor的原始是z轴堆叠方向的，

function $(id) {
	return document.getElementById(id);
}



//旋转i == j二维数组 dir: 1 顺时针， -1 逆时针, step 步数
function rotateSquareArr(arr, dir, step) {
	if (step == 0) {return arr;}
	var rotate180 = false,
		arrAfterRotate = [],
		floor = arr.length,
		maxIndex = floor - 1;

	step = step % 4;
	if (Math.abs(step) == 3) {
		dir = dir * -1;
	} else if (Math.abs(step) == 2) {
		rotate180 = true;
	}

	if (rotate180) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - i]) {
					arrAfterRotate[maxIndex - i] = [];
				}
				arrAfterRotate[maxIndex - i][maxIndex - j] = arr[i][j];
			}
		}		
	} else if (dir == 1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[j]) {
					arrAfterRotate[j] = [];
				}
				arrAfterRotate[j][maxIndex - i] = arr[i][j];
			}
		}			
	} else if (dir == -1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - j]) {
					arrAfterRotate[maxIndex - j] = [];
				}
				arrAfterRotate[maxIndex - j][i] = arr[i][j];
			}
		}			
	}

	return arrAfterRotate;
}