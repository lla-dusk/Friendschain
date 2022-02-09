import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../img/Logo.png";

const Header = ({ account, udName, onConnectWallet, onDisconnect }) => {
  const address = account
    ? account.slice(0, 6) + "....." + account.slice(-7)
    : null;

  console.log("Header UDName: ", udName);
  console.log("Header Account Address: ", account);

  const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-around;
    /* width: 100vw; */
    height: 80px;
    /* padding: 12px; */

    background: #f0f0f3;
    /* box-shadow: 5px 5px 6px #baab7b, -5px -5px 6px #cab985; */
    box-shadow: 6px 6px 18px #e9e9ec, -6px -6px 18px #f7f7fa;
    top: 0;
    position: sticky;
    z-index: 10;
  `;

  const Logo = styled.div`
    top: 25px;
    left: 70px;
    position: absolute;
    /* padding: 0px 10px; */
    border: none;
  `;

  const HeaderFields = styled.div`
    display: flex;
    top: 15px;
    right: 40px;
    position: absolute;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 15px;
    /* padding: 0px 10px; */
  `;

  const Item = styled.div`
    /* text-align: center; */
    color: black;
    text-decoration: none;
    height: 40px;
    width: fit-content;
    border-radius: 10px;
    box-shadow: 9px 9px 20px #e6e6e9, -9px -9px 20px #fafafd;
    display: grid;
    align-content: center;
    justify-content: center;
    margin: 0px 10px;
    padding: 5px 15px;

    &:hover {
      cursor: pointer;
      box-shadow: inset 9px 9px 20px #e6e6e9, inset -9px -9px 20px #fafafd;
    }
  `;

  const Wallet = styled(Item)`
    /* position: inherit; */
    /* margin-right: 50px; */
  `;

  const Image = styled.img`
    height: 40px;
  `;

  // let account = false;

  return (
    <HeaderContainer>
      <Logo>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          {/* <h2>F . R . I . E . N . D . S</h2> */}
          <Image src={logo} />
        </Link>
      </Logo>
      {account === "" || (typeof account === "undefined" && udName === "") ? (
        <HeaderFields>
          <Wallet onClick={() => onConnectWallet()}>
            <h3>Login</h3>
          </Wallet>
        </HeaderFields>
      ) : (
        <HeaderFields>
          <Item>
            <Link
              to={`${account}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h4>PROFILE</h4>
            </Link>
          </Item>
          <Item onClick={onDisconnect}>
            {/* <h4>0x5c03.....08ef587</h4> */}
            {udName === "" ? <h4>{address}</h4> : <h4>{udName}</h4>}
          </Item>
        </HeaderFields>
      )}
    </HeaderContainer>
  );
};

export default Header;
