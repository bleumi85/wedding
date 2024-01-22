import { InvitationsModule } from '@api/invitations/invitations.module';
import { File } from './entities/file.entity';
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([File]), InvitationsModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
