import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: EntityRepository<Group>,
    private readonly em: EntityManager,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const newGroup = this.groupsRepository.create(createGroupDto);
    await this.em.persistAndFlush(newGroup);
    return newGroup;
  }

  async findAll() {
    return await this.groupsRepository.findAll({ populate: ['guests'] });
  }

  async findOne(id: string, withGuests = false) {
    const group = await this.groupsRepository.findOne(id, {
      populate: withGuests ? ['guests'] : [],
    });
    if (group) {
      return group;
    }
    throw new HttpException('Eine Gruppe mit dieser id existiert nicht', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(id);
    Object.assign(group, updateGroupDto);

    await this.em.persistAndFlush(group);
    return group;
  }

  async remove(id: string) {
    const group = await this.findOne(id, true);
    if (group.guests.length > 0) {
      throw new HttpException('Eine Gruppe mit Gästen kann nicht gelöscht werden', HttpStatus.FORBIDDEN);
    }

    await this.em.removeAndFlush(group);
    return { message: `Gruppe '${group.groupName}' wurde gelöscht` };
  }
}
