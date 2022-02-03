import React from 'react'
import socketIOClient from 'socket.io-client'
import env from "react-dotenv";

export const SocketContext = React.createContext(socketIOClient(`${env.API_URL}:${env.API_PORT}`))

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