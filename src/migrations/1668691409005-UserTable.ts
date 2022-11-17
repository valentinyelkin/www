import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1668691409005 implements MigrationInterface {
    name = 'UserTable1668691409005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
                "invite_code" character varying,
                "invite_from" integer,
                "wallet_id" integer,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "REL_67abb81dc33e75d1743323fd5d" UNIQUE ("wallet_id"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "wallets" (
                "id" SERIAL NOT NULL,
                "amount" double precision NOT NULL DEFAULT '0',
                CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_67abb81dc33e75d1743323fd5db" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_67abb81dc33e75d1743323fd5db"
        `);
        await queryRunner.query(`
            DROP TABLE "wallets"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
