import { Migration } from '@mikro-orm/migrations';

export class Migration20240117092613_GuestsTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "guests" ("id" uuid not null default gen_random_uuid(), "first_name" varchar(255) not null, "last_name" varchar(255) not null, "display_name" varchar(255) not null, "response_status" smallint not null default 0, "role" smallint not null default 1, "gender" smallint not null, "age_type" smallint not null default 0, "meal_request" smallint not null default 0, constraint "guests_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "guests" cascade;');
  }
}
