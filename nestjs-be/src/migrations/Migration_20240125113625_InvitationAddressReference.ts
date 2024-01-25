import { Migration } from '@mikro-orm/migrations';

export class Migration20240125113625_InvitationAddressReference extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "addresses" drop constraint "addresses_invitation_id_foreign";');

    this.addSql('alter table "addresses" drop constraint "addresses_invitation_id_unique";');
    this.addSql('alter table "addresses" drop column "invitation_id";');

    this.addSql('alter table "invitations" add column "address_id" uuid null;');
    this.addSql(
      'alter table "invitations" add constraint "invitations_address_id_foreign" foreign key ("address_id") references "addresses" ("id") on update cascade on delete set null;',
    );
    this.addSql('alter table "invitations" add constraint "invitations_address_id_unique" unique ("address_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "invitations" drop constraint "invitations_address_id_foreign";');

    this.addSql('alter table "addresses" add column "invitation_id" uuid null default null;');
    this.addSql(
      'alter table "addresses" add constraint "addresses_invitation_id_foreign" foreign key ("invitation_id") references "invitations" ("id") on update cascade on delete cascade;',
    );
    this.addSql('alter table "addresses" add constraint "addresses_invitation_id_unique" unique ("invitation_id");');

    this.addSql('alter table "invitations" drop constraint "invitations_address_id_unique";');
    this.addSql('alter table "invitations" drop column "address_id";');
  }
}
