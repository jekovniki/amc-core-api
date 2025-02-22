import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class SeedAdditionalPermissionsToRoles1740211714642 implements MigrationInterface {
  private readonly logger = new Logger(SeedAdditionalPermissionsToRoles1740211714642.name);
  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    // user permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('users', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('users', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('users', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('users', 'CREATE');`);

    // assign the permissions
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 21);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 22);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 23);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (1, 24);`);
    await queryRunner.query(`INSERT INTO role_permission (role_id, permission_id) VALUES (2, 21);`);
    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');

    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id = 1 AND permission_id = 21`);
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id = 1 AND permission_id = 22`);
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id = 1 AND permission_id = 23`);
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id = 1 AND permission_id = 24`);
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id = 2 AND permission_id = 21`);

    await queryRunner.query(`DELETE FROM permission WHERE feature = 'users'`);
    this.logger.log('DOWN - COMPLETED');
  }
}
