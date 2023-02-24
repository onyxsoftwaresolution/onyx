import { SetMetadata } from '@nestjs/common';

export const IS_ANONYMOUS = 'AllowAnonymous';
export const AllowAnonymous = () => SetMetadata(IS_ANONYMOUS, true);
