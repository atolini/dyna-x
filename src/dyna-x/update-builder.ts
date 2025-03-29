export class UpdateBuilder {
    private updateExpressions: string[] = [];
    private expressionAttributeNames: Record<string, string> = {};
    private expressionAttributeValues: Record<string, any> = {};
    private index = 0;

    set(field: string, value: any): UpdateBuilder {
        return this.addUpdateExpression("SET", field, value);
    }

    remove(field: string): UpdateBuilder {
        this.updateExpressions.push(`REMOVE #attr${this.index}`);
        this.expressionAttributeNames[`#attr${this.index}`] = field;
        this.index++;
        return this;
    }

    add(field: string, value: number): UpdateBuilder {
        return this.addUpdateExpression("ADD", field, value);
    }

    build() {
        return {
            UpdateExpression: this.updateExpressions.join(" "),
            ExpressionAttributeNames: this.expressionAttributeNames,
            ExpressionAttributeValues: this.expressionAttributeValues,
        };
    }

    private addUpdateExpression(type: "SET" | "ADD", field: string, value: any): UpdateBuilder {
        const fieldPlaceholder = `#attr${this.index}`;
        const valuePlaceholder = `:val${this.index}`;

        this.updateExpressions.push(`${type} ${fieldPlaceholder} = ${valuePlaceholder}`);
        this.expressionAttributeNames[fieldPlaceholder] = field;
        this.expressionAttributeValues[valuePlaceholder] = this.formatValue(value);
        this.index++;

        return this;
    }

    private formatValue(value: any) {
        if (typeof value === "string") return { S: value };
        if (typeof value === "number") return { N: value.toString() };
        if (typeof value === "boolean") return { BOOL: value };
        throw new Error(`Unsupported value type: ${typeof value}`);
    }
}
