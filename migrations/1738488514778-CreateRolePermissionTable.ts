import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';
import { Logger } from '@nestjs/common';

export class RolePermissionTable1738488514778 implements MigrationInterface {
  private readonly logger = new Logger(RolePermissionTable1738488514778.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');
    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'feature',
            type: 'varchar',
          },
          {
            name: 'permission',
            type: 'enum',
            enum: ['READ', 'CREATE', 'DELETE', 'UPDATE'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'role_permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'permission_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'role_permission',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'role_permission',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permission',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'role_permission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_ROLE_ID',
        columnNames: ['role_id'],
      }),
    );

    await queryRunner.createIndex(
      'role_permission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_PERMISSION_ID',
        columnNames: ['permission_id'],
      }),
    );
    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    await queryRunner.dropTable('role_permission');
    await queryRunner.dropTable('permission');
    await queryRunner.dropTable('role');
    this.logger.log('DOWN - COMPLETED');
  }
}
