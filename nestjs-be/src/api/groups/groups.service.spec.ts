import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature([Group])],
      providers: [GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
