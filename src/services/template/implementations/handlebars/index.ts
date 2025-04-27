import { TemplateDelegate, compile } from 'handlebars';
import { ITemplateService } from '../../contracts';

/**
 * Service responsible for compiling templates using Handlebars as the templating engine.
 *
 * This service allows you to create a template from a string and compile it with data.
 * The template is compiled using Handlebars, a popular templating engine for JavaScript.
 *
 * @example
 * const templateService = new TemplateService('<h1>{{title}}</h1>');
 * const result = templateService.compile({ title: 'Hello, World!' });
 * console.log(result); // Outputs: <h1>Hello, World!</h1>
 *
 * @implements {ITemplateService}
 */
export class TemplateService implements ITemplateService {
  private readonly template: TemplateDelegate;

  /**
   * Creates an instance of the TemplateService.
   *
   * The constructor takes a raw Handlebars template string and compiles it into a template function.
   *
   * @param templateString - The raw Handlebars template as a string. This string can contain placeholders (e.g., {{title}}).
   */
  constructor(templateString: string) {
    this.template = compile(templateString);
  }

  /**
   * Compiles the template with the provided data.
   * If no data is provided, it will return the template with default or empty values injected.
   *
   * @example
   * const templateService = new TemplateService('<h1>{{title}}</h1>');
   * const result = templateService.compile({ title: 'Hello, World!' });
   * console.log(result); // Outputs: <h1>Hello, World!</h1>
   *
   * @example
   * const templateService = new TemplateService('<h1>{{title}}</h1>');
   * const result = templateService.compile();
   * console.log(result); // Outputs: <h1></h1>
   *
   * @param data - An object containing the values to inject into the template. This parameter is optional.
   *              If not provided, the template will be rendered with default or empty values.
   * @returns {string} The resulting HTML string after template compilation.
   */
  compile(data: Record<string, any> = {}): string {
    return this.template(data);
  }
}
