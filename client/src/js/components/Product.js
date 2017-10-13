import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const baseUrl = "/product",
	

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			products: [],

			product: {
				_id: '',
				name: '',
				price: 0,
				imageUrl: ''
			}
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// BINDING
	handleChange(field, event) {
		var object = this.state.product;
		object[field] = event.target.value;
		this.setState({ product: object });
	}

	// SUBMIT (ADD / EDIT)
	handleSubmit(event) {
		event.preventDefault();
		var component = this;
		var productId = ReactDOM.findDOMNode(component.refs.product_id).value;

		if (productId.length === 0) {
			// INSERT
			var insertData = JSON.stringify({
				name: ReactDOM.findDOMNode(this.refs.product_name).value,
				price: ReactDOM.findDOMNode(this.refs.product_price).value,
				imageUrl: ReactDOM.findDOMNode(this.refs.product_image_url).value,
			});

			fetch(baseUrl, {
				method: 'POST',
				body: insertData,
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			})
				.then(res => res.json())
				.then((data) => {
					var products = component.state.products;
					products.push(data);

					component.state.product = {
						_id: '',
						name: '',
						price: 0,
						imageUrl: ''
					};

					component.setState(this.state);

				}).catch((err) => {
					console.log(err);
				});
		} else {
			// EDIT
			var editData = JSON.stringify({
				name: ReactDOM.findDOMNode(this.refs.product_name).value,
				price: ReactDOM.findDOMNode(this.refs.product_price).value,
				imageUrl: ReactDOM.findDOMNode(this.refs.product_image_url).value,
			});

			fetch(baseUrl + '/' + productId, {
				method: 'PUT',
				body: editData,
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			})
				.then(res => res.json())
				.then((data) => {
					var products = component.state.products;
					for (var i = 0; i < products.length; i++) {
						if (products[i]._id === productId) {

							products[i].name = ReactDOM.findDOMNode(this.refs.product_name).value;
							products[i].price = ReactDOM.findDOMNode(this.refs.product_price).value;
							products[i].imageUrl = ReactDOM.findDOMNode(this.refs.product_image_url).value;

							component.state.product = {
								_id: '',
								name: '',
								price: 0,
								imageUrl: ''
							};

							component.setState(this.state);

							return false;
						}
					}
				}).catch((err) => {
					console.log(err);
				});
		}
	}

	// SELECT ROW
	handleSelect(productId, event) {
		for (var i = 0; i < this.state.products.length; i++) {
			if (this.state.products[i]._id === productId) {
				this.state.product = this.state.products[i];
				this.setState({ product: this.state.product });
				return false;
			}
		}
	}

	// DELETE
	handleDelete(productId, event) {
		var component = this;
		fetch(baseUrl + '/' + productId, {
			method: 'DELETE',
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then(res => res.json())
			.then((data) => {
				var products = component.state.products;
				for (var i = 0; i < products.length; i++) {
					if (products[i]._id === productId) {
						products.splice(i, 1);
						component.setState({ products: products });
						return false;
					}
				}
			}).catch((err) => {
				console.log(err);
			});
	}

	componentDidMount() {
		fetch(baseUrl + '/all')
			.then(res => res.json())
			.then((data) => {
				this.setState({ products: data });
				this.setState({ loading: false });
			});
	}

	render() {
		if (this.state.loading === false) {
			return (
				<div>
					<h1>Products</h1>
					<table class="table table-hover">
						<thead>
							<tr>
								<th>Id</th>
								<th>Name</th>
								<th>Price</th>
								<th>Image</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{this.state.products.map(p =>
								<tr key={p._id}>
									<td>{p._id}</td>
									<td>{p.name}</td>
									<td>{p.price}</td>
									<td>
										<img src={p.imageUrl} height="100px" />
									</td>
									<td class="text-right">
										<div class="btn-group">
											<button class="btn btn-danger" onClick={this.handleDelete.bind(this, p._id)}>Delete</button>
											<button class="btn btn-info" onClick={this.handleSelect.bind(this, p._id)}>Select</button>											
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<hr />
					<form onSubmit={this.handleSubmit}>
						<div class="form-group">
							<label>Id:</label>
							<input type="text" readOnly class="input form-control" ref="product_id" value={this.state.product._id} onChange={this.handleChange.bind(this, '_id')} />
						</div>
						<div class="form-group">
							<label>Name:</label>
							<input type="text" class="input form-control" ref="product_name" value={this.state.product.name} onChange={this.handleChange.bind(this, 'name')} />
						</div>
						<div class="form-group">
							<label>Price:</label>
							<input type="text" class="input form-control" ref="product_price" value={this.state.product.price} onChange={this.handleChange.bind(this, 'price')} />
						</div>
						<div class="form-group">
							<label>Image Url:</label>
							<input type="text" class="input form-control" ref="product_image_url" value={this.state.product.imageUrl} onChange={this.handleChange.bind(this, 'imageUrl')} />
						</div>
						<div>
							<input class="btn btn-primary" type="submit" value="Submit" />
						</div>
					</form>
				</div>
			);
		}
		else {
			return (<h1>Loading ...</h1>);
		}
	}
}
export default Product;
