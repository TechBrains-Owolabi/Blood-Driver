import { RequestHandler } from 'express';
import 'reflect-metadata';
import { MetadataKeys } from '../enums/MetadataKeys';

export function bodyValidator(validators: RequestHandler[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKeys.validators, validators, target, key);
  };
}
