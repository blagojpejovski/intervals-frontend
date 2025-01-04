"use client";

import { computeMergedIntervals } from "@/logic/intervals/server";
import { Interval } from "@/logic/intervals/types";
import { FormEvent, useState } from "react";
import { FaUndo } from "react-icons/fa";

const IntervalsForm = () => {
  const [includes, setIncludes] = useState<string>("");
  const [excludes, setExcludes] = useState<string>("");
  const [result, setResult] = useState<Interval[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const parseIntervals = (text: string) => {
    return text
      .split(",")
      .map((t) => t.trim().split("-"))
      .filter(([start, end]) => start && end)
      .map(([start, end]) => ({
        start: Number(start),
        end: Number(end),
      }));
    //   .filter((i) => i.start <= i.end);
  };

  const validateIntervals = (intervals: string[], type: string): string[] => {
    const errors: string[] = [];
    intervals.forEach((interval, subIdx) => {
      if (interval && !/^\d+-\d+$/.test(interval)) {
        errors.push(
          `${type} interval part ${subIdx + 1} ("${interval}") is invalid.`
        );
      }
    });
    return errors;
  };

  const resetForm = () => {
    setIncludes("");
    setExcludes("");
    setResult([]);
    setErrors([]);
    setLoading(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let newErrors: string[] = [];

    const includeIntervals = includes.split(",").map((t) => t.trim());
    newErrors = newErrors.concat(
      validateIntervals(includeIntervals, "Include")
    );

    const excludeIntervals = excludes.split(",").map((t) => t.trim());
    newErrors = newErrors.concat(
      validateIntervals(excludeIntervals, "Exclude")
    );

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const includesParsed = parseIntervals(includes);
      const excludesParsed = parseIntervals(excludes);
      const merged = await computeMergedIntervals(
        includesParsed,
        excludesParsed
      );
      setResult(merged);
      setErrors([]);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg) {
        setErrors([msg]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="m-auto p-6 w-full md:w-3/5 bg-white bg-opacity-95 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Interval Calculator</h1>
        <button
          type="button"
          onClick={resetForm}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:hover:cursor-default flex items-center"
          disabled={loading || (includes === "" && excludes === "")}
        >
          <FaUndo className="mr-2" /> Reset
        </button>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium mb-2">Include Intervals</p>
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={includes}
          onChange={(e) => setIncludes(e.target.value)}
          placeholder="e.g. 10-100, 200-300"
        />
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium mb-2">Exclude Intervals</p>
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={excludes}
          onChange={(e) => setExcludes(e.target.value)}
          placeholder="e.g. 95-205"
        />
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600 active:bg-purple-700 focus:outline-black focus:outline-2 disabled:bg-gray-400 disabled:hover:cursor-default"
        disabled={loading || (includes === "" && excludes === "")}
      >
        Calculate
      </button>

      {result && result.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-xl font-bold mb-2">Result:</p>
          <ul className="list-disc list-inside">
            {result.map((interval, idx) => (
              <li key={idx}>{`${interval.start} - ${interval.end}`}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default IntervalsForm;
