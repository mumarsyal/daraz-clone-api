module.exports = {
	testMatch: [
		'<rootDir>/tests/*.test.js',
	],
	coverageReporters: ['json', 'lcov'],
	coverageDirectory: '<rootDir>/coverage',
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	testResultsProcessor: 'jest-teamcity-reporter',
	// testResultsProcessor: 'jest-sonar-reporter',
};
