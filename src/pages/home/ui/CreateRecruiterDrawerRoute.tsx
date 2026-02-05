import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRecruiterDrawer } from '../../../features/create-recruiter';
import { ROUTES } from '../../../shared/config/routes';

const CreateRecruiterDrawerRoute = () => {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate(ROUTES.recruiters.root);
  }, [navigate]);

  return <CreateRecruiterDrawer opened onClose={handleClose} />;
};

export default CreateRecruiterDrawerRoute;
