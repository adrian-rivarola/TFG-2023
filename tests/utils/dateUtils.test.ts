import MockDate from "mockdate";
import { getDatesFromRange } from "../../utils/dateUtils";

describe("getDatesFromRange", () => {
  beforeAll(() => {
    MockDate.set("2023-01-04"); // Wednesday
  });

  afterAll(() => {
    MockDate.reset();
  });

  it("should return a start and an end date", () => {
    const range = getDatesFromRange("week");

    expect(range).toHaveProperty("startDate");
    expect(range).toHaveProperty("endDate");
  });

  it("should return a start and an end date", () => {
    const { startDate, endDate } = getDatesFromRange("week");

    expect(startDate).toBe("2023-01-01");
    expect(endDate).toBe("2023-01-07");
  });

  it("should accept an positive offest", () => {
    const { startDate, endDate } = getDatesFromRange("week", 1);

    expect(startDate).toBe("2023-01-08");
    expect(endDate).toBe("2023-01-14");
  });

  it("should accept an negative offest", () => {
    const { startDate, endDate } = getDatesFromRange("week", -1);

    expect(startDate).toBe("2022-12-25");
    expect(endDate).toBe("2022-12-31");
  });
});
