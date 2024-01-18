import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import * as React from 'react';
import { alertActions } from './alertSlice';

const Alert: React.FunctionComponent = () => {
  const alertState = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();

  const toast = useToast();

  React.useEffect(() => {
    alertState
      .slice()
      .reverse()
      .map(({ id, status, description, title, type, duration, isClosable }) => {
        if (status !== null) {
          if (!toast.isActive(id)) {
            toast({
              id,
              status,
              title,
              duration,
              isClosable,
              position: 'top',
              description: type === 'json' ? <pre>{description}</pre> : description,
            });

            setTimeout(() => {
              dispatch(alertActions.reset());
            }, 500);
          }
        }
        return null;
      });
  });

  return null;
};

export default Alert;
