import React from 'react';

const HomeContent = ({ email }) => {
  return <h1 className='home-title'>Hello {email ? email : 'none'}</h1>;
};

export default HomeContent;
