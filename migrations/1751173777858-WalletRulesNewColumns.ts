import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class WalletRulesNewColumns1751173777858 implements MigrationInterface {
  private readonly logger = new Logger(WalletRulesNewColumns1751173777858.name);
  private readonly table = 'wallet_rules';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.table,
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['per_asset', 'per_group', 'all', 'per_type_asset'],
        default: "'per_asset'",
      }),
    );

    await queryRunner.addColumn(
      this.table,
      new TableColumn({
        name: 'type_value',
        type: 'enum',
        enum: ['%', 'BGN', 'EUR', 'USD'],
        default: "'%'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');

    await queryRunner.dropColumn(this.table, 'type_value');

    await queryRunner.changeColumn(
      this.table,
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['per_asset', 'per_group'],
        default: "'per_asset'",
      }),
    );

    this.logger.log('DOWN - COMPLETED');
  }
}
