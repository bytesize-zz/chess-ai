import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Demo from "./Demo";
import registerServiceWorker from "./registerServiceWorker";
import * as tf from '@tensorflow/tfjs';

ReactDOM.render(<Demo />, document.getElementById("root"));
registerServiceWorker();
