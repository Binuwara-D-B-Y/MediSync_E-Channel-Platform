// Validation functions (matching frontend logic)
function validateName(name) {
  if (!name || name.trim() === '') return false;
  return /^[a-zA-Z\s]+$/.test(name.trim());
}

function validateNIC(nic) {
  if (!nic || nic.trim() === '') return false;
  return /^\d{12}$/.test(nic.trim());
}

function validateEmail(email) {
  if (!email || email.trim() === '') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateContact(contact) {
  if (!contact || contact.trim() === '') return false;
  return /^\d+$/.test(contact.trim());
}

const tests = [
  { name: 'Name - Empty name', test: () => validateName(''), expected: false },
  { name: 'Name - Whitespace only', test: () => validateName('   '), expected: false },
  { name: 'Name - Valid name', test: () => validateName('John Doe'), expected: true },
  { name: 'Name - Name with numbers', test: () => validateName('John123'), expected: false },
  { name: 'NIC - Empty NIC', test: () => validateNIC(''), expected: false },
  { name: 'NIC - Valid 12-digit', test: () => validateNIC('123456789012'), expected: true },
  { name: 'NIC - 11-digit', test: () => validateNIC('12345678901'), expected: false },
  { name: 'NIC - With letters', test: () => validateNIC('12345678901A'), expected: false },
  { name: 'Email - Empty email', test: () => validateEmail(''), expected: false },
  { name: 'Email - Valid email', test: () => validateEmail('test@example.com'), expected: true },
  { name: 'Email - Invalid format', test: () => validateEmail('invalid-email'), expected: false },
  { name: 'Email - Without domain', test: () => validateEmail('test@'), expected: false },
  { name: 'Contact - Empty contact', test: () => validateContact(''), expected: false },
  { name: 'Contact - Valid contact', test: () => validateContact('0771234567'), expected: true },
  { name: 'Contact - With letters', test: () => validateContact('077abc1234'), expected: false },
  { name: 'Contact - With hyphens', test: () => validateContact('077-123-4567'), expected: false },
];

import fs from 'fs';

// Run tests
let output = [];
output.push('MEDISYNC VALIDATION TESTS');
output.push('============================');

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = test.test();
  const success = result === test.expected;
  
  if (success) {
    output.push(`PASS ${test.name}`);
    passed++;
  } else {
    output.push(`FAIL ${test.name} - Expected: ${test.expected}, Got: ${result}`);
    failed++;
  }
});

output.push('');
output.push(`Total Tests: ${tests.length}`);
output.push(`Passed: ${passed}`);
output.push(`Failed: ${failed}`);
output.push(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);

if (failed === 0) {
  output.push('');
  output.push('All tests passed!');
} else {
  output.push('');
  output.push('Some tests failed!');
}

// Save to testlog file
const logContent = output.join('\n');
fs.writeFileSync('testlog.txt', logContent);

// Also print to console
console.log(logContent);

if (failed > 0) {
  process.exit(1);
}