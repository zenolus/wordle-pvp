import './App.css';
import { FaRegQuestionCircle } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import React from 'react';
import Game from './Game'

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showHelp: false
		}
	}
	handleHelpToggle = () => this.setState({showHelp: !this.state.showHelp})
	render() {
		return (
			<div className = "main-content">
				<header>
					<div className= "title">WORDLE PvP</div>
					<div className= "help">
						<IconContext.Provider value = {{ size: "1.5em" }}>
							<FaRegQuestionCircle style = {{cursor: 'pointer'}} onClick = {this.handleHelpToggle} />
						</IconContext.Provider>
					</div>
				</header>
				{
					this.state.showHelp ? 
					<div>

					</div> : <Game />
				}
			</div>
		);
	}
}

export default App;
