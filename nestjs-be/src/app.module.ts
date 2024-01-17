import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { GuestsModule } from './api/guests/guests.module';
import { InvitationsModule } from './api/invitations/invitations.module';
import { GroupsModule } from './api/groups/groups.module';

@Module({
  imports: [ConfigModule, DatabaseModule, GuestsModule, InvitationsModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
