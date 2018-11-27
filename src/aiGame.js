/* eslint-disable no-unused-vars */
import React, { Component } from "react";

import MyAgentGame from "./ai/qLerning";

class AIGame extends Component {
  render() {
    return (
      <div style={boardsContainer}>
      <MyAgentGame />
      </div>
    );
  }
}

export default AIGame;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50
};