import { Migration } from '@mikro-orm/migrations';

export class Migration20240117094235_GroupsTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "groups" ("id" uuid not null default gen_random_uuid(), "group_name" varchar(255) not null, "color_light" varchar(255) null, "color_dark" varchar(255) null, constraint "groups_pkey" primary key ("id"));',
    );
    this.addSql('alter table "groups" add constraint "groups_group_name_unique" unique ("group_name");');

    this.addSql(
      'create table "groups_guests" ("group_id" uuid not null, "guest_id" uuid not null, constraint "groups_guests_pkey" primary key ("group_id", "guest_id"));',
    );

    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "groups_guests" add constraint "groups_guests_guest_id_foreign" foreign key ("guest_id") references "guests" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "groups_guests" drop constraint "groups_guests_group_id_foreign";');

    this.addSql('drop table if exists "groups" cascade;');

    this.addSql('drop table if exists "groups_guests" cascade;');
  }
}
