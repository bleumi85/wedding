import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature([Group])],
      controllers: [GroupsController],
      providers: [GroupsService],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
