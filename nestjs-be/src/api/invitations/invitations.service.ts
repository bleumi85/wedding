import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Invitation } from './entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Address } from '@api/addresses/entities/address.entity';
import { Guest } from '@api/guests/entities/guest.entity';
import { Group } from '@api/groups/entities/group.entity';
import { File } from '@api/files/entities/file.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: EntityRepository<Invitation>,
    private readonly em: EntityManager,
  ) {}

  async create(createInvitationDto: CreateInvitationDto) {
    const { address, guests } = createInvitationDto;
    await this.em.begin();

    try {
      const newInvitation = this.invitationsRepository.create({ accessCode: '123456' });
      this.em.persist(newInvitation);

      if (address !== null) {
        const newAddress = new Address({ ...address, invitation: newInvitation });
        this.em.persist(newAddress);
      }

      const newGuests: Guest[] = await Promise.all(
        guests.map(async ({ groups, ...rest }): Promise<Guest> => {
          const [foundGroups, count] = await this.em.findAndCount(Group, { id: { $in: groups } });
          if (count === 0) {
            throw new HttpException('Keine zulässige Gruppe angegeben', HttpStatus.BAD_REQUEST);
          }
          return this.em.create(Guest, { ...rest, groups: foundGroups, invitation: newInvitation });
        }),
      );
      this.em.persist(newGuests);
      const countNewGuests = newGuests.length;

      await this.em.commit();
      const description = countNewGuests === 1 ? 'Gast' : 'Gästen';
      return { message: `Neue Einladung mit ${countNewGuests} ${description} angelegt` };
    } catch (err: any) {
      await this.em.rollback();
      Logger.error(err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.invitationsRepository.findAll({
      populate: ['address', 'guests'],
    });
  }

  async findOne(id: string, showGuests: boolean) {
    const invitation = await this.invitationsRepository.findOne(id, { populate: showGuests ? ['guests'] : false });
    if (invitation) {
      return invitation;
    }
    throw new HttpException('Eine Einladung mit dieser id existiert nicht', HttpStatus.NOT_FOUND);
  }

  async findOneByToken(token: string, showGuests: boolean) {
    const invitation = await this.invitationsRepository.findOne(
      { token },
      {
        populate: showGuests ? ['guests'] : false,
      },
    );
    if (invitation) {
      return invitation;
    }
    throw new HttpException('Eine Einladung mit diesem Token existiert nicht', HttpStatus.NOT_FOUND);
  }

  async getInvitationIfRefreshTokenMatches(refreshToken: string, id: string, showGuests: boolean) {
    const invitation = await this.findOne(id, showGuests);

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, invitation.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return invitation;
    }
  }

  async update(id: string, updateInvitationDto: UpdateInvitationDto) {
    if (updateInvitationDto.currentHashedRefreshToken) {
      updateInvitationDto.currentHashedRefreshToken = await bcrypt.hash(updateInvitationDto.currentHashedRefreshToken, 10);
    }
    if (updateInvitationDto.token) {
      await this.em.nativeDelete(File, { invitation: id });
    }
    await this.invitationsRepository.nativeUpdate({ id }, updateInvitationDto);
    return { message: `Einladung mit id #${id} erfolgreich aktualisiert` };
  }

  async remove(id: string) {
    await this.em.begin();
    try {
      const invitation = await this.invitationsRepository.findOne({ id }, { populate: ['address'] });
      const address = await this.em.findOne(Address, { id: invitation.address.id });

      this.em.remove(invitation);
      this.em.remove(address);

      await this.em.commit();
      return { message: 'Einladung wurde erfolgreich gelöscht' };
    } catch (err: any) {
      await this.em.rollback();
      Logger.error(err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
