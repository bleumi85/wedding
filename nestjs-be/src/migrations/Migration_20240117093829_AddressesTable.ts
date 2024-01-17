import { Migration } from '@mikro-orm/migrations';

export class Migration20240117093829_AddressesTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "addresses" ("id" uuid not null default gen_random_uuid(), "street" varchar(255) not null, "zip_code" varchar(255) not null, "city" varchar(255) not null, "country" varchar(255) not null default \'Deutschland\', "invitation_id" uuid null, constraint "addresses_pkey" primary key ("id"));',
    );
    this.addSql('alter table "addresses" add constraint "addresses_invitation_id_unique" unique ("invitation_id");');

    this.addSql(
      'alter table "addresses" add constraint "addresses_invitation_id_foreign" foreign key ("invitation_id") references "invitations" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "addresses" cascade;');
  }
}
