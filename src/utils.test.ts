import { milestonePower } from "./utils";

describe('returns milestone', () => {
  it.each([
    {
      prevGlobalBauCount: 3_999_999,
      globalBauCount: 4_000_000,
      expected: 6,
    },
    {
      prevGlobalBauCount: 3_999_999,
      globalBauCount: 4_000_001,
      expected: 6,
    },
    {
      prevGlobalBauCount: 3_000_000,
      globalBauCount: 4_000_000,
      expected: 6,
    },
    {
      prevGlobalBauCount: 3_000_000,
      globalBauCount: 4_000_001,
      expected: 6,
    },
    {
      prevGlobalBauCount: 3_000_000,
      globalBauCount: 3_999_999,
      expected: 5,
    },
    {
      prevGlobalBauCount: 3_000_000,
      globalBauCount: 3_100_000,
      expected: 5,
    },
    {
      prevGlobalBauCount: 3_000_000,
      globalBauCount: 3_010_000,
      expected: 4,
    },
    {
      prevGlobalBauCount: 3_005_000,
      globalBauCount: 3_006_000,
      expected: 3,
    },
    {
      prevGlobalBauCount: 3_000_700,
      globalBauCount: 3_000_800,
      expected: 0,
    },
    {
      prevGlobalBauCount: 3_999_998,
      globalBauCount: 3_999_999,
      expected: 0,
    },
  ])("Should return $expected with prev count: $prevGlobalBauCount and current: $globalBauCount", ({prevGlobalBauCount, globalBauCount, expected}) => {
    expect(milestonePower(prevGlobalBauCount, globalBauCount)).toEqual(expected);
  });
});