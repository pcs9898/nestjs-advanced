import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLength(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [length],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedLength] = args.constraints;
          return (
            typeof value === 'number' &&
            value.toString().length === relatedLength
          );
        },
      },
    });
  };
}
