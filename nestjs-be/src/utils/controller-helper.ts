import { Controller, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ControllerHelper = (path: string): ClassDecorator => {
  const apiTags = path.split('/').filter(Boolean).join('/');
  return (target: any) => {
    SetMetadata('path', path)(target);
    SetMetadata('apiTags', apiTags)(target);
    Controller(path)(target);
    ApiTags(path)(target);
  };
};
