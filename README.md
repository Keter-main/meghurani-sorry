# ShareBill - Expense Splitting App

ShareBill is a Flutter-based application designed to help friends and groups split bills and track shared expenses easily. It features a complete authentication system, group management, expense tracking with various split options, and settlement recording.

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

## 🛠 Dependencies

*   **http**: For making API requests.
*   **shared_preferences**: For storing the authentication token locally.
*   **json_annotation**: For JSON serialization (implied usage).
