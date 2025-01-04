"use server";

import { Interval, isInterval } from "./types";

/**
 * Merges overlapping intervals.
 * @param intervals - An array of Interval objects to merge.
 * @returns An array of merged Interval objects.
 */
export const mergeOverlappingIntervals = async (
  intervals: Interval[]
): Promise<Interval[]> => {
  if (!intervals || intervals.length === 0) {
    return [];
  }

  // slice() is used to create a shallow copy of the array
  const sorted = intervals.slice().sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];

  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const interval = sorted[i];

    if (interval.start <= current.end) {
      current.end = Math.max(current.end, interval.end);
    } else {
      merged.push(current);
      current = { ...interval };
    }
  }

  merged.push(current);

  return merged;
};

/**
 * Computes merged intervals by including and excluding specific ranges.
 * @param includes - An array of Interval objects to include.
 * @param excludes - An array of Interval objects to exclude.
 * @returns A promise that resolves to an array of merged Interval objects.
 */
export const computeMergedIntervals = async (
  includes: Interval[],
  excludes: Interval[]
): Promise<Interval[]> => {
  if (Array.isArray(includes) === false || Array.isArray(excludes) === false) {
    throw new Error("Includes and Excludes must be an array.");
  }

  if (
    includes.some((i) => !isInterval(i)) ||
    excludes.some((i) => !isInterval(i))
  ) {
    throw new Error(
      "Includes and Excludes must be an array of Interval objects."
    );
  }

  if (includes.length === 0) return [];

  const mergedIncludes = await mergeOverlappingIntervals(includes);
  const mergedExcludes = await mergeOverlappingIntervals(excludes);

  // If no excludes, return merged includes
  if (mergedExcludes.length === 0) {
    return mergedIncludes;
  }

  const finalMerged: Interval[] = [];

  // Iterate over each merged include interval
  for (const inc of mergedIncludes) {
    let tempStart = inc.start;

    // Iterate over each merged exclude interval
    for (const exc of mergedExcludes) {
      // No overlap
      if (exc.end < tempStart || exc.start > inc.end) {
        continue;
      }

      // Overlapping part
      if (exc.start <= tempStart && exc.end >= inc.end) {
        // Exclude completely covers the include interval
        tempStart = inc.end + 1;
        break;
      }

      if (exc.start <= tempStart && exc.end < inc.end) {
        // Exclude overlaps the start of the include interval
        tempStart = exc.end + 1;
      } else if (exc.start > tempStart && exc.end < inc.end) {
        // Exclude is in the middle of the include interval
        finalMerged.push({ start: tempStart, end: exc.start - 1 });
        tempStart = exc.end + 1;
      } else if (exc.start > tempStart && exc.end >= inc.end) {
        // Exclude overlaps the end of the include interval
        finalMerged.push({ start: tempStart, end: exc.start - 1 });
        tempStart = inc.end + 1;
      }
    }

    if (tempStart <= inc.end) {
      finalMerged.push({ start: tempStart, end: inc.end });
    }
  }

  console.log("Final Merged Intervals:", finalMerged);
  return finalMerged;
};
