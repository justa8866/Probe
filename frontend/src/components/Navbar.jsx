import React, { Component } from 'react';
import { gql } from '@apollo/client';
import styled from 'styled-components';
import { mobile } from '../responsive';
import bag from '../images/bag.png';
import trolley from '../images/trolley.png';
import arrow from '../images/arrow.png';
import DropdownItems from './DropdownItems';
import { Link } from 'react-router-dom';
import { withCategoryParam } from './withRouter';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      name
    }
  }
`;

const Container = styled.div`
  height: 80px;
  text-align: center;
  font-family: Raleway;
  line-height: 120%;
  ${mobile({ height: '50px' })}
`;
const Wrapper = styled.div`
  padding: 10px 97px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  flex: 1;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: 'center' })}
`;

const Bag = styled.img`
  cursor: pointer;
  width: 31px;
  height: 29px;
`;

const Category = styled.div`
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 0px 20px;
  color: #1d1f22;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  height: 80px;
`;

const ActiveCategory = styled(Category)`
  color: #5ece7b;
  border-bottom: 1.5px solid #5ece7b;
`;
const Dollar = styled.span`
  cursor: pointer;
  font-family: 'Raleway';
  font-weight: 600;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  margin-right: 30px;
`;

const MenuTrigger = styled.img`
  position: absolute;
  cursor: pointer;
  width: 10px;
  height: 6px;
  top: 50px;
  right: 130px;
`;

const Trolley = styled.span`
  width: 20px;
  height: 13px;
  margin-left: 20px;
  position: absolute;
  margin-top: 18px;
`;

const TrolleyImage = styled.img`
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: -15px;
  width: 22px;
  height: 22px;
  background: black;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 600;
  margin: 0 auto;
  flex-direction: column;
  padding-bottom: 2.5px;
  cursor: pointer;
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsDropdownShow: false,
      categories: [],
      ActiveCurrency: new Object()
    };
  }

  onChangeActiveCurrency = (currency) => {
    this.setState({ ActiveCurrency: currency, IsDropdownShow: false });
    this.props.onChangeActiveCurrency(currency);
  };

  componentDidMount() {
    this.getCategories();
  }

  async getCategories() {
    const result = await this.props.client.query({
      query: GET_CATEGORIES,
    });

    const categories = [...this.state.categories];

    if (result.data) {
      if (result.data.categories) {
        if (result.data.categories.length) {
          result.data.categories.map((item) => categories.push(item.name));
        }
      }
    }

    this.setState({ categories });
    this.props.onChangeActiveCategory(categories[0]);
  }

  setDropDownState() {
    this.setState((state) => {
      return { IsDropdownShow: !state.IsDropdownShow };
    });
  }

  getCategory() {
    return this.props.category
      ? this.props.category
      : this.props.ActiveCategory;
  }

  generateCategories() {
    return this.state.categories.map((category, index) => {
      if (this.getCategory() === category) {
        return (
          <Link to={`/products/${category}`} key={index}>
            <ActiveCategory>{category}</ActiveCategory>
          </Link>
        );
      }

      return (
        <Link to={`/products/${category}`} key={index}>
          <Category
            onClick={() => this.props.onChangeActiveCategory(category)}
          >
            {category}
          </Category>
        </Link>
      );
    });
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <Left>{this.generateCategories()}</Left>
          <Center>
            <Bag src={bag} alt="" />
          </Center>
          <Right>
            <Dollar onClick={() => this.setDropDownState()}>{this.state.ActiveCurrency.symbol}</Dollar>
            <MenuTrigger src={arrow} onClick={() => this.setDropDownState()} />
            <DropdownItems
              visibility={this.state.IsDropdownShow ? true : undefined}
              client={this.props.client}
              ActiveCurrency={this.state.ActiveCurrency}
              onChangeActiveCurrency={this.onChangeActiveCurrency}
            />
            <Link to='/cart'>
              <Trolley>
                <TrolleyImage src={trolley} alt="" />
                {this.props.CartItemCount > 0 ? <Badge>{this.props.CartItemCount}</Badge> : <></>}
              </Trolley>
            </Link>
          </Right>
        </Wrapper>
      </Container>
    );
  }
}

export default withCategoryParam(Navbar);
