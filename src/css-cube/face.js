var Face = (function() {

	function Face(faceType) {
		this.blocks = [];
		this.faceData = [];
		this.faceType = faceType;
		this.faceEle = document.createElement('div');
		this.faceEle.className = 'face ' + faceType;

		var faceTransformStyle = '';
		switch (faceType) {
			case 'front': 
				faceTransformStyle = 'translateZ(0px)';
				break;
			case 'right': 
				faceTransformStyle = 'rotateY(90deg) translateZ(0px)';
				break;
			case 'back': 
				faceTransformStyle = 'rotateY(180deg) translateZ(0px)';
				break;
			case 'left': 
				faceTransformStyle = 'rotateY(270deg) translateZ(0px)';
				break;
			case 'up': 
				faceTransformStyle = 'rotateX(90deg) translateZ(0px)';
				break;
			case 'bottom': 
				faceTransformStyle = 'rotateX(270deg) translateZ(0px)';
				break;
		}
		this.faceEle.style.transform = faceTransformStyle;
		//this.reset(colNum);
	} 

	//某一列的数据, 有第二个参数则是设置
	Face.prototype.col = function(colNum, colData) {
		var floorData = [];
		for (var i = 0; i < this.blocks.length; i++) {
			if (colData) {
				this.blocks[i][colNum].setType(colData[i]);
				this.blocks[i][colNum].blockEle.style.opacity = '1';
			} else {
				floorData.push(this.blocks[i][colNum].type);
				this.blocks[i][colNum].blockEle.style.opacity = '0';
			}
		}
		return floorData;
	}

	//某一行的数据, 有第二个参数则是设置  注：隐藏暂时在这里做
	Face.prototype.row = function(rowNum, rowData) {
		var floorData = [];
		for (var i = 0; i < this.blocks[rowNum].length; i++) {
			if (rowData) {
				this.blocks[rowNum][i].setType(rowData[i]);
				this.blocks[rowNum][i].blockEle.style.opacity = '1';
			} else {
				floorData.push(this.blocks[rowNum][i].type);
				this.blocks[rowNum][i].blockEle.style.opacity = '0';
			}
		} 
		return floorData;
	}

	//参数包括旋转类型xyz?， 层数 ,
	Face.prototype.getFloorData = function(rotateType, floorNum) {
		var sizeEdgesData = rotateDir[rotateType].sizeEdges,
			edgeData = {};
		//找到对应该面的sizeedge数据
		for (var i = 0; i < sizeEdgesData.length; i++) {
			if (sizeEdgesData[i].face == this.faceType) {
				edgeData = sizeEdgesData[i];
			}
		}
		//{'face': 'front', 'rowOrCol': 'row', 'dir': '1'},
		var floorData = [];
		if (edgeData.rowOrCol == 'col') {
			floorData = this.col((edgeData.stackDir == 1? floorNum: cube_floor_num - 1 - floorNum));
		} else {
			floorData = this.row((edgeData.stackDir == 1? floorNum: cube_floor_num - 1 - floorNum));
		}
		return (edgeData.readDir == 1 ? floorData : floorData.reverse());
	}


	Face.prototype.setFloorData = function(rotateType, floorNum, floorData) {
		var sizeEdgesData = rotateDir[rotateType].sizeEdges,
			edgeData = {};
		//找到对应该面的sizeedge数据
		for (var i = 0; i < sizeEdgesData.length; i++) {
			if (sizeEdgesData[i].face == this.faceType) {
				edgeData = sizeEdgesData[i];
			}
		}
		//{'face': 'front', 'rowOrCol': 'row', 'dir': '1'},
		if (edgeData.rowOrCol == 'col') {
			return this.col((edgeData.stackDir == 1? floorNum: cube_floor_num - 1 - floorNum), (edgeData.readDir == 1 ? floorData : floorData.reverse()));
		} else {
			return this.row((edgeData.stackDir == 1? floorNum: cube_floor_num - 1 - floorNum), (edgeData.readDir == 1 ? floorData : floorData.reverse()));
		}
	}

	//faceData形式：[['up','front','left'],[...],[...]]
	Face.prototype.getFaceData = function() {
		var faceData = [];
		for (var i = 0; i < this.blocks.length; i++) {
			faceData[i] = [];
			for (var j = 0; j < this.blocks[i].length; j++) {
				faceData[i][j] = this.blocks[i][j].type;
				this.blocks[i][j].blockEle.style.opacity = '0';
			}
		}
		return faceData;
	}

	//faceData形式：[['up','front','left'],[...],[...]]
	Face.prototype.setFaceData = function(faceData) {
		for (var i = 0; i < faceData.length; i++) {
			for (var j = 0; j < faceData[i].length; j++) {
				this.blocks[i][j].setType(faceData[i][j]);
				this.blocks[i][j].blockEle.style.opacity = '1';
			}	
		}		
	}

	Face.prototype.isAllSame = function() {
		var type =  this.blocks[0][0].type;
			
		for (var i = 0; i < this.blocks.length; i++) {
			for (var j = 0; j < this.blocks[i].length; j++) {
				if (this.blocks[i][j].type != type) {
					return false;
				}				
			}
		}
		return true;
	}

	Face.prototype.hideRow = function(rowIndex ) {}

	Face.prototype.hideCol = function(rowIndex ) {

	}

	Face.prototype.getFaceEle= function() {
		return this.faceEle;
	}


	Face.prototype.reset = function() {
		for (var i = 0; i < cube_floor_num; i++) {
			if (!this.blocks[i]) {
				this.blocks[i] = [];
			}
			//如果该下标已经有block实例。就reset 该block
			for (var j = 0; j < cube_floor_num; j++) {

				if (this.blocks[i][j]) {
					this.blocks[i][j].reset(this.faceType, j, i, (100/cube_floor_num), (100/cube_floor_num), (100/cube_floor_num) * j, (100/cube_floor_num) * i);
				} else {
					//blocks里面放的都是Block实例，具体属性在block.js
					this.blocks[i][j] = new Block(this.faceType, j, i, (100/cube_floor_num), (100/cube_floor_num), (100/cube_floor_num) * j, (100/cube_floor_num) * i);
					//将blockEle添加到face;
					this.faceEle.appendChild(this.blocks[i][j].blockEle);
					var testDiv = document.createElement('div');

					//for test
					//testDiv.innerHTML = i * cube_floor_num + j + 1 + this.faceType;
					//this.blocks[i][j].blockEle.appendChild(testDiv);
					//this.blocks[i][j].blockEle.innerHTML = i * cube_floor_num + j + 1 + this.faceType;
				}

			}
			//删除比cube_floor_num多的列
			var k = cube_floor_num;
			while (k < this.blocks[i].length) {
				if (this.blocks[i][k]) {
					this.faceEle.removeChild(this.blocks[i][k].blockEle);
					this.blocks[i][k].distory();
					this.blocks[i][k] = null;
				}
				k++;
			}
			this.blocks[i].length = cube_floor_num;
		}
		//shan除比cube_floor_num多的行
		var row = cube_floor_num;
		while(row < this.blocks.length) {
			for (var col = 0; col < this.blocks[row].length; col++) {
					this.faceEle.removeChild(this.blocks[row][col].blockEle);
					this.blocks[row][col].distory();
					this.blocks[row][col] = null;
			}
			row++
		}
		this.blocks.length = cube_floor_num;

	}	

	return Face;
})();

