import { TemplateService } from './template-service';

describe('TemplateService', () => {
  it('should compile a valid template with given data', () => {
    const template = '<h1>{{title}}</h1><p>{{name}}</p>';
    const service = new TemplateService(template);

    const result = service.compile({ title: 'Hello', name: 'World' });

    expect(result).toBe('<h1>Hello</h1><p>World</p>');
  });

  it('should leave placeholders empty if data is missing', () => {
    const template = '<h1>{{title}}</h1><p>{{name}}</p>';
    const service = new TemplateService(template);

    const result = service.compile({ title: 'Hello' });

    expect(result).toBe('<h1>Hello</h1><p></p>');
  });

  it('should handle complex data structures (loops)', () => {
    const template = `
      <ul>
        {{#each items}}
          <li>{{this}}</li>
        {{/each}}
      </ul>
    `;
    const service = new TemplateService(template);

    const result = service.compile({ items: ['a', 'b', 'c'] }).replace(/\s+/g, '');

    expect(result).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
  });

  it('should not throw but return unexpected output when data is null', () => {
    const template = '<h1>{{title}}</h1>';
    const service = new TemplateService(template);

    const result = service.compile(null as any);

    expect(result).toBe('<h1></h1>');
  });

  it('should not throw but return empty values when data is undefined', () => {
    const template = '<h1>{{title}}</h1>';
    const service = new TemplateService(template);

    const result = service.compile(undefined as any);

    expect(result).toBe('<h1></h1>');
  });

  it('should compile with helper functions registered in Handlebars', () => {
    const template = '<h1>{{uppercase title}}</h1>';
    const Handlebars = require('handlebars');
    Handlebars.registerHelper('uppercase', (str: string) => str.toUpperCase());

    const service = new TemplateService(template);
    const result = service.compile({ title: 'hello' });

    expect(result).toBe('<h1>HELLO</h1>');
  });
});
