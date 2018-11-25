import React, { Component } from "react";
import PropTypes from "prop-types";
import Chess from  "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor

import Chessboard from "chessboardjsx";

class RandomVsRandom extends Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: "start" };

  componentDidMount() {
    this.game = new Chess();
    setTimeout(() => this.playNextMove(), 2000);
    this.setState({ fen: this.game.fen() });
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer());
  }

  timer = () => window.setTimeout(this.playNextMove, 2000);


    makeMoveForColor(color){

    }

    playNextMove = () => {
      //console.log(this.game.fen())
      var playerAtTurn = this.turn(this.game.fen())
      var fenForColor = this.getFenForColor(this.state.fen, playerAtTurn)
      //console.log(fenForColor)
      this.game.load(fenForColor)

      this.makeRandomMove()
      //this.setState({ fen: this.game.fen() });
      //this.timer();
    }

    makeRandomMove = () => {
      let possibleMoves = this.game.moves();
  
      // exit if the game is over
      if (
        this.game.game_over() === true ||
        this.game.in_draw() === true ||
        possibleMoves.length === 0
      )
        return;
  
      let randomIndex = Math.floor(Math.random() * possibleMoves.length);
      this.game.move(possibleMoves[randomIndex]);
      this.setState({ fen: this.game.fen() });
      
      //this.playNextMove()
      this.timer();
    };

    //returns which color's turn it is 
    turn(fen){
      var input = fen.split(" ")
      return input[1];
    }

    // ai need's to "see" the board always from the same perspective. (is this right???)
    getFenForColor(fen, color){
      var input = fen.split(" ")
      var output = "";

      if(color === "b") return fen; // normal layout, nothing to do
      else { // ai now play's the opposite site, we need to invert the board
        output += this.invertPositions(input[0]);
        output += " " + this.invertColor(input[1]);
        output += " " + this.invertCastling(input[2]);
        output += " " + this.invertEnPassant(input[3]);
        output += " " + input[4];
        output += " " + input[5];
      }
      return output;
    }

  invertPositions(positions){
    var input = positions.split("")
    var output = "";
    for(let i=input.length-1; i>=0;i--){
      var number = Number(input[i]);
      if(!isNaN(number)) output += input[i]; // input[i] is a number, nothing to convert
      else{
        if(input[i] === input[i].toLowerCase()) output += input[i].toUpperCase();
        else if(input[i] === input[i].toUpperCase()) output += input[i].toLowerCase();
      }
    }
    return output
  }

  invertCastling(castling){
    //TODO if neccessary
    return castling;
  }

  //invert the enPassent value
  invertEnPassant(enPassent){
    if(enPassent === "-") return enPassent;
    else{
      var tmp = enPassent.split("")
      var output = "";
      output += this.mapValue(tmp[0]);
      output += this.mapValue(tmp[1]);
    }
    return output;
  }

  //used for turning the board
  mapValue(value){
    var map={
      8: 1, 7: 2, 6: 3, 5: 4, 4: 5, 3: 6, 2: 7, 1: 8,
      "h":"a", "g":"b", "f":"c", "e":"d", "d":"e", "c":"f", "b":"g", "a":"h"
    }
    return(map[value])
  }

  //used for turning the board
  invertColor(color){
    if(color === "b") return "w";
    if(color === "w") return "b";
  }

  //converts an fen string to an array representation of the status
  //'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - c3 0 19'
  fenToArray(fen){
    var tmp = fen.split("");
    var board = [];

    for(let i=0; i<tmp.length;i++){      
      if(tmp[i] === " ") break; // array is completed
      if(tmp[i] === "/") continue; // next line, skip /
      else{
        var number = Number(tmp[i]);
        if(!isNaN(number) ){ // Numbers represents empty squares, wich we fill with Null        
          for(let j=0; j<number;j++) board.push(null)
        } else{ // we found a piece, add it as tuple to the array (piece, color)
            //var piece;
            if(tmp[i] === tmp[i].toLowerCase()) board.push([tmp[i], "b"])
            else board.push([tmp[i], "w"])
        }
      }
    }
    return board;

  }

  //convert the board array to a string. only for debug purpose
  boardToString(board){
    var str = "";

    for(let i=0;i<board.length;i++){
      if(board[i] === null) str += ". "
      else str += board[i][0] + "" + board[i][1]

      if((i+1)%8 === 0) str+= "\n"
      else str += " "
    }
    return str;
  }

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen });
  }
}

/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
export default function RandomVsRandomGame() {
  return (
    <div>
      <RandomVsRandom>
        {({ position }) => (
          <div>
          <Chessboard
            width={320}
            id="random"
            position={position}
            transitionDuration={300}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
          />
          <Chessboard
            width={320}
            id="random"
            position={position}
            transitionDuration={300}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
          />
          </div>        
        )}
      </RandomVsRandom>
    </div>
  );
}
