import React, { Component } from 'react';

import CartView from '../components/CartView';

export default class Cart extends Component {
  render() {
    return <CartView ActiveCurrency={this.props.ActiveCurrency}></CartView>;
  }
}
