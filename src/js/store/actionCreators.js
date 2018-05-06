import {
  SET_MAP,
  MOVE_PLAYER
} from "./actions";

export function setMap(mapData) {
  return {
    type: SET_MAP,
    payload: mapData,
  };
}

export function movePlayer(delta) {
  return {
    type: MOVE_PLAYER,
    payload: delta,
  };
}
