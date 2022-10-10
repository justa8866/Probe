import React, { Component } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Products from './pages/Products';
import Product from './pages/Product';

import Navbar from './components/Navbar';

import '../src/App.css';
import Cart from './pages/Cart';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActiveCategory: '',
      ActiveCurrency: new Object(),
      CartItemCount: 0,
    };
  }

  componentDidMount() {
    this.onAddToCart();
  }

  onChangeActiveCategory = (category) => {
    this.setState({ ActiveCategory: category });
  };

  onChangeActiveCurrency = (currency) => {
    this.setState({ ActiveCurrency: currency });
  };

  onAddToCart = () => {
    let cartItemCount = 0;
    const cartStorage = localStorage.getItem('cart');

    if(cartStorage) {
      JSON.parse(cartStorage).map(item => cartItemCount += item.quantity);
    }

    this.setState({ CartItemCount: cartItemCount });
  }

  render() {
    return (
      <BrowserRouter>
        <Navbar
          client={this.props.client}
          onChangeActiveCategory={this.onChangeActiveCategory}
          ActiveCategory={this.state.ActiveCategory}
          onChangeActiveCurrency={this.onChangeActiveCurrency}
          CartItemCount={this.state.CartItemCount}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Products
                client={this.props.client}
                ActiveCategory={this.state.ActiveCategory}
                ActiveCurrency={this.state.ActiveCurrency}
              />
            }
          />
          <Route
            path="products/:category"
            element={
              <Products
                client={this.props.client}
                ActiveCategory={this.state.ActiveCategory}
                ActiveCurrency={this.state.ActiveCurrency}
              />
            }
          />
          <Route
            path="product/:productId"
            element={
              <Product
                client={this.props.client}
                ActiveCurrency={this.state.ActiveCurrency}
                onAddToCart={this.onAddToCart}
              />
            }
          />
          <Route
            path="cart"
            element={
              <Cart ActiveCurrency={this.state.ActiveCurrency} />
            }
          />
        </Routes>
      </BrowserRouter>
    );
  }
}
