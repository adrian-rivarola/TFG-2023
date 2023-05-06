MyApp
├── modules
│   ├── accounts
│   │   ├── components
│   │   │   ├── UserProfile.js
│   │   │   └── LoginInput.js
│   │   ├── screens
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   └── Deactivate.js
│   │   ├── utils
│   │   │   └── formatAccountName.js
│   │   └── App.js
│   ├── growth
│   │   ├── components
│   │   ├── screens
│   │   ├── utils
│   │   └── App.js
│   ├── privacy
│   │   ├── components
│   │   ├── screens
│   │   ├── utils
│   │   └── App.js
│   └── shared
│       ├── components
│       │   ├── Avatar.js
│       │   ├── Button.js
│       │   └── List.js
│       └── utils
│           └── format.js
└── App.js

/components
  - DateTimePicker
  - ConfirmationModal
  - SnackbarMessage
  - Text, Inputs?

/data
  /entities
    - Category
    - Transactions
    - Budget
  - data-source
  - index

/features
  /Category
    /screens
      - CategoryList
      - CategoryForm
      - CategoryDetails?

  /Transaction
    /screens
      - TransactionList
      - TransactionForm
      - TransactionDetails

  /Budget
    /screens
      - BudgetList
      - BudgetForm
      - BudgetDetails

/hooks
  - useCachedResources

/navigation
  - BottomTabNavigator
  - LinkingConfiguration
  - index

/services
  - budgetService
  - categoryService
  - transactionService
  - reportService

/stores
  - AppStore (selectedCategories, activeScreen?, userConfig? [theme, privacy options])
  - ModalStore (toast, confirmation modal)