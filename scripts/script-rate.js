/**
 * RATE Calculator
 * This script calculates the interest rate needed to reach an investment goal
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('rateForm');

    // Add submit event listener
    form.addEventListener('submit', calculateRate);
});

/**
 * Main calculation function
 * Handles form submission and calculates required interest rate
 * @param {Event} e - Form submit event
 */
function calculateRate(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get input values from form
    const nper = parseInt(document.getElementById('nper').value);
    const pmt = parseFloat(document.getElementById('pmt').value);
    const pv = parseFloat(document.getElementById('pv').value);
    const fv = parseFloat(document.getElementById('fv').value);
    const type = parseInt(document.getElementById('type').value);

    try {
        // IMPORTANT: Convert positive values to negative for RATE function
        // In financial formulas, money you pay out is negative
        const pmtNegative = -Math.abs(pmt);  // Regular payment (negative = outflow)
        const pvNegative = -Math.abs(pv);    // Initial amount (negative = outflow)

        // Call RATE function from formulajs library
        // RATE(nper, pmt, pv, fv, type, guess)
        // Returns the interest rate per period
        const ratePerPeriod = formulajs.RATE(nper, pmtNegative, pvNegative, fv, type, 0.1);

        // Convert to annual percentage
        const annualRate = ratePerPeriod * 100;

        // Format result as percentage
        const formatted = annualRate.toFixed(2) + '%';

        // Calculate additional information
        const totalInvested = Math.abs(pv) + Math.abs(pmt) * nper;
        const profit = fv - totalInvested;
        const profitPercent = (profit / totalInvested * 100).toFixed(2);

        // Display results
        displayResults(formatted, nper, totalInvested, fv, profit, profitPercent);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message + '\n\nPlease check your inputs. The target amount might be unrealistic for the given parameters.');
    }
}

/**
 * Display calculation results in the result section
 * @param {string} formatted - Formatted interest rate
 * @param {number} nper - Number of periods
 * @param {number} totalInvested - Total amount invested
 * @param {number} fv - Future value goal
 * @param {number} profit - Total profit
 * @param {string} profitPercent - Profit percentage
 */
function displayResults(formatted, nper, totalInvested, fv, profit, profitPercent) {
    // Update result value
    document.getElementById('resultValue').textContent = formatted;

    // Update result details with breakdown
    document.getElementById('resultDetails').innerHTML = `
        <strong>Required annual interest rate to reach your goal in ${nper} years</strong><br><br>
        Total to Invest: ${formatCurrency(totalInvested)}<br>
        Target Amount: ${formatCurrency(fv)}<br>
        Expected Profit: ${formatCurrency(profit)}<br>
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
