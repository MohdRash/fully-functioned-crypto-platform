# Crypto Application

This is a full-stack cryptocurrency application that allows users to track crypto prices, manage transactions, connect wallets, and view their profiles.

## Features

- User Authentication (Register, Login, Logout)
- User Profile Management (View and Edit Profile)
- Wallet Connection and Display
- Real-time Cryptocurrency Price Tracking
- Transaction History Management
- NFT Gallery (Placeholder)
- Blockchain Data Display (Placeholder)
- Community Features (Placeholder)
- Testimonials (Placeholder)

## Technologies Used

### Frontend
- React.js
- React Router DOM
- ApexCharts (for price charts)
- Axios (for API requests)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- Axios (for external API requests, e.g., CoinGecko)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud-based)

### 1. Clone the repository
```bash
git clone <repository_url>
cd crypto
```

### 2. Backend Setup
Navigate to the root directory of the project and install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and add the following environment variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
COINGECKO_API_KEY=your_coingecko_api_key (optional, if using premium features)
```

Start the backend server:
```bash
npm run server
```

### 3. Frontend Setup
Navigate to the `client` directory:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or similar).

## Usage

- **Register/Login**: Create an account or log in to access authenticated features.
- **Profile**: View and update your user profile, including wallet balances.
- **Prices**: See real-time cryptocurrency prices.
- **Transactions**: Track your transaction history.

## Screenshots

Include screenshots of key application pages here. For example:

### Dashboard
![Dashboard Page](https://github.com/user-attachments/assets/b05c094b-aa3c-4280-ba60-b9ebfc2e1290)


*(Note: Replace `client/src/assets/*.png` with actual paths to your screenshots. You may need to create an `assets` folder in the client directory and place your images there.)*

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
