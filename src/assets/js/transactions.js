// transactions.js

let transactionHistory = [];

// Function to log a new transaction
function logTransaction(type, stockSymbol, quantity, price) {
    const transaction = {
        id: transactionHistory.length + 1,
        type: type,
        stockSymbol: stockSymbol,
        quantity: quantity,
        price: price,
        date: new Date().toLocaleString()
    };
    transactionHistory.push(transaction);
    displayTransactions();
}

// Function to display transaction history
function displayTransactions() {
    const transactionsTable = document.getElementById('transactions-table');
    transactionsTable.innerHTML = '';

    transactionHistory.forEach(transaction => {
        const row = transactionsTable.insertRow();
        row.insertCell(0).innerText = transaction.id;
        row.insertCell(1).innerText = transaction.type;
        row.insertCell(2).innerText = transaction.stockSymbol;
        row.insertCell(3).innerText = transaction.quantity;
        row.insertCell(4).innerText = transaction.price;
        row.insertCell(5).innerText = transaction.date;
    });
}

// Example usage
// logTransaction('buy', 'AAPL', 10, 150);
// logTransaction('sell', 'GOOGL', 5, 2800);