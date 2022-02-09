import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import "./Modal.css";
import BandAbi from "../../../../ethereum/build/Band.json";
import web3 from "../../../../ethereum/web3";

const Container = styled.div`
  display: grid;
  align-content: center;
  justify-items: center;
  position: relative;
`;

const ImageBox = styled.div`
  height: 100px;
  width: 100px;
  border-radius: 10px;
  box-shadow: inset 6px 6px 18px #e9e9ec, inset -6px -6px 18px #f7f7fa;
  padding: 5px;
`;

const Image = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 10px;
`;

const Name = styled.div`
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 30px 50px;
`;

const FriendBox = styled.div`
  height: 100px;
  width: 520px;
  /* box-shadow: inset 6px 6px 12px #e4e4e7, inset -6px -6px 12px #fcfcff; */
  border-radius: 10px;
  margin: 20px 0px;
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;
  /* border: 1px solid grey; */
`;

const FriendAddress = styled.div`
  font-weight: bolder;
  top: 10px;
  left: 10px;
  position: absolute;
  padding: 10px 15px;
`;

const FriendMessage = styled.div`
  /* top: 10px; */
  right: 10px;
  position: absolute;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 6px 6px 12px #e4e4e7, -6px -6px 12px #fcfcff;
  height: 50px;
  width: 230px;
`;

const Modal = ({ isShowing, hide, name, uri, address, id }) => {
  const [listFriends, setListFriends] = useState(null);
  const displayFriends = async () => {
    try {
      let BandInstance = await new web3.eth.Contract(BandAbi, address);

      let friends = await BandInstance.methods.getFriends(id).call();
      console.log("friends: ", friends);

      let promises = friends.map((friend) => {
        let fAddress = friend.slice(0, 6) + "....." + friend.slice(-7);
        return BandInstance.getPastEvents("Message", {
          filter: { _receiver: id, _sender: friend },
          fromBlock: 17083999,
          toBlock: "latest",
        }).then((message) => {
          // console.log('message: ', message);
          return (
            <FriendBox key={friend}>
              <FriendAddress>{fAddress}</FriendAddress>
              <FriendMessage>{message[0].returnValues._message}</FriendMessage>
            </FriendBox>
          );
        });
      });

      Promise.all(promises).then((listFriends) => {
        // listFriends.reverse();
        setListFriends(listFriends);
      });
    } catch (err) {
      // console.log(err, 'Problem while displaying friends');
    }
  };

  useEffect(() => {
    displayFriends();
    return () => {
      setListFriends(null);
    };
  }, [isShowing]);
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            onClick={hide}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <Name>{name}</Name>
                <button
                  type="button"
                  className="modal-close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-content">
                <Container>
                  <ImageBox>
                    <Image src={`https://gateway.pinata.cloud/ipfs/${uri}`} />
                  </ImageBox>
                  {/* <FriendBox></FriendBox> */}
                  {listFriends}
                </Container>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default withRouter(Modal);
