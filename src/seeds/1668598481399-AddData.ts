import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddData1668598481399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (111, 'admin@gmail.com', '$2b$05$aSiUXJ0pp8V1m/eEgAycTu6xHgMh0nIjW3o/oB37kYe5SMSo8eZiq', 'admin', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (112, 'user2@gmail.com', 'user2', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (113, 'investor3@gmail.com', 'user3', 'investor', 1000, '', 117);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (114, 'user4@gmail.com', 'user4', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (115, 'user5@gmail.com', 'user5', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (116, 'user6@gmail.com', 'user6', 'user', 0, '', 119);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (117, 'investor7@gmail.com', 'investor7', 'investor', 40000, 'inv-investor7@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (118, 'user8@gmail.com', 'user8', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (119, 'investor9@gmail.com', 'investor9', 'investor', 6000, 'inv-investor9@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (1110, 'investor10@gmail.com', 'investor10', 'investor', 12000, 'inv-investor10@gmail.com', 119);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users"
        `);
  }
}
