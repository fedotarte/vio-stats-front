import { Center, Loader, Text } from '@mantine/core';

interface CenteredLoaderProps {
  height?: number;
}

interface CenteredErrorProps {
  message: string;
  height?: number;
}

export const CenteredLoader = ({ height = 200 }: CenteredLoaderProps) => (
  <Center h={height}>
    <Loader size="lg" />
  </Center>
);

export const CenteredError = ({ message, height = 200 }: CenteredErrorProps) => (
  <Center h={height}>
    <Text c="red">{message}</Text>
  </Center>
);
