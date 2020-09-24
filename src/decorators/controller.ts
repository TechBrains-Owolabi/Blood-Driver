import 'reflect-metadata';

import { AppRouter } from '../AppRouter';
import { Methods } from '../enums/Methods';
import { MetadataKeys } from '../enums/MetadataKeys';

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      ) as Methods;

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      const fieldsValidation =
        Reflect.getMetadata(MetadataKeys.validators, target.prototype, key) ||
        [];

      if (path && method) {
        router[method](
          `${routePrefix}${path}`,
          fieldsValidation,
          ...middlewares,
          routeHandler
        );
      }
    }
  };
}
