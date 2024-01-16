import { useColorModeValue } from '@chakra-ui/color-mode';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

export interface ICustomNavLinkProps {
  label: string;
  target: string;
}

export const CustomNavLink: React.FunctionComponent<ICustomNavLinkProps> = (props) => {
  const colorText = useColorModeValue('var(--chakra-colors-primary-500)', 'var(--chakra-colors-primary-200)');
  return (
    <NavLink
      to={props.target}
      style={({ isActive }) => {
        return {
          color: isActive ? colorText : '',
        };
      }}
    >
      {props.label}
    </NavLink>
  );
};
