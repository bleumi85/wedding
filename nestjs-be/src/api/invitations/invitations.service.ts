import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { Invitation } from './entities/invitation.entity';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: EntityRepository<Invitation>,
    private readonly em: EntityManager,
  ) {}

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
    await this.invitationsRepository.nativeUpdate({ id }, updateInvitationDto);
    return { message: `Einladung mit id #${id} erfolgreich aktualisiert` };
  }
}
