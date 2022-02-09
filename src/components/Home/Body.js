import React from 'react';
import styled from 'styled-components';
import banner from '../../img/Website.png';

const Body = () => {
    const BodyContainer = styled.div`
        height: 500px;
        display: grid;
        align-items: center;
        justify-items: center;
        margin: 50px 0px 50px 0px;
    `;

    const Box = styled.div`
        height: 500px;
        width: 80vw;
        box-shadow: 6px 6px 18px #e9e9ec, -6px -6px 18px #f7f7fa;
        border-radius: 20px;
        /* padding: 50px 50px; */
        display: grid;
        align-items: center;
        justify-content: center;
        background-color: black;
        overflow: hidden;
    `;

    // const Content = styled.div`
    //     padding: 30px;
    //     font-size: 40px;
    //     font-weight: bolder;
    //     display: grid;
    //     justify-content: center;
    //     background-color: black;
    // `;

    const Image = styled.img`
        height: 540px;
        margin-top: -20px;
    `;

    return (
        <BodyContainer>
            <Box>
                <Image src={banner} />
            </Box>
        </BodyContainer>
    );
};

export default Body;
