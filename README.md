# Interval Calculator

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The application allows users to input intervals to include and exclude, computes the merged intervals on the server side using server actions, and displays the results.

## Technologies Used

- [Next.js](https://nextjs.org/): A React framework for production.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): A superset of JavaScript with static typing.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- [Jest](https://jestjs.io/): A JavaScript Testing Framework with a focus on simplicity.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

## Running Tests

To run the tests, execute the following command in the project directory:

```bash
npm test
```

The included examples are part of the test suite and can be found in the `__tests__` directory.

## Algorithm Complexity

- `mergeOverlappingIntervals`: O(n \* log n) where `n` is the length of the interval array
- `computeMergedIntervals`: Merge includes: O(m \* log m) + Merge excludes: O(k \* log k) + Iterate over both: O(m \* k) => Simplified: O(m \* k)

Where `m` and `k` are the number of intervals in include and exclude respectively.

## Validation

### Frontend forms

The frontend form uses regular expressions to validate the input intervals.

### Server actions

The server actions validate the input intervals using TypeScript type guards.
