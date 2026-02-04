import { createTheme, type MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#f6eeff',
  '#e7d9f7',
  '#cab1ea',
  '#ad86dd',
  '#9462d2',
  '#854bcb',
  '#7d3fc9',
  '#6b31b2',
  '#5f2ba0',
  '#52238d',
];

export const theme = createTheme({
  defaultRadius: 'md',
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
});
