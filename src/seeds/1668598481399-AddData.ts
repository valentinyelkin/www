import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddData1668598481399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (111, 'admin@gmail.com', '$2b$05$g2pTRJpCcixI.f7ZP3ny1.FApLaVJxV8GX9kZtcI9h19e.TwnIb7q', 'admin', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (112, 'user2@gmail.com', '$2b$05$fddRlSli7cJE92CNdc8GDOYkHcvyjDaWHlaidabu40CZB9omaoqa2', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (113, 'investor3@gmail.com', '$2b$05$.aGxr3B7U4fgZc9g2cOOcuQUlYbC6ES6Zs5ekigIOsHeU0lwiECIe', 'investor', 1000, '', 117);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (114, 'user4@gmail.com', '$2b$05$4391q3NaL2mWlo4EDTIkfO61kZHxZ.53aW6ArjPUaVhpD0YmRXcy2', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (115, 'user5@gmail.com', '$2b$05$FvNdFY0Qxk9voiKWl5KEhutfrzljfuN9oFiFfJ./iZGFJMwc6qzga', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (116, 'user6@gmail.com', '$2b$05$NadF5x0nOHJvnXprtrYE.ulz6PfEl53SkL3EWV1xYstJOL2857pMy', 'user', 0, '', 119);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (117, 'investor7@gmail.com', '$2b$05$vjtE2imIRJ8Zv/bQNKYifuYSugSxrf2Ytf1MZ3rQrQX5wLeEEcBjS', 'investor', 40000, 'inv-investor7@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (118, 'user8@gmail.com', '$2b$05$kUsXMzcEYU68Doh2XcUyheUxRh9XFL0Rt063W3D0TR4RqwPfuMIsO', 'user', 0, '', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (119, 'investor9@gmail.com', '$2b$05$UDvA18kNMaPX2SdP3ufzceUlL2MbKg4CWWWSI0Zbu455iu0JusqgO', 'investor', 6000, 'inv-investor9@gmail.com', null);",
    );
    queryRunner.query(
      "INSERT INTO users (id, email, password, role, balance, invite_code, invite_from) VALUES (1110, 'investor10@gmail.com', '$2b$05$7E/OwHsmpNbUfsN2H5lV0u2VXi5yh51TAo2Vlxzm6QcSz7vuvTPWm', 'investor', 12000, 'inv-investor10@gmail.com', 119);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM "users"
        `);
  }
}
