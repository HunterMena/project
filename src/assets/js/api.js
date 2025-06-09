async function fetchStockData() {
    const symbol = document.getElementById("stock-symbol").value.trim();
    if (!symbol) {
        document.getElementById("json-data").innerHTML = "Please enter a stock symbol.";
        return;
    }

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=2a8fbbbc35a749d9930a3c43ff553bc0`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Check if the response contains valid data
        if (data.values && data.values.length > 0) {
            const latestEntry = data.values[0]; // Get the most recent entry
            document.getElementById("json-data").innerHTML = `
                <p>Current Open price for ${symbol}:</p>
                <p>Datetime: ${latestEntry.datetime}, Open: ${latestEntry.open}</p>
            `;
        } else {
            document.getElementById("json-data").innerHTML = `No data found for symbol: ${symbol}`;
        }
    } catch (error) {
        document.getElementById("json-data").innerHTML = `An error occurred: ${error.message}`;
    }
}