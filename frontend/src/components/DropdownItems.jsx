import React, { Component } from 'react';
import { gql } from '@apollo/client';
import styled from 'styled-components';

const GET_CURRENCIES = gql`
  query GetCurrencies {
    currencies {
      label
      symbol
    }
  }
`;

const Money = styled.span`
  cursor: pointer;
  font-family: 'Raleway';
  font-weight: 600;
  padding: 20px 40px 20px 20px;
  font-size: 18px;
  line-height: 160%;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  background-color: #fff;
  &:hover {
    background-color: #eee;
  }
`;

const DropdownMenu = styled.div`
  cursor: pointer;
  position: absolute;
  top: 80px;
  right: 60px;
  -webkit-box-shadow: 0px 3px 14px -12px rgba(66, 68, 90, 1);
  -moz-box-shadow: 0px 3px 14px -12px rgba(66, 68, 90, 1);
  box-shadow: 0px 3px 14px -12px rgba(66, 68, 90, 1);
  display: ${(props) => (props.visibility ? 'block' : 'none')};
`;

export default class DropdownItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
    };
  }

  componentDidMount() {
    this.getCurrencies();
  }

  async getCurrencies() {
    const result = await this.props.client.query({
      query: GET_CURRENCIES,
    });

    const currencies = [...this.state.currencies];

    if (result.data) {
      if (result.data.currencies) {
        result.data.currencies.map((currency, index) => {
          if(index === 0) {
            this.props.onChangeActiveCurrency(currency)
          }
          currencies.push({ label: currency.label, symbol: currency.symbol });
        });
      }
    }

    this.setState({ currencies });
  }

  render() {
    return (
      <DropdownMenu visibility={this.props.visibility}>
        {this.state.currencies.map(currency => (
          <Money onClick={() => this.props.onChangeActiveCurrency(currency)}>{currency.symbol} {currency.label}</Money>
        ))}
      </DropdownMenu>
    );
  }
}
