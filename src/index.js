/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Demo from "./Demo";
import AIGame from "./aiGame"
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<AIGame />, document.getElementById("root"));
registerServiceWorker();
