export class UpdateBuilder {
    updateExpressions = [];
    expressionAttributeNames = {};
    expressionAttributeValues = {};
    index = 0;
    set(field, value) {
        return this.addUpdateExpression("SET", field, value);
    }
    remove(field) {
        this.updateExpressions.push(`REMOVE #attr${this.index}`);
        this.expressionAttributeNames[`#attr${this.index}`] = field;
        this.index++;
        return this;
    }
    add(field, value) {
        return this.addUpdateExpression("ADD", field, value);
    }
    build() {
        return {
            UpdateExpression: this.updateExpressions.join(" "),
            ExpressionAttributeNames: this.expressionAttributeNames,
            ExpressionAttributeValues: this.expressionAttributeValues,
        };
    }
    addUpdateExpression(type, field, value) {
        const fieldPlaceholder = `#attr${this.index}`;
        const valuePlaceholder = `:val${this.index}`;
        this.updateExpressions.push(`${type} ${fieldPlaceholder} = ${valuePlaceholder}`);
        this.expressionAttributeNames[fieldPlaceholder] = field;
        this.expressionAttributeValues[valuePlaceholder] = this.formatValue(value);
        this.index++;
        return this;
    }
    formatValue(value) {
        if (typeof value === "string")
            return { S: value };
        if (typeof value === "number")
            return { N: value.toString() };
        if (typeof value === "boolean")
            return { BOOL: value };
        throw new Error(`Unsupported value type: ${typeof value}`);
    }
}
