import Immutable from "immutable";
import {
  SET_MAP,
  MOVE_PLAYER
} from "./actions";

function player(state = Immutable.Map({ x: 0, y: 0 }), { type, payload } = {}) {
  switch (type) {
    case MOVE_PLAYER:
      return state.withMutations(s => {
        if (payload.x) {
          s.update("x", xPos => xPos + payload.x);
        }
        if (payload.y) {
          s.update("y", yPos => yPos + payload.y);
        }
      });
  }

  return state;
}

function sokobanReducer(
  state = Immutable.Map({
    mapData: undefined,
    mapName: undefined,
    player: undefined,
  }),
  { type, payload } = {}
) {
  switch (type) {
    case SET_MAP: {
      const playerY = payload.findIndex(row => row.indexOf('r') >= 0);
      if (playerY === undefined) {
        throw new Error("ramirez is missing from the map");
      }

      const playerX = payload[playerY].indexOf('r');
      return state.withMutations(s => {
        s.set("player", player(
          Immutable.Map({ x: playerX, y: playerY }))
        );
        s.set("mapData", Immutable.fromJS(
          payload.map(row => row.replace(/r/g, '-')))
        );
      });
    }
    case MOVE_PLAYER:
      return state.withMutations(s => {
        s.set("previousMove", Immutable.fromJS(payload));
        s.update("player", p => player(p, arguments[1]));
      })
  }
  
  return state;
}

export default sokobanReducer;
