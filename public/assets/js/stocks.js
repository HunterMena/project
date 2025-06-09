import { auth, db, COLLECTIONS } from './firebase-config.js';
import { 
    doc, 
    updateDoc, 
    getDoc, 
    setDoc, 
    collection,
    addDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// API Key for Financial Modeling Prep
const API_KEY = '2a8fbbbc35a749d9930a3c43ff553bc0';

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to search for a stock
async function searchStock(query) {
    if (!query) return;
    
    const stocksContainer = document.querySelector('.stock-card');
    stocksContainer.innerHTML = '<p>Searching...</p>';
    
    const url = `https://api.twelvedata.com/stocks?symbol=${query}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
            if (data.data.length === 0) {
                stocksContainer.innerHTML = '<p>No stocks found. Try another search.</p>';
                return;
            }
            // Only display unique stocks based on symbol
            const uniqueStocks = Array.from(new Set(data.data.map(s => s.symbol)))
                .map(symbol => data.data.find(s => s.symbol === symbol));
            displayStocks(uniqueStocks);
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        stocksContainer.innerHTML = `<p class="error">Error loading stocks. Please try again in a moment.</p>`;
    }
}

// Function to fetch stock price
async function fetchStockPrice(symbol) {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.values && data.values.length > 0) {
            const latestEntry = data.values[0];
            return {
                price: parseFloat(latestEntry.open),
                change: parseFloat(latestEntry.open) - parseFloat(data.values[1]?.open || latestEntry.open)
            };
        }
        throw new Error('No price data available');
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        return { price: 0, change: 0 };
    }
}

// Function to log transaction
async function logTransaction(type, symbol, shares, price, totalCost) {
    const transaction = {
        type,
        symbol,
        shares,
        price,
        totalCost,
        date: new Date()
    };
    
    try {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        const userData = userSnap.data();
        
        const transactions = userData.transactions || [];
        transactions.push(transaction);
        
        await updateDoc(userDoc, {
            transactions
        });
    } catch (error) {
        console.error('Error logging transaction:', error);
    }
}

// Function to buy stock
async function buyStock(stock, price) {
    try {
        if (!auth.currentUser) {
            alert('Please login to buy stocks');
            window.location.href = '../login.html';
            return;
        }

        const shares = parseInt(prompt(`How many shares of ${stock.symbol} would you like to buy at $${price}?`));
        
        if (isNaN(shares) || shares <= 0) {
            alert('Please enter a valid number of shares.');
            return;
        }

        const totalCost = shares * price;
        const userId = auth.currentUser.uid;
        
        // Reference to user document
        const userDocRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            throw new Error('User profile not found');
        }

        const userData = userDoc.data();
        
        if (!userData.balance || userData.balance < totalCost) {
            alert('Insufficient funds!');
            return;
        }

        // Create transaction document
        const transactionData = {
            userId: userId,
            type: 'buy',
            symbol: stock.symbol,
            shares: shares,
            price: price,
            totalCost: totalCost,
            timestamp: serverTimestamp()
        };

        // Add to transactions collection
        const transactionRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), transactionData);

        // Update or create portfolio entry
        const portfolioRef = doc(db, COLLECTIONS.PORTFOLIOS, userId);
        const portfolioDoc = await getDoc(portfolioRef);
        
        let portfolio = portfolioDoc.exists() ? portfolioDoc.data().holdings : [];
        const existingPosition = portfolio.find(p => p.symbol === stock.symbol);

        if (existingPosition) {
            // Update existing position
            existingPosition.shares += shares;
            existingPosition.totalCost += totalCost;
            existingPosition.averagePrice = existingPosition.totalCost / existingPosition.shares;
        } else {
            // Add new position
            portfolio.push({
                symbol: stock.symbol,
                shares: shares,
                totalCost: totalCost,
                averagePrice: price,
                lastUpdated: serverTimestamp()
            });
        }

        // Update all documents in a batch
        const batch = writeBatch(db);
        
        // Update user balance
        batch.update(userDocRef, {
            balance: userData.balance - totalCost,
            lastUpdated: serverTimestamp()
        });

        // Update portfolio
        batch.set(portfolioRef, {
            userId: userId,
            holdings: portfolio,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        // Commit the batch
        await batch.commit();

        alert(`Successfully purchased ${shares} shares of ${stock.symbol}`);
        window.location.href = 'portfolio.html';
    } catch (error) {
        console.error('Error buying stock:', error);
        alert(`Failed to complete purchase: ${error.message}`);
    }
}

// Function to display stocks in the UI
function displayStocks(stocks) {
    const stocksContainer = document.querySelector('.stock-card');
    if (!stocksContainer) return;
    
    stocksContainer.innerHTML = '';
    const displayedSymbols = new Set();

    stocks.forEach(async (stock) => {
        if (!stock?.symbol || displayedSymbols.has(stock.symbol)) return;
        displayedSymbols.add(stock.symbol);
        
        try {
            const priceData = await fetchStockPrice(stock.symbol);
            const stockElement = document.createElement('div');
            stockElement.className = 'stock-info';
            stockElement.innerHTML = `
                <h3>${stock.symbol}</h3>
                <div class="stock-price ${priceData.change > 0 ? 'price-up' : 'price-down'}">
                    $${(priceData.price || 0).toFixed(2)}
                </div>
                <p>${stock.name || stock.instrument_name || 'Unknown'}</p>
                <button class="trade-button buy" data-symbol="${stock.symbol}" data-price="${priceData.price}">Buy</button>
            `;
            stocksContainer.appendChild(stockElement);

            // Add click handler for buy button
            const buyButton = stockElement.querySelector('.buy');
            buyButton.addEventListener('click', () => buyStock(stock, priceData.price));
        } catch (error) {
            console.error(`Error displaying stock ${stock.symbol}:`, error);
        }
    });
}

// Add debounced search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#stockSearch');
    if (searchInput) {
        const debouncedSearch = debounce((value) => {
            if (value.length > 0) {
                searchStock(value);
            }
        }, 1000);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
});