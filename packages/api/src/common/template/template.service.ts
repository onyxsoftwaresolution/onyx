import { Injectable } from "@nestjs/common";
import { TemplateProvider } from "./template.provider";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

@Injectable()
export class TemplateService {
  constructor(
    private templateProvider: TemplateProvider,
  ) { }

  async render(data: PizZip.LoadData, object: Record<string, string>) {
    const zip = new PizZip(data);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(object);

    const bufffer = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    return bufffer;
  }
}
