import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Guest } from './entities/guest.entity';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Guest])],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
