/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Chess from  "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor
import Chessboard from "chessboardjsx";
import * as tf from '@tensorflow/tfjs';
import { any } from "@tensorflow/tfjs";


//Initialize Q randomly
//Choose action from Q but give space for exploration
//perform action
//measure reward
//update Q

class MyAgent extends Component{

    static propTypes = { children: PropTypes.func/*, model: tf.Sequential, prediction: any*/ };

    state = { fen: "start"};

    intitializeModel(){
        const LEARNING_RATE = 0.15;
        const optimizer = tf.train.sgd(LEARNING_RATE);
        let FIELDS = 64; //all fields of the board
        let PIECES = 6; // pawn	knight	bishop	rook	queen king
        let COLOR = 2; // black and white
        
        //this.model = tf.sequential();
        //this.model.add(tf.layers.conv2d({inputShape: [64, 6, 2], kernelSize: 5, filters: 8, strides: 1, activation: 'relu'}))
        //this.model.add(tf.layers.conv2d(64, (3, 3)/*, input_shape=(FIELDS, PIECES, COLOR), data_format="channels_last"*/))
        //this.model.add(tf.layers.Activation('relu'))
        //this.model.add(tf.layers.maxPooling2d({poolSize:[2, 2], strides: [2, 2]}))
        //this.model.add(tf.layers.conv2d({kernelSize: 5, filters: 16, strides: 1, activation: 'relu'}))
        //this.model.add(tf.layers.conv2d(64, (3, 3)))
        //this.model.add(tf.layers.Activation('relu'))
        //this.model.add(tf.layers.conv2d(64, (3, 3)))
        //this.model.add(tf.layers.Activation('relu'))
        //this.model.add(tf.layers.conv2d(64, (3, 3)))
        //this.model.add(tf.layers.Activation('relu'))

        //this.model.add(tf.layers.flatten())
        //this.model.add(tf.layers.Dropout(0.5))
        //this.model.add(tf.layers.dense(400))
        //this.model.add(tf.layers.Activation('relu'))
        //this.model.add(tf.layers.Dropout(0.5))
        //this.model.add(tf.layers.dense({units: 1, kernelInitializer: 'VarianceScaling', activation: 'softmax'})); // units: answer, the move we should do ?
        //this.model.add(tf.layers.dense(1))
        //this.model.add(tf.layers.Activation('softmax'))
        //this.model.compile(loss='categorical_crossentropy', optimizer='adamax', metrics=['accuracy'])
        //this.model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy', metrics: ['accuracy'], });
        
        
    } 

    componentDidMount() {
      this.intitializeModel();
        this.reset();
    }

    componentWillUnmount() {
      window.clearTimeout(this.timer());
    }

    //function that waits for x seconds, then call the next move (not needed for learning, since we don't need a delay)
    timer = () => window.setTimeout(this.makeRandomMove, 2000);

    //clears the board and initialize with default starting positions. returns this as state
    reset(){
        this.game = new Chess();
        this.setState({ fen: this.game.fen() });
        setTimeout(() => this.makeRandomMove(), 1000);
    }

    async trainModel(observation){

    }

    q_learning(game){

    }

    //execute a move on the board, return observation(state after action), reward, done, info
    step(action){

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
      //console.log(this.boardToString(this.fenToArray(this.state.fen)))
      this.boardToBitmap(this.fenToArray(this.state.fen))
      //this.createArray(1,1,1)
      this.timer();
    };

    
    //returns the current positions as state array(maybe fen -> state)
    // the state array will be directly be feeded into the Neural Network
    //state array: position[1-64], piecetype[1-6], color[w, b]  ???
    // needs perspective input, since ai can be black or white ??
    getState(board){
        return this.fenToArray(this.game.fen())
    }

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
/*
  transformToBitmap(fen){
    var tmp = fen.split("")
    var bitmap = this.getEmptyBitmap(8, 12)
    

    for(let i=0; i<tmp.length;i++){      
      if(tmp[i] === " ") break; // array is completed
      if(tmp[i] === "/") continue; // next line, skip /
      else{
        var number = Number(tmp[i]);
        if(!isNaN(number) ){ // Numbers represents empty squares, wich we fill with Null 


  }
  */

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

  boardToBitmap(board, dimension, pieces){
    var bitmap = this.getEmptyBitmap(8,12) 

    // the board is a 64 length list, wich we need to transform into a 8x8 array
    for(let i=0;i<board.length;i++){
        let x = Math.floor(i/8) // round down to get our x coord
        let y = i%8 // modulo for our y coord        

        if(board[i] !== null)
        switch(board[i][0]){
          case "p": bitmap[x][y][0] = 1; break;
          case "P": bitmap[x][y][6] = 1; break;
          case "n": bitmap[x][y][1] = 1; break;
          case "N": bitmap[x][y][7] = 1; break;
          case "b": bitmap[x][y][2] = 1; break;
          case "B": bitmap[x][y][8] = 1; break;
          case "r": bitmap[x][y][3] = 1; break;
          case "R": bitmap[x][y][9] = 1; break;
          case "q": bitmap[x][y][4] = 1; break;
          case "Q": bitmap[x][y][10] = 1; break;
          case "k": bitmap[x][y][5] = 1; break;
          case "K": bitmap[x][y][11] = 1; break;
          default: console.log("Wrong entry at board[i] found in boardToBitmap")
        }
    }
    return bitmap;
  }

  getXY(i){


  }

  //this function creates an multidimensional array dimension x dimension x figures for our bitmap presentation
  getEmptyBitmap(dimension, figures){
    var bitmap = new Array(dimension)

    for(let x=0; x<dimension;x++){
      bitmap[x] = new Array(dimension)
      for(let y=0; y<dimension; y++){
        bitmap[x][y] = new Array(figures)
        for(let z=0; z< figures; z++){
          bitmap[x][y][z] = 0; // fill all with zero = no piece present
        }
      }
    }
    return bitmap
  } 

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen });
  }  

}


    
    /* eslint react/display-name: 0 */
    /* eslint react/prop-types: 0 */
    export default function MyAgentGame() {
      return (
        <div>
          <MyAgent>
            {({ position }) => (
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
            )}
          </MyAgent>
        </div>
      );
}