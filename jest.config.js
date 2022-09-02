module.exports = {
	testMatch: [
		'<rootDir>/tests/*.test.js',
	],
	coverageReporters: ['json', 'lcov'],
	coverageDirectory: '<rootDir>/coverage',
	// testResultsProcessor: 'jest-teamcity-reporter',
	testResultsProcessor: 'jest-sonar-reporter',
};
