import { Button, ButtonProps } from '@chakra-ui/button';
import * as React from 'react';
import { NavLink, To } from 'react-router-dom';

interface INavLinkButtonProps extends ButtonProps {
  to: To;
  children: string;
}

export const NavLinkButton: React.FunctionComponent<INavLinkButtonProps> = ({ children, to, ...rest }) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <Button variant={isActive ? 'solid' : 'outline'} w={'100%'} {...rest}>
        {children}
      </Button>
    )}
  </NavLink>
);
