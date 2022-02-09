import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Band from './Band/Band';
import Friends from '../../ethereum/Friends';
import web3 from '../../ethereum/web3';
import BandAbi from '../../ethereum/build/Band.json';

const BandsContainer = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    margin: 10px 0px 50px 0px;
`;

const Bands = ({ account }) => {
    const [listBands, setListBands] = useState(null);

    const displayBands = async () => {
        try {
            let bandsAddress = await Friends.methods.getBands().call();
            // console.log(bandsAddress);

            let promises = bandsAddress.map((band) => {
                let BandInstance = new web3.eth.Contract(BandAbi, band);
                return BandInstance.methods
                    .getBandDetails()
                    .call()
                    .then((details) => {
                        // console.log(details);
                        let { retName, retPrice, retUri } = details;
                        return (
                            <Band
                                key={band}
                                address={band}
                                name={retName}
                                uri={retUri}
                                price={retPrice}
                                account={account}
                            />
                        );
                    });
            });

            Promise.all(promises).then((listBands) => {
                listBands.reverse();
                setListBands(listBands);
            });
        } catch (err) {
            // window.location.reload();
            // console.log('Problem, please reload!');
            console.error(err);
        }
    };

    useEffect(() => {
        displayBands();
        return () => {
            setListBands(null);
        };
    }, []);

    return <BandsContainer>{listBands}</BandsContainer>;
};

export default Bands;
