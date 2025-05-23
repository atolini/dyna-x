import { TemplateDelegate, compile } from 'handlebars';
import { ITemplateService } from '@template/contracts';
import { TemplateServiceEventLogger } from '@template/implementations/handlebars';
import { ILogger } from '@logger/contracts';

/**
 * @implements {ITemplateService}
 *
 * TemplateService provides a simple interface for compiling Handlebars templates.
 *
 * This service allows compiling a Handlebars template string with optional dynamic data.
 *
 * @example
 * const templateService = new TemplateService('<p>{{name}}</p>');
 * const result = templateService.compile({ name: 'John' });
 * console.log(result); // Outputs: <p>John</p>
 */
export class TemplateService implements ITemplateService {
  private readonly template: TemplateDelegate;
  private readonly eventsLogger: TemplateServiceEventLogger;

  /**
   * Initializes the service by compiling the provided Handlebars template string.
   *
   * @param templateString - A raw Handlebars template (e.g., "<h1>{{title}}</h1>").
   */
  constructor(templateString: string, logger: ILogger<unknown>) {
    this.eventsLogger = new TemplateServiceEventLogger(logger);
    this.template = compile(templateString);
    this.eventsLogger.templateInitialized(templateString);
  }

  /**
   * Compiles the template using the provided data object.
   *
   * @param data - Optional object with key-value pairs to replace placeholders in the template.
   * @returns The compiled string with the data injected into the template.
   *
   * @example
   * const templateService = new TemplateService('Hello, {{user}}!');
   * templateService.compile({ user: 'Alice' }); // "Hello, Alice!"
   */
  compile(data: Record<string, any> = {}): string {
    const result = this.template(data);
    this.eventsLogger.templateCompiled(data, result);
    return result;
  }
}
