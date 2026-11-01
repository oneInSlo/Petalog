import { describe, expect, it } from "vitest";
import { allergySchema } from "./allergies.schemas.js";

describe("allergySchema", () => {
  it.each([{}, { allergen: "   " }])("requires an allergen in %j", (input) => {
    const result = allergySchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Alergen je obvezen");
  });

  it.each([undefined, "", "   "])("stores the optional description %j as null", (description) => {
    expect(allergySchema.parse({ allergen: "Penicilin", description }).description).toBeNull();
  });
});
