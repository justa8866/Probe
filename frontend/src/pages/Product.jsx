import React, { Component } from 'react';

import ProductView from '../components/ProductView';

export default class Product extends Component {
  onAddToCart = () => {
    this.props.onAddToCart();
  }

  render() {
    return (
      <div>
        <ProductView client={this.props.client} ActiveCurrency={this.props.ActiveCurrency} onAddToCart={this.onAddToCart}></ProductView>
      </div>
    );
  }
}
