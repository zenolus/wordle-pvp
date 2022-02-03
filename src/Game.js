import React from "react";
import { IconContext } from "react-icons";
import { MdOutlineBackspace } from 'react-icons/md'
import { withSocket } from "./socket";

const keySet = [
	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
	['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
]

const isAlpha = ch => 
	(typeof ch === "string") && (ch.length === 1) && (((ch >= "a") && (ch <= "z")) || ((ch >= "A") && (ch <= "Z")))

const getCharCode = s => s.charCodeAt(0)

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			guesses: props.guesses ?? Array(6).fill(Array(5).fill('')),
			tileCheck: props.tileCheck ?? Array(6).fill(Array(5).fill('')),
			keyCheck: Array(26).fill(""),
			rowIndex: 0,
			colIndex: -1,
			rowShake: false,
			gameOver: false
		}
	}
	componentDidMount(){
		document.addEventListener("keydown", this.handleKeyPress)
		this.props.socket.on("invalid guess", this.handleShake)
		this.props.socket.on("result", result => {
			var {tileCheck, keyCheck, guesses, rowIndex, gameOver} = {...this.state};
			gameOver = result.reduce((acc, cur) => acc &= (cur === 'correct'), true) || rowIndex === 6
			for(var i = 0; i < 5; i++){
				const charCode = getCharCode(`${guesses[rowIndex][i]}`.toUpperCase()) - getCharCode('A');
				if((keyCheck[charCode] === "") || (keyCheck[charCode] === 'present' && result[i] === 'correct'))
					keyCheck[charCode] = result[i]
			}
			tileCheck[rowIndex++] = result;
			this.setState({
				guesses,
				tileCheck,
				keyCheck,
				colIndex: -1,
				rowIndex,
				gameOver
			})
		})
	}
	handleShake = () => {
		this.setState({rowShake: true});
		setTimeout(() => this.setState({rowShake: false}), 250);
	}
	handleKeyPress = e => {
		if(this.state.gameOver)	return;
		var newGuesses = this.state.guesses.map(row => row.slice())
		var {colIndex, rowIndex} = {...this.state}
		if(e.key === "Backspace"){
			if(colIndex === -1)	return;
			newGuesses[rowIndex][colIndex--] = '';
			this.setState({guesses: newGuesses, colIndex});
		} else if(e.key === "Enter") {
			if(colIndex !== 4)	return this.handleShake()
			const guess = newGuesses[rowIndex].join('');
			this.props.socket.emit("evaluate", guess)
		} else {
			if(colIndex === 4)	return;
			if(!isAlpha(e.key))	return;
			newGuesses[this.state.rowIndex][++colIndex] = e.key
			this.setState({guesses: newGuesses, colIndex});
		}
	}
	handleGameOver = () => this.setState({gameOver: true})
	render() {
		return (
			<>
				<div className='board-container'>
					<div className='board'>
						{this.state.guesses.map((guess, row) => (
							<div key = {row} className={`grid-row ${(this.state.rowShake && row === this.state.rowIndex) ? "shake" : ""}`}>
								{guess.map((letter, col) => 
									<div key = {[row, col]} className={`grid-tile ${this.state.tileCheck[row][col]}`}>{letter}</div> 
								)}
							</div>
						))}
					</div>
				</div>
				<div className='keyboard'>
					{keySet.map((keyRow, row) => 
						<div key = {row} className="key-row">
							{keyRow.map((key, col) => 
								<button
									key = {[row, col]}
									className={`key ${(key.length > 1) ? '' : this.state.keyCheck[getCharCode(key) - getCharCode('A')]}`}
									style={{maxWidth: key.length > 1 ? '60px' : '40px'}}
									onClick={() => this.handleKeyPress({key})}
								>{key !== 'Backspace' ? key :
									<IconContext.Provider value={{size: '2em'}}><MdOutlineBackspace/></IconContext.Provider>}
								</button>
							)}
						</div>
					)}
				</div>
			</>
		)
	}
}

export default withSocket(Game)