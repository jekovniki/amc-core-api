import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEntities1740906087274 implements MigrationInterface {
  private readonly logger = new Logger(SeedEntities1740906087274.name);
  private readonly tableName = 'entity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    // user permissions
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Fund');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Investment company');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Alternative Investment Fund');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('National Investment Fund');`);
    await queryRunner.query(`INSERT INTO ${this.tableName} (name) VALUES ('Other');`);
    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');

    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Fund'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Investment company'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Alternative Investment Fund'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'National Investment Fund'`);
    await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'Other'`);

    this.logger.log('DOWN - COMPLETED');
  }
}
