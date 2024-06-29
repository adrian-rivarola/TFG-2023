import { Category, CategoryType } from './entities/Category';

export function getDefaultCategories() {
  return Category.create([
    // income
    {
      name: 'Salario',
      icon: 'attach-money',
      type: CategoryType.income,
    },
    {
      name: 'Otros ingresos',
      icon: 'more-horiz',
      type: CategoryType.income,
    },
    // expense
    {
      name: 'Alimentos',
      icon: 'fastfood',
      type: CategoryType.expense,
    },
    {
      name: 'Entretenimiento',
      icon: 'movie',
      type: CategoryType.expense,
    },
    {
      name: 'Educación',
      icon: 'school',
      type: CategoryType.expense,
    },
    {
      name: 'Hogar',
      icon: 'home',
      type: CategoryType.expense,
    },
    {
      name: 'Salud',
      icon: 'medical-services',
      type: CategoryType.expense,
    },
    {
      name: 'Servicios básicos',
      icon: 'lightbulb-outline',
      type: CategoryType.expense,
    },
    {
      name: 'Shopping',
      icon: 'shopping-cart',
      type: CategoryType.expense,
    },
    {
      name: 'Transporte',
      icon: 'directions-bus',
      type: CategoryType.expense,
    },
    {
      name: 'Otros gastos',
      icon: 'more-horiz',
      type: CategoryType.expense,
    },
  ]);
}
