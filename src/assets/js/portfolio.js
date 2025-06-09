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

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'q6hgDThWmTlI5CbyyeB1Q5DLm3VNThCB'; // Replace with your actual API key
    const stockSymbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT']; // Stocks to fetch
    const stockData = []; // Array to store fetched stock data

    // Function to fetch stock data from the API
    async function fetchStockData(symbol) {
        const url = `https://financialmodelingprep.com/stable/search-symbol?query=${symbol}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const price = parseFloat(data['Global Quote']['05. price']);
            return { symbol, price };
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            return { symbol, price: null }; // Return null price on error
        }
    }

    // Function to update the chart
    function updateChart(chart, labels, prices) {
        chart.data.labels = labels; // Update labels (stock symbols)
        chart.data.datasets[0].data = prices; // Update data (stock prices)
        chart.update(); // Refresh the chart
    }

    // Initialize the Chart.js graph
    const ctx = document.getElementById('testChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Placeholder for stock symbols
            datasets: [{
                label: 'Stock Prices ($)',
                data: [], // Placeholder for stock prices
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

    // Fetch data for all stocks and update the chart
    async function loadStockData() {
        const promises = stockSymbols.map(symbol => fetchStockData(symbol));
        const results = await Promise.all(promises);

        // Filter out stocks with null prices (in case of API errors)
        const validStocks = results.filter(stock => stock.price !== null);

        // Extract labels (symbols) and data (prices) for the chart
        const labels = validStocks.map(stock => stock.symbol);
        const prices = validStocks.map(stock => stock.price);

        // Update the chart with the fetched data
        updateChart(chart, labels, prices);
    }

    // Load stock data on page load
    loadStockData();

    // Select the table body containing the stock rows
    const tableBody = document.querySelector('.table tbody');

    // Use event delegation to handle clicks on "Buy More" and "Sell" buttons
    tableBody.addEventListener('click', (event) => {
        const target = event.target;

        // Check if the clicked element is a "Buy More" or "Sell" button
        if (target.classList.contains('buy') || target.classList.contains('sell')) {
            // Find the row containing the clicked button
            const row = target.closest('tr');
            const sharesCell = row.querySelector('td:nth-child(2)'); // Shares column
            let shares = parseInt(sharesCell.textContent, 10);

            // Update the shares based on the button clicked
            if (target.classList.contains('buy')) {
                shares += 1; // Increment shares
            } else if (target.classList.contains('sell')) {
                shares = Math.max(0, shares - 1); // Decrement shares, but not below 0
            }

            // Update the shares cell with the new value
            sharesCell.textContent = shares;
        }

        console.log('Button clicked:', target.classList);
    });
});