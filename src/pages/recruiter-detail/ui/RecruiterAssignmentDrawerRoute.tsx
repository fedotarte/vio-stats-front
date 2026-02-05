import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssignmentDrawer } from '../../../features/edit-assignment';
import { ROUTES } from '../../../shared/config/routes';
import { useRecruiterDetailOutletContext } from '../model/route-context';

const RecruiterAssignmentDrawerRoute = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { recruiterId, recruiterVacancies } = useRecruiterDetailOutletContext();

  const selectedAssignment = useMemo(
    () => (assignmentId ? recruiterVacancies?.find((assignment) => assignment.id === assignmentId) : null),
    [assignmentId, recruiterVacancies]
  );

  const handleClose = useCallback(() => {
    navigate(recruiterId ? ROUTES.recruiters.detail(recruiterId) : ROUTES.recruiters.root);
  }, [navigate, recruiterId]);

  return (
    <AssignmentDrawer
      assignmentId={assignmentId ?? null}
      assignment={selectedAssignment}
      opened={Boolean(assignmentId)}
      onCloseAssignmentDrawer={handleClose}
    />
  );
};

export default RecruiterAssignmentDrawerRoute;
