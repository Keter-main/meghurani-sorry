# ShareBill - Expense Splitting App

ShareBill is a Flutter-based application designed to help friends and groups split bills and track shared expenses easily. It features a complete authentication system, group management, expense tracking with various split options, and settlement recording.

---

## 📖 Table of Contents
1.  [🚀 Features](#features)
2.  [💻 Technologies Used](#technologies-used)
3.  [🏗️ Architecture](#architecture)
4.  [📂 Project Structure](#project-structure-expanded)
5.  [🔄 Data Flow & State Management](#data-flow--state-management)
6.  [🖱️ User Interaction Map](#detailed-user-interaction-map)
7.  [🛠 Dependencies](#dependencies)
8.  [🏁 Getting Started](#getting-started)

---

## 📱 Features

### 1. Authentication
*   **Sign Up**: Create an account with name, email, password, and optional profile picture.
*   **Sign In**: Login with email and password.
*   **Forgot Password**: Request a password reset link via email.
*   **Profile Management**: View and update user profile details.

### 2. Dashboard
*   **Overview**: View "Total You Owe" and "Total You Are Owed".
*   **Activity Feed**: See recent activities (added expenses, settlements, group changes).
*   **Carousel**: Promotional or informational banners.

### 3. Group Management
*   **Create Group**: Create new groups with a name, type (Trip, Home, Couple, etc.), and image.
*   **Add Members**: Add members by User ID or Email.
*   **Group Details**: View total group expenses, individual balances, and member list.

### 4. Expense Tracking
*   **Add Expense**: Record expenses with description, amount, payer, and category.
*   **Split Options**: Support for different split types (currently 'equal', extensible to others).
*   **Categories**: Categorize expenses (Food, Travel, Entertainment, etc.).

### 5. Settlements
*   **Settle Up**: Record payments between users to clear debts.
*   **Payment Methods**: Track how the payment was made (Cash, UPI, etc.).

---

## 🏗 Project Architecture

The project follows a **MVC (Model-View-Controller)** architecture:

*   **`lib/Controller/`**: Handles business logic and API communication.
*   **`lib/Model/`**: Defines data structures and JSON serialization.
*   **`lib/View/`**: Contains the UI screens.
*   **`lib/Widgets/`**: Reusable UI components.

---

## 🔌 API Documentation

The app communicates with a backend API hosted at:
`https://sharebillback.mystartupwave.com/api/v1`

### Authentication (`AuthController`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register new user | `name`, `email`, `password`, `phone` (opt), `profile_image` (multipart) |
| **POST** | `/auth/login/json` | Login user | `email`, `password` |
| **POST** | `/auth/forgot-password` | Request password reset | `email` |
| **POST** | `/auth/reset-password` | Reset password | `token`, `new_password` |
| **GET** | `/auth/me` | Get current user profile | - |
| **PUT** | `/auth/me` | Update profile | `name`, `phone`, `currency` |

### Groups (`DatabaseController`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/groups` | List user's groups | - |
| **POST** | `/groups` | Create new group | `name`, `type`, `image` |
| **GET** | `/groups/:id` | Get group details | - |
| **POST** | `/groups/:id/members` | Add member by ID | `user_id`, `role` |
| **POST** | `/groups/:id/members/email` | Add member by Email | `email`, `role` |
| **GET** | `/groups/:id/balances` | Get group balances | - |

### Expenses (`DatabaseController`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/expenses` | List expenses | Query: `group_id`, `category`, `page`, `page_size` |
| **POST** | `/expenses` | Create expense | `group_id`, `amount`, `description`, `payer_id`, `splits` |

### Settlements (`DatabaseController`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/settlements` | Create settlement | `group_id`, `to_user`, `amount`, `payment_method` |

### Dashboard & Users (`DatabaseController`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/dashboard` | Get dashboard stats | - |
| **GET** | `/dashboard/activity` | Get activity feed | Query: `limit`, `offset` |
| **GET** | `/users/search` | Search users | Query: `q` (name/email) |
| **GET** | `/carousel` | Get banner images | Query: `active_only` |

---

## 📦 Data Models

### `User`
Stores user profile information (`id`, `name`, `email`, `profileImage`).

### `Group`
Represents a group of users sharing expenses (`id`, `name`, `type`, `memberCount`).

### `Expense`
Details of a transaction (`id`, `amount`, `paidBy`, `splits`).

### `Settlement`
Records a payment between two users (`fromUser`, `toUser`, `amount`).

### `Dashboard`
Summary object containing `BalanceSummary` (total owed/owing) and `recentExpensesCount`.

---

## � Data Flow & State Management

This application works by passing data in a cycle: **View -> Controller -> API -> Controller -> View**.

### 1. The Cycle (Example: Loading the Home Screen)

1.  **View Triggers Action**:
    *   File: `lib/View/home_screen.dart`
    *   When the screen opens, `void initState()` calls `_loadDashboardData()`.
    *   This function calls `DatabaseController.getDashboard()`.

2.  **Controller Requests Data**:
    *   File: `lib/Controller/database_controller.dart`
    *   The `getDashboard` method adds the Authentication Token (Bearer Token) to the header.
    *   It sends a `GET` request to `https://.../api/v1/dashboard`.

3.  **API Responds**:
    *   The backend replies with a JSON object containing balances, recent activity, etc.
    *   Example: `{"success": true, "data": { "balance": { ... } } }`.

4.  **Controller Processes Response**:
    *   The controller decodes the JSON and checks if `success` is true.
    *   It returns the raw `Map<String, dynamic>` data back to the View.

5.  **Data Modeling**:
    *   File: `lib/Model/models.dart`
    *   Back in `home_screen.dart`, the raw Map is converted into a Dart Object using `Dashboard.fromJson(data)`.
    *   This ensures we have type safety (e.g., `balance.netBalance` is definitely a double).

6.  **State Update**:
    *   The View calls `setState(() { ... })`.
    *   This tells Flutter to rebuild the UI with the new data.
    *   The `_buildOverallBalanceCard()` widget now shows the actual balance instead of a loading spinner.

---

### 📂 Key Interactions

#### **Authentication Flow**
*   **User enters email/password** in `LoginScreen`.
*   **Calls** `AuthController.signIn()`.
*   **Response** contains a "Token".
*   **Saved** to device storage using `SharedPreferences`.
*   **Used** in *every* subsequent API call by `DatabaseController._authHeaders()`.

#### **Expenses Flow**
*   **User taps "Add Expense"** in `GroupDetailScreen`.
*   **Opens** `AddExpenseSheet` widget.
*   **User submits form**: Calls `DatabaseController.createExpense()`.
*   **On Success**: The sheet closes and calls `onSuccess` callback.
*   **Refresh**: `GroupDetailScreen` re-runs `_loadGroupData()` to fetch the updated list including the new expense.

---

### 5. Application Navigation Flow

*   **Initialization**: `main.dart` initializes the app and applies `AppTheme`.
*   **Splash Screen**: Shows an animation for 3 seconds, then navigates to `LoginScreen`.
*   **Auth Flow**:
    *   `LoginScreen` -> Success -> `HomeScreen`.
    *   `SignUpScreen` -> Success -> Back to `LoginScreen`.
*   **Main Navigation (`HomeScreen`)**:
    *   Uses a `BottomNavigationBar` to switch between:
        1.  **Dashboard**: Overview and recent activity.
        2.  **Groups**: Lists all groups and friends.
        3.  **Profile**: User details, debug info, and logout.

---

### 📂 Project Structure (Expanded)

*   `lib/`
    *   `Controller/`: Business logic & API.
        *   `database_controller.dart`: **Main** controller for data.
        *   `auth_controller.dart`: Authentication logic.
        *   *(Note: `backend_controller.dart` is deprecated/unused)*.
    *   `Model/`: Data blueprints (e.g., `User`, `Group`, `Expense`).
    *   `View/`: Screens (e.g., `HomeScreen`, `LoginScreen`).
    *   `Widgets/`: Reusable UI components & Bottom Sheets.
        *   `add_expense_sheet.dart`: Modal for creating expenses.
        *   `create_group_sheet.dart`: Modal for new groups.
        *   `drawer.dart`: Side menu (currently unused in Home).
    *   `Core/`:
        *   `app_theme.dart`: Centralized colors, fonts, and theme data.

---

## 🖱️ Detailed User Interaction Map

Here is exactly what happens when you click every major button in the app:

### 1. Authentication

| **Screen** | **Button** | **Action** | **Controller Function** | **API Called** |
| :--- | :--- | :--- | :--- | :--- |
| `SignUpScreen` | **Create Account** | Validates form & sends data | `AuthController.signUp()` | `POST /auth/register` |
| `LoginScreen` | **Sign In** | Authenticates user | `AuthController.signIn()` | `POST /auth/login/json` |
| `LoginScreen` | **Forgot Password** | Sends reset email | `AuthController.forgotPassword()` | `POST /auth/forgot-password` |
| `ProfileScreen` | **Logout** | Clears token & creates | `AuthController.logout()` | - |

### 2. Groups

| **Screen/Widget** | **Button** | **Action** | **Controller Function** | **API Called** |
| :--- | :--- | :--- | :--- | :--- |
| `GroupsScreen` | **Create New Group** | Opens create sheet | - | - |
| `CreateGroupSheet` | **Create** | Creates new group | `DatabaseController.createGroup()` | `POST /groups` |
| | | *Auto-adds members* | `DatabaseController.addMember()` (Loop) | `POST /groups/:id/members` |
| `GroupDetailScreen`| **Add Member** | Opens search sheet | - | - |
| `AddMemberSheet` | **Add (+)** | Adds selected user | `DatabaseController.addMember()` | `POST /groups/:id/members` |
| `AddMemberSheet` | **Search Bar** | Types > 3 chars | `DatabaseController.searchUsers()` | `GET /users/search` |

### 3. Expenses & Settlements

| **Screen/Widget** | **Button** | **Action** | **Controller Function** | **API Called** |
| :--- | :--- | :--- | :--- | :--- |
| `AddExpenseSheet` | **Save Expense** | Splits & saves bill | `DatabaseController.createExpense()` | `POST /expenses` |
| `AddExpenseSheet` | **Group Dropdown** | Selects group | `DatabaseController.getGroup()` | `GET /groups/:id` |
| `SettleUpSheet` | **Record Payment** | Records payment | `DatabaseController.createSettlement()` | `POST /settlements` |

---

### 4. Role of Model Classes (`lib/Model/`)

You might wonder: *"Why not just use the raw data from the API directly?"*

The **Model classes** act as a **translator** and **safety guard**.

1.  **Translation (JSON to Dart)**:
    *   **Backend sends**: `{"created_at": "2023-10-27T10:00:00Z"}` (String)
    *   **Model converts**: `DateTime.parse(json['created_at'])` (DateTime Object)
    *   Now the View can easily say `.day` or `.hour` without parsing strings every time.

2.  **Safety**:
    *   If you misspell a field in the View (e.g., `data['amoung']` instead of `data['amount']`), the app crashes at runtime.
    *   With a Model, you type `expense.` and the code editor suggests `amount`. If you make a typo, the app **won't even compile**, saving you from bugs.

**Example Flow**:
```dart
// 1. Raw JSON from API (Unsafe, just a Map)
Map<String, dynamic> json = {
  "id": "123",
  "amount": 500.50,
  "desc": "Dinner" //Backend uses 'desc', but we want 'description'
};

// 2. Model "Factory" (The Translator)
Expense expense = Expense.fromJson(json);

// 3. View (Safe to use)
print(expense.amount); // 500.50 (Double)
print(expense.description); // "Dinner" (Correctly mapped)
```

---

## 🛠 Dependencies

*   **http**: For making API requests.
*   **shared_preferences**: For storing the authentication token locally.
*   **json_annotation**: For JSON serialization (implied usage).
