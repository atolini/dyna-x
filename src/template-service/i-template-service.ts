/**
 * Interface that defines the contract for template services.
 */
export interface ITemplateService {
    /**
     * Compiles the template with the provided data.
     * @param data - An object containing the values to inject into the template.
     * @returns The generated HTML string.
     */
    compile(data: Record<string, any>): string;
}