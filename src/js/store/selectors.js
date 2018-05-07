import Immutable from "immutable";
import { createSelector } from "reselect";

export const playerSelector = createSelector(
  state => state.get("player"),
  player => {
    if (!(player instanceof Immutable.Map)) {
      return undefined;
    }

    return player.toJS()
  }
);

export const mapDataSelector = createSelector(
  state => state.get("mapData"),
  mapData => {
    if (!(mapData instanceof Immutable.List)) {
      return undefined;
    }

    return mapData.toJS()
  }
);

export const previousMoveSelector = createSelector(
  state => state.get("previousMove"),
  previousMove => {
    if (!(previousMove instanceof Immutable.Map)) {
      return undefined;
    }

    return previousMove.toJS();
  }
);
