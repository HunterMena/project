// stocks.js

// Function to fetch available stocks from the API
async function fetchAvailableStocks() {
    const response = await fetch('https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=YOUR_API_KEY');
    const data = await response.json();
    return data;
}

// Function to display stocks in the UI
function displayStocks(stocks) {
    const stocksContainer = document.getElementById('stocks-container');
    stocksContainer.innerHTML = '';

    stocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.className = 'stock-item';
        stockElement.innerHTML = `
            <h3>${stock.symbol}</h3>
            <p>${stock.name}</p>
            <button onclick="tradeStock('${stock.symbol}')">Trade</button>
        `;
        stocksContainer.appendChild(stockElement);
    });
}

// Function to initiate a trade for a selected stock
function tradeStock(symbol) {
    // Logic for trading the stock
    console.log(`Trading stock: ${symbol}`);
}

// Example usage
fetchAvailableStocks().then(stocks => {
    displayStocks(stocks);
});