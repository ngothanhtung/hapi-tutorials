import React from "react";
import Header from "./Header";
import Product from "./Product";

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {		
		return (
			<div>
				<Header text="Hello React" />
				<Product />
			</div>
		);
	}
}
