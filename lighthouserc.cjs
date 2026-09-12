module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5000/',
        'http://localhost:5000/pdf-merge/',
        'http://localhost:5000/pdf-compress/',
        'http://localhost:5000/image-converter/',
        'http://localhost:5000/json-formatter/',
        'http://localhost:5000/word-counter/',
        'http://localhost:5000/typing-speed-test/',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        onlyCategories: ['performance', 'seo', 'best-practices'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'uses-rel-preconnect': 'warn',
        'render-blocking-resources': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
