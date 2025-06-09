// portfolio.js

// Function to display the user's current portfolio
function displayPortfolio(portfolio) {
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolioContainer.innerHTML = '';

    portfolio.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.className = 'stock-item';
        stockElement.innerHTML = `
            <h3>${stock.name} (${stock.symbol})</h3>
            <p>Quantity: ${stock.quantity}</p>
            <p>Current Value: $${(stock.currentPrice * stock.quantity).toFixed(2)}</p>
        `;
        portfolioContainer.appendChild(stockElement);
    });
}

// Function to calculate the total value of the portfolio
function calculateTotalValue(portfolio) {
    return portfolio.reduce((total, stock) => total + (stock.currentPrice * stock.quantity), 0).toFixed(2);
}

// Example usage
const userPortfolio = [
    { name: 'Apple Inc.', symbol: 'AAPL', quantity: 10, currentPrice: 150 },
    { name: 'Tesla Inc.', symbol: 'TSLA', quantity: 5, currentPrice: 700 },
];

// Display the portfolio
displayPortfolio(userPortfolio);
console.log(`Total Portfolio Value: $${calculateTotalValue(userPortfolio)}`);