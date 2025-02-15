import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateUserTable1739598018672 implements MigrationInterface {
  private readonly logger = new Logger(CreateUserTable1739598018672.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'job',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'role_id',
            type: 'smallint',
            isNullable: false,
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('user', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company',
        onDelete: 'CASCADE',
      }),
    ]);

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    await queryRunner.dropTable('user');
    this.logger.log('DOWN - COMPLETED');
  }
}
