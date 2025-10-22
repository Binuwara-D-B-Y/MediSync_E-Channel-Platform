// Validation test cases for ClientBookingModal form validation

export class ValidationTests {
  constructor() {
    this.testResults = [];
  }

  // Test helper to validate name (updated to match frontend)
  validateName(name) {
    if (!name || !name.trim()) {
      return 'Full name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Name should contain only letters and spaces';
    }
    return null;
  }

  // Test helper to validate NIC (updated to match frontend)
  validateNIC(nic) {
    if (!nic || !nic.trim()) {
      return 'NIC is required';
    } else if (!/^\d{12}$/.test(nic.trim())) {
      return 'NIC should be exactly 12 digits';
    }
    return null;
  }

  // Test helper to validate email (updated to match frontend)
  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      return 'Email is required';
    } else if (!emailPattern.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  // Test helper to validate contact (updated to match frontend)
  validateContact(contact) {
    if (!contact || !contact.trim()) {
      return 'Contact number is required';
    } else if (!/^\d+$/.test(contact.trim())) {
      return 'Contact number should contain only numbers';
    }
    return null;
  }

  // Payment form validation helpers
  validateAccountName(accName) {
    if (!accName || !accName.trim()) {
      return 'Account name is required';
    } else if (accName.trim().length < 2) {
      return 'Account name must be at least 2 characters';
    }
    return null;
  }

  validateAccountNumber(accNo) {
    if (!accNo || !accNo.trim()) {
      return 'Account number is required';
    } else if (!/^[0-9]+$/.test(accNo.trim())) {
      return 'Account number must be digits only';
    } else if (accNo.trim().length < 6 || accNo.trim().length > 24) {
      return 'Account number must be 6-24 digits';
    }
    return null;
  }

  validateBankName(bankName) {
    if (!bankName || !bankName.trim()) {
      return 'Bank name is required';
    } else if (bankName.trim().length < 2) {
      return 'Bank name must be at least 2 characters';
    }
    return null;
  }

  validateBankBranch(bankBranch) {
    if (!bankBranch || !bankBranch.trim()) {
      return 'Bank branch is required';
    }
    return null;
  }

  validatePIN(pin) {
    if (!pin || !pin.trim()) {
      return 'PIN is required';
    } else if (!/^[0-9]{4}$/.test(pin.trim())) {
      return 'PIN must be exactly 4 digits';
    }
    return null;
  }

  // Name validation tests
  testNameValidation() {
    const testCases = [
      { input: '', expected: 'Full name is required', description: 'Empty name' },
      { input: '   ', expected: 'Full name is required', description: 'Whitespace only name' },
      { input: 'John Doe', expected: null, description: 'Valid name with space' },
      { input: 'John', expected: null, description: 'Valid single name' },
      { input: 'John123', expected: 'Name should contain only letters and spaces', description: 'Name with numbers' },
      { input: 'John@Doe', expected: 'Name should contain only letters and spaces', description: 'Name with special characters' },
      { input: 'John  Doe', expected: null, description: 'Name with multiple spaces' },
      { input: 'Mary Jane Smith', expected: null, description: 'Valid full name with multiple words' }
    ];

    testCases.forEach(testCase => {
      const result = this.validateName(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `Name Validation - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });
  }

  // NIC validation tests
  testNICValidation() {
    const testCases = [
      { input: '', expected: 'NIC is required', description: 'Empty NIC' },
      { input: '   ', expected: 'NIC is required', description: 'Whitespace only NIC' },
      { input: '123456789012', expected: null, description: 'Valid 12-digit NIC' },
      { input: '12345678901', expected: 'NIC should be exactly 12 digits', description: '11-digit NIC' },
      { input: '1234567890123', expected: 'NIC should be exactly 12 digits', description: '13-digit NIC' },
      { input: '12345678901a', expected: 'NIC should be exactly 12 digits', description: 'NIC with letters' },
      { input: '123456789-12', expected: 'NIC should be exactly 12 digits', description: 'NIC with special characters' },
      { input: '000000000000', expected: null, description: 'Valid NIC with all zeros' }
    ];

    testCases.forEach(testCase => {
      const result = this.validateNIC(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `NIC Validation - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });
  }

  // Email validation tests
  testEmailValidation() {
    const testCases = [
      { input: '', expected: 'Email is required', description: 'Empty email' },
      { input: '   ', expected: 'Email is required', description: 'Whitespace only email' },
      { input: 'test@example.com', expected: null, description: 'Valid email' },
      { input: 'user.name@domain.co.uk', expected: null, description: 'Valid email with subdomain' },
      { input: 'invalid-email', expected: 'Please enter a valid email address', description: 'Email without @' },
      { input: 'test@', expected: 'Please enter a valid email address', description: 'Email without domain' },
      { input: '@example.com', expected: 'Please enter a valid email address', description: 'Email without username' },
      { input: 'test@example', expected: 'Please enter a valid email address', description: 'Email without TLD' },
      { input: 'test.example.com', expected: 'Please enter a valid email address', description: 'Email with dot instead of @' },
      { input: 'test@example.', expected: 'Please enter a valid email address', description: 'Email with incomplete TLD' }
    ];

    testCases.forEach(testCase => {
      const result = this.validateEmail(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `Email Validation - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });
  }

  // Contact validation tests
  testContactValidation() {
    const testCases = [
      { input: '', expected: 'Contact number is required', description: 'Empty contact' },
      { input: '   ', expected: 'Contact number is required', description: 'Whitespace only contact' },
      { input: '1234567890', expected: null, description: 'Valid contact number' },
      { input: '0771234567', expected: null, description: 'Valid Sri Lankan mobile number' },
      { input: '123abc456', expected: 'Contact number should contain only numbers', description: 'Contact with letters' },
      { input: '123-456-789', expected: 'Contact number should contain only numbers', description: 'Contact with hyphens' },
      { input: '+94771234567', expected: 'Contact number should contain only numbers', description: 'Contact with plus sign' },
      { input: '(077) 123 4567', expected: 'Contact number should contain only numbers', description: 'Contact with brackets and spaces' },
      { input: '0', expected: null, description: 'Single digit contact' },
      { input: '12345678901234567890', expected: null, description: 'Very long contact number' }
    ];

    testCases.forEach(testCase => {
      const result = this.validateContact(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `Contact Validation - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });
  }

  // Payment form validation tests
  testPaymentValidation() {
    // Account name tests
    const accountNameTests = [
      { input: '', expected: 'Account name is required', description: 'Empty account name' },
      { input: '   ', expected: 'Account name is required', description: 'Whitespace only account name' },
      { input: 'A', expected: 'Account name must be at least 2 characters', description: 'Single character account name' },
      { input: 'John Doe', expected: null, description: 'Valid account name' }
    ];

    accountNameTests.forEach(testCase => {
      const result = this.validateAccountName(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `Account Name - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });

    // Account number tests
    const accountNumberTests = [
      { input: '', expected: 'Account number is required', description: 'Empty account number' },
      { input: '   ', expected: 'Account number is required', description: 'Whitespace only account number' },
      { input: '12345', expected: 'Account number must be 6-24 digits', description: 'Too short account number' },
      { input: '1234567890123456789012345', expected: 'Account number must be 6-24 digits', description: 'Too long account number' },
      { input: '123abc456', expected: 'Account number must be digits only', description: 'Account number with letters' },
      { input: '1234567890', expected: null, description: 'Valid account number' }
    ];

    accountNumberTests.forEach(testCase => {
      const result = this.validateAccountNumber(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `Account Number - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });

    // PIN tests
    const pinTests = [
      { input: '', expected: 'PIN is required', description: 'Empty PIN' },
      { input: '   ', expected: 'PIN is required', description: 'Whitespace only PIN' },
      { input: '123', expected: 'PIN must be exactly 4 digits', description: '3-digit PIN' },
      { input: '12345', expected: 'PIN must be exactly 4 digits', description: '5-digit PIN' },
      { input: '12ab', expected: 'PIN must be exactly 4 digits', description: 'PIN with letters' },
      { input: '1234', expected: null, description: 'Valid 4-digit PIN' }
    ];

    pinTests.forEach(testCase => {
      const result = this.validatePIN(testCase.input);
      const passed = result === testCase.expected;
      this.testResults.push({
        test: `PIN - ${testCase.description}`,
        input: testCase.input,
        expected: testCase.expected,
        actual: result,
        passed
      });
    });
  }

  // Run all validation tests
  runAllTests() {
    console.log('🧪 Starting Validation Tests...\n');
    
    this.testResults = [];
    
    this.testNameValidation();
    this.testNICValidation();
    this.testEmailValidation();
    this.testContactValidation();
    this.testPaymentValidation();
    
    return this.testResults;
  }

  // Generate test report
  generateReport() {
    const results = this.runAllTests();
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log('📊 VALIDATION TEST REPORT');
    console.log('========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);
    
    // Show failed tests
    if (failedTests > 0) {
      console.log('❌ FAILED TESTS:');
      results.filter(r => !r.passed).forEach(test => {
        console.log(`- ${test.test}`);
        console.log(`  Input: "${test.input}"`);
        console.log(`  Expected: ${test.expected}`);
        console.log(`  Actual: ${test.actual}\n`);
      });
    }
    
    // Show passed tests summary
    console.log('✅ PASSED TESTS:');
    results.filter(r => r.passed).forEach(test => {
      console.log(`- ${test.test}`);
    });
    
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(1),
      results
    };
  }
}