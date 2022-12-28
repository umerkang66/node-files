import React from 'react';
import ClipLoader from 'react-spinners/MoonLoader';

const Loader = () => {
  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ClipLoader size={20} />
    </div>
  );
};

export default Loader;
