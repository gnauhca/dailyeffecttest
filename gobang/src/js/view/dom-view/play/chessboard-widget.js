import Widget from '../widget.js';

export default class ChessboardWidget extends Widget {
  init() {
    this.horizontal;
    this.vertical;
    this.eChessboard = this.page.elem.querySelector('.chessboard');
    this.squares;
    this.initEvent();
  }

  watch() {
    return {
      forbidden: (forbidden) => {
        if (forbidden) {
          this.eChessboard.classList.add('forbidden');
        } else {
          this.eChessboard.classList.remove('forbidden');
        }
      },
    };
  }

  createSquares(horizontal, vertical) {
    this.horizontal = horizontal; // 格子个数
    this.vertical = horizontal; // 格子个数
    const squaresHTML = new Array(this.horizontal * this.vertical).fill(1)
      .map((a) => '<div class="square"><i></i></div>').join('');
    this.eChessboard.innerHTML = squaresHTML;
    this.squares = this.eChessboard.querySelectorAll('.square');
    [...this.squares].forEach((s, i) => {
      s.dataset.crood = `${(i % this.vertical)},${(i / this.horizontal) | 0}`;
    });
  }

  initEvent() {
    this.eChessboard.addEventListener('click', (e) => {
      if (this.widgetData.forbidden || !e.target.parentNode.classList.contains('square')) {
        return;
      }

      const square = e.target.parentNode;
      const crood = square.dataset.crood.split(',');

      if (square.classList.contains('black') || square.classList.contains('white')) {
        return;
      }
      this.trigger('square-click', { x: crood[0], y: crood[1] });
    });
  }

  setSquare(pieceType, crood) {
    const square = this.squares[Number(crood.x) + crood.y * this.horizontal];

    square.classList.remove('black', 'white');
    pieceType && square.classList.add(pieceType);
  }

  setActivePiece(pieceType) {
    this.eChessboard.classList.remove('playing-black', 'playing-white');
    this.eChessboard.classList.add(`playing-${pieceType}`);
  }

  clearChessboard() {
    // 清空棋盘
    [...this.squares].forEach((s) => s.className = 'square');
  }
}
