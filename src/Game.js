import React from "react";
import { IconContext } from "react-icons";
import { MdOutlineBackspace } from 'react-icons/md'

const keySet = [
	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
	['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
]

const isAlpha = ch => 
	(typeof ch === "string") && (ch.length === 1) && (((ch >= "a") && (ch <= "z")) || ((ch >= "A") && (ch <= "Z")))

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			guesses: props.guesses ?? Array(6).fill(Array(5).fill('')),
			tileCheck: props.tileCheck ?? Array(6).fill(Array(5).fill('')),
			keyCheck: props.keyCheck ?? Array(3).fill(Array(10).fill('')),
			rowIndex: 0,
			colIndex: -1,
			rowShake: false,
			gameOver: false
		}
	}
	componentDidMount(){
		document.addEventListener("keydown", this.handleKeyPress)
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
			if(colIndex !== 4){
				this.setState({rowShake: true});
				setTimeout(() => this.setState({rowShake: false}), 250);
				return;
			}
			// Send to socket for check
			console.log(newGuesses[rowIndex].join(''))
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
							<div className={`grid-row ${(this.state.rowShake && row === this.state.rowIndex) ? "shake" : ""}`}>
								{guess.map((letter, col) => 
									<div className={`grid-tile ${this.state.tileCheck[row][col]}`}>{letter}</div> 
								)}
							</div>
						))}
						{/* <input type = "text" hidden onKeyPress={ e => this.handleKeyPress(e) } /> */}
					</div>
				</div>
				<div className='keyboard'>
					{keySet.map((keyRow, row) => 
						<div className="key-row">
							{keyRow.map((key, col) => 
								<button className={`key ${this.state.keyCheck[row][col]}`}
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

export default Game