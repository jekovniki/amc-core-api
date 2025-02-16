import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * I know that most likely it's not optimal to have data in the migration
 * but for the sake of roles and permissions I'm ok with passing that
 *
 * FYI - this will fail if the id's are not in these position, but I'm too lazy to do the selects
 */
export class AssignPermissionsToRolesSeed1738780874236 implements MigrationInterface {
  private readonly logger = new Logger(AssignPermissionsToRolesSeed1738780874236.name);
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Employee permissions
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 1);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 2);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 5);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 9);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 13);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 14);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 15);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 16);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 17);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 18);`);

    // Admin permissions
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 1);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 2);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 3);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 4);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 5);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 6);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 7);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 8);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 9);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 10);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 11);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 12);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 13);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 14);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 15);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 16);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 17);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 18);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 19);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 20);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permission`);
  }
}
