import { TemplateDelegate, compile } from 'handlebars';
import { ITemplateService } from '../../contracts';

/**
 * Service responsible for compiling Handlebars templates.
 */
export class TemplateService implements ITemplateService {
  private readonly template: TemplateDelegate;

  /**
   * Creates an instance of the template service.
   * @param templateString - The raw Handlebars template as a string.
   */
  constructor(templateString: string) {
    this.template = compile(templateString);
  }

  /**
   * Compiles the template with the provided data.
   * @param data - An object containing the values to inject into the template.
   * @returns The resulting HTML string.
   */
  compile(data: Record<string, any>): string {
    return this.template(data);
  }
}
