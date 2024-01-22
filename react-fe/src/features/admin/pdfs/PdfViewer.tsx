import { Button, Flex, Progress } from '@chakra-ui/react';
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

  const [pdfString, setPdfString] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
      const blob = new Blob([response.data], { type: contentType as string });

      const base64String = await convertBlobToBase64(blob);
      setPdfString(base64String as string);
    };

    fetchAndProcess()
      .catch((error: string) => {
        setError(error);
      })
      .finally(() => setIsLoading(false));
  }, [invitationId]);

  if (isLoading) return <Progress isIndeterminate />;

  if (error) return <ErrorBox error={error} />;

  if (!pdfString) return <ErrorBox error="Etwas ist gewaltig schief gelaufen" />;

  return (
    <Flex gap={6} justify={'center'}>
      <Document file={pdfString}>
        <Page height={600} pageNumber={1} />
      </Document>
      <Link to="/admin/invitations">
        <Button variant={'outline'} colorScheme="danger">
          Zurück
        </Button>
      </Link>
    </Flex>
  );
};

export default PdfViewer;
