/* eslint-disable no-unused-vars */
import React, { Component } from "react";

import MyAgent from "./ai/qLerning";

class aiGame extends Component {
  render() {
    return (
      <div style={boardsContainer}>

      </div>
    );
  }
}

export default aiGame;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: "100vw",
  marginTop: 30,
  marginBottom: 50
};