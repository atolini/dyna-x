export declare class ConditionBuilder {
    private expressions;
    private attributeNames;
    private attributeValues;
    private index;
    /**
     * Adiciona uma condição de igualdade
     * @param field Nome do atributo
     * @param value Valor esperado
     */
    eq(field: string, value: any): ConditionBuilder;
    /**
     * Adiciona uma condição de diferente (!=)
     */
    ne(field: string, value: any): ConditionBuilder;
    /**
     * Adiciona uma condição de maior que (>)
     */
    gt(field: string, value: any): ConditionBuilder;
    /**
     * Adiciona uma condição de menor que (<)
     */
    lt(field: string, value: any): ConditionBuilder;
    /**
     * Adiciona uma condição composta com AND
     */
    and(): ConditionBuilder;
    /**
     * Adiciona uma condição composta com OR
     */
    or(): ConditionBuilder;
    /**
     * Retorna os valores prontos para uso na query
     */
    build(): {
        ConditionExpression: string;
        ExpressionAttributeNames: Record<string, string>;
        ExpressionAttributeValues: Record<string, any>;
    };
    /**
     * Método privado para adicionar uma condição genérica
     */
    private addCondition;
    /**
     * Converte valores para o formato esperado pelo DynamoDB
     */
    private formatValue;
}
//# sourceMappingURL=condition-builder.d.ts.map