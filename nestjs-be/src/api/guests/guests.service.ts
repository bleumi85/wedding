import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Guest } from './entities/guest.entity';
import { UpdateGuestDto } from './dto/update-guest.dto';

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
