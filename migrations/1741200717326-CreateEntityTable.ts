import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { Logger } from '@nestjs/common';

export class CreateEntityTable1741200717326 implements MigrationInterface {
  private readonly logger = new Logger(CreateEntityTable1741200717326.name);
  private readonly tableName = 'entity';

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('UP - START');

    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            // isUnique: true, // no need for is unique, it will be handled from typeorm
          },
          {
            name: 'uic',
            type: 'varchar',
            // isUnique: true // no need for is unique, it will be handled from typeorm
          },
          {
            name: 'lei',
            type: 'varchar',
            // isUnique: true, // no need for is unique, it will be handled from typeorm
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'entity_type_id',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE'],
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
      this.tableName,
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for entity_type_id
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['entity_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entity_type',
        onDelete: 'CASCADE',
      }),
    );

    this.logger.log('UP - COMPLETED');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('DOWN - START');
    const entityTable = await queryRunner.getTable('entity');
    const companyForeignKey = entityTable?.foreignKeys.find((fk) => fk.columnNames.indexOf('company_id') !== -1);
    const entityTypeForeignKey = entityTable?.foreignKeys.find((fk) => fk.columnNames.indexOf('entity_type_id') !== -1);

    if (companyForeignKey) {
      await queryRunner.dropForeignKey('entity', companyForeignKey);
    }
    if (entityTypeForeignKey) {
      await queryRunner.dropForeignKey('entity', entityTypeForeignKey);
    }

    // Drop the table
    await queryRunner.dropTable('entity');
    this.logger.log('DOWN - COMPLETED');
  }
}
