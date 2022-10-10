import React, { Component } from 'react';
import styled from 'styled-components';
import { mobile } from '../responsive';


const Container = styled.div`
  height: 80px;
  text-right: center;
  font-family: Raleway;
  line-height: 120%;
  margin-left: 100px; 
  margin-top: 80px; 
  ${mobile({ height: '50px' })}

  .hr{
    background: #E5E5E5;
  }
  
`;

export default class CartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.getCart();
  }

  getCart() {
    const cart = [];
    const cartStorage = localStorage.getItem('cart');

    if (cartStorage) {
      JSON.parse(cartStorage).map((item) => cart.push(item));
    }

    this.setState({ cartItems: cart });
  }

  generateCart() {
    return this.state.cartItems.map((item, index) => {
      return (
        <div key={index}>
          {item.product.name} <br />
          {item.product.brand} <br />x{item.quantity} <br />
          {this.props.ActiveCurrency.symbol}
          {this.getPrice(item.product)} <br />
        </div>
      );
    });
  }

  getTotalQuantity() {
    let cartItemCount = 0;
    this.state.cartItems.map((item) => (cartItemCount += item.quantity));
    return cartItemCount;
  }

  getTotalPrice() {
    let sum = 0;
    this.state.cartItems.map(
      (item) => (sum += item.product.prices[0].amount * item.quantity)
    );
    return sum;
  }

  getPrice(product) {
    if (!product.prices) {
      return 0;
    }

    const price = product.prices.find(
      (price) => price.currency.label === this.props.ActiveCurrency.label
    );

    if (!price) {
      return 0;
    }

    return price.amount;
  }

  render() {
    return (
      <Container>
        <h1>Cart</h1>
        <hr/>
        <div>{this.generateCart()}</div>
        <div>
          Tax 21%: {this.props.ActiveCurrency.symbol}
          {this.getTotalPrice() * 0.21} <br />
          Quantity: {this.getTotalQuantity()} <br />
          Total: {this.props.ActiveCurrency.symbol}
          {this.getTotalPrice()}
        </div>
      </Container>
    );
  }
}
