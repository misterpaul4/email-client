import { useState } from 'react';
import { PrimaryLoader } from '../../components/Loader';
import { useLocation } from 'react-router-dom';

const GoogleCallBack = () => {
  const [] = useState();
  const {} = useLocation();
  return (
    <div>
      <PrimaryLoader size={100} />
    </div>
  );
};

export default GoogleCallBack;
