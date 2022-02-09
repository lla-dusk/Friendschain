import React from 'react';
import Body from '../components/Home/Body';
import Bands from '../components/Home/Bands';

const Home = ({ account }) => {
    return (
        <div>
            <Body />
            <Bands account={account} />
        </div>
    );
};

export default Home;
