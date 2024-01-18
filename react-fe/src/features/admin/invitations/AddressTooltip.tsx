import { Center, SimpleGrid, Text, Tooltip, chakra } from '@chakra-ui/react';
import * as React from 'react';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { Address } from '../../auth/authTypes';

interface IAddressTooltipProps {
  address: Address;
}

const AddressTooltip: React.FunctionComponent<IAddressTooltipProps> = ({ address }) => {
  const { city, country, street, zipCode } = address;

  return (
    <Center>
      <Tooltip
        placement="top"
        hasArrow
        label={
          <SimpleGrid columns={2} p={1} spacing={2}>
            <Text as="b" textAlign={'right'}>
              Straße
            </Text>
            <Text as="i">{street}</Text>
            <Text as="b" textAlign={'right'}>
              Ort
            </Text>
            <Text as="i">
              {zipCode} {city}
            </Text>
            <Text as="b" textAlign={'right'}>
              Land
            </Text>
            <Text as="i">{country ?? 'Deutschland'}</Text>
          </SimpleGrid>
        }
      >
        <chakra.span>
          <BsPostcardHeartFill fontSize={'1.5rem'} />
        </chakra.span>
      </Tooltip>
    </Center>
  );
};

export default AddressTooltip;
