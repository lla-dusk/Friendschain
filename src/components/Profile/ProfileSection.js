import React, { useState } from 'react';
import styled from 'styled-components';
import './ProfilePage.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ProfileSection = ({ id }) => {
    const [copied, setCopied] = useState(false);

    const address = id.slice(0, 6) + '.....' + id.slice(-7);

    const Container = styled.div`
        display: grid;
        align-items: center;
        justify-content: center;
    `;

    const onCopyAddress = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <div>
            <div className="profile-desc">
                {/* <div className="pic-1">
                    <img src={profile} alt="" />
                </div> */}
                <div className="details-1">
                    {/* {name && (
                        <div>
                            <h1>{name}</h1>
                        </div>
                    )}
                    {username && (
                        <div>
                            <h3>@{username}</h3>
                        </div>
                    )} */}
                    <div className="eth-address">
                        <div className="artist-id">#ID</div>
                        <div className="address">{address}</div>
                        <CopyToClipboard
                            text={id}
                            onCopy={() => onCopyAddress()}
                        >
                            <div className="copy-symbol">Copy</div>
                        </CopyToClipboard>
                    </div>

                    {copied ? <span>Copied</span> : null}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
