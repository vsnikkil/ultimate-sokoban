import * as G from "./gameStates";
import React from "react";
import exampleMap from "./maps/example-1";
import worldRenderer, { preloadEntities } from "./worldRenderer";
import { connect } from "react-redux";
import {
  mapDataSelector,
  playerSelector,
  previousMoveSelector
} from "./store/selectors";
import { setMap, movePlayer } from "./store/actionCreators";

const connectWorld = connect(
  function (state) {
    return {
      mapData: mapDataSelector(state),
      player: playerSelector(state),
      previousMove: previousMoveSelector(state),
    };
  },
  function (dispatch) {
    return {
      setMap: (...props) => dispatch(setMap(...props)),
      movePlayer: (...props) => dispatch(movePlayer(...props)),
    };
  }
);

function mergePlayerToMap(mapData, player) {
  return mapData.map((m, index) => {
    if (index !== player.y) {
      return m;
    }

    return m.substr(0, player.x) + 'r' + m.substr(player.x + 1);
  });
}

class World extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animationFunction = this.animationFunction.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.state = {
      gameState: G.LOADING_MAP,
    };
  }

  animationFunction() {
    worldRenderer(
      this.worldCtx,
      this.props.mapData,
      this.props.player,
      this.props.previousMove
    );

    this.animationRequest = requestAnimationFrame(this.animationFunction);
  }
  
  componentDidMount() {
    const { width, height } = this.worldCanvas.getBoundingClientRect();
    this.worldCanvas.width = width;
    this.worldCanvas.height = height;
    this.worldCtx = this.worldCanvas.getContext("2d");
    this.props.setMap(exampleMap);
    this.componentDidUpdate();
    preloadEntities().then(() => {
      this.setState(() => ({
        gameState: G.GAME_RUNNING,
      }));
    });
  }

  componentDidUpdate(prevProps, prevState = {}) {
    if (
      prevState.gameState !== this.state.gameState &&
      this.state.gameState === G.GAME_RUNNING
    ) {
      this.animationFunction();
    }
  }

  handleKeyboard({ key }) {
    switch (key) {
      case "ArrowLeft":
        this.props.movePlayer({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        this.props.movePlayer({ x: 1, y: 0 });
        break;
      case "ArrowUp":
        this.props.movePlayer({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        this.props.movePlayer({ x: 0, y: 1 });
    }
  }

  render() {
    return (
      <canvas
        tabIndex={0}
        onKeyDown={this.handleKeyboard}
        className="sokoban-world-canvas"
        ref={worldCanvas => this.worldCanvas = worldCanvas} />
    );
  }
};

export default connectWorld(World);
