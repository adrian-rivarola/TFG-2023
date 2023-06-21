import dayjs from "dayjs";
import { DataSource } from "typeorm";
import { Budget, Category, CategoryType, Transaction } from "../../data";
import { initiMemoryDB } from "./dbSetup";

describe("Budget", () => {
  let dataSource: DataSource;
  let categories: Category[];

  const weekStart = dayjs().startOf("day").startOf("week");
  const weekEnd = dayjs().startOf("day").endOf("week");

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
    categories = Category.create([
      {
        name: "Category 1",
        icon: "icon",
        type: CategoryType.expense,
      },
      {
        name: "Category 2",
        icon: "icon",
        type: CategoryType.expense,
      },
    ]);
    await Category.save(categories);
  });

  beforeEach(async () => {
    await Transaction.clear();
    await Budget.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should create a budget with the correct date range", async () => {
    const weekBudget = await Budget.create({
      description: "Budget #1",
      maxAmount: 100_000,
      dateRange: "week",
      categories,
    }).save();

    expect(weekBudget).toBeInstanceOf(Budget);
    expect(weekBudget.startDate.isSame(weekStart, "day")).toBe(true);
    expect(weekBudget.endDate.isSame(weekEnd, "day")).toBe(true);

    expect(weekBudget.totalSpent).toBe(0);
  });

  it("should include existing transaction in total spent", async () => {
    await Transaction.save([
      {
        amount: 10_000,
        category: categories[0],
        date: weekStart.format("YYYY-MM-DD"),
      },
      {
        amount: 10_000,
        category: categories[0],
        date: weekEnd.format("YYYY-MM-DD"),
      },
    ]);

    const weekBudget = await Budget.create({
      description: "Budget #1",
      maxAmount: 100_000,
      dateRange: "week",
      categories,
    }).save();

    const totalSpent = await Budget.getTotalSpent(weekBudget);
    expect(totalSpent).toBe(20_000);
  });

  it("should get different periods", async () => {
    await Transaction.save([
      {
        amount: 5_000,
        category: categories[0],
        date: weekStart.add(-1, "week").format("YYYY-MM-DD"),
      },
      {
        amount: 10_000,
        category: categories[0],
        date: weekStart.format("YYYY-MM-DD"),
      },
      {
        amount: 15_000,
        category: categories[0],
        date: weekEnd.add(1, "week").format("YYYY-MM-DD"),
      },
    ]);

    const weekBudget = await Budget.create({
      description: "Budget #1",
      maxAmount: 100_000,
      dateRange: "week",
      categories,
    }).save();

    const previousWeek = await Budget.getTotalSpent(weekBudget, -1);
    expect(previousWeek).toBe(5_000);

    const currentWeek = await Budget.getTotalSpent(weekBudget, 0);
    expect(currentWeek).toBe(10_000);

    const nextWeek = await Budget.getTotalSpent(weekBudget, 1);
    expect(nextWeek).toBe(15_000);

    const futureWeek = await Budget.getTotalSpent(weekBudget, 10);
    expect(futureWeek).toBe(0);
  });
});
