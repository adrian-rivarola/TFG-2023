import { DataSource, QueryFailedError } from "typeorm";
import { Budget, Category, Transaction } from "../../data";
import { initiMemoryDB } from "./dbSetup";

describe("Budget operations", () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await initiMemoryDB();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("Create", () => {
    let categories: Category[];

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

    afterAll(async () => {
      await Budget.clear();
      await Transaction.clear();
      await Category.clear();
    });

    it("should create a new budget with one category", async () => {
      const budget = Budget.create({
        description: "Budget 1",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
        maxAmount: 1000,
        categories: [categories[0]],
      });
      const savedBudget = await Budget.save(budget);

      expect(savedBudget).toBeInstanceOf(Budget);
      expect(savedBudget.id).toBeDefined();
      expect(savedBudget.categories).toHaveLength(1);
      expect(savedBudget.categories[0].id).toBe(categories[0].id);

      expect(Budget.count()).resolves.toBe(1);
    });

    it("should create a new budget with multiple categories", async () => {
      const budget = Budget.create({
        description: "Budget 1",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
        maxAmount: 1000,
        categories: categories,
      });
      const savedBudget = await Budget.save(budget);

      expect(savedBudget).toBeInstanceOf(Budget);
      expect(savedBudget.id).toBeDefined();
      expect(savedBudget.categories).toHaveLength(categories.length);
      savedBudget.categories.forEach((category, index) => {
        expect(category.id).toBe(categories[index].id);
      });

      expect(Budget.count()).resolves.toBe(2);
    });

    it("should fail if the budget has no maxAmount", async () => {
      const budget = Budget.create({
        description: "Budget 1",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
        categories: categories,
      });

      await expect(Budget.save(budget)).rejects.toThrow(QueryFailedError);
    });

    it("should fail if the budget has no start and end date", async () => {
      const budget = Budget.create({
        description: "Budget 1",
        maxAmount: 1000,
        categories: categories,
      });

      await expect(Budget.save(budget)).rejects.toThrow(QueryFailedError);
    });

    // it("should fail if the budget has no categories", async () => {
    //   const budget = Budget.create({
    //     description: "Budget 1",
    //     startDate: "2023-01-01",
    //     endDate: "2023-01-31",
    //     maxAmount: 1000,
    //   });

    //   await expect(Budget.save(budget)).rejects.toThrow(
    //     QueryFailedError
    //   );
    // });
  });

  describe("Spending", () => {
    let budget: Budget;
    let category: Category;
    const [startDate, endDate] = ["2023-01-01", "2023-01-07"];
    const defaultTransaction = {
      description: "Transaction 1",
      amount: 1_000,
      date: "2023-01-01",
    };

    beforeAll(async () => {
      category = await Category.save({
        name: "Category 1",
        icon: "icon",
        type: 0,
      });

      (defaultTransaction as any).category = category;
      budget = await Budget.save({
        description: "Budget 1",
        categories: [category],
        maxAmount: 10_000,
        startDate,
        endDate,
      });
    });

    afterAll(async () => {
      await Budget.clear();
      await Transaction.clear();
      await Category.clear();
    });

    it("should return 0 if there are no transactions", async () => {
      const totalSpent = await Budget.getTotalSpent(budget);
      expect(totalSpent).toBe(0);
    });

    it("should not include transactions outside of date range", async () => {
      await Transaction.save({
        ...defaultTransaction,
        date: "2023-06-01",
      });

      const totalSpent = await Budget.getTotalSpent(budget);
      expect(totalSpent).toBe(0);
    });

    it("should return the total spent for a budget", async () => {
      await Transaction.save({
        ...defaultTransaction,
        amount: 10_000,
      });

      const totalSpent = await Budget.getTotalSpent(budget);
      expect(totalSpent).toBe(10_000);
    });
  });

  describe("Get Transactions", () => {
    let budget: Budget;
    let category: Category;
    const [startDate, endDate] = ["2023-01-01", "2023-01-07"];

    beforeAll(async () => {
      category = await Category.save({
        name: "Category 1",
        icon: "icon",
        type: 0,
      });

      budget = await Budget.save({
        description: "Budget 1",
        categories: [category],
        maxAmount: 10_000,
        startDate,
        endDate,
      });
    });

    afterAll(async () => {
      await Budget.clear();
      await Transaction.clear();
      await Category.clear();
    });

    afterEach(async () => {
      await Transaction.clear();
    });

    it("should return an empty array if there are no transactions", async () => {
      const transactions = await Budget.findTransactions(budget);

      expect(transactions).toHaveLength(0);
    });

    it("should return an array of transactions", async () => {
      const transaction = await Transaction.save({
        description: "Transaction 1",
        amount: 1_000,
        date: "2023-01-01",
        category,
      });
      const transactions = await Budget.findTransactions(budget);

      expect(transactions).toHaveLength(1);
      expect(transactions[0].id).toBe(transaction.id);
    });

    it("should return only transactions within the date range", async () => {
      await Transaction.save([
        {
          description: "Transaction 2",
          amount: 1_000,
          date: "2023-02-01",
          category,
        },
        {
          description: "Transaction 2",
          amount: 1_000,
          date: "2022-12-31",
          category,
        },
      ]);
      const transactions = await Budget.findTransactions(budget);

      expect(transactions).toHaveLength(0);
    });

    it("should return transactions for multiple categories", async () => {
      const category2 = await Category.save({
        name: "Category 2",
        icon: "icon",
        type: 0,
      });

      budget = await Budget.save({
        ...budget,
        categories: [category, category2],
      });

      await Transaction.save([
        {
          description: "Transaction 2",
          amount: 1_000,
          date: "2023-01-01",
          category,
        },
        {
          description: "Transaction 2",
          amount: 1_000,
          date: "2023-01-01",
          category: category2,
        },
      ]);
      const transactions = await Budget.findTransactions(budget);

      expect(transactions).toHaveLength(2);
    });
  });
});
