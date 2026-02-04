import { Card, Group, Text } from '@mantine/core';
import { type CompanyEntity } from '../../../shared/types';

interface CompanyCardProps {
  company: CompanyEntity;
  onClick: () => void;
}

export const CompanyCard = ({ company, onClick }: CompanyCardProps) => (
  <Card
    shadow="sm"
    padding="lg"
    radius="md"
    withBorder
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <Group>
      <div style={{ flex: 1 }}>
        <Text fw={500} size="lg">
          {company.name}
        </Text>
        {company.address && (
          <Text size="sm" c="dimmed">
            {company.address}
          </Text>
        )}
        {company.email && (
          <Text size="sm" c="dimmed">
            {company.email}
          </Text>
        )}
        {company.phone && (
          <Text size="sm" c="dimmed">
            {company.phone}
          </Text>
        )}
      </div>
    </Group>
  </Card>
);
