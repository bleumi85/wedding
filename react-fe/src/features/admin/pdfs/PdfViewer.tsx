import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { pdfService } from './pdfService';
import { ErrorBox } from '../../../components/controls';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { AxiosHeaderValue } from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const convertBlobToBase64 = (blob: Blob): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

const PdfViewer: React.FunctionComponent = () => {
  const { invitationId } = useParams();

  const { isOpen: pdfIsOpen, onOpen: pdfOnOpen, onClose: pdfOnClose } = useDisclosure();

  const [pdfBlob, setPdfBlob] = React.useState<Blob>();
  const [pdfString, setPdfString] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fileName, setFileName] = React.useState('');

  React.useEffect(() => {
    const fetchAndProcess = async () => {
      setIsLoading(true);

      if (!invitationId) {
        setError('Keine invitationId');
        return;
      }

      const response = await pdfService.getByInvitationId(invitationId);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const contentType: AxiosHeaderValue = response.headers['content-type'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const contentDisposition: string = response.headers['content-disposition'];

      setFileName(contentDisposition.split('=')[1].split('.')[0]);

      const blob = new Blob([response.data], { type: contentType as string });
      setPdfBlob(blob);

      const base64String = await convertBlobToBase64(blob);
      setPdfString(base64String as string);
    };

    fetchAndProcess()
      .catch((error: string) => {
        setError(error);
      })
      .finally(() => setIsLoading(false));
  }, [invitationId]);

  const onSavePdf = () => {
    if (!pdfBlob) return;

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = `${fileName}-${+new Date()}.pdf`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    pdfOnClose();
  };

  if (isLoading) return <Progress isIndeterminate />;

  if (error) return <ErrorBox error={error} />;

  if (!pdfString) return <ErrorBox error="Etwas ist gewaltig schief gelaufen" />;

  return (
    <>
      <Flex gap={6} justify={'center'}>
        <Document file={pdfString}>
          <Page height={600} pageNumber={1} />
        </Document>
        <Flex direction={'column'} gap={4}>
          <Link to="/admin/invitations">
            <Button variant={'outline'} colorScheme="danger" minW={150}>
              Zurück
            </Button>
          </Link>
          <Button onClick={pdfOnOpen}>Download</Button>
        </Flex>
      </Flex>
      <Modal isOpen={pdfIsOpen} onClose={pdfOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt={4} pb={2}>
            PDF downloaden
          </ModalHeader>
          <ModalBody py={2}>
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>Möchtest du die Datei jetzt speichern?</AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter pt={2} pb={4}>
            <Stack direction={'row'} spacing={[2, null, 4]}>
              <Button colorScheme="gray" onClick={pdfOnClose} size={['sm', null, 'md']}>
                Abbrechen
              </Button>
              <Button onClick={onSavePdf}>Ok</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PdfViewer;
