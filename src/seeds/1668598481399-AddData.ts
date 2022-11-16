import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddData1668598481399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (1, 'admin@gmail.com', 'adminpass', 'admin', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (2, 'user2@gmail.com', 'user2', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (3, 'investor3@gmail.com', 'user3', 'investor', 1000, '', 7);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (4, 'user4@gmail.com', 'user4', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (5, 'user5@gmail.com', 'user5', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (6, 'user6@gmail.com', 'user6', 'user', 0, '', 9);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (7, 'investor7@gmail.com', 'investor7', 'investor', 40000, 'inv-investor7@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (8, 'user8@gmail.com', 'user8', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (9, 'investor9@gmail.com', 'investor9', 'investor', 6000, 'inv-investor9@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (10, 'investor10@gmail.com', 'investor10', 'investor', 12000, 'inv-investor10@gmail.com', 9);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users"
        `);
  }
}
