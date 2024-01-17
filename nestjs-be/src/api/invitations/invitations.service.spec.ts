import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Invitation } from './entities/invitation.entity';

describe('InvitationsService', () => {
  let service: InvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature([Invitation])],
      providers: [InvitationsService],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
