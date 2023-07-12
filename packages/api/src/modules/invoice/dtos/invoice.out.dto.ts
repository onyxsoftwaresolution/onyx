import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ProjectOutDTO } from '@modules/project/dtos/project.out.dto';
import { Expose, Type } from 'class-transformer';

export class InvoiceOutDTO extends EntityOutDTO {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  number: string;

  @Expose()
  issueDate: Date;

  @Expose()
  dueDate: Date;

  @Expose()
  projectId: number;

  @Expose()
  @Type(() => ProjectOutDTO)
  project: ProjectOutDTO;
}

export class InvoiceDownloadUrl extends EntityOutDTO {
  @Expose()
  invoiceNumber: string;

  @Expose()
  url: string;
}
