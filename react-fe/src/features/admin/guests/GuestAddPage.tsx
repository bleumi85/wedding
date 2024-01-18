import { Button, Collapse, SimpleGrid, Stack, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { FaArrowsDownToPeople, FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const GuestAppPage: React.FunctionComponent = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4}>
      <SimpleGrid columns={[1, null, 2]} spacing={4}>
        <Link to="/admin/invitations/add" style={{ width: '100%' }}>
          <Button w={'100%'} size={['sm', null, 'md']} leftIcon={<FaPlus />}>
            Gast mit neuer Einladung anlegen
          </Button>
        </Link>
        <Button w={'100%'} size={['sm', null, 'md']} leftIcon={<FaArrowsDownToPeople />} onClick={onToggle}>
          Gast zu bestehender Einladung hinzufügen
        </Button>
      </SimpleGrid>
      <Collapse in={isOpen}></Collapse>
    </Stack>
  );
};

export default GuestAppPage;
