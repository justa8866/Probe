import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { withProductIdParam } from './withRouter';
import styled from 'styled-components';
import { mobile } from '../responsive';

const GET_PRODUCT = gql`
  query ($productId: String!) {
    product(id: $productId) {
      category
      name
      description
      gallery
      inStock
      brand
      id
      attributes {
        name
        items {
          displayValue
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
    }
  }
`;

const Container = styled.div`
  font-family: Raleway;
  ${mobile({ height: '50vh' })}
`;
const Wrapper = styled.div`
  padding: 80px 97px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  color: #1d1f22;
`;

const Left = styled.div`
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 100px;
  cursor: pointer;
  margin-top: 50px;
  ${mobile({ height: '40vh', width: '30vh' })}

  &:first-child {
    margin-top: 0px;
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  display: block;
`;

const ImageCenterContainer = styled.div`
  max-width: 610px;
  width: 100%;
  cursor: pointer;
  padding-left: 50px;
  ${mobile({ height: '40vh', width: '30vh' })}
`;

const Center = styled.div``;

const Right = styled.div`
  margin-left: auto;
  padding-left: 100px;
  ${mobile({ flex: 2, justifyContent: 'center' })}
`;

const Name = styled.div`
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 27px;
`;

const Text = styled.div`
  font-family: 'Raleway';
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 27px;
`;

const Size = styled.div``;

const StandardText = styled.div`
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 18px;
  text-transform: uppercase;
`;

const ButtonBox = styled.div`
  display: flex;
`;

const Button = styled.div`
  padding: 15px 30px;
  margin-top: 10px;
  margin-right: 10px;
  border: 1px solid black;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  &:hover {
    background: #1d1f22;
    color: #fff;
    cursor: pointer;
  }
`;

const ActiveButton = styled(Button)`
  background: #1d1f22;
  color: #fff;
`;

// Color

const Color = styled.div`
  padding-top: 20px;
  padding-bottom: 30px;
`;

const ColorBox = styled.div`
  display: flex;
`;

const Box = styled.div`
  height: 20px;
  width: 20px;
  margin-top: 10px;
  margin-right: 10px;
  justify-content: space-between;
  background: ${(props) => props.background};
  &:hover {
    border: 1px solid white;
    outline: 1px solid #5ece7b;
    cursor: pointer;
  }
`;

const ActiveBox = styled(Box)`
  border: 1px solid white;
  outline: 1px solid #5ece7b;
  cursor: pointer;
`;

// PRICE

const Description = styled.div`
  width: 100%;
  word-wrap: break-word;
  display: inline-block;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 159.96%;
`;

const Price = styled.div`
  font-weight: 600;
`;

const PriceValue = styled.div`
  font-weight: 600;
`;

const ButtonAddToCart = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;
  font-family: 'Raleway';
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  background: #5ece7b;
  &:hover {
    cursor: pointer;
  }
`;

class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActiveCategory: '',
      product: new Object(),
      selectedImage: '',
      selectedAttributes: [],
    };
  }

  async componentDidMount() {
    await this.getProduct();
  }

  async componentDidUpdate(previousProps) {
    if (previousProps.productId !== this.props.productId) {
      await this.getProduct();
    }
  }

  async getProduct() {
    const result = await this.props.client.query({
      query: GET_PRODUCT,
      variables: { productId: this.props.productId },
    });

    if (result.data) {
      if (result.data.product) {
        this.setState({
          product: result.data.product,
          selectedImage: result.data.product.gallery[0],
        });

        const attributes = [...this.state.selectedAttributes];
        result.data.product.attributes.map((attribute) =>
          attributes.push({ name: attribute.name, value: null })
        );
        this.setState({ selectedAttributes: attributes });
      }
    }
  }

  getPrice() {
    if (!this.state.product.prices) {
      return 0;
    }

    const price = this.state.product.prices.find(
      (price) => price.currency.label === this.props.ActiveCurrency.label
    );

    return price.currency.symbol + price.amount;
  }

  generateGallery() {
    if (!this.state.product) {
      return <></>;
    }

    if (!this.state.product.gallery) {
      return <></>;
    }

    return this.state.product.gallery.map((image, index) => (
      <ImageContainer
        key={index}
        onClick={() => this.setState({ selectedImage: image })}
      >
        <Image src={image} />
      </ImageContainer>
    ));
  }

  addToCart() {
    const cart = [];
    const cartStorage = localStorage.getItem('cart');

    if(cartStorage) {
      JSON.parse(cartStorage).map(item => cart.push(item));
    }

    const cartProductIndex = cart.findIndex(item => item.product.id == this.state.product.id);
    
    if(cartProductIndex > -1) {
      cart[cartProductIndex].quantity += 1;
    } else {
      cart.push({ product: this.state.product, attributes: this.state.selectedAttributes, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.props.onAddToCart();
  }

  setAttribute(name, value) {
    this.setState({
      selectedAttributes: this.state.selectedAttributes.map((item) => {
        if (item.name === name) {
          item.value = value;
        }

        return item;
      }),
    });
  }

  attributeSelected(name, value) {
    const attribute = this.state.selectedAttributes.find(
      (attribute) => attribute.name === name
    );

    if (!attribute) {
      return false;
    }

    return attribute.value == value;
  }

  generateAttributes() {
    if (!this.state.product) {
      return <></>;
    }

    if (!this.state.product.attributes) {
      return <></>;
    }

    return this.state.product.attributes.map((attribute) => {
      if (attribute.name.toLowerCase() === 'color') {
        return (
          <Color>
            <StandardText>COLOR:</StandardText>
            <ColorBox>
              {attribute.items.map((item) => {
                return this.attributeSelected(
                  attribute.name,
                  item.displayValue
                ) ? (
                  <ActiveBox background={item.displayValue} />
                ) : (
                  <Box
                    background={item.displayValue}
                    onClick={() =>
                      this.setAttribute(attribute.name, item.displayValue)
                    }
                  />
                );
              })}
            </ColorBox>
          </Color>
        );
      }

      return (
        <Size>
          <StandardText>{attribute.name}:</StandardText>
          <ButtonBox>
            {attribute.items.map((item) => {
              return this.attributeSelected(
                attribute.name,
                item.displayValue
              ) ? (
                <ActiveButton>{item.displayValue}</ActiveButton>
              ) : (
                <Button
                  onClick={() =>
                    this.setAttribute(attribute.name, item.displayValue)
                  }
                >
                  {item.displayValue}
                </Button>
              );
            })}
          </ButtonBox>
        </Size>
      );
    });
  }

  render() {
    return (
      <>
        <Container>
          <Wrapper>
            <Left>{this.generateGallery()}</Left>
            <Center>
              <ImageCenterContainer>
                <Image src={this.state.selectedImage} />
              </ImageCenterContainer>
            </Center>
            <Right>
              <Name>{this.state.product.name}</Name>
              <Text>{this.state.product.id}</Text>
              {this.generateAttributes()}
              <Price>
                <StandardText>PRICE:</StandardText>
                <PriceValue>{this.getPrice()}</PriceValue>
              </Price>

              <Description
                dangerouslySetInnerHTML={{
                  __html: this.state.product.description,
                }}
              ></Description>
              <ButtonAddToCart onClick={() => this.addToCart()}>ADD TO CART</ButtonAddToCart>
            </Right>
          </Wrapper>
        </Container>
      </>
    );
  }
}

export default withProductIdParam(ProductView);
