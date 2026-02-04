import { Avatar, Card, Group, Text } from '@mantine/core';
import { type RecruiterEntity } from '../../../shared/types';

interface RecruiterCardProps {
  recruiter: RecruiterEntity;
  onClick: () => void;
}

export const RecruiterCard = ({ recruiter, onClick }: RecruiterCardProps) => {
  const fullName = `${recruiter.firstName} ${recruiter.lastName}`;
  const initials = `${recruiter.firstName[0] || ''}${recruiter.lastName[0] || ''}`;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Group>
        <Avatar color="myColor" radius="xl">
          {initials}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text fw={500} size="lg">
            {fullName}
          </Text>
          <Text size="sm" c="dimmed">
            {recruiter.email}
          </Text>
          {recruiter.phone && (
            <Text size="sm" c="dimmed">
              {recruiter.phone}
            </Text>
          )}
        </div>
      </Group>
    </Card>
  );
};
