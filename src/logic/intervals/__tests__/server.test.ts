import { mergeOverlappingIntervals, computeMergedIntervals } from "../server";
import { Interval } from "../types";

describe("mergeOverlappingIntervals", () => {
  it("should merge overlapping intervals", async () => {
    const intervals: Interval[] = [
      { start: 1, end: 3 },
      { start: 2, end: 6 },
      { start: 8, end: 10 },
      { start: 15, end: 18 },
    ];
    const merged = await mergeOverlappingIntervals(intervals);
    expect(merged).toEqual([
      { start: 1, end: 6 },
      { start: 8, end: 10 },
      { start: 15, end: 18 },
    ]);
  });

  it("should return empty array when input is empty", async () => {
    const merged = await mergeOverlappingIntervals([]);
    expect(merged).toEqual([]);
  });
});

describe("computeMergedIntervals", () => {
  it("should include and exclude intervals correctly", async () => {
    const includes: Interval[] = [
      { start: 1, end: 10 },
      { start: 20, end: 30 },
    ];
    const excludes: Interval[] = [
      { start: 5, end: 15 },
      { start: 25, end: 35 },
    ];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 1, end: 4 },
      { start: 20, end: 24 },
    ]);
  });

  it("should return merged includes when excludes are empty", async () => {
    const includes: Interval[] = [
      { start: 1, end: 5 },
      { start: 6, end: 10 },
    ];
    const excludes: Interval[] = [];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 1, end: 5 },
      { start: 6, end: 10 },
    ]);
  });

  it("should handle overlapping excludes", async () => {
    const includes: Interval[] = [{ start: 1, end: 10 }];
    const excludes: Interval[] = [{ start: 3, end: 7 }];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 1, end: 2 },
      { start: 8, end: 10 },
    ]);
  });

  it("should correctly merge includes 10-100 with excludes 20-30", async () => {
    const includes: Interval[] = [{ start: 10, end: 100 }];
    const excludes: Interval[] = [{ start: 20, end: 30 }];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 10, end: 19 },
      { start: 31, end: 100 },
    ]);
  });

  it("should merge multiple includes without excludes", async () => {
    const includes: Interval[] = [
      { start: 50, end: 5000 },
      { start: 10, end: 100 },
    ];
    const excludes: Interval[] = [];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([{ start: 10, end: 5000 }]);
  });

  it("should handle overlapping excludes with multiple includes", async () => {
    const includes: Interval[] = [
      { start: 200, end: 300 },
      { start: 50, end: 150 },
    ];
    const excludes: Interval[] = [{ start: 95, end: 205 }];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 50, end: 94 },
      { start: 206, end: 300 },
    ]);
  });

  it("should handle multiple includes and excludes with complex overlaps", async () => {
    const includes: Interval[] = [
      { start: 200, end: 300 },
      { start: 10, end: 100 },
      { start: 400, end: 500 },
    ];
    const excludes: Interval[] = [
      { start: 410, end: 420 },
      { start: 95, end: 205 },
      { start: 100, end: 150 },
    ];
    const result = await computeMergedIntervals(includes, excludes);
    expect(result).toEqual([
      { start: 10, end: 94 },
      { start: 206, end: 300 },
      { start: 400, end: 409 },
      { start: 421, end: 500 },
    ]);
  });
});
