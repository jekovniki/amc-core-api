import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateWalletTable1750877331903 implements MigrationInterface {
  private readonly logger = new Logger(UpdateWalletTable1750877331903.name);
  private readonly table = 'wallet';
  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.addColumn(
      this.table,
      new TableColumn({
        name: 'amount',
        type: 'decimal',
        precision: 18,
        scale: 2,
        isNullable: true,
        default: null,
      }),
    );

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');

    await queryRunner.dropColumn(this.table, 'amount');

    this.logger.log('DOWN - COMPLETED');
  }
}
