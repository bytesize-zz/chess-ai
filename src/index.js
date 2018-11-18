import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Demo from "./Demo";
import aiGame from "./aiGame"
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Demo />, document.getElementById("root"));
registerServiceWorker();
