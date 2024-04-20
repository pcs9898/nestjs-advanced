// custom-swagger-decorators.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResDto } from '../dto/res.dto';

export const ApiPostResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: 201, // POST 요청 성공 시 일반적으로 사용되는 상태 코드
      description: 'The record has been successfully created.',
      schema: {
        $ref: getSchemaPath(model),
      },
    }),
  );
};

export const ApiGetResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      status: 200, // GET 요청 성공 시 일반적으로 사용되는 상태 코드
      description: 'The record has been successfully retrieved.',
      schema: {
        $ref: getSchemaPath(model),
      },
    }),
  );
};

export const ApiGetItemResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
