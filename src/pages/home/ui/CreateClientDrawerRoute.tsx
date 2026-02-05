import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateClientDrawer } from '../../../features/create-client';
import { ROUTES } from '../../../shared/config/routes';

const CreateClientDrawerRoute = () => {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate(ROUTES.clients.root);
  }, [navigate]);

  return <CreateClientDrawer opened onClose={handleClose} />;
};

export default CreateClientDrawerRoute;
