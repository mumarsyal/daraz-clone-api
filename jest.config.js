module.exports = {
	testMatch: [
		'<rootDir>/tests/*.test.js',
	],
	collectCoverage: true,
	collectCoverageFrom: ['**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'coverage',
		'.scannerwork',
		'.vscode',
		'tests',
	],
	coverageReporters: ['json', 'lcov', 'teamcity'],
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
