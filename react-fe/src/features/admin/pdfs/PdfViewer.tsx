import { Button, Flex, Progress, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { pdfService } from './pdfService';
import { ErrorBox, SimpleConfirmationModal } from '../../../components/controls';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaPrint } from 'react-icons/fa6';

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

  const { isOpen: isOpenDownload, onOpen: onOpenDownload, onClose: onCloseDownload } = useDisclosure();
  const { isOpen: isOpenPrint, onOpen: onOpenPrint, onClose: onClosePrint } = useDisclosure();

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
    onCloseDownload();
    if (!pdfBlob) {
      console.error('No PDF Blob');
      return;
    }

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = `${fileName}-${+new Date()}.pdf`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const onPrintPdf = () => {
    onClosePrint();
    if (!pdfBlob) {
      console.error('No PDF Blob');
      return;
    }

    const blobURL = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.style.display = 'none';
    iframe.src = blobURL;
    iframe.onload = () => {
      setTimeout(() => {
        iframe.focus();
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
        } else {
          console.error('No content window for iframe');
        }
      }, 1);
    };
  };

  if (isLoading) return <Progress isIndeterminate />;

  if (error) return <ErrorBox error={error} />;

  if (!pdfString) return <ErrorBox error="Etwas ist gewaltig schief gelaufen" />;

  return (
    <>
      <Flex direction={['column', null, 'row']} gap={6} justify={'center'}>
        <Flex display={['none', null, 'flex']} justify={'center'}>
          <Document file={pdfString}>
            <Page height={600} pageNumber={1} />
          </Document>
        </Flex>
        <Flex direction={'column'} gap={4}>
          <SimpleGrid columns={[2, null, 1]} spacing={4}>
            <Button size={['sm', null, 'md']} onClick={onOpenDownload} leftIcon={<FaDownload />}>
              Download
            </Button>
            <Button size={['sm', null, 'md']} onClick={onOpenPrint} leftIcon={<FaPrint />}>
              Drucken
            </Button>
          </SimpleGrid>
          <Link to="/admin/invitations">
            <Button size={['sm', null, 'md']} variant={'outline'} colorScheme="danger" w={'100%'}>
              Zurück
            </Button>
          </Link>
        </Flex>
        <Flex display={['flex', null, 'none']} justify={'center'}>
          <Document file={pdfString}>
            <Page scale={0.6} height={600} pageNumber={1} />
          </Document>
        </Flex>
      </Flex>
      <SimpleConfirmationModal
        showModal={isOpenDownload}
        confirmModal={onSavePdf}
        hideModal={onCloseDownload}
        header="PDF downloaden"
        message="Möchtest du die Datei jetzt speichern?"
      />
      <SimpleConfirmationModal
        showModal={isOpenPrint}
        confirmModal={onPrintPdf}
        hideModal={onClosePrint}
        header="PDF ausdrucken"
        message="Möchtest du die Datei jetzt ausdrucken?"
      />
    </>
  );
};

export default PdfViewer;
