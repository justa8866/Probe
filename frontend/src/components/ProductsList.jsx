import React, { Component } from 'react';
import { gql } from '@apollo/client';
import styled from 'styled-components';

import { withCategoryParam } from './withRouter';
import ProductBox from './ProductBox';

const GET_PRODUCTS = gql`
  query ($category: String!) {
    category(input: { title: $category }) {
      name
      products {
        gallery
        inStock
        id
        name
        prices {
          currency {
            label
            symbol
          }
          amount
        }
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryName = styled.div`
  margin-top: 80px;
  margin-bottom: 80px;
  margin-left: 100px;
  font-weight: 400;
  font-size: 42px;
  text-align: left;
  text-transform: capitalize;
`;

class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  componentDidUpdate(previousProps) {
    if(previousProps.category !== this.props.category) {
      this.getProducts();
    }
  }

  getCategoryName() {
    return this.props.category
      ? this.props.category
      : this.props.ActiveCategory;
  }

  async getProducts() {
    const result = await this.props.client.query({
      query: GET_PRODUCTS,
      variables: { category: this.getCategoryName() },
    });

    if (result.data) {
      if (result.data.category) {
        if (result.data.category.products) {
          if (result.data.category.products.length) {
            this.setState({ products: result.data.category.products });
            console.log(result.data.category.products);
          }
        }
      }
    }
  }

  generateProducts() {
    return this.state.products.map((product, index) => {
      return <ProductBox product={product} ActiveCurrency={this.props.ActiveCurrency} key={index}></ProductBox>;
    });
  }

  render() {
    return (
      <>
        <CategoryName>{this.getCategoryName()}</CategoryName>
        <Container>{this.generateProducts()}</Container>
      </>
    );
  }
}

export default withCategoryParam(ProductsList);
