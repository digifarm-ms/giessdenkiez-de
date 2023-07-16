import React, { FC } from 'react';
import styled from 'styled-components';

const CreditsContainer = styled.div`
  width: 160px;
  height: auto;
  flex-direction: column;
  display: flex;
  justify-content: end;
  position: absolute;
  top: 12px;
  right: 12px;

  @media screen and (max-width: ${p => p.theme.screens.tablet}) {
    display: none;
  }
`;

const Logo = styled.img`
  width: 100%;
  margin: 10px 0 5px 0;
`;

const Credits: FC = () => {
  return (
    <CreditsContainer>
      <Logo src='/images/muenster-logo.svg' alt='Stadt Münster' />
      <Logo src='/images/smartcity-logo.png' alt='Smart City Münster' />
      <Logo src='/images/muenster-schenkt-aus.png' alt='Münster schenkt aus' />
    </CreditsContainer>
  );
};

export default Credits;
