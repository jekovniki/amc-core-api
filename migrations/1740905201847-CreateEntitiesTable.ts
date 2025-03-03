import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEntitiesTable1740905201847 implements MigrationInterface {
  private readonly logger = new Logger(CreateEntitiesTable1740905201847.name);
  private readonly tableName = 'entity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.createTable(
      new Table({
        name: this.tableName,
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
            isNullable: false,
          },
        ],
      }),
      true,
    );

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    await queryRunner.dropTable(this.tableName);
    this.logger.log('DOWN - COMPLETED');
  }
}
