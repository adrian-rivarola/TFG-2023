import { DataSource } from "typeorm";
import { Category, CategoryType, Transaction } from "../data";
import { initiMemoryDB } from "./db/dbSetup";
import { DATE_FORMAT, DateRange } from "../utils/dateUtils";
import dayjs from "dayjs";

describe("Reports", () => {
  const monthRange: DateRange = {
    startDate: "2023-01-01",
    endDate: "2023-01-31",
  };
  let dataSource: DataSource;
  let categories: Category[];

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("Get totals by category type", () => {
    beforeAll(async () => {
      categories = await Category.save([
        {
          name: "Category 1",
          icon: "icon",
          type: 0,
        },
        {
          name: "Category 2",
          icon: "icon",
          type: 0,
        },
      ]);
    });

    afterEach(async () => {
      await Transaction.clear();
    });

    it("should return an empty array if no transaction exist", async () => {
      const totals = await Transaction.getTotalsByCategoryType(
        CategoryType.expense,
        monthRange
      );
      expect(totals).toHaveLength(0);
    });

    it("should return the totals by category type and date range", async () => {
      const [category] = categories;
      await Transaction.save([
        {
          description: "Transaction 1",
          date: "2023-01-01",
          amount: 100,
          category,
        },
      ]);
      const totals = await Transaction.getTotalsByCategoryType(
        CategoryType.expense,
        monthRange
      );
      expect(totals).toHaveLength(1);
      expect(totals[0]).toHaveProperty("categoryName", category.name);
      expect(totals[0]).toHaveProperty("total", 100);
    });

    it("should not include transactions out of the date range", async () => {
      const [category] = categories;
      await Transaction.save([
        {
          description: "Transaction 1",
          date: "2023-01-01",
          amount: 100,
          category,
        },
        {
          description: "Transaction 2",
          date: "2023-02-01",
          amount: 100_000,
          category,
        },
      ]);

      const totals = await Transaction.getTotalsByCategoryType(
        CategoryType.expense,
        monthRange
      );
      expect(totals).toHaveLength(1);
      expect(totals[0]).toHaveProperty("categoryName", category.name);
      expect(totals[0]).toHaveProperty("total", 100);
    });

    it("should return the totals in descending order", async () => {
      const [category1, category2] = categories;
      await Transaction.save([
        {
          description: "Transaction 1",
          date: "2023-01-01",
          amount: 100,
          category: category1,
        },
        {
          description: "Transaction 2",
          date: "2023-01-01",
          amount: 200,
          category: category2,
        },
      ]);

      const totals = await Transaction.getTotalsByCategoryType(
        CategoryType.expense,
        monthRange
      );
      expect(totals).toHaveLength(2);
      expect(totals[0]).toHaveProperty("categoryName", category2.name);
      expect(totals[0]).toHaveProperty("total", 200);
      expect(totals[1]).toHaveProperty("categoryName", category1.name);
      expect(totals[1]).toHaveProperty("total", 100);
    });
  });

  describe("Get daily totals", () => {
    afterEach(async () => {
      await Transaction.clear();
    });

    it("should return an empty array if no transaction exist", async () => {
      const dailyTotals = await Transaction.getDailyTotals(monthRange);
      expect(dailyTotals).toHaveLength(0);
    });

    it("should return the daily totals for the given date range", async () => {
      const dates = ["2023-01-01", "2023-01-02", "2023-01-03"];

      const transactions = dates.map((date, idx) =>
        Transaction.create({
          description: `Transaction ${idx}`,
          category: categories[0],
          amount: 100,
          date,
        })
      );
      await Transaction.save(transactions);

      const totals = await Transaction.getDailyTotals(monthRange);
      expect(totals).toHaveLength(3);
      totals.forEach((total, idx) => {
        expect(total).toHaveProperty("date", dates[idx]);
        expect(total).toHaveProperty("total", 100);
      });
    });
  });

  describe("Get weekly totals", () => {
    afterEach(async () => {
      await Transaction.clear();
    });

    it("should return an empty array if no transaction exist", async () => {
      const dailyTotals = await Transaction.getWeeklyTotals(monthRange);
      expect(dailyTotals).toHaveLength(0);
    });

    it("should return the weekly totals for the given date range", async () => {
      const dates = ["2023-01-01", "2023-01-08", "2023-01-15", "2023-01-22"];

      const transactions = dates.map((date, idx) =>
        Transaction.create({
          description: `Transaction ${idx}`,
          category: categories[0],
          amount: 100,
          date,
        })
      );
      await Transaction.save(transactions);

      const totals = await Transaction.getDailyTotals(monthRange);
      expect(totals).toHaveLength(4);
      totals.forEach((total, idx) => {
        expect(total).toHaveProperty("date", dates[idx]);
        expect(total).toHaveProperty("total", 100);
      });
    });
  });
});
