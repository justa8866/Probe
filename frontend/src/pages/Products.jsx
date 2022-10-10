import React, { Component } from 'react';
import ProductsList from '../components/ProductsList';

export default class Products extends Component {
  render() {
    return (
      <div>
        <ProductsList
          client={this.props.client}
          ActiveCategory={this.props.ActiveCategory}
          ActiveCurrency={this.props.ActiveCurrency}
        />
      </div>
    );
  }
}
