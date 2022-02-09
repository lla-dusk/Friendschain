import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import ProfileSection from '../components/Profile/ProfileSection';
import Friendships from '../components/Profile/Bands/Friendships';

const Profile = ({ account }) => {
    const { id } = useParams();
    const Container = styled.div`
        display: grid;
        justify-content: center;
    `;

    return (
        <Container>
            <ProfileSection id={id} />
            <Friendships id={id} />
        </Container>
    );
};

export default Profile;
