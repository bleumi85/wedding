import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const weddingContainer = defineStyle(() => {
  return {
    p: 0,
    boxShadow: 'md',
    borderRadius: 'md',
    _light: {
      bg: 'white',
    },
    _dark: {
      bg: 'gray.700',
    },
  };
});

export const containerTheme = defineStyleConfig({
  variants: { wedding: weddingContainer },
});
