import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWalletAssetGroup1748087126326 implements MigrationInterface {
  private readonly logger = new Logger(CreateWalletAssetGroup1748087126326.name);
  private readonly table = 'wallet_asset_group';
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
            name: 'wallet_group_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wallet_asset_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'entity_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.table,
      new TableForeignKey({
        columnNames: ['wallet_group_id'],
        referencedTableName: 'wallet_group',
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
