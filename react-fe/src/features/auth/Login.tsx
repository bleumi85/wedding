import {
  Avatar,
  Alert,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  chakra,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Flex,
  PinInput,
  PinInputField,
} from '@chakra-ui/react';
import * as React from 'react';
import { BsQrCode, BsCheckLg, BsFillQuestionDiamondFill } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TokenStatus } from '../../common/enums';
import { CustomStack } from '../../components/controls';
import { authService } from './authService';
import { authActions } from './authSlice';
import { LoginData } from './authTypes';
import ImgWe from '/images/wir.jpg';
import { Navigate } from 'react-router-dom';

const Login: React.FunctionComponent = () => {
  const [accessCode, setAccessCode] = React.useState('');
  const [token, setToken] = React.useState('');
  const [tokenStatus, setTokenStatus] = React.useState(TokenStatus.VALIDATING);

  const dispatch = useAppDispatch();
  const invitation = useAppSelector((state) => state.auth.invitation);

  const validateToken = async (token: string): Promise<void> => {
    try {
      await authService.validateInvitationToken(token);
      setToken(token);
      setTokenStatus(TokenStatus.VALID);
    } catch (err) {
      console.error(err);
      setTokenStatus(TokenStatus.INVALID);
    }
  };

  // submit
  const handleSubmit = React.useCallback(
    async (values: LoginData) => {
      await dispatch(authActions.login(values));
    },
    [dispatch],
  );

  const onHelp = () => {
    handleSubmit({ token: 'abcd-abcd-abcd', accessCode: '123456' }).catch((err) => console.error(err));
  };

  React.useEffect(() => {
    if (invitation) return;

    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get('token');
    const queryAccessCode = params.get('accessCode');

    if (queryToken && queryAccessCode) {
      handleSubmit({ token: queryToken, accessCode: queryAccessCode }).catch((err) => console.error(err));
      return;
    }

    if (!queryToken) {
      setTokenStatus(TokenStatus.EMPTY);
      return;
    }

    validateToken(queryToken).catch((err) => console.error(err));
  }, [handleSubmit, invitation]);

  if (invitation) {
    return <Navigate to="/" />;
  }

  return (
    <CustomStack spacing={4} p={4} align={'center'} boxShadow={'md'} borderRadius={'md'} w={'100%'}>
      <Avatar w={{ base: 200, md: 320 }} h={{ base: 200, md: 320 }} src={ImgWe} boxShadow={'md'} />
      <Box w={'100%'}>{getBody()}</Box>
    </CustomStack>
  );

  function getBody(): JSX.Element {
    switch (tokenStatus) {
      case TokenStatus.VALID:
      case TokenStatus.EMPTY:
        return getForm(tokenStatus === TokenStatus.VALID);
      case TokenStatus.INVALID:
        return (
          <TokenMessage status="error" title="Es gibt ein Problem">
            Hier scheint irgendetwas nicht zu stimmen. Hast du auch wirklich den richtigen QR-Code gescannt oder eingegeben?
          </TokenMessage>
        );
      case TokenStatus.VALIDATING:
        return (
          <TokenMessage status="info" title="Bitte warte kurz">
            Es geht gleich weiter
          </TokenMessage>
        );
    }
  }

  function getForm(isValid: boolean): JSX.Element {
    const formatTokenValue = (value: string): string => {
      // Nur gültige Zeichen zulassen (a-z, 0-9)
      const filteredValue = value.replace(/[^a-z0-9]/g, '');

      // Bindestriche automatisch einfügen
      const formattedValue = filteredValue
        .split('')
        .map((char, index) => (index === 4 || index === 8 ? `-${char}` : char))
        .join('');

      return formattedValue.slice(0, 14);
    };

    const handleTokenChange = (value: string) => {
      const formattedTokenValue = formatTokenValue(value);

      setToken(formattedTokenValue);

      if (formattedTokenValue.length === 14) {
        validateToken(formattedTokenValue).catch((err) => console.error(err));
      }
    };

    const handlePinChange = (value: string) => {
      setAccessCode(value);

      if (value.length === 6 && tokenStatus === TokenStatus.VALID) {
        handleSubmit({ token, accessCode: value }).catch((err) => console.error(err));
      }
    };

    return (
      <chakra.form>
        <Stack spacing={4} mb={6}>
          <FormControl>
            <InputGroup size={{ base: 'sm', md: 'md' }}>
              <InputLeftAddon pointerEvents={'none'} fontSize={{ base: '1.1rem', md: '1.5rem' }}>
                <BsQrCode />
              </InputLeftAddon>
              <Input value={token} type="text" fontFamily={'Courier New, monospace'} onChange={(e) => handleTokenChange(e.target.value)} isDisabled={isValid} />
              <InputRightElement>{isValid ? <BsCheckLg /> : null}</InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl>
            <Flex justify={'space-between'}>
              <PinInput id="accessCode" value={accessCode} size={{ base: 'sm', md: 'md' }} onChange={handlePinChange}>
                {Array.from<number>({ length: 6 }).map((_, idx) => (
                  <PinInputField key={idx} />
                ))}
              </PinInput>
            </Flex>
          </FormControl>
        </Stack>
        <Flex justifyContent={'right'} gap={4}>
          <Button size={{ base: 'sm', md: 'md' }} onClick={onHelp} leftIcon={<BsFillQuestionDiamondFill />} variant={'outline'}>
            Hilfe
          </Button>
          <Button size={{ base: 'sm', md: 'md' }} type="submit">
            Bestätigen
          </Button>
        </Flex>
      </chakra.form>
    );
  }
};

interface ITokenMessageProps {
  status: 'error' | 'info';
  title: string;
  children: React.ReactNode;
}

const TokenMessage: React.FunctionComponent<ITokenMessageProps> = (props): JSX.Element => (
  <Alert status={props.status} variant={'top-accent'} flexDirection={'column'}>
    <AlertTitle mb={1} fontSize={{ base: 'small', md: 'medium' }}>
      {props.title}
    </AlertTitle>
    <AlertDescription textAlign={'center'} fontSize={{ base: 'small', md: 'medium' }}>
      {props.children}
    </AlertDescription>
  </Alert>
);

export default Login;
