import { IConditionBuilder } from "@database/condition-builder/i-condition-builder";
import { ConditionExpressionResult } from "./condition-expression-result";

export class ConditionBuilder implements IConditionBuilder<ConditionExpressionResult> {
    private expressions: string[] = [];
    private attributeNames: Record<string, string> = {};
    private attributeValues: Record<string, any> = {};
    private index = 0;

    /**
     * Adiciona uma condição de igualdade
     * @param field Nome do atributo
     * @param value Valor esperado
     */
    eq(field: string, value: any): ConditionBuilder {
        return this.addCondition(field, "=", value);
    }

    /**
     * Adiciona uma condição de diferente (!=)
     */
    ne(field: string, value: any): ConditionBuilder {
        return this.addCondition(field, "<>", value);
    }

    /**
     * Adiciona uma condição de maior que (>)
     */
    gt(field: string, value: any): ConditionBuilder {
        return this.addCondition(field, ">", value);
    }

    /**
     * Adiciona uma condição de menor que (<)
     */
    lt(field: string, value: any): ConditionBuilder {
        return this.addCondition(field, "<", value);
    }

    /**
     * Adiciona uma condição composta com AND
     */
    and(): ConditionBuilder {
        this.expressions.push("AND");
        return this;
    }

    /**
     * Adiciona uma condição composta com OR
     */
    or(): ConditionBuilder {
        this.expressions.push("OR");
        return this;
    }

    /**
     * Retorna os valores prontos para uso na query
     */
    build() {
        return {
            ConditionExpression: this.expressions.join(" "),
            ExpressionAttributeNames: this.attributeNames,
            ExpressionAttributeValues: this.attributeValues,
        };
    }

    /**
     * Método privado para adicionar uma condição genérica
     */
    private addCondition(field: string, operator: string, value: any): ConditionBuilder {
        const fieldPlaceholder = `#attr${this.index}`;
        const valuePlaceholder = `:val${this.index}`;

        this.expressions.push(`${fieldPlaceholder} ${operator} ${valuePlaceholder}`);
        this.attributeNames[fieldPlaceholder] = field;
        this.attributeValues[valuePlaceholder] = this.formatValue(value);
        this.index++;

        return this;
    }

    /**
     * Converte valores para o formato esperado pelo DynamoDB
     */
    private formatValue(value: any) {
        if (typeof value === "string") return { S: value };
        if (typeof value === "number") return { N: value.toString() };
        if (typeof value === "boolean") return { BOOL: value };
        throw new Error(`Unsupported value type: ${typeof value}`);
    }
}
