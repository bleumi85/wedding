import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Guest } from './entities/guest.entity';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Group } from '@api/groups/entities/group.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestsRepository: EntityRepository<Guest>,
    private readonly em: EntityManager,
  ) {}

  async findAll() {
    return await this.guestsRepository.findAll({
      populate: ['groups'],
      orderBy: [{ role: 'ASC' }, { responseStatus: 'ASC' }, { gender: 'ASC' }],
    });
  }

  async findAllFromCommonGroups(invitationId: string, hasAdmin: boolean) {
    if (hasAdmin) {
      return await this.guestsRepository.find({}, { fields: ['id', 'firstName', 'lastName', 'responseStatus'] });
    }

    const guestIds = await this.em.createQueryBuilder(Guest, 'gu').select('id').where({ 'gu.invitation': invitationId }).getResultList();

    const groups = await this.em
      .createQueryBuilder(Group, 'gr')
      .select('id')
      .distinct()
      .leftJoin('gr.guests', 'gu')
      .where({ 'gu.invitation': invitationId })
      .getResultList();

    const guests = this.em
      .createQueryBuilder(Guest, 'gu')
      .select(['id', 'firstName', 'lastName', 'responseStatus'])
      .distinct()
      .leftJoin('gu.groups', 'gr')
      .where({ 'gr.id': { $in: groups } })
      .andWhere({ 'gu.id': { $nin: guestIds } });

    return await guests.getResultList();
  }

  async update(ids: string[], guestsData: UpdateGuestDto[], hasAdmin: boolean) {
    await this.em.begin();

    try {
      const updatedGuests: Guest[] = guestsData.map((guestData): Guest => {
        if (!hasAdmin && guestData.id && ids.indexOf(guestData.id) === -1) {
          throw new HttpException('Nicht erlaubt', HttpStatus.FORBIDDEN);
        }
        const guest = this.em.getReference(Guest, guestData.id);
        Object.assign(guest, guestData);

        return guest;
      });
      this.em.persist(updatedGuests);
      await this.em.commit();
    } catch (error: any) {
      await this.em.rollback();
      Logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
