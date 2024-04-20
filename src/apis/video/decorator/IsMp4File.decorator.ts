import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsMp4File(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMp4File',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
          const allowedExtensions = /(\.mp4)$/i;

          if (
            typeof value !== 'object' ||
            value === null ||
            !value.originalname ||
            !value.mimetype ||
            !value.size
          ) {
            console.error(
              'Validation error: The value is not an object, or missing required file properties',
            );
            return false;
          }

          const fileExtensionIsValid = allowedExtensions.test(
            value.originalname,
          );
          const fileTypeIsValid = value.mimetype === 'video/mp4';
          const fileSizeIsValid = value.size <= maxFileSize;

          console.log(fileExtensionIsValid);
          console.log(fileTypeIsValid);
          console.log(fileSizeIsValid);
          return fileExtensionIsValid && fileTypeIsValid && fileSizeIsValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a valid MP4 file and less than 5MB`;
        },
      },
    });
  };
}
