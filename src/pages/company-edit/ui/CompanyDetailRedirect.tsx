import { Navigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';

/**
 * Редирект с /company/:companyId на /company/:companyId/edit,
 * чтобы деталка компании сразу открывалась в режиме редактирования.
 */
const CompanyDetailRedirect = () => {
  const { companyId } = useParams<{ companyId: string }>();
  if (!companyId) return null;
  return <Navigate to={ROUTES.company.edit(companyId)} replace />;
};

export default CompanyDetailRedirect;
