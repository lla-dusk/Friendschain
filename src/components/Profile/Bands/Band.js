import React from 'react';
import styled from 'styled-components';
// import Modal from './Modal/Modal';

const Container = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;
    }
`;

const Box = styled.div`
    height: 200px;
    width: 200px;
    /* box-shadow: 9px 9px 20px #e6e6e9, -9px -9px 20px #fafafd; */
    border-radius: 10px;
    /* box-shadow: 14px 14px 28px #cccccf, -14px -14px 28px #ffffff; */
    position: relative;
    display: grid;
    align-items: center;
    justify-content: center;

    /* &:hover {
        cursor: pointer;
        box-shadow: inset 9px 9px 20px #e6e6e9, inset -9px -9px 20px #fafafd;
    } */
`;

// const ImageBox = styled.div`
//     height: 200px;
//     width: 200px;
//     border-bottom-right-radius: 10px;
//     box-shadow: inset 6px 6px 18px #e9e9ec, inset -6px -6px 18px #f7f7fa;
//     padding: 5px;

//     /* margin: 10px; */
// `;

const Image = styled.img`
    height: 200px;
    width: 200px;
    border-radius: 10px;
`;

const Name = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
`;

const Band = ({ uri, address, setClickedBand }) => {
    return (
        <>
            <Container onClick={() => setClickedBand(address)}>
                <Box>
                    <Image src={`https://gateway.pinata.cloud/ipfs/${uri}`} />
                </Box>
                {/* <Modal
                    isShowing={isShowing}
                    hide={toggle}
                    name={name}
                    uri={uri}
                    address={address}
                    id={id}
                /> */}
            </Container>
        </>
    );
};

export default Band;
