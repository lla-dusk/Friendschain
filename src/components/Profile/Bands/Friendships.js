import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Band from "./Band";
import "./Bands.css";
// import useModal from '../../../hooks/useModal';
// import Modal from './Modal/Modal';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Friends from "../../../ethereum/Friends";
import web3 from "../../../ethereum/web3";
import BandAbi from "../../../ethereum/build/Band.json";

import { FaRegClone } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const BodyContainer = styled.div`
  display: grid;
  /* align-items: center; */
  /* justify-content: center
  ; */
  margin: 50px 0px;
`;

const Container = styled.div`
  /* grid-template-columns: repeat(auto-fill, 100px); */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 60px;
`;

const ScrollBar = styled.div`
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    box-shadow: inset 6px 6px 12px #e4e4e7, inset -6px -6px 12px #fcfcff;
  }

  ::-webkit-scrollbar-thumb {
    background-color: lightgrey;
    /* outline: 1px solid slategrey; */
    border-radius: 20px;
  }
`;

const Bands = styled(ScrollBar)`
  margin: 20px 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  height: 600px;
  width: 250px;
  box-shadow: 14px 14px 28px #cccccf, -14px -14px 28px #ffffff;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

const Sent = styled(ScrollBar)`
  height: 600px;
  width: 400px;
  box-shadow: 14px 14px 28px #cccccf, -14px -14px 28px #ffffff;
  border-radius: 15px;
  display: grid;
  justify-items: center;
`;

const Received = styled(Sent)``;

const FriendList = styled.div`
  height: 530px;
  width: 380px;
  display: grid;
  justify-items: center;
  gap: 40px;
  /* margin: 10px 0px; */
`;

const Friend = styled.div`
  height: fit-content;
  width: 350px;
  /* box-shadow: 14px 14px 28px #cccccf, -14px -14px 28px #ffffff; */
  border-radius: 10px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-gap: 10px;
  /* position: relative; */
`;

const FriendAddress = styled.div`
  font-weight: bolder;
  /* top: 10px; */
  /* left: 10px; */
  /* position: absolute; */
  /* padding: 10px 15px; */

  &:hover {
    cursor: pointer;
  }
