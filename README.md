# Financial Calculators

A collection of web-based financial calculators for investment planning and analysis.

## 🔗 Live Demo

**[Launch Calculators](https://feldmax.github.io/CalculatorFV/index.html)**

## 📊 Available Calculators

### 1. FV Calculator
Calculate the future value of your investment with annual periods. Helps you understand how your money will grow over time with regular annual contributions.

### 2. Monthly Investment Calculator
Calculate future value with monthly contributions and compounding. Perfect for planning regular monthly savings with compound interest.

### 3. RATE Calculator
Calculate the interest rate needed to reach your investment goal. Determine what return rate you need to achieve your financial targets.

### 4. Annual Rate Calculator
Analyze annual interest rates from investment fund reports. Designed for evaluating quarterly and annual fund performance based on reported investment data.

## 🛠️ Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling and animations
- **JavaScript (ES6)** - Logic and calculations
- **[Formula.js](https://formulajs.info/)** - Financial formula library (FV, RATE functions)

## 📁 Project Structure

```
CalculatorFV/
│
├── index.html                          # Main landing page with calculator links
├── Calculator-FV.html                  # FV Calculator (annual periods)
├── Calculator-Monthly-Investment.html  # Monthly investment calculator
├── Calculator-RATE.html                # Interest rate calculator
├── Calculator-Annual-Rate.html         # Annual rate from fund reports
│
├── styles.css                          # Shared styles for all calculators
├── script.js                           # Combined JavaScript for all calculators
│
└── README.md                           # This file
```

## 📖 File Descriptions

### HTML Files

- **index.html** - Landing page with navigation cards to all calculators
- **Calculator-FV.html** - Future Value calculator for annual investments
- **Calculator-Monthly-Investment.html** - FV calculator optimized for monthly contributions
- **Calculator-RATE.html** - Calculates required interest rate to reach investment goals
- **Calculator-Annual-Rate.html** - Analyzes annual rates from fund investment reports

### CSS File

- **styles.css** - Contains all styling including:
    - Responsive layout design
    - Gradient backgrounds
    - Form styling
    - Result animations
    - Navigation buttons
    - Calculator cards

### JavaScript File

- **script.js** - Unified script containing:
    - `calculateFV()` - FV calculation for annual periods
    - `calculateMonthlyFV()` - FV calculation for monthly investments
    - `calculateRate()` - Interest rate calculation
    - `calculateAnnualRate()` - Annual rate from fund reports
    - `formatCurrency()` - ILS (₪) currency formatting utility

## 💡 Features

- ✅ Clean, modern user interface
- ✅ Responsive design (works on mobile and desktop)
- ✅ Real-time calculations
- ✅ Detailed breakdown of results
- ✅ Israeli Shekel (₪) currency formatting
- ✅ Input validation and error handling
- ✅ Smooth animations
- ✅ Easy navigation between calculators

## 🧮 Financial Formulas Used

### FV (Future Value)
```
FV = PV × (1 + rate)^nper + PMT × [((1 + rate)^nper - 1) / rate]
```

### RATE (Interest Rate)
```
Iterative calculation to solve for rate given PV, FV, PMT, and nper
```

## 🚀 Usage

1. Navigate to the [main page](https://feldmax.github.io/CalculatorFV/index.html)
2. Choose the calculator that fits your needs
3. Enter your investment parameters
4. Click "Calculate" to see results
5. Use the back button (←) to return to the main page

## 📝 Notes

- All calculators use positive input values for user convenience
- The system automatically converts values to the correct sign for financial formulas
- Annual rates are automatically converted to monthly rates where applicable
- Currency formatting uses Israeli Shekel (₪) by default


---

**Created for personal finance planning and investment analysis**