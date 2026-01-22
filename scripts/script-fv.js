/**
 * FV Calculator - Future Value Investment Calculator
 * This script calculates the future value of an investment using the FV formula
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('fvForm');

    // Add submit event listener
    form.addEventListener('submit', calculateFV);
});

/**
 * Main calculation function
 * Handles form submission and calculates future value
 * @param {Event} e - Form submit event
 */
function calculateFV(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get input values from form
    const rate = parseFloat(document.getElementById('rate').value) / 100; // Convert % to decimal
    const nper = parseInt(document.getElementById('nper').value);
    const pmt = parseFloat(document.getElementById('pmt').value);
    const pv = parseFloat(document.getElementById('pv').value);
    const type = parseInt(document.getElementById('type').value);

    try {
        // IMPORTANT: Convert positive values to negative for FV function
        // In financial formulas, money you pay out is negative
        const pmtNegative = -Math.abs(pmt);  // Regular payment (negative = outflow)
        const pvNegative = -Math.abs(pv);    // Initial amount (negative = outflow)

        // Call FV function from formulajs library
        // FV(rate, nper, pmt, pv, type)
        // Returns the future value of an investment
        const futureValue = formulajs.FV(rate, nper, pmtNegative, pvNegative, type);

        // Format result in ILS (Israeli Shekel)
        const formatted = new Intl.NumberFormat('en-IL', {
            style: 'currency',
            currency: 'ILS'
        }).format(futureValue);

        // Calculate additional information
        const totalInvested = Math.abs(pv) + Math.abs(pmt) * nper;
        const profit = futureValue - totalInvested;
        const profitPercent = (profit / totalInvested * 100).toFixed(2);

        // Display results
        displayResults(formatted, nper, totalInvested, profit, profitPercent);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message);
    }
}

/**
 * Display calculation results in the result section
 * @param {string} formatted - Formatted future value
 * @param {number} nper - Number of periods
 * @param {number} totalInvested - Total amount invested
 * @param {number} profit - Total profit
 * @param {string} profitPercent - Profit percentage
 */
function displayResults(formatted, nper, totalInvested, profit, profitPercent) {
    // Update result value
    document.getElementById('resultValue').textContent = formatted;

    // Update result details with breakdown
    document.getElementById('resultDetails').innerHTML = `
        <strong>Future value of your investment after ${nper} years</strong><br><br>
        Total Invested: ${formatCurrency(totalInvested)}<br>
        Profit: ${formatCurrency(profit)}<br>
        Return: ${profitPercent}%
    `;

    // Show result section with animation
    document.getElementById('result').classList.add('show');
}

/**
 * Format number as ILS currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IL', {
        style: 'currency',
        currency: 'ILS'
    }).format(amount);
}
