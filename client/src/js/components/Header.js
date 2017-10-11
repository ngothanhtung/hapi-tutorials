import React from "react";

export default class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<h1 style={{ color: '#CB3837' }}>{this.props.text}</h1>
		);
	}
}
