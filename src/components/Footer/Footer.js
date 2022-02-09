import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';
// FaDiscord, FaInstagram, FaGithub
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="social">
                {/* <a target="_blank" href="www.twitter.com"><h4>Twitter</h4></a> */}
                <Link
                    to={{ pathname: 'https://twitter.com/FriendsChain_' }}
                    target="_blank"
                >
                    <FaTwitter size={25} className="footer-logo" />
                </Link>
                {/* <Link to={{ pathname: 'https://discord.com' }} target="_blank">
                    <FaDiscord size={25} className="footer-logo" />
                </Link> */}

                {/* <Link to={{ pathname: 'https://github.com' }} target="_blank">
                    <FaGithub size={30} className="footer-logo" />
                </Link> */}
            </div>
        </div>
    );
};

export default Footer;
