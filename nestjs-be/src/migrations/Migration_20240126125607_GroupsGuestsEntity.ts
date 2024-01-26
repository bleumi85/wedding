import { Migration } from '@mikro-orm/migrations';

export class Migration20240126125607_GroupsGuestsEntity extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "groups_guests" drop constraint "groups_guests_group_id_foreign";');
    this.addSql('alter table "groups_guests" drop constraint "groups_guests_guest_id_foreign";');

    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_guest_id_foreign" foreign key ("guest_id") references "guests" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "groups_guests" drop constraint "groups_guests_group_id_foreign";');
    this.addSql('alter table "groups_guests" drop constraint "groups_guests_guest_id_foreign";');

    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_guest_id_foreign" foreign key ("guest_id") references "guests" ("id") on update cascade on delete cascade;',
    );
  }
}
