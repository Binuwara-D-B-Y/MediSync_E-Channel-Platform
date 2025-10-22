# MediSync Test Suite

This directory contains comprehensive test cases for the MediSync frontend application.

## Structure

```
tests/
├── validation/
│   └── ValidationTests.js     # Form validation test cases
├── runTests.mjs              # Node.js test execution script
└── README.md                 # This file
```

## Test Suites

### 1. Validation Tests (`validation/ValidationTests.js`)
Tests for form validation logic in ClientBookingModal component:

- **Name Validation**: Letters and spaces only, required field
- **NIC Validation**: Exactly 12 digits, numbers only
- **Email Validation**: Standard email pattern, required field  
- **Contact Validation**: Numbers only, required field

**Test Cases Covered:**
- ✅ Valid inputs
- ❌ Empty/whitespace inputs
- ❌ Invalid formats
- ❌ Boundary conditions
- ❌ Edge cases with special characters

## Running Tests

### Method 1: Browser Console
1. Open your React app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Use the global `MediSyncTests` object:

```javascript
// Run all tests
MediSyncTests.runAll()

// Run only validation tests
MediSyncTests.runValidation()

// List available test suites
MediSyncTests.listSuites()
```

### Method 2: Node.js
```bash
# Navigate to tests directory
cd src/tests

# Run all tests
node runTests.mjs
```

### Method 3: Import in React Component
```javascript
import { testRunner } from './tests/TestRunner.js';

// In your component or useEffect
const runTests = () => {
  testRunner.runAllTests();
};
```

## Test Results

The test runner provides detailed reports including:

- 📊 **Summary**: Total tests, passed, failed, success rate
- ❌ **Failed Tests**: Detailed failure information with expected vs actual
- ✅ **Passed Tests**: List of successful test cases
- 🎯 **Suite Breakdown**: Per-suite success rates

## Example Output

```
🎯 MEDISYNC TEST RUNNER
=======================

🧪 Starting Validation Tests...

📊 VALIDATION TEST REPORT
========================
Total Tests: 32
✅ Passed: 32
❌ Failed: 0
Success Rate: 100.0%

🏆 OVERALL TEST SUMMARY
=======================
Total Test Suites: 1
Total Tests: 32
✅ Total Passed: 32
❌ Total Failed: 0
🎯 Overall Success Rate: 100.0%
```

## Adding New Tests

### 1. Create New Test Suite
```javascript
// tests/newFeature/NewFeatureTests.js
export class NewFeatureTests {
  constructor() {
    this.testResults = [];
  }
  
  runAllTests() {
    // Your test logic here
    return this.testResults;
  }
  
  generateReport() {
    // Generate test report
  }
}
```

### 2. Register in TestRunner
```javascript
// tests/TestRunner.js
import { NewFeatureTests } from './newFeature/NewFeatureTests.js';

setupTestSuites() {
  this.testSuites = [
    // ... existing suites
    {
      name: 'New Feature Tests',
      suite: new NewFeatureTests(),
      description: 'Tests for new feature functionality'
    }
  ];
}
```

## Best Practices

1. **Test Coverage**: Cover happy path, edge cases, and error conditions
2. **Clear Descriptions**: Use descriptive test names and error messages
3. **Isolated Tests**: Each test should be independent
4. **Boundary Testing**: Test limits and edge values
5. **Error Scenarios**: Test invalid inputs and error handling

## Validation Rules Tested

| Field | Rule | Test Cases |
|-------|------|------------|
| Name | Letters & spaces only | Valid names, numbers, special chars |
| NIC | Exactly 12 digits | Valid 12-digit, 11-digit, 13-digit, letters |
| Email | Standard email format | Valid emails, missing @, missing domain |
| Contact | Numbers only | Valid numbers, letters, special characters |

## Integration

These tests validate the same logic used in:
- `src/components/ClientBookingModal.jsx` - Form validation
- Frontend form submission flow
- User input sanitization

The test validation functions mirror the actual validation logic in the ClientBookingModal component.