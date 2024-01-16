import { Box, Flex, chakra } from '@chakra-ui/react';
import * as React from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import './style.scss';

const ErrorPage: React.FunctionComponent = () => {
  const error = useRouteError();
  const errorStatus = isRouteErrorResponse(error) ? error.status.toString() : '500';
  const errorStatusText = isRouteErrorResponse(error) ? error.statusText : 'Internal Server Error';
  console.error(error);

  return (
    <Flex className="flex-container">
      <Box className="text-center">
        <chakra.h1>
          {errorStatus.split('').map((val, idx) => (
            <span key={idx} className="fade-in" id={`digit${idx + 1}`}>
              {val}
            </span>
          ))}
        </chakra.h1>
        <chakra.h3>{errorStatusText}</chakra.h3>
        <Link to="/">
          <chakra.button>Zurück zur Startseite</chakra.button>
        </Link>
      </Box>
    </Flex>
  );
};

export default ErrorPage;
