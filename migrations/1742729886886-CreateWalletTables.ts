import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateWalletTables1742729886886 implements MigrationInterface {
  private readonly logger = new Logger(CreateWalletTables1742729886886.name);
  private readonly walletTable = 'wallet';
  private readonly walletAssetTypeTable = 'wallet_asset_type';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.createTable(
      new Table({
        name: this.walletAssetTypeTable,
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
            isNullable: true,
            default: null,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.walletAssetTypeTable,
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: this.walletTable,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isin',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 18,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'enum',
            enum: ['BGN', 'EUR', 'USD'],
            default: "'BGN'",
          },
          {
            name: 'asset_type_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'entity_id',
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

    // Create foreign keys for wallet
    await queryRunner.createForeignKey(
      this.walletTable,
      new TableForeignKey({
        columnNames: ['asset_type_id'],
        referencedTableName: this.walletAssetTypeTable,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      this.walletTable,
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      this.walletTable,
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

    await queryRunner.dropTable(this.walletTable, true);
    await queryRunner.dropTable(this.walletAssetTypeTable, true);

    this.logger.log('DOWN - COMPLETED');
  }
}
