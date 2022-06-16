
const NO_WASD = true;

const initKeyboardControlsDaemon = (store) => {
  const {dispatch} = store;

  //////////////////////////////////////////////////////////////////////////////
  // keypress event handling
  //////////////////////////////////////////////////////////////////////////////
  document.onkeydown = (ev) => {
    const state = store.getState();
    if (state.game == null) return;
    const dir = getUpDownLeftRight(ev, NO_WASD);
    if (dir != null) {
      if (state.game.hotKeys.onKeyDown[dir] != null) {
        state.game.hotKeys.onKeyDown[dir](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: dir, pressed: true});
      return;
    }
    if (ev.keyCode === 13) {
      if (state.game.hotKeys.onKeyDown.enter != null) {
        state.game.hotKeys.onKeyDown.enter(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'enter', pressed: true});
      return;
    }
    if (ev.keyCode === 32) {
      if (state.game.hotKeys.onKeyDown.space != null) {
        state.game.hotKeys.onKeyDown.space(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'space', pressed: true});
      return;
    }
    const character = String.fromCharCode(ev.keyCode).toUpperCase();
    if (character != null) {
      if (state.game.hotKeys.onKeyDown[character] != null) {
        state.game.hotKeys.onKeyDown[character](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: character, pressed: true});
    }
  }

  document.onkeypress = (ev) => {
    const state = store.getState();
    if (state.game == null) return;
    const dir = getUpDownLeftRight(ev, NO_WASD);
    if (dir != null) {
      if (state.game.hotKeys.onKeyPress[dir] != null) {
        state.game.hotKeys.onKeyPress[dir](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: dir, pressed: true});
      return;
    }
    if (ev.keyCode === 13) {
      if (state.game.hotKeys.onKeyPress.enter != null) {
        state.game.hotKeys.onKeyPress.enter(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'enter', pressed: true});
      return;
    }
    if (ev.keyCode === 32) {
      if (state.game.hotKeys.onKeyPress.space != null) {
        state.game.hotKeys.onKeyPress.space(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'space', pressed: true});
      return;
    }
    const character = String.fromCharCode(ev.keyCode).toUpperCase();
    if (character != null) {
      if (state.game.hotKeys.onKeyPress[character] != null) {
        state.game.hotKeys.onKeyPress[character](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: character, pressed: true});
    }
  }

  document.onkeyup = (ev) => {
    const state = store.getState();
    if (state.game == null) return;
    const dir = getUpDownLeftRight(ev, NO_WASD);
    if (dir != null) {
      if (state.game.hotKeys.onKeyUp[dir] != null) {
        state.game.hotKeys.onKeyUp[dir](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: dir, pressed: false});
      return;
    }
    if (ev.keyCode === 13) {
      if (state.game.hotKeys.onKeyUp.enter != null) {
        state.game.hotKeys.onKeyUp.enter(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'enter', pressed: false});
      return;
    }
    if (ev.keyCode === 32) {
      if (state.game.hotKeys.onKeyUp.space != null) {
        state.game.hotKeys.onKeyUp.space(store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: 'space', pressed: false});
      return;
    }
    const character = String.fromCharCode(ev.keyCode).toUpperCase();
    if (character != null) {
      if (state.game.hotKeys.onKeyUp[character] != null) {
        state.game.hotKeys.onKeyUp[character](store);
      }
      dispatch({type: 'SET_KEY_PRESS', key: character, pressed: false});
    }
  }

}

const getUpDownLeftRight = (ev, noWASD) => {
  const keyCode = ev.keyCode;

  if (noWASD) {
    if (keyCode === 38) {
      return 'down';
    }

    if (keyCode === 40) {
      return 'up';
    }

    if (keyCode === 37) {
      return 'left';
    }

    if (keyCode === 39) {
      return 'right';
    }
    return null;
  }

  if (keyCode === 87 || keyCode === 38 || keyCode === 119) {
    return 'down';
  }

  if (keyCode === 83 || keyCode === 40 || keyCode === 115) {
    return 'up';
  }

  if (keyCode === 65 || keyCode === 37 || keyCode === 97) {
    return 'left';
  }

  if (keyCode === 68 || keyCode === 39 || keyCode === 100) {
    return 'right';
  }
  return null;
}

module.exports = {initKeyboardControlsDaemon};
