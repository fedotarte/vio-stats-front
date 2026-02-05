import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateVacancyDrawer } from '../../../features/create-vacancy';
import { ROUTES } from '../../../shared/config/routes';

const CreateVacancyDrawerRoute = () => {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate(ROUTES.vacancies.root);
  }, [navigate]);

  return <CreateVacancyDrawer opened onClose={handleClose} />;
};

export default CreateVacancyDrawerRoute;
