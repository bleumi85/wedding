import { Migration } from '@mikro-orm/migrations';

export class Migration20240117092613_GuestsTable extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "guests" ("id" uuid not null default gen_random_uuid(), "first_name" varchar(255) not null, "last_name" varchar(255) not null, "display_name" varchar(255) not null, "response_status" text check ("response_status" in (\'Offen\', \'Zugesagt\', \'Abgesagt\')) not null default \'Offen\', "role" smallint not null default 1, "gender" text check ("gender" in (\'m\', \'w\')) not null, "age_type" text check ("age_type" in (\'Erwachsener\', \'Kind\')) not null default \'Erwachsener\', "meal_request" text check ("meal_request" in (\'Keine Sonderwünsche\', \'Pescetarier\', \'Vegetarier\', \'Veganer\')) not null default \'Keine Sonderwünsche\', constraint "guests_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "guests" cascade;');
  }
}
