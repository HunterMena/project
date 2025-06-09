const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

async function fetchStockData(symbol) {
    const response = await fetch(`${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

async function fetchPortfolioData(userId) {
    // Placeholder for fetching user portfolio data
    // This function can be implemented to fetch user-specific portfolio information
    return [];
}

export { fetchStockData, fetchPortfolioData };