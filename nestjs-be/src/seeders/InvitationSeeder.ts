import { Address } from '@api/addresses/entities/address.entity';
import { Group } from '@api/groups/entities/group.entity';
import { Guest } from '@api/guests/entities/guest.entity';
import { Invitation } from '@api/invitations/entities/invitation.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role, Gender, ResponseStatus, MealRequest } from '@utils/enums';
import bcrypt from 'bcrypt';

export class InvitationSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.nativeDelete(Invitation, { token: 'abcd-abcd-abcd' });
    em.nativeDelete(Invitation, { token: 'xoud-ehin-kelx' });
    em.nativeDelete(Group, { groupName: 'Brautpaar' });

    const invitation = em.create(Invitation, {
      token: 'abcd-abcd-abcd',
      accessCode: await bcrypt.hash('123456', 10),
    });

    const invitationOu = em.create(Invitation, {
      token: 'xoud-ehin-kelx',
      accessCode: await bcrypt.hash('090982', 10),
    });

    em.create(Address, {
      street: 'Am Ullenbach 1',
      zipCode: '49847',
      city: 'Itterbeck',
      country: 'Deutschland',
      invitation,
    });

    em.create(Address, {
      street: 'Eichenstr. 3',
      zipCode: '49824',
      city: 'Emlichheim',
      country: 'Deutschland',
      invitation: invitationOu,
    });

    const group = em.create(Group, {
      groupName: 'Brautpaar',
      colorLight: '#d69e2e',
      colorDark: '#faf089',
    });

    em.create(Guest, {
      firstName: 'Anne',
      lastName: 'Bleumer',
      displayName: 'Braut',
      role: Role.ADMIN,
      gender: Gender.FEMALE,
      responseStatus: ResponseStatus.CONFIRMED,
      mealRequest: MealRequest.NONE,
      invitation,
      groups: [group],
    });
    em.create(Guest, {
      firstName: 'Jens',
      lastName: 'Bleumer',
      displayName: 'Bräutigam',
      role: Role.ADMIN,
      gender: Gender.MALE,
      responseStatus: ResponseStatus.CONFIRMED,
      mealRequest: MealRequest.NONE,
      invitation,
      groups: [group],
    });

    em.create(Guest, {
      firstName: 'Andy',
      lastName: 'Oudehinkel',
      displayName: 'Andy',
      role: Role.WITNESS,
      gender: Gender.MALE,
      responseStatus: ResponseStatus.CONFIRMED,
      mealRequest: MealRequest.NONE,
      invitation: invitationOu,
      groups: [group],
    });
    em.create(Guest, {
      firstName: 'Nadine',
      lastName: 'Oudehinkel',
      displayName: 'Nadine',
      role: Role.GUEST,
      gender: Gender.FEMALE,
      responseStatus: ResponseStatus.CONFIRMED,
      mealRequest: MealRequest.VEGETARIAN,
      invitation: invitationOu,
      groups: [group],
    });
  }
}
