import React, { Component } from 'react';
import styled from 'styled-components';
import { mobile } from '../responsive';
import { Link } from 'react-router-dom';

const Container = styled.div`
  margin: 20px;
`;
const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: '10px', flexDirection: 'column' })}
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #1d1f22;
  font-family: 'Raleway';
  &:link {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
  }

  &:visited {
    text-decoration: inherit;
    color: inherit;
    cursor: auto;
  }
`;

const ImageContainer = styled.div`
  width: 19vw;
  height: 20vh;
  ${mobile({ height: '40vh', width: '30vh' })}
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  display: block;
`;

const ProductName = styled.span`
  font-weight: 500;
  line-height: 160%;
  text-align: left;
`;

const Price = styled.span`
  font-weight: 600;
  line-height: 160%;
  text-align: left;
`;

export default class ProductBox extends Component {
  getPrice() {
    if (!this.props.product.prices) {
      return 0;
    }

    const price = this.props.product.prices.find(price => price.currency.label === this.props.ActiveCurrency.label);

    return price.currency.symbol + price.amount;
  }

  render() {
    const { product } = this.props;
    return (
      <div>
        <Container>
          <Wrapper>
            <Link to={`/product/${product.id}`}>
              <ProductContainer>
                <ImageContainer>
                  <Image src={product.gallery[0]} />
                </ImageContainer>
                <ProductName> {product.name} </ProductName>
                <Price>
                  {this.getPrice()}
                </Price>
              </ProductContainer>
            </Link>
          </Wrapper>
        </Container>
      </div>
    );
  }
}
