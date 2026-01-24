/**
 * Tests for Rules Engine
 * Run with: node tests/rules-engine.test.js
 */

// Simple test runner
const RulesEngine = require('../rules-engine.js');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// Test data
const testRules = [
  {
    id: 'youtube-shorts',
    type: 'path-contains',
    domain: 'youtube.com',
    pathPattern: '/shorts',
    classification: 'distracting'
  },
  {
    id: 'youtube-watch',
    type: 'path-contains',
    domain: 'youtube.com',
    pathPattern: '/watch',
    classification: 'neutral'
  },
  {
    id: 'youtube-default',
    type: 'domain',
    domain: 'youtube.com',
    classification: 'neutral'
  },
  {
    id: 'twitter',
    type: 'domain',
    domain: 'twitter.com',
    classification: 'distracting'
  },
  {
    id: 'github',
    type: 'domain',
    domain: 'github.com',
    classification: 'productive'
  }
];

// Run tests
console.log('Running Rules Engine Tests...\n');

const engine = new RulesEngine(testRules);
engine.defaultClassification = 'neutral';

// Test 1: Domain rule matching
test('Domain rule - twitter.com should be distracting', () => {
  const result = engine.classify('https://twitter.com/home');
  assertEqual(result.classification, 'distracting');
  assertEqual(result.ruleId, 'twitter');
});

// Test 2: Domain rule - github.com should be productive
test('Domain rule - github.com should be productive', () => {
  const result = engine.classify('https://github.com/user/repo');
  assertEqual(result.classification, 'productive');
  assertEqual(result.ruleId, 'github');
});

// Test 3: Path-contains rule - more specific should win
test('Path-contains rule - youtube.com/shorts should be distracting', () => {
  const result = engine.classify('https://youtube.com/shorts/abc123');
  assertEqual(result.classification, 'distracting');
  assertEqual(result.ruleId, 'youtube-shorts');
});

// Test 4: Path-contains rule - youtube.com/watch should be neutral
test('Path-contains rule - youtube.com/watch should be neutral', () => {
  const result = engine.classify('https://youtube.com/watch?v=abc123');
  assertEqual(result.classification, 'neutral');
  assertEqual(result.ruleId, 'youtube-watch');
});

// Test 5: Domain fallback - youtube.com without path pattern should use domain rule
test('Domain fallback - youtube.com should use domain rule', () => {
  const result = engine.classify('https://youtube.com/feed');
  assertEqual(result.classification, 'neutral');
  assertEqual(result.ruleId, 'youtube-default');
});

// Test 6: Unknown domain should use default
test('Unknown domain should use default classification', () => {
  const result = engine.classify('https://example.com/page');
  assertEqual(result.classification, 'neutral');
  assertEqual(result.ruleId, null);
});

// Test 7: Invalid URL should use default
test('Invalid URL should use default classification', () => {
  const result = engine.classify('not-a-url');
  assertEqual(result.classification, 'neutral');
  assertEqual(result.ruleId, null);
});

// Test 8: Add rule
test('Add rule should work', () => {
  const ruleId = engine.addRule({
    type: 'domain',
    domain: 'test.com',
    classification: 'productive'
  });
  assert(ruleId !== null, 'Rule ID should be generated');
  const result = engine.classify('https://test.com');
  assertEqual(result.classification, 'productive');
});

// Test 9: Update rule
test('Update rule should work', () => {
  engine.updateRule('twitter', { classification: 'neutral' });
  const result = engine.classify('https://twitter.com/home');
  assertEqual(result.classification, 'neutral');
  // Reset
  engine.updateRule('twitter', { classification: 'distracting' });
});

// Test 10: Delete rule
test('Delete rule should work', () => {
  engine.addRule({
    type: 'domain',
    domain: 'delete-test.com',
    classification: 'distracting'
  });
  const result1 = engine.classify('https://delete-test.com');
  assertEqual(result1.classification, 'distracting');
  
  const rules = engine.getRules();
  const ruleToDelete = rules.find(r => r.domain === 'delete-test.com');
  engine.deleteRule(ruleToDelete.id);
  
  const result2 = engine.classify('https://delete-test.com');
  assertEqual(result2.classification, 'neutral');
});

// Test 11: Export/Import rules
test('Export and import rules should work', () => {
  const exported = engine.exportRules();
  const newEngine = new RulesEngine([]);
  const success = newEngine.importRules(exported);
  assert(success, 'Import should succeed');
  assertEqual(newEngine.getRules().length, engine.getRules().length);
});

// Test 12: URL parsing
test('URL parsing should extract host and path', () => {
  const parsed = engine.parseURL('https://example.com/path/to/page?query=1');
  assert(parsed !== null, 'Parsed should not be null');
  assertEqual(parsed.host, 'example.com');
  assertEqual(parsed.path, '/path/to/page');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed');
  process.exit(1);
}