`;

const FriendMessage = styled.div`
  /* top: 10px; */
  /* right: 10px; */
  /* margin: 50px 0px 20px 0px; */
  /* position: absolute; */
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 6px 6px 12px #e4e4e7, -6px -6px 12px #fcfcff;
  height: fit-content;
  width: 300px;
  /* display: flex; */
  /* flex-wrap: wrap; */
  word-wrap: break-word;
  text-align: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Friendships = ({ id }) => {
  const [listFriendships, setListFriendships] = useState(null);
  const [clickedBand, setClickedBand] = useState("");
  const [listFriends, setListFriends] = useState(null);
  const [listBuddies, setListBuddies] = useState(null);
  const [sentLoading, setSentLoading] = useState(false);
  const [receivedLoading, setReceivedLoading] = useState(false);
  const [results, setResults] = useState([]);

  const displayFriendships = async () => {
    try {
      const bandsAddress = await Friends.methods.getBands().call();

      let promises = bandsAddress.map((band) => {
        const bandIns = async () => {
          let BandInstance = await new web3.eth.Contract(BandAbi, band);
          return BandInstance;
        };
        return bandIns().then((BandInstance) => {
          return BandInstance.methods
            .getFriends(id)
            .call()
            .then((friends) => {
              console.log("friends: ", friends);
              return BandInstance.methods
                .getBuddies(id)
                .call()
                .then((buddies) => {
                  console.log("buddies:", buddies);
                  return friends.length || buddies.length
                    ? BandInstance.methods
                        .getBandDetails()
                        .call()
                        .then((details) => {
                          //   console.log(details);
                          let { retName, retUri } = details;
                          return (
                            <div key={band}>
                              <Band
                                address={band}
                                uri={retUri}
                                setClickedBand={setClickedBand}
                              />
                            </div>
                          );
                        })
                    : null;
                });
            });
        });
      });

      Promise.all(promises).then((listFriendships) => {
        listFriendships.reverse();
        setListFriendships(listFriendships);
      });
    } catch (err) {
      // console.log(err, "Problem while displaying friendships");
      console.error(err);
      window.location.reload();
    }
  };

  useEffect(() => {
    displayFriendships();
    return () => {
      setListFriendships(null);
    };
  }, []);

  const calcResults = async () => {
    const url = `https://api.covalenthq.com/v1/137/events/topics/0xdd99aef5e4fdfad84059320be40f5dc0f015dc4025f56bd4010608c6743bc22e/?starting-block=17545954&ending-block=17575900&sender-address=${clickedBand}&key=ckey_9f2ed5152bcb4eb1a8dbc4cf854`;

    const { data } = await axios.get(url);

    const inputs = [
      {
        indexed: true,
        name: "_sender",
        type: "address",
      },
      {
        indexed: true,
        name: "_receiver",
        type: "address",
      },
      {
        indexed: true,
        name: "_id",
        type: "uint256",
      },
      {
        name: "_message",
        type: "string",
      },
    ];

    const results = [];

    data.data.items.map((item) => {
      const hexString = item.raw_log_data;
      const retTopics = item.raw_log_topics;

      console.log("hexString: ", typeof hexString);
      console.log("topics: ", typeof retTopics);

      let topics = [];

      retTopics.map((topic, index) => {
        if (index > 0) topics.push(topic);
      });

      console.log("topics: ", typeof topics);

      const result = web3.eth.abi.decodeLog(inputs, hexString, topics);
      console.log("message: ", result._message);

      results.push(result);
    });

    setResults(results);
  };

  useEffect(() => {
    calcResults();
  }, [clickedBand]);

  const displayBuddies = async () => {
    setSentLoading(true);
    if (clickedBand !== "") {
      try {
        console.log("clicked Band: ", clickedBand);
        let BandInstance = await new web3.eth.Contract(BandAbi, clickedBand);

        let buddies = await BandInstance.methods.getBuddies(id).call();
        console.log("clicked band buddies: ", buddies);

        buddies.map((buddy) => {
          let listBuddies = [];
          let bAddress = buddy.slice(0, 6) + "....." + buddy.slice(-7);
          let message;
          results.map((result) => {
            if (result._receiver === buddy && result._sender === id) {
              message = result._message;
              console.log("message to buddy: ", message);
            }
          });

          if (message.length > 0) {
            listBuddies.push(
              <Friend key={buddy}>
                <FriendAddress>
                  <StyledLink to={`${buddy}`}>{bAddress} </StyledLink>
                  <CopyToClipboard text={buddy}>
                    <FaRegClone />
                  </CopyToClipboard>
                </FriendAddress>
                <FriendMessage>{message}</FriendMessage>
              </Friend>
            );
          }

          setListBuddies(listBuddies);
          setSentLoading(false);
        });
      } catch (err) {
        // console.log(err, "Problem while displaying friends");
        // window.location.reload();
        console.error(err);
      }
    }
  };

  const displayFriends = async () => {
    setReceivedLoading(true);
    if (clickedBand !== "") {
      try {
        let BandInstance = await new web3.eth.Contract(BandAbi, clickedBand);

        let friends = await BandInstance.methods.getFriends(id).call();

        friends.map((friend) => {
          let listFriends = [];
          let fAddress = friend.slice(0, 6) + "....." + friend.slice(-7);
          let message;
          results.map((result) => {
            if (result._receiver === id && result._sender === friend) {
              message = result._message;
              console.log("message to buddy: ", message);
            }
          });

          if (message.length > 0) {
            listFriends.push(
              <Friend key={friend}>
                <FriendAddress>
                  <StyledLink to={`${friend}`}>{fAddress} </StyledLink>
                  <CopyToClipboard text={friend}>
                    <FaRegClone />
                  </CopyToClipboard>
                </FriendAddress>
                <FriendMessage>{message}</FriendMessage>
              </Friend>
            );
          }

          setListFriends(listFriends);

          setReceivedLoading(false);
        });
      } catch (err) {
        // console.log(err, "Problem while displaying friends");
        // window.location.reload();
        console.error(err);
      }
    }
  };

  useEffect(() => {
    displayBuddies();

    // return () => {
    //     setListBuddies(null);
    //     setSentLoading(false);
    // };
  }, [clickedBand, results]);

  useEffect(() => {
    displayFriends();
    // return () => {
    //     setListFriends(null);
    //     setSentLoading(false);
    // };
  }, [clickedBand, results]);

  // useEffect(() => {
  //     displayBuddies();
  //     displayFriends();
  //     return () => {
  //         setListFriends(null);
  //         setListBuddies(null);
  //         setReceivedLoading(false);
  //         setSentLoading(false);
  //         // setClickedBand('');
  //     };
  //     // console.log("band: ", clickedBand);
  // }, [clickedBand]);

  return (
    <BodyContainer>
      <span className="gradient-underline">Friendships</span>
      <Container>
        <Bands>
          {/* <Band toggle={toggle} isShowing={isShowing} /> */}
          {/* <Modal isShowing={isShowing} hide={toggle} /> */}
          {listFriendships}
        </Bands>
        <Sent>
          <h2>Sent</h2>
          <FriendList>
            {listBuddies ? (
              listBuddies
            ) : (
              <span>
                {clickedBand === ""
                  ? "Please select a Band "
                  : sentLoading
                  ? "Please wait, it's loading..."
                  : "No buddies yet"}
              </span>
            )}
          </FriendList>
        </Sent>
        <Received>
          <h2>Received</h2>
          <FriendList>
            {listFriends ? (
              listFriends
            ) : (
              <span>
                {clickedBand === "" ? (
                  "Please select a Band "
                ) : receivedLoading ? (
                  <span>"Please wait, it's loading..."</span>
                ) : (
                  "No friends yet"
                )}
              </span>
            )}
          </FriendList>
        </Received>
      </Container>
    </BodyContainer>
  );
};

export default Friendships;
