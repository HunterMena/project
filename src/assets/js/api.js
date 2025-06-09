async function fetchStockData() {
    const symbol = document.getElementById("stock-symbol").value.trim();
    if (!symbol) {
        document.getElementById("json-data").innerHTML = "Please enter a stock symbol.";
        return;
    }

    const url = `https://financialmodelingprep.com/stable/search-symbol?query=${symbol}&apikey=q6hgDThWmTlI5CbyyeB1Q5DLm3VNThCB`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Extract the desired part of the response
        const filteredData = data.find(item => item.symbol === symbol.toUpperCase());
        if (filteredData) {
            const displayData = {
                symbol: filteredData.symbol,
                name: filteredData.name,
                currency: filteredData.currency,
                exchangeFullName: filteredData.exchangeFullName,
                exchange: filteredData.exchange
            };
            document.getElementById("json-data").innerHTML = JSON.stringify(displayData, null, 4).replace(/\n/g, "<br>");
        } else {
            document.getElementById("json-data").innerHTML = `No data found for symbol: ${symbol}`;
        }
    } catch (error) {
        document.getElementById("json-data").innerHTML = `An error occurred: ${error.message}`;
    }
}