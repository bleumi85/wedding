import { Alert, AlertDescription, AlertIcon, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import * as React from 'react';

interface IDeleteConfirmationModalProps {
  id: string;
  showModal: boolean;
  confirmModal: (id: string) => void;
  hideModal: () => void;
  message: string | JSX.Element;
}

const DeleteConfirmationModal: React.FunctionComponent<IDeleteConfirmationModalProps> = (props) => {
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

export default DeleteConfirmationModal;
