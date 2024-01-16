import {
  Collapse,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Stack,
  Text,
  chakra,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';
import { MdLogout } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Role } from '../../common/enums';
import { authActions } from '../../features/auth/authSlice';
import { CustomNavLink } from './CustomNavLink';
import { MenuToggle } from './MenuToggle';
import { guestLinks, adminLinks } from './navLinks';

import LogoWedding from '../../assets/wedding-rings.svg?react';

const Nav: React.FunctionComponent = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { toggleColorMode } = useColorMode();

  const dispatch = useAppDispatch();

  const ColorModeIcon = useColorModeValue(FaMoon, FaSun);

  const invitation = useAppSelector((state) => state.auth.invitation);
  const isAdmin = invitation && invitation.guests.some((guest) => guest.role === Role.ADMIN);

  const menuToggleRef = React.useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileNavRef.current &&
        event.target instanceof Node &&
        !mobileNavRef.current.contains(event.target) &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(event.target) &&
        isOpen
      ) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleNavClick = () => {
    if (isOpen) {
      onToggle();
    }
  };

  const logOut = React.useCallback(() => {
    dispatch(authActions.logout()).catch((err) => console.error(err));
  }, [dispatch]);

  return (
    <chakra.nav
      bg={useColorModeValue('white', 'gray.900')}
      px={4}
      boxShadow={'md'}
      pos={'fixed'}
      w={'100%'}
      zIndex={100}
      top={0}
      left={0}
      fontFamily={'Dancing Script, cursive'}
    >
      <Flex display={{ base: 'none', md: 'flex' }} h={'64px'} align={'center'}>
        <Flex flexGrow={1}>
          <Logo handleNavClick={handleNavClick} />
          <Stack direction={'row'} spacing={4} align={'center'} ml={8} fontSize={24}>
            {invitation && invitation.guests && guestLinks.map((value, index) => <CustomNavLink key={index} label={value.label} target={value.target} />)}
            {isAdmin && adminLinks.map((value, index) => <CustomNavLink key={index} label={value.label} target={value.target} />)}
          </Stack>
        </Flex>
        <Stack direction={'row'}>
          <IconButton aria-label="Toggle Light/Dark" onClick={toggleColorMode} variant={'outline'}>
            <ColorModeIcon />
          </IconButton>
          {invitation && (
            <IconButton data-testid="btnLogout" aria-label="Logout" colorScheme="red" onClick={logOut}>
              <MdLogout />
            </IconButton>
          )}
        </Stack>
      </Flex>
      <Grid display={{ base: 'grid', md: 'none' }} templateColumns="repeat(8, 1fr)" alignItems={'center'} h="48px">
        <GridItem colSpan={1}>
          <MenuToggle ref={menuToggleRef} isOpen={isOpen} onToggle={onToggle} />
        </GridItem>
        <GridItem colSpan={6}>
          <Flex justify={'center'}>
            <Logo />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex justify={'right'}>
            <IconButton aria-label="Toggle Light/Dark" size={'xs'} onClick={toggleColorMode} variant={'outline'}>
              <ColorModeIcon />
            </IconButton>
          </Flex>
        </GridItem>
      </Grid>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          data-testid="stackMobileNav"
          ref={mobileNavRef}
          spacing={1}
          py={2}
          display={{ base: 'flex', md: 'none' }}
          fontSize={20}
          fontWeight={300}
          borderTop={'1px solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          {invitation &&
            invitation.guests &&
            guestLinks.map((value, index) => (
              <Link data-testid="navGuestLink" key={index} to={value.target} onClick={handleNavClick}>
                {value.label}
              </Link>
            ))}
          {isAdmin &&
            adminLinks.map((value, index) => (
              <Link data-testid="navAdminLink" key={index} to={value.target} onClick={handleNavClick}>
                {value.label}
              </Link>
            ))}
          <Text
            onClick={() => {
              handleNavClick();
              logOut();
            }}
          >
            Abmelden
          </Text>
        </Stack>
      </Collapse>
    </chakra.nav>
  );
};

interface INavClickProps {
  handleNavClick?: () => void;
}

const Logo: React.FunctionComponent<INavClickProps> = ({ handleNavClick }) => {
  const height = useBreakpointValue({ base: 32, md: 48 });
  return (
    <Link to="/" onClick={handleNavClick}>
      <Flex alignItems={'center'}>
        <LogoWedding style={{ height, width: height }} fill={useColorModeValue('#d69e2e', '#f6e05e')} />
        <Text ml={3} fontSize={{ base: '2xl', md: '4xl' }}>
          Anne und Jens
        </Text>
      </Flex>
    </Link>
  );
};

export default Nav;
