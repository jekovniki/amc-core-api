import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

/**
 * I know that most likely it's not optimal to have data in the migration
 * but for the sake of roles and permissions I'm ok with passing that
 */
export class RolePermissionsSeed1738780252905 implements MigrationInterface {
  private readonly logger = new Logger(RolePermissionsSeed1738780252905.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    // add roles
    await queryRunner.query(`INSERT INTO role (name) VALUES ('Administrator');`);
    await queryRunner.query(`INSERT INTO role (name) VALUES ('Employee');`);

    // user permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('user', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('user', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('user', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('user', 'CREATE');`);

    // company permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('company', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('company', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('company', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('company', 'CREATE');`);

    // entity permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('entity', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('entity', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('entity', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('entity', 'CREATE');`);

    // obligation permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('obligation', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('obligation', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('obligation', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('obligation', 'CREATE');`);

    // asset permissions
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('asset', 'READ');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('asset', 'UPDATE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('asset', 'DELETE');`);
    await queryRunner.query(`INSERT INTO permission (feature, permission) VALUES ('asset', 'CREATE');`);

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    await queryRunner.query(`DELETE FROM permission`);
    await queryRunner.query(`DELETE FROM role WHERE name = 'Administrator'`);
    await queryRunner.query(`DELETE FROM role WHERE name = 'Employee'`);
    this.logger.log('DOWN - COMPLETED');
  }
}
