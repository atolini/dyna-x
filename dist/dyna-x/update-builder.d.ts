export declare class UpdateBuilder {
    private updateExpressions;
    private expressionAttributeNames;
    private expressionAttributeValues;
    private index;
    set(field: string, value: any): UpdateBuilder;
    remove(field: string): UpdateBuilder;
    add(field: string, value: number): UpdateBuilder;
    build(): {
        UpdateExpression: string;
        ExpressionAttributeNames: Record<string, string>;
        ExpressionAttributeValues: Record<string, any>;
    };
    private addUpdateExpression;
    private formatValue;
}
//# sourceMappingURL=update-builder.d.ts.map