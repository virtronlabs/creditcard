// Function to flip the card
function flipCard() {
    document.querySelector(".card-container").classList.toggle("flipped");
}

// Function to generate the card
function generateCard() {
    const cardholderName = document.getElementById('cardholder-name').value.trim();
    if (!cardholderName) {
        alert("Please enter a cardholder name.");
        return;
    }

    // Generate the account object
    const account = generateAccountNumber('041'); // Use a default issuer for simplicity

    // Update the card details
    const cardNumberElement = document.querySelector('.card-number');
    const cardHolderElement = document.querySelector('.card-holder');
    const expirationElement = document.querySelector('.expiration');
    const cvvElement = document.querySelector('.cvv');

    cardNumberElement.textContent = account.number;
    cardHolderElement.textContent = cardholderName;
    expirationElement.innerHTML = `<div class="label">Expires</div>${account.expiration}`;
    cvvElement.textContent = account.cvc;
}

// Function to generate an account number, CVC, and expiration date
function generateAccountNumber(issuer) {
    const validIssuers = ['055', '041', '022'];

    // Check if the passed issuer is valid
    if (!validIssuers.includes(issuer)) {
        throw new Error(`Invalid issuer: ${issuer}. Valid issuers are: ${validIssuers.join(', ')}`);
    }

    const accountNumber = Math.floor(100000 + Math.random() * 900000);
    const randomDigits = Math.floor(10 + Math.random() * 90);
    const fixedDigit = '1';
    const randomThreeDigits = Math.floor(100 + Math.random() * 900);

    // Build the first 15 digits of the account number
    let first15Digits = `${issuer}${accountNumber}${randomDigits}${fixedDigit}${randomThreeDigits}`;
    
    // Correct checksum calculation
    const checksum = calculateChecksum(first15Digits);
    const fullAccountNumber = `${first15Digits}${checksum}`;

    // Format the account number with spaces every 4 digits
    const formattedAccountNumber = formatAccountNumber(fullAccountNumber);

    // Generate a 3-digit CVC
    const cvc = Math.floor(100 + Math.random() * 900).toString();

    // Generate expiration date (2 years and 1 month from now)
    const expirationDate = generateExpirationDate();

    // Create the account object
    const account = {
        number: formattedAccountNumber,
        cvc: cvc,
        expiration: expirationDate,
    };

    return account;
}

// Helper function to format the account number with spaces every 4 digits
function formatAccountNumber(accountNumber) {
    return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Function to calculate the correct Luhn checksum
function calculateChecksum(accountWithoutChecksum) {
    let sum = 0;
    let shouldDouble = true; // Start doubling from second-last digit

    for (let i = accountWithoutChecksum.length - 1; i >= 0; i--) {
        let digit = parseInt(accountWithoutChecksum[i], 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    let checksum = (10 - (sum % 10)) % 10; // Correct checksum calculation

    return checksum;
}

// Function to generate an expiration date (2 years and 1 month from now)
function generateExpirationDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 2); // Add 2 years
    today.setMonth(today.getMonth() + 1); // Add 1 month

    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
    const year = String(today.getFullYear()).slice(-2); // Last 2 digits of the year

    return `${month}/${year}`;
}
