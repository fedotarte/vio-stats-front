import { ScrollArea, Stack } from '@mantine/core';
import { RecruiterCard } from '../../../entities/recruiter';
import { type RecruiterEntity } from '../../../shared/types';

interface RecruitersListProps {
  recruiters: RecruiterEntity[];
  onRecruiterClick: (recruiterId: string) => void;
}

export const RecruitersList = ({ recruiters, onRecruiterClick }: RecruitersListProps) => (
  <ScrollArea h="calc(100vh - 300px)">
    <Stack gap="md">
      {recruiters.map((recruiter) => (
        <RecruiterCard
          key={recruiter.id}
          recruiter={recruiter}
          onClick={() => onRecruiterClick(recruiter.id)}
        />
      ))}
    </Stack>
  </ScrollArea>
);
