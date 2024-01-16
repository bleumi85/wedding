import { StyleFunctionProps, extendTheme, theme, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const customTheme = extendTheme(
  {
    colors: {
      primary: theme.colors.blue,
      danger: theme.colors.red,
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        'html, body': {
          color: mode('gray.700', 'white')(props),
          bg: mode('#f4f5fd', 'gray.800')(props),
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' }),
);
