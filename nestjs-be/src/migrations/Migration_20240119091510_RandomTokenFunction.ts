import { Migration } from '@mikro-orm/migrations';

export class Migration20240119091510_RandomTokenFunction extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE OR REPLACE FUNCTION generate_token()
      RETURNS VARCHAR AS '
      DECLARE
          token_part1 VARCHAR;
          token_part2 VARCHAR;
          token_part3 VARCHAR;
      BEGIN
          -- Generiere 4 zufällige Kleinbuchstaben und Zahlen für jeden Teil des Tokens
          token_part1 := substring(md5(random()::text), 1, 4);
          token_part2 := substring(md5(random()::text), 1, 4);
          token_part3 := substring(md5(random()::text), 1, 4);

          -- Setze die Teile zusammen mit Bindestrichen
          RETURN token_part1 || ''-'' || token_part2 || ''-'' || token_part3;
      END;
      ' LANGUAGE plpgsql;
    `);
    this.addSql('alter table "invitations" alter column "token" type varchar(255) using ("token"::varchar(255));');
    this.addSql('alter table "invitations" alter column "token" set default generate_token();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "invitations" alter column "token" drop default;');
    this.addSql('alter table "invitations" alter column "token" type varchar(255) using ("token"::varchar(255));');
    this.addSql('drop function generate_token()');
  }
}
