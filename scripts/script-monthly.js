/**
 * Monthly Investment Calculator
 * This script calculates the future value of monthly investments
 * NOTE: Interest rate is annual but converted to monthly for calculations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('monthlyForm');

    // Add submit event listener
    form.addEventListener('submit', calculateMonthlyFV);
});

/**
 * Main calculation function for monthly investments
 * Handles form submission and calculates future value
 * @param {Event} e - Form submit event
 */
function calculateMonthlyFV(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get input values from form
    const annualRate = parseFloat(document.getElementById('rate').value) / 100; // Convert % to decimal
    const monthlyRate = annualRate / 12; // Convert annual rate to monthly rate
    const nper = parseInt(document.getElementById('nper').value); // Already in months
    const pmt = parseFloat(document.getElementById('pmt').value);
    const pv = parseFloat(document.getElementById('pv').value);
    const type = parseInt(document.getElementById('type').value);

    try {
        // IMPORTANT: Convert positive values to negative for FV function
        // In financial formulas, money you pay out is negative
        const pmtNegative = -Math.abs(pmt);  // Regular monthly payment (negative = outflow)
        const pvNegative = -Math.abs(pv);    // Initial amount (negative = outflow)

        // Call FV function from formulajs library with MONTHLY rate
        // FV(rate, nper, pmt, pv, type)
        // Returns the future value of an investment
        const futureValue = formulajs.FV(monthlyRate, nper, pmtNegative, pvNegative, type);

        // Format result in ILS (Israeli Shekel)
        const formatted = new Intl.NumberFormat('en-IL', {
            style: 'currency',
            currency: 'ILS'
        }).format(futureValue);

        // Calculate additional information
        const totalInvested = Math.abs(pv) + Math.abs(pmt) * nper;
        const profit = futureValue - totalInvested;
        const profitPercent = (profit / totalInvested * 100).toFixed(2);

        // Calculate years and months for display
        const years = Math.floor(nper / 12);
        const months = nper % 12;
        const periodText = years > 0
            ? `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` and ${months} month${months > 1 ? 's' : ''}` : ''}`
            : `${months} month${months > 1 ? 's' : ''}`;

        // Display results
        displayMonthlyResults(formatted, periodText, totalInvested, profit, profitPercent, nper);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message);
    }
}

/**
 * Display calculation results in the result section
 * @param {string} formatted - Formatted future value
 * @param {string} periodText - Human-readable period description
 * @param {number} totalInvested - Total amount invested
 * @param {number} profit - Total profit
 * @param {string} profitPercent - Profit percentage
 * @param {number} months - Total number of months
 */
function displayMonthlyResults(formatted, periodText, totalInvested, profit, profitPercent, months) {
    // Update result value
    document.getElementById('resultValue').textContent = formatted;

    // Update result details with breakdown
    document.getElementById('resultDetails').innerHTML = `
        <strong>Future value of your investment after ${periodText} (${months} months)</strong><br><br>
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
