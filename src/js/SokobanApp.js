import React from "react";
import { Provider } from "react-redux";
import store from "./store/";
import World from "./World";

const UltimateSokobanHeader = () => (
  <header className="ultimate-sokoban-header">Ultimate Sokoban v.1</header>
);

class SokobanApp extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <div className="sokoban">
          <UltimateSokobanHeader />
          <World />
        </div>
    </Provider>
    );
  }
};

export default SokobanApp;
