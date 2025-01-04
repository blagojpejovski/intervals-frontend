export type Interval = {
  start: number;
  end: number;
};

/**
 * Checks if a value is a number and not NaN.
 * @param value - The value to check.
 * @returns True if the value is a valid number, false otherwise.
 */
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !isNaN(value);

/**
 * Determines if an object is a valid Interval.
 * @param obj - The object to check.
 * @returns True if the object is a valid Interval, false otherwise.
 */
export const isInterval = (obj: unknown): obj is Interval => {
  if (typeof obj !== "object" || obj === null) return false;
  const { start, end } = obj as Interval;
  return isNumber(start) && isNumber(end) && start <= end;
};
