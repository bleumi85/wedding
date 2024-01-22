import { Body, Get, Param, Post, Res, StreamableFile } from '@nestjs/common';
import { ControllerHelper } from '@utils/controller-helper';
import { FilesService } from './files.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateFileDto } from './dto/create-file.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';

@ControllerHelper('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiBody({ type: [CreateFileDto] })
  async createBulk(@Body() createFilesDto: CreateFileDto[]) {
    return await this.filesService.createBulk(createFilesDto);
  }

  @Get(':invitationId')
  @ApiParam({ name: 'invitationId', type: 'string' })
  async findOne(@Res({ passthrough: true }) res: Response, @Param('invitationId') invitationId: string) {
    const file = await this.filesService.findOneByInvitation(invitationId);
    const fileHelper = createReadStream(file.filePath);

    res.setHeader('Content-Disposition', `attachment; filename=${file.fileName}`).type(file.mimeType);

    return new StreamableFile(fileHelper);
  }
}
