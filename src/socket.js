import React from 'react'
import socketIOClient from 'socket.io-client'

export const SocketContext = React.createContext(socketIOClient(`http://localhost:8000`))

export const withSocket = Component => 
	class SocketedComponent extends React.Component {
		render() {
			return (
				<SocketContext.Consumer>
					{ socket => <Component socket = {socket} /> }
				</SocketContext.Consumer>
			)
		}
	}