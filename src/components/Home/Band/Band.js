import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import web3 from "../../../ethereum/web3";
import Friends from "../../../ethereum/Friends";
import Resolution from "@unstoppabledomains/resolution";

const BandContainer = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  margin: 20px 0px 20px 0px;
`;

const Box = styled.div`
  height: 250px;
  width: 70vw;
  box-shadow: 6px 6px 18px #e9e9ec, -6px -6px 18px #f7f7fa;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: grid;
  align-content: center;
  justify-items: center;
`;

const ImageBox = styled.div`
  height: 200px;
  width: 200px;
  border-bottom-right-radius: 10px;
  box-shadow: inset 6px 6px 18px #e9e9ec, inset -6px -6px 18px #f7f7fa;
  padding: 5px;
  top: 0;
  left: 0;
  position: absolute;
  /* margin: 10px; */
`;

const Image = styled.img`
  height: 200px;
  width: 200px;
  border-bottom-right-radius: 10px;
  top: 0;
  left: 0;
  position: absolute;
`;

const Price = styled.div`
  font-weight: bolder;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px 15px;
  border-top-right-radius: 10px;
  box-shadow: inset 5px 5px 16px #e6e6e9, inset -5px -5px 16px #fafafd;
  background: linear-gradient(
    110.78deg,
    #76e650 -1.13%,
    #f9d649 15.22%,
    #f08e35 32.09%,
    #ec5157 48.96%,
    #ff18bd 67.94%,
    #1a4bff 85.34%,
    #62d8f9 99.57%
  );
  background-clip: inherit;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Name = styled.div`
  position: absolute;
  top: 25px;
  right: 10px;
  /* left: 55px; */
  padding: 10px;
`;

const Address = styled.div`
  position: absolute;
  top: 7px;
  right: 7px;
`;

const ToFriendInput = styled.input`
  font-family: GABRWFFR;
  font-weight: bold;
  font-size: 16px;
  height: 20px;
  width: 350px;
  background: #f0f0f3;
  box-shadow: inset 5px 5px 16px #e6e6e9, inset -5px -5px 16px #fafafd;
  border: none;
  border-radius: 50px;
  outline: none;
  padding: 10px 10px 10px 20px;
  margin: 10px 0px;

  ::placeholder {
    color: lightgray;
  }
`;

const Message = styled.textarea`
  font-family: GABRWFFR;
  font-weight: bold;
  font-size: 16px;
  width: 350px;
  height: 100px;
  background: #f0f0f3;
  box-shadow: inset 5px 5px 16px #e6e6e9, inset -5px -5px 16px #fafafd;
  border: none;
  border-radius: 20px;
  outline: none;
  padding: 10px 10px 10px 20px;
  margin: 10px 0px;

  ::placeholder {
    color: lightgray;
  }
`;

const Button = styled.div`
  height: 30px;
  display: grid;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  width: fit-content;
  padding: 5px 10px;
  /* box-shadow: 6px 6px 18px #e9e9ec, -6px -6px 18px #f7f7fa; */
  box-shadow: 5px 5px 10px #e6e6e9, -5px -5px 10px #fafafd;
  border-radius: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;

  &:hover {
    cursor: pointer;
    /* box-shadow: inset 6px 6px 18px #e9e9ec, inset -6px -6px 18px #f7f7fa; */
    box-shadow: inset 5px 5px 10px #e6e6e9, inset -5px -5px 10px #fafafd;
  }
`;

const Band = ({ address, name, price, description, uri, account }) => {
  const [friendAddress, setFriendAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [message, setMessage] = useState("");
  const [addressMode, setAddressMode] = useState("walletAddress");
  const [registered, setRegistered] = useState(true);

  let showPrice = web3.utils.fromWei(price.toString(), "ether");
  const ref = useRef();

  const buyAndSend = async () => {
    try {
      await Friends.methods
        .buyAndSendToAFriend(address, friendAddress, message)
        .send({
          from: account,
          value: price,
        });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const resolve = (domain) => {
    const resolution = new Resolution();
    setDomain(domain);

    resolution
      .addr(domain, "ETH")
      .then((receiverETHAdress) => {
        setFriendAddress(receiverETHAdress);
        setRegistered(true);
        console.log(receiverETHAdress);
      })
      .catch((err) => {
        if (err) {
          setRegistered(false);
        }
      });
  };

  return (
    <BandContainer ref={ref}>
      <Box>
        <ImageBox>
          <Image src={`https://gateway.pinata.cloud/ipfs/${uri}`} />
        </ImageBox>
        <Price>{showPrice} Matic</Price>
        <Name>{name}</Name>
        <Address>
          <Link
            to={{
              pathname: `https://polygonscan.com/address/${address}`,
            }}
            target="_blank"
          >
            <FaExternalLinkAlt color="black" />
          </Link>
        </Address>

        <div>
          <label>
            <input
              type="radio"
              value="walletAddress"
              checked={addressMode === "walletAddress"}
              onChange={(e) => setAddressMode(e.target.value)}
            />
            Wallet Address
          </label>
          &nbsp;&nbsp;
          <label>
            <input
              type="radio"
              value="unstoppableDomain"
              checked={addressMode === "unstoppableDomain"}
              onChange={(e) => setAddressMode(e.target.value)}
            />
            Unstoppable Domain
          </label>
        </div>
        {addressMode === "walletAddress" ? (
          <ToFriendInput
            type="text"
            placeholder="Friend's Address"
            value={friendAddress}
            onChange={(e) => setFriendAddress(e.target.value)}
          />
        ) : (
          <ToFriendInput
            type="text"
            placeholder="Friend's Domain"
            // value={domain}
            onChange={(e) => resolve(e.target.value)}
          />
        )}
        {!registered ? (
          <span style={{ color: "red" }}>Domain is not registered!!!</span>
        ) : null}
        <Message
          type="text"
          wrap="true"
          maxLength={1000}
          required
          placeholder="the one who ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={buyAndSend}>Buy and Send</Button>
      </Box>
    </BandContainer>
  );
};

export default Band;
