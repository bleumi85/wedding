import { Invitation } from '@api/invitations/entities/invitation.entity';
import { InvitationsService } from '@api/invitations/invitations.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fontkit from '@pdf-lib/fontkit';
import { AgeType } from '@utils/enums';
import bcrypt from 'bcrypt';
import { readFileSync, writeFileSync } from 'fs';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
import qrcode from 'qrcode';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: EntityRepository<File>,
    private readonly em: EntityManager,
    private readonly invitationsService: InvitationsService,
    private configService: ConfigService,
  ) {}

  async createBulk(createFilesDto: CreateFileDto[]) {
    await this.em.begin();
    try {
      await Promise.all(
        createFilesDto.map(async ({ id }) => {
          const invitation = await this.invitationsService.findOne(id, true);
          const newCode = this.generateRandomCode();

          const pdfBytes = await this.createPdf(invitation, newCode);

          const pdfFileName = `${invitation.token}.pdf`;
          const pdfFilePath = join(process.cwd(), 'pdf-files', pdfFileName);
          writeFileSync(pdfFilePath, pdfBytes);

          const createdFile = new File({
            fileName: pdfFileName,
            filePath: pdfFilePath,
            mimeType: 'application/pdf',
            size: pdfBytes.length,
            invitation,
          });

          this.em.persist(createdFile);

          invitation.accessCode = await bcrypt.hash(newCode, 10);
        }),
      );
      await this.em.commit();

      return { message: `${createFilesDto.length} Datei${createFilesDto.length > 1 ? 'en' : ''} erfolgreich erstellt und gespeichert` };
    } catch (err: any) {
      await this.em.rollback();
      Logger.error(err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByInvitation(id: string) {
    const file = await this.filesRepository.findOne({ invitation: id });
    if (file) {
      return file;
    }
    throw new HttpException('Eine Datei zu dieser Einladung existiert nicht', HttpStatus.NOT_FOUND);
  }

  // helpers
  private async createPdf(invitation: Invitation, code: string): Promise<Uint8Array> {
    const { guests } = invitation;
    const filterGuests = guests.filter((guest) => guest.ageType === AgeType.ADULT);
    const nGuests = filterGuests.length;
    const isOne = nGuests === 1;
    const names = isOne
      ? filterGuests[0].displayName
      : filterGuests
          .slice(0, nGuests - 1)
          .map((g) => g.displayName)
          .join(', ') +
        ' und ' +
        filterGuests[nGuests - 1].displayName;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const homepageUrl = 'hochzeit.diebleumers.de';
    const qrCodeUrl = `https://${homepageUrl}/auth/login?token=${invitation.token}&accessCode=${code}`;

    // Load font and embed it to pdf document
    const fontBytes = readFileSync(this.configService.get<string>('app.pdfFontPath'));
    const customFont = await pdfDoc.embedFont(fontBytes, { subset: true });
    const urlFont = await pdfDoc.embedFont(StandardFonts.Courier);
    const urlFontBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

    const qrCodeImage = await this.generateAndSaveQrCode(qrCodeUrl);

    // Add a blank page to the document
    const page = pdfDoc.addPage(PageSizes.A6);
    const { width, height } = page.getSize();
    console.log({ width, height });

    page.setFont(customFont);
    page.moveTo(25, height - 40);
    page.drawText('Hallo ' + names + '!', { size: 16 });

    page.setFontSize(11);
    page.setLineHeight(16);

    page.moveDown(25);
    page.drawText(
      `Wir würden uns sehr freuen, wenn ${isOne ? 'du' : 'ihr'} unsere kleine\n` +
        `Homepage ${isOne ? 'besuchst' : 'besucht'} und uns so eine Rückmeldung ${isOne ? 'gibst' : 'gebt'}.`,
    );

    page.moveDown(40);
    page.drawText(
      `Dann wissen wir, ob ${isOne ? 'du' : 'ihr'} diesen besonderen Tag mit uns\n` +
        `verbringen ${isOne ? 'kannst' : 'könnt'} und ob es Essenswünsche gibt, die wir\n` +
        'berücksichtigen können.',
    );

    page.moveDown(56);
    page.drawText(
      `${isOne ? 'Scanne' : 'Scannt'} einfach den unten angegebenen QR-Code und ${isOne ? 'gib' : 'gebt'}\n` +
        `${isOne ? 'deine' : 'eure'} Zugangsdaten ein oder ${isOne ? 'rufe' : 'ruft'} die Seite direkt auf:`,
    );

    page.moveDown(40);
    const textWidth = urlFont.widthOfTextAtSize(homepageUrl, 11);
    const posX = (width - textWidth) / 2;
    page.drawText(homepageUrl, { font: urlFont, x: posX });

    // png=string
    const image1 = await pdfDoc.embedPng(qrCodeImage);
    const image1Dims = image1.scale(0.5);

    page.moveDown(image1Dims.height + 12);
    page.drawImage(image1, { width: image1Dims.width, height: image1Dims.height });

    page.moveUp(image1Dims.height - 20);
    page.moveRight(image1Dims.width + 15);
    page.drawText('Zugangsschlüssel', { font: urlFontBold });

    page.moveDown(12);
    page.drawText(invitation.token, { font: urlFont });

    page.moveDown(20);
    page.drawText('PIN', { font: urlFontBold });

    page.moveDown(12);
    page.drawText(code, { font: urlFont });

    page.moveTo(25, 90);
    page.drawText(`Wir freuen uns auf den Tag mit ${isOne ? 'Dir' : 'Euch'}!`, { size: 16 });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  }

  private async generateAndSaveQrCode(url: string): Promise<string> {
    try {
      return await this.generateQrCode(url);
    } catch {
      throw new HttpException('QR Code konnte nicht erstellt werden', HttpStatus.BAD_REQUEST);
    }
  }

  private generateQrCode(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(url, (err, imageData) => {
        if (err) {
          reject(err);
        } else {
          resolve(imageData);
        }
      });
    });
  }

  private generateRandomCode = (): string => {
    const code = Math.floor(Math.random() * 900_000 + 100_000);
    return code.toString();
  };
}
