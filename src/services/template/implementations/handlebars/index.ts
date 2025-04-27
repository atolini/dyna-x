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
   * If data is not provided, it will return the template without any values injected.
   * @example
   * const templateService = new TemplateService('<h1>{{title}}</h1>');
   * const result = templateService.compile({ title: 'Hello, World!' });
   * console.log(result); // Outputs: <h1>Hello, World!</h1>
   * @example
   * const templateService = new TemplateService('<h1>{{title}}</h1>');
   * const result = templateService.compile();
   * console.log(result); // Outputs: <h1></h1>
   * @param data - An object containing the values to inject into the template.
   * @returns The resulting HTML string.
   */
  compile(data: Record<string, any>): string {
    return this.template(data);
  }
}
