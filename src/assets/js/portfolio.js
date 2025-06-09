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

// Call the fetch function (you can expand this to fetch multiple stocks)
fetchStockData();

document.addEventListener('DOMContentLoaded', () => {
    // Dummy stock data
    const dummyStocks = [
        {
            symbol: 'AAPL',
            shares: 15,
            avgPrice: 145.00,
            currentPrice: 150.25,
            profitLoss: (150.25 - 145.00) * 15
        },
        {
            symbol: 'GOOGL',
            shares: 10,
            avgPrice: 2800.00,
            currentPrice: 2900.00,
            profitLoss: (2900.00 - 2800.00) * 10
        },
        {
            symbol: 'AMZN',
            shares: 8,
            avgPrice: 3200.00,
            currentPrice: 3150.00,
            profitLoss: (3150.00 - 3200.00) * 8
        },
        {
            symbol: 'MSFT',
            shares: 20,
            avgPrice: 300.00,
            currentPrice: 310.00,
            profitLoss: (310.00 - 300.00) * 20
        }
    ];

    // Function to update the portfolio summary
    function updatePortfolioSummary(totalValue) {
        const summaryContainer = document.getElementById('portfolio-summary-text');
        summaryContainer.innerHTML = `<p>Total Portfolio Value: $${totalValue.toFixed(2)}</p>`;
    }

    // Function to update the holdings table
    function updateHoldingsTable(stocks) {
        const tableBody = document.getElementById('holdings-table');
        tableBody.innerHTML = ''; // Clear existing rows

        stocks.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock.symbol}</td>
                <td>${stock.shares}</td>
                <td>$${stock.avgPrice.toFixed(2)}</td>
                <td>$${stock.currentPrice.toFixed(2)}</td>
                <td class="${stock.profitLoss >= 0 ? 'price-up' : 'price-down'}">
                    $${stock.profitLoss.toFixed(2)}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to display stock details under the chart
    function displayStockDetails(stocks) {
        const stockDetailsContainer = document.getElementById('stock-details-container');
        stockDetailsContainer.innerHTML = ''; // Clear existing content

        stocks.forEach(stock => {
            const stockElement = document.createElement('div');
            stockElement.className = 'stock-item';
            stockElement.innerHTML = `
                <h3>${stock.symbol}</h3>
                <p>Shares: ${stock.shares}</p>
                <p>Avg Price: $${stock.avgPrice.toFixed(2)}</p>
                <p>Current Price: $${stock.currentPrice.toFixed(2)}</p>
                <p class="${stock.profitLoss >= 0 ? 'price-up' : 'price-down'}">
                    Profit/Loss: $${stock.profitLoss.toFixed(2)}
                </p>
            `;
            stockDetailsContainer.appendChild(stockElement);
        });
    }

    // Function to create a line graph
    function createLineGraph(labels, data) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // Stock symbols
                datasets: [{
                    label: 'Stock Price Trends ($)',
                    data: data, // Current prices
                    fill: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
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
                        text: 'Stock Price Trends (Line Graph)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Main function to load and display portfolio data
    function loadPortfolioData() {
        // Calculate total portfolio value
        const totalValue = dummyStocks.reduce((sum, stock) => sum + stock.currentPrice * stock.shares, 0);

        // Update the portfolio summary, holdings table, and graphs
        updatePortfolioSummary(totalValue);
        updateHoldingsTable(dummyStocks);

        const labels = dummyStocks.map(stock => stock.symbol);
        const prices = dummyStocks.map(stock => stock.currentPrice);

        // Create the line graph
        createLineGraph(labels, prices);

        // Display stock details under the chart
        displayStockDetails(dummyStocks);
    }

    // Load portfolio data on page load
    loadPortfolioData();
});