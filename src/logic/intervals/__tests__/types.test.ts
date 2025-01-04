import { isInterval } from "../types";

describe("isInterval", () => {
  it("should return true for valid Interval objects", async () => {
    const validInterval = { start: 1, end: 5 };
    expect(isInterval(validInterval)).toBe(true);
  });

  it("should return false for objects with non-number properties", async () => {
    const invalidInterval = { start: "a", end: 5 };
    expect(isInterval(invalidInterval)).toBe(false);
  });

  it("should return false when start is greater than end", async () => {
    const invalidInterval = { start: 10, end: 5 };
    expect(isInterval(invalidInterval)).toBe(false);
  });

  it("should return false for null or non-object values", async () => {
    expect(isInterval(null)).toBe(false);
    expect(isInterval(123)).toBe(false);
  });
});
