# README.md

# Stock Trading Application

## Overview
This project is a web-based stock trading application that allows users to trade with fake money, view stocks, and track their transactions. The application utilizes the Alpha Vantage API for stock data.

## Features
- Users can view available stocks and their prices.
- Users can trade stocks using fake money.
- Users can see a list of all their transactions.
- Users can track their portfolio and see current holdings.

## Project Structure
```
stock-trading-app
├── src
│   ├── assets
│   │   ├── css
│   │   ├── js
│   ├── pages
│   └── index.html
├── .env
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd stock-trading-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your Alpha Vantage API key:
   ```
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```
5. Open `src/index.html` in your web browser to run the application.

## Usage
- Navigate to the dashboard to see an overview of your portfolio.
- Use the stocks page to view and trade stocks.
- Check the transactions page to view your trading history.
- Access your portfolio to see current holdings and their values.

## License
This project is licensed under the MIT License.