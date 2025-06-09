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

// Ensure Chart.js is included in your project via a CDN or npm
// Example: Add this to your HTML <head> if not already included
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Select the trading chart container
const tradingChartContainer = document.querySelector('.trading-chart');

// Create a canvas element for the chart
const canvas = document.createElement('canvas');
canvas.id = 'tradingChart';
tradingChartContainer.appendChild(canvas);

// Sample data for the graph (to be replaced with API data later)
const stockLabels = ['AAPL', 'GOOGL', 'AMZN', 'MSFT']; // Stock symbols
const stockPrices = [150.25, 2950.00, 3150.00, 310.00]; // Current prices

// Initialize the Chart.js graph
const ctx = document.getElementById('tradingChart').getContext('2d');
const tradingChart = new Chart(ctx, {
    type: 'bar', // You can change this to 'line', 'pie', etc.
    data: {
        labels: stockLabels,
        datasets: [{
            label: 'Stock Prices ($)',
            data: stockPrices,
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Portfolio Stock Prices'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Placeholder for fetching data from Alpha Vantage API
async function fetchStockData() {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const symbol = 'AAPL'; // Example stock symbol
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // Inspect the data structure
        // Process and update the chart with new data here
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

// Call the fetch function (you can expand this to fetch multiple stocks)
fetchStockData();