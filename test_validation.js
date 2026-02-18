import { validateName } from "./src/lib/validation.js";

const testCases = [
	{ name: "Ana Maria", expected: true },
	{ name: "Pedro-Henrique", expected: true }, // Hyphen
	{ name: "Jr.", expected: true }, // Dot
	{ name: "O'Connor", expected: true }, // Apostrophe
	{ name: "A", expected: false }, // Too short
	{ name: "Pedro 123", expected: false }, // Numbers
];

console.log("Running Name Validation Tests...");
let failed = 0;
testCases.forEach(({ name, expected }) => {
	const result = validateName(name);
	if (result !== expected) {
		console.error(
			`FAILED: "${name}" -> Expected ${expected}, got ${result}`,
		);
		failed++;
	} else {
		console.log(`PASSED: "${name}"`);
	}
});

if (failed === 0) console.log("All tests passed!");
else console.log(`${failed} tests failed.`);
