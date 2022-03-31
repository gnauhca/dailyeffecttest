let globalData;
const initData = {
  player1: {
    avatar: null,
  },
  player2: {
    avatar: null,
  },
};

if (window.localStorage.gobang) {
  globalData = window.localStorage.gobang;
} else {
  clearGlobalData();
}

function clearGlobalData() {
  globalData = JSON.parse(JSON.stringify(initData));
}

export { globalData, clearGlobalData };
