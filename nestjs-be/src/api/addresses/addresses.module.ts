import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from './entities/address.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Address])],
  providers: [AddressesService],
  controllers: [AddressesController],
})
export class AddressesModule {}
