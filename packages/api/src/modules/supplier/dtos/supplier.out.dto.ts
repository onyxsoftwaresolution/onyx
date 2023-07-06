import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { ContractOutDTO } from '@modules/contract/dtos/contract.out.dto';
import { ProjectOutDTO } from '@modules/project/dtos/project.out.dto';
import { Supplier } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';

export class SupplierOutDTO extends EntityOutDTO implements Supplier {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  cif: string;

  @Expose()
  rc: string;

  @Expose()
  bankName: string;

  @Expose()
  bankIban: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  products: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => ProjectOutDTO)
  projects: ProjectOutDTO[];

  @Expose()
  @IsInt()
  contractId: number;

  @Expose()
  @Type(() => ContractOutDTO)
  contract: ContractOutDTO;
}
