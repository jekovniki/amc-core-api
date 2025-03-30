import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialWalletTypes1742731367076 implements MigrationInterface {
  private readonly logger = new Logger(SeedInitialWalletTypes1742731367076.name);

  private readonly tableName = 'wallet_asset_type';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Stocks');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Corporate bonds');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Collective Investment Schemes shares');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Money and deposits');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Other assets');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Receivables');`);
    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');

    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Stocks'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Corporate bonds'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Collective Investment Schemes shares'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Money and deposits'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Other assets'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Receivables'`);

    this.logger.log('DOWN - COMPLETED');
  }
}
