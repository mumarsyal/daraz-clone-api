module.exports = {
	testMatch: [
		'<rootDir>/tests/*.test.js',
	],
	coverageReporters: ['lcov'],
	coverageDirectory: '<rootDir>/coverage',
	testResultsProcessor: 'jest-teamcity-reporter',
};
