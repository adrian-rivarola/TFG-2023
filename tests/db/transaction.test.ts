import { DataSource, QueryFailedError } from "typeorm";
import { Category, Transaction } from "../../data";
import { initiMemoryDB } from "./dbSetup";

describe("Transaction operations", () => {
  describe("Create", () => {
    let category: Category;
    let dataSource: DataSource;

    beforeAll(async () => {
      dataSource = await initiMemoryDB();

      category = await Category.save({
        name: "Category 1",
        icon: "icon",
        type: 0,
      });
    });

    afterAll(async () => {
      await dataSource.destroy();
    });

    it("should create a new transaction", async () => {
      const transaction = Transaction.create({
        description: "Transaction 1",
        date: "2023-01-01",
        amount: 42,
        category,
      });
      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.id).toBeUndefined();

      const savedTransaction = await Transaction.save(transaction);
      expect(savedTransaction).toBeInstanceOf(Transaction);
      expect(savedTransaction.id).toBeDefined();
      expect(savedTransaction.category).toBeInstanceOf(Category);
      expect(savedTransaction.category.id).toBe(category.id);

      expect(Transaction.count()).resolves.toBe(1);
    });

    it("should fail if the category does not exist", async () => {
      const transaction = Transaction.create({
        description: "Transaction 2",
        date: "2023-01-01",
        amount: 42,
        category: { id: 999 },
      });

      await expect(Transaction.save(transaction)).rejects.toThrow(
        QueryFailedError
      );
    });

    it("should fail if the category is not provided", async () => {
      const transaction = Transaction.create({
        description: "Transaction 3",
        date: "2023-01-01",
        amount: 42,
      });

      await expect(Transaction.save(transaction)).rejects.toThrow(
        QueryFailedError
      );
    });

    it("should fail if the amount is not provided", async () => {
      const transaction = Transaction.create({
        description: "Transaction 4",
        date: "2023-01-01",
        category,
      });

      await expect(Transaction.save(transaction)).rejects.toThrow(
        QueryFailedError
      );
    });
  });
});
