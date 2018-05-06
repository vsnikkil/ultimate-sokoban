import "../index.html";
import "../scss/style.scss";
import React from "react";
import { render } from "react-dom";
import App from "./SokobanApp";

const body = document.querySelector("body");
const appContainer = document.createElement("section");
appContainer.setAttribute("class", "sokoban-application");

body.appendChild(appContainer);
render(<App />, appContainer);
