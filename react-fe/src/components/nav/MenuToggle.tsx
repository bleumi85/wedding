import { IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { motion, Variants } from 'framer-motion';
import * as React from 'react';

interface IMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface IPathProps {
  d?: string;
  stroke: string;
  opacity?: number;
  transition?: { duration: number };
  variants?: Variants;
}

export const MenuToggle = React.forwardRef<HTMLButtonElement, IMenuToggleProps>(({ isOpen, onToggle }, ref): JSX.Element => {
  return (
    <motion.div initial={false} animate={isOpen ? 'open' : 'closed'}>
      <IconButton
        aria-label="Menu Toggle"
        ref={ref}
        onClick={onToggle}
        size={'xs'}
        colorScheme="primary"
        icon={
          <svg width={12} height={12} viewBox="0 0 22 20">
            <Path
              variants={{
                closed: { d: 'M 2 2.5 L 20 2.5' },
                open: { d: 'M 3 16.5 L 17 2.5' },
              }}
              stroke={useColorModeValue('white', 'var(--chakra-colors-gray-800)')}
            />
            <Path
              d="M 2 9.423 L 20 9.423"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.1 }}
              stroke={useColorModeValue('white', 'var(--chakra-colors-gray-800)')}
            />
            <Path
              variants={{
                closed: { d: 'M 2 16.346 L 20 16.346' },
                open: { d: 'M 3 2.5 L 17 16.346' },
              }}
              stroke={useColorModeValue('white', 'var(--chakra-colors-gray-800)')}
            />
          </svg>
        }
      />
    </motion.div>
  );
});

const Path = (props: IPathProps) => <motion.path fill="transparent" strokeWidth={3} strokeLinecap={'round'} {...props} />;
