import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Guest } from './entities/guest.entity';

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
}
