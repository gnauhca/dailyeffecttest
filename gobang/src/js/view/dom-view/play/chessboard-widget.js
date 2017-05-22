import Widget from '../widget.js';

export default class ChessboardWidget extends Widget {
    init() {
        this.horizontal;
        this.vertical;
        this.eChessboard = this.page.elem.querySelector('.chessboard');
        this.squares;
        this.initEvent();
    }

    createSquares(horizontal, vertical) {
        this.horizontal = horizontal; // 格子个数
        this.vertical = horizontal; // 格子个数
        let squaresHTML = new Array(this.horizontal*this.vertical).fill(1)
                            .map(a=>`<div class="square"><i></i></div>`).join('');
        this.eChessboard.innerHTML = squaresHTML;
        this.squares = this.eChessboard.querySelectorAll('.square');
        [...this.squares].forEach((s,i)=>{
            s.dataset.crood = `${(i%this.vertical)},${(i/this.horizontal)|0}`;
        });
    }


    setPrevent(isPrevent) {
        if (isPrevent) {
            this.eChessboard.classList.add('prevent');
        } else {
            this.eChessboard.classList.remove('prevent');
        }
    }

    initEvent() {
        this.eChessboard.addEventListener('click', (e)=>{
            if (this.eChessboard.classList.contains('prevent')||!e.target.parentNode.classList.contains('square')) return;

            let square = e.target.parentNode;
            let crood = square.dataset.crood.split(',');

            if (square.classList.contains('black') || square.classList.contains('white')) {
                return;
            }
            this.trigger('square-click', {x: crood[0], y: crood[1]});
        });
    }

    setSquare(pieceType, crood) {
        let square = this.squares[Number(crood.x) + crood.y * this.horizontal];

        square.classList.remove('black','white');
        square.classList.add(pieceType);
    }

    setActivePiece(pieceType) {
        this.eChessboard.classList.remove('playing-black','playing-white')
        this.eChessboard.classList.add('playing-'+pieceType);
    }

    clearChessboard() {
        // 清空棋盘
        [...this.squares].forEach(s=>s.className='square');
    }
}