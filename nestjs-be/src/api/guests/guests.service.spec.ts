import { Test, TestingModule } from '@nestjs/testing';
import { GuestsService } from './guests.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Guest } from './entities/guest.entity';

describe('GuestsService', () => {
  let service: GuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature([Guest])],
      providers: [GuestsService],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
