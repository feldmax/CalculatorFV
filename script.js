/**
 * Financial Calculators - Combined Script
 * This script handles all calculator types:
 * - FV Calculator (annual periods)
 * - Monthly Investment Calculator
 * - RATE Calculator
 * - Annual Rate Calculator (from fund reports)
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Determine which calculator is active based on form ID
    const fvForm = document.getElementById('fvForm');
    const monthlyForm = document.getElementById('monthlyForm');
    const rateForm = document.getElementById('rateForm');
    const annualRateForm = document.getElementById('annualRateForm');

    // Add appropriate event listener based on which form exists
    if (fvForm) {
        fvForm.addEventListener('submit', calculateFV);
    }

    if (monthlyForm) {
        monthlyForm.addEventListener('submit', calculateMonthlyFV);
    }

    if (rateForm) {
        rateForm.addEventListener('submit', calculateRate);
    }

    if (annualRateForm) {
        annualRateForm.addEventListener('submit', calculateAnnualRate);
    }
});

// ========================================================================
// FV CALCULATOR (Annual Periods)
// ========================================================================

/**
 * Calculate FV for annual periods
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
        const formatted = formatCurrency(futureValue);

        // Calculate additional information
        const totalInvested = Math.abs(pv) + Math.abs(pmt) * nper;
        const profit = futureValue - totalInvested;
        const profitPercent = (profit / totalInvested * 100).toFixed(2);

        // Display results
        displayFVResults(formatted, nper, totalInvested, profit, profitPercent);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message);
    }
}

/**
 * Display FV calculation results
 */
function displayFVResults(formatted, nper, totalInvested, profit, profitPercent) {
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

// ========================================================================
// MONTHLY INVESTMENT CALCULATOR
// ========================================================================

/**
 * Calculate FV for monthly investments
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
        const formatted = formatCurrency(futureValue);

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
 * Display monthly investment calculation results
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

// ========================================================================
// RATE CALCULATOR
// ========================================================================

/**
 * Calculate required interest rate
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
        displayRateResults(formatted, nper, totalInvested, fv, profit, profitPercent);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message + '\n\nPlease check your inputs. The target amount might be unrealistic for the given parameters.');
    }
}

/**
 * Display RATE calculation results
 */
function displayRateResults(formatted, nper, totalInvested, fv, profit, profitPercent) {
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

// ========================================================================
// ANNUAL RATE CALCULATOR (from Fund Reports)
// ========================================================================

/**
 * Calculate annual rate from fund reports
 * @param {Event} e - Form submit event
 */
function calculateAnnualRate(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get input values from form
    const nper = parseInt(document.getElementById('nper').value); // Number of months
    const totalInvestment = parseFloat(document.getElementById('totalInvestment').value);
    const pv = parseFloat(document.getElementById('pv').value);
    const fv = parseFloat(document.getElementById('fv').value);
    const type = parseInt(document.getElementById('type').value);

    // Calculate monthly payment from total investment sum
    // pmt = total investment / number of periods
    const pmt = totalInvestment / nper;

    try {
        // IMPORTANT: Convert positive values to negative for RATE function
        // In financial formulas, money you pay out is negative
        const pmtNegative = -Math.abs(pmt);  // Monthly payment (negative = outflow)
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
        const totalInvestedAmount = Math.abs(pv) + totalInvestment;
        const profit = fv - totalInvestedAmount;
        const profitPercent = (profit / totalInvestedAmount * 100).toFixed(2);

        // Calculate years and months for display
        const years = Math.floor(nper / 12);
        const months = nper % 12;
        const periodText = years > 0
            ? `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` and ${months} month${months > 1 ? 's' : ''}` : ''}`
            : `${months} month${months > 1 ? 's' : ''}`;

        // Display results
        displayAnnualRateResults(formatted, periodText, nper, totalInvestedAmount, fv, profit, profitPercent, pmt);

    } catch (error) {
        // Handle calculation errors
        alert('Calculation error: ' + error.message + '\n\nPlease check your inputs. The final amount might be unrealistic for the given parameters.');
    }
}

/**
 * Display annual rate calculation results
 */
function displayAnnualRateResults(formatted, periodText, nper, totalInvested, fv, profit, profitPercent, pmt) {
    // Update result value
    document.getElementById('resultValue').textContent = formatted;

    // Update result details with breakdown
    document.getElementById('resultDetails').innerHTML = `
        <strong>Annual interest rate earned over ${periodText} (${nper} months)</strong><br><br>
        Monthly Payment: ${formatCurrency(pmt)}<br>
        Total Invested: ${formatCurrency(totalInvested)}<br>
        Final Amount: ${formatCurrency(fv)}<br>
        Profit Earned: ${formatCurrency(profit)}<br>
        Return: ${profitPercent}%
    `;

    // Show result section with animation
    document.getElementById('result').classList.add('show');
}

// ========================================================================
// UTILITY FUNCTIONS
// ========================================================================

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
