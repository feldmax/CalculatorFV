/**
 * Annual Rate Calculator
 * This script calculates the annual interest rate from monthly investments
 * NOTE: Monthly rate is calculated and then converted to annual rate
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form element
    const form = document.getElementById('annualRateForm');

    // Add submit event listener
    form.addEventListener('submit', calculateAnnualRate);
});

/**
 * Main calculation function for annual rate from monthly investments
 * Handles form submission and calculates annual interest rate
 * @param {Event} e - Form submit event
 */
function calculateAnnualRate(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get input values from form
    const nper = parseInt(document.getElementById('nper').value); // Number of months
    const pmt = parseFloat(document.getElementById('pmt').value);
    const pv = parseFloat(document.getElementById('pv').value);
    const fv = parseFloat(document.getElementById('fv').value);
    const type = parseInt(document.getElementById('type').value);

    try {
        // IMPORTANT: Convert positive values to negative for RATE function
        // In financial formulas, money you pay out is negative
        const pmtNegative = -Math.abs(pmt);  // Regular monthly payment (negative = outflow)
        const pvNegative = -Math.abs(pv);    // Initial amount (negative = outflow)

        // Call RATE function from formulajs library
        // RATE(nper, pmt, pv, fv, type, guess)
        // Returns the interest rate per period (monthly in this case)
        const monthlyRate = formulajs.RATE(nper, pmtNegative, pvNegative, fv, type, 0.01);

        // Convert monthly rate to annual rate
        // Annual rate = monthly rate * 12
        const annualRate = monthlyRate * 12 * 100; // Convert to percentage

        // Format result as percentage
        const formatted = annualRate.toFixed(2) + '%';

        // Calculate additional information
        const totalInvested = Math.abs(pv) + Math.abs(pmt) * nper;
        const profit = fv - totalInvested;
        const profitPercent = (profit / totalInvested * 100).toFixed(2);

        // Calculate years and months for display
        const years = Math.floor(nper / 12);
        const months = nper % 12;
        const periodText = years > 0
            ? `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` and ${months} month${months > 1 ? 's' : ''}` : ''}`
            : `${months} month${months > 1 ? 's' : ''}`;

        // Display results
        displayAnnualRateResults(formatted, periodText, nper, totalInvested, fv, profit, profitPercent);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message + '\n\nPlease check your inputs. The final amount might be unrealistic for the given parameters.');
    }
}

/**
 * Display calculation results in the result section
 * @param {string} formatted - Formatted annual interest rate
 * @param {string} periodText - Human-readable period description
 * @param {number} nper - Number of months
 * @param {number} totalInvested - Total amount invested
 * @param {number} fv - Future value achieved
 * @param {number} profit - Total profit
 * @param {string} profitPercent - Profit percentage
 */
function displayAnnualRateResults(formatted, periodText, nper, totalInvested, fv, profit, profitPercent) {
    // Update result value
    document.getElementById('resultValue').textContent = formatted;

    // Update result details with breakdown
    document.getElementById('resultDetails').innerHTML = `
        <strong>Annual interest rate earned over ${periodText} (${nper} months)</strong><br><br>
        Total Invested: ${formatCurrency(totalInvested)}<br>
        Final Amount: ${formatCurrency(fv)}<br>
        Profit Earned: ${formatCurrency(profit)}<br>
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
