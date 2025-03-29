import { UpdateBuilder } from "./update-builder";

describe("UpdateBuilder", () => {
    let builder: UpdateBuilder;

    beforeEach(() => {
        builder = new UpdateBuilder();
    });

    describe("set", () => {
        it("should add a SET update expression", () => {
            builder.set("name", "John Doe");
            const result = builder.build();

            console.log(result);

            expect(result.UpdateExpression).toContain("SET");
            expect(result.ExpressionAttributeNames).toHaveProperty("#attr0", "name");
            expect(result.ExpressionAttributeValues).toHaveProperty(":val0", { S: "John Doe" });
        });
    });

    describe("remove", () => {
        it("should add a REMOVE update expression", () => {
            builder.remove("age");
            const result = builder.build();

            console.log(result);

            expect(result.UpdateExpression).toContain("REMOVE #attr0");
            expect(result.ExpressionAttributeNames).toHaveProperty("#attr0", "age");
        });
    });

    describe("add", () => {
        it("should add an ADD update expression", () => {
            builder.add("score", 10);
            const result = builder.build();

            console.log(result);

            expect(result.UpdateExpression).toContain("ADD #attr0 = :val0");
            expect(result.ExpressionAttributeNames).toHaveProperty("#attr0", "score");
            expect(result.ExpressionAttributeValues).toHaveProperty(":val0", { N: "10" });
        });
    });

    describe("build", () => {
        it("should return a valid update expression object", () => {
            builder.set("name", "Alice").add("points", 5).remove("status");
            const result = builder.build();

            console.log(result);

            expect(result.UpdateExpression).toContain("SET #attr0 = :val0");
            expect(result.UpdateExpression).toContain("ADD #attr1 = :val1");
            expect(result.UpdateExpression).toContain("REMOVE #attr2");
            expect(result.ExpressionAttributeNames).toEqual({
                "#attr0": "name",
                "#attr1": "points",
                "#attr2": "status",
            });
            expect(result.ExpressionAttributeValues).toEqual({
                ":val0": { S: "Alice" },
                ":val1": { N: "5" },
            });
        });
    });

    describe("formatValue", () => {
        it("should format string values correctly", () => {
            expect(builder["formatValue"]("hello")).toEqual({ S: "hello" });
        });

        it("should format number values correctly", () => {
            expect(builder["formatValue"](42)).toEqual({ N: "42" });
        });

        it("should format boolean values correctly", () => {
            expect(builder["formatValue"](true)).toEqual({ BOOL: true });
        });

        it("should throw an error for unsupported types", () => {
            expect(() => builder["formatValue"](null)).toThrow("Unsupported value type");
            expect(() => builder["formatValue"]({})).toThrow("Unsupported value type");
        });
    });
});
