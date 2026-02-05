import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditRecruiterDrawer } from '../../../features/edit-recruiter';
import { ROUTES } from '../../../shared/config/routes';
import { useRecruiterDetailOutletContext } from '../model/route-context';

const RecruiterEditDrawerRoute = () => {
  const navigate = useNavigate();
  const { recruiter, recruiterId } = useRecruiterDetailOutletContext();

  const handleClose = useCallback(() => {
    navigate(recruiterId ? ROUTES.recruiters.detail(recruiterId) : ROUTES.recruiters.root);
  }, [navigate, recruiterId]);

  if (!recruiter) return null;

  return <EditRecruiterDrawer recruiterId={recruiter.id} opened onClose={handleClose} />;
};

export default RecruiterEditDrawerRoute;
