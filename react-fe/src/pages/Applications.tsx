import { Progress } from '@chakra-ui/react';
import * as React from 'react';
import { useGetGuestsFromCommonGroupsQuery } from '../features/weddingApi';
import { useAppSelector } from '../app/hooks';
import { ErrorBox } from '../components/controls';

const Applications: React.FunctionComponent = () => {
  const invitation = useAppSelector((state) => state.auth.invitation);
  const { data: guests, isLoading, error } = useGetGuestsFromCommonGroupsQuery(invitation!.id);

  if (error) return <ErrorBox error={error} />;

  if (isLoading) return <Progress isIndeterminate />;

  return (
    <>
      <>You are on the applications page</>
      <pre>{JSON.stringify(guests, null, 2)}</pre>
    </>
  );
};

export default Applications;
