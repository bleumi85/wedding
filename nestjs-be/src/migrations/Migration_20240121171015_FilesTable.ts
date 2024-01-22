import { Migration } from '@mikro-orm/migrations';

export class Migration20240121171015_FilesTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "files" ("id" uuid not null default gen_random_uuid(), "file_name" varchar(255) not null, "file_path" varchar(255) not null, "mime_type" varchar(255) not null, "size" bigint not null, "is_send" boolean not null default false, "invitation_id" uuid null, constraint "files_pkey" primary key ("id"));',
    );
    this.addSql('alter table "files" add constraint "files_invitation_id_unique" unique ("invitation_id");');

    this.addSql(
      'alter table "files" add constraint "files_invitation_id_foreign" foreign key ("invitation_id") references "invitations" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "files" cascade;');
  }
}
