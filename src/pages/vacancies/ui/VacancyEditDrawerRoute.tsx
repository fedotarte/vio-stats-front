import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VacancyDrawer } from '../../../features/edit-vacancy';
import { ROUTES } from '../../../shared/config/routes';
import { useVacanciesOutletContext } from '../model/route-context';

const VacancyEditDrawerRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { vacancies } = useVacanciesOutletContext();

  const selectedVacancy = useMemo(
    () => (id ? vacancies.find((vacancy) => vacancy.id === id) ?? null : null),
    [id, vacancies]
  );

  const handleClose = useCallback(() => {
    navigate(ROUTES.vacancies.root);
  }, [navigate]);

  return (
    <VacancyDrawer
      vacancy={selectedVacancy}
      opened={Boolean(id)}
      onCloseVacancyDrawer={handleClose}
      initialEditing
    />
  );
};

export default VacancyEditDrawerRoute;
