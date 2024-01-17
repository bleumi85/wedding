import { Migration } from '@mikro-orm/migrations';

export class Migration20240117093413_InvitationsTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "invitations" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default current_timestamp, "updated_at" timestamptz(0) null, "token" varchar(255) not null, "access_code" varchar(255) not null, "is_printed" boolean not null default false, "current_hashed_refresh_token" varchar(255) null, constraint "invitations_pkey" primary key ("id"));',
    );

    this.addSql('alter table "guests" add column "invitation_id" uuid null;');
    this.addSql(
      'alter table "guests" add constraint "guests_invitation_id_foreign" foreign key ("invitation_id") references "invitations" ("id") on delete cascade;',
    );
    this.addSql('alter table "guests" add constraint "unique_full_name_on_invitation" unique ("first_name", "last_name", "invitation_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "guests" drop constraint "guests_invitation_id_foreign";');

    this.addSql('drop table if exists "invitations" cascade;');

    this.addSql('alter table "guests" drop constraint "unique_full_name_on_invitation";');
    this.addSql('alter table "guests" drop column "invitation_id";');
  }
}
