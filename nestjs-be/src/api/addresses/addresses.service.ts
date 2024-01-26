import { Invitation } from '@api/invitations/entities/invitation.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: EntityRepository<Address>,
    private readonly em: EntityManager,
  ) {}

  async create(data: CreateAddressDto) {
    const { invitation: invitationId, ...addressData } = data;
    const invitation = this.em.getReference(Invitation, invitationId);
    const newAddress = this.addressRepository.create({ ...addressData, invitation });
    await this.em.persistAndFlush(newAddress);
    return newAddress;
  }

  async findOne(id: string) {
    const address = await this.addressRepository.findOne(id);
    if (address) {
      return address;
    }
    throw new HttpException('Eine Adresse mit dieser id existiert nicht', HttpStatus.NOT_FOUND);
  }

  async update(id: string, data: UpdateAddressDto) {
    const address = await this.findOne(id);
    delete data.invitation;
    Object.assign(address, data);
    console.log({ address });

    await this.em.persistAndFlush(address);
    return address;
  }

  async remove(id: string) {
    const address = await this.findOne(id);
    await this.em.removeAndFlush(address);
    return { message: 'Adresse wurde erfolgreich gelöscht' };
  }
}
