import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWalletRulesTable1743950616346 implements MigrationInterface {
  private readonly logger = new Logger(CreateWalletRulesTable1743950616346.name);
  private readonly table = 'wallet_rules';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.createTable(
      new Table({
        name: this.table,
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
            isNullable: false,
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: false,
            default: null,
          },
          {
            name: 'entity_id',
            type: 'uuid',
            isNullable: false,
            default: null,
          },
          {
            name: 'min_limit',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'max_limit',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['per_asset', 'per_group'],
            default: "'per_asset'",
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

    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['entity_id'],
        referencedTableName: 'entity',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    await queryRunner.dropTable(this.table, true);
    this.logger.log('DOWN - COMPLETED');
  }
}
