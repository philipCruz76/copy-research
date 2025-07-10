// Regex to get everything up to the first semicolon

// Method 1: Using positive lookahead (most common approach)
const regex1 = /^[^;]*/;
// This matches from the start of the string (^) any characters that are NOT semicolons ([^;]*)

// Method 2: Using capture group with semicolon
const regex2 = /^([^;]*);/;
// This captures everything up to the first semicolon in group 1

// Method 3: Using non-greedy match
const regex3 = /.*?(?=;)/;
// This matches any characters (non-greedy) until it finds a semicolon

// Example usage:
const testString = "Hello world; this is after the semicolon; and another one";

// Method 1
const match1 = testString.match(regex1);
console.log("Method 1:", match1[0]); // "Hello world"

// Method 2
const match2 = testString.match(regex2);
console.log("Method 2:", match2[1]); // "Hello world"

// Method 3
const match3 = testString.match(regex3);
console.log("Method 3:", match3[0]); // "Hello world"

// Edge cases:
const edgeCases = [
  "No semicolon here",
  "; starts with semicolon",
  "Multiple; semicolons; here",
  "",
];

edgeCases.forEach((str, i) => {
  const result = str.match(regex1);
  console.log(`Edge case ${i + 1}: "${str}" -> "${result ? result[0] : ""}"`);
});
