import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { generateRandomNumber } from '../../functions/helpers';

interface IConfirmationModalProps {
  id: string;
  showModal: boolean;
  confirmModal: (id: string) => void;
  hideModal: () => void;
  message: string | JSX.Element;
}

const COUNTDOWN_SECONDS = 10;

export const CancelConfirmationModal: React.FunctionComponent<IConfirmationModalProps> = (props) => {
  const { id, showModal, confirmModal, hideModal, message } = props;
  const bgHeader = useColorModeValue('gray.100', 'gray.800');

  const [rnd1, setRnd1] = React.useState(0);
  const [rnd2, setRnd2] = React.useState(0);
  const [rnd3, setRnd3] = React.useState(0);
  const [rnd4, setRnd4] = React.useState(0);
  const [countdown, setCountdown] = React.useState(COUNTDOWN_SECONDS);

  React.useEffect(() => {
    let timer: number;

    if (showModal) {
      timer = setInterval(() => {
        setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [showModal]);

  React.useEffect(() => {
    if (!showModal) {
      setRnd1(generateRandomNumber(1000, 9999));
      setRnd2(generateRandomNumber(1000, 9999));
      setRnd3(generateRandomNumber(1000, 9999));
      setRnd4(generateRandomNumber(1000, 9999));
      setCountdown(COUNTDOWN_SECONDS);
    }
  }, [showModal]);

  return (
    <Modal size={['xs', null, 'md']} closeOnOverlayClick={false} isOpen={showModal} onClose={hideModal} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
      <ModalContent>
        <ModalHeader bg={bgHeader}>Ist das dein Ernst?!</ModalHeader>
        <ModalBody>
          <Stack spacing={2}>
            <Text fontSize={['sm', null, 'md']}>{message}</Text>
            {countdown !== 0 && (
              <Text fontSize={['sm', null, 'md']}>
                Löse nur noch schnell die folgende Aufgabe in den nächstes <b>{countdown}</b> Sekunden und schon kannst du dich abmelden.
              </Text>
            )}
            {countdown !== 0 && (
              <Text as="kbd" fontSize={['xs', null, 'md']} textAlign={'center'} borderStyle={'solid'} borderWidth={1} p={1}>
                ({rnd1} * {rnd2}) - ({rnd3} / {rnd4}) = ?
              </Text>
            )}
            {countdown === 0 && <Text fontSize={['sm', null, 'md']}>Kleiner Spaß. Möchtest du wirklich absagen?</Text>}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" onClick={hideModal} mr={3} size={['sm', null, 'md']}>
            Abbrechen
          </Button>
          <Button size={['sm', null, 'md']} onClick={() => confirmModal(id)} isDisabled={countdown !== 0}>
            Absagen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DeleteConfirmationModal: React.FunctionComponent<IConfirmationModalProps> = (props) => {
  const { id, showModal, confirmModal, hideModal, message } = props;

  return (
    <Modal closeOnOverlayClick={false} isOpen={showModal} onClose={hideModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Löschen bestätigen</ModalHeader>
        <ModalBody>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" onClick={hideModal} mr={3} size={'sm'}>
            Abbrechen
          </Button>
          <Button colorScheme="red" onClick={() => confirmModal(id)} size={'sm'}>
            Löschen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface ISimpleModalProps {
  showModal: boolean;
  confirmModal: () => void;
  hideModal: () => void;
  header: string;
  message: string;
}

export const SimpleConfirmationModal: React.FunctionComponent<ISimpleModalProps> = (props) => {
  const { showModal, confirmModal, hideModal, header, message } = props;

  return (
    <Modal isOpen={showModal} onClose={hideModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pt={4} pb={2}>
          {header}
        </ModalHeader>
        <ModalBody py={2}>
          <Alert status="info">
            <AlertIcon />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </ModalBody>
        <ModalFooter pt={2} pb={4}>
          <Stack direction={'row'} spacing={[2, null, 4]}>
            <Button colorScheme="gray" onClick={hideModal} size={['sm', null, 'md']}>
              Abbrechen
            </Button>
            <Button onClick={confirmModal} size={['sm', null, 'md']}>
              Ok
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
