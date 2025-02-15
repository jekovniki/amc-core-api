import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityManager } from 'typeorm';

/**
 * Got it from stackoverflow:
 * https://stackoverflow.com/questions/75660359/how-to-add-unique-field-validation-in-nest-js-with-class-validator
 */
@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const [tableName, column] = args?.constraints as string[];

    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return !dataExist;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const field = validationArguments.property;

    return `${field} already exist.`;
  }
}
