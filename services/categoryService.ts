import { Category, dataSource } from "../data";

const categoryRepository = dataSource.getRepository(Category);

export const getCategories = async () => {
  return categoryRepository.find();
};

export const getCategoryById = async (categoryId: number) => {
  return categoryRepository.findOne({
    where: { id: categoryId },
  });
};

export const createCategory = async (category: Category) => {
  return categoryRepository.save(category);
};

export const updateCategory = async (
  categoryId: number,
  payload: Partial<Category>
) => {
  const result = await categoryRepository.update({ id: categoryId }, payload);
  return !!result.affected;
};

export const deleteCategory = async (categoryId: number) => {
  const result = await categoryRepository.delete({ id: categoryId });
  return !!result.affected;
};

export const deleteAllCategories = async () => {
  await categoryRepository.clear();
};
