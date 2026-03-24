---
name: testing
description: Comprehensive testing strategies — unit, integration, E2E, coverage requirements, and test-driven development patterns
---

# Testing

## Core Principles

- **Test-first mentality**: Write tests before implementation when possible
- **Coverage target**: Minimum 80% code coverage for production code
- **Test pyramid**: Many unit tests, fewer integration tests, minimal E2E tests
- **Real data**: Never use mocks/fakes just to pass tests — tests should reflect real behavior

## Test Types

### Unit Tests
- Test individual functions/methods in isolation
- Fast execution, no external dependencies
- Use framework conventions (Jest, Vitest, pytest, Go testing)

### Integration Tests
- Test component interactions and API boundaries
- Use real database connections when testing data layer
- Verify request/response contracts

### E2E Tests
- Test critical user journeys end-to-end
- Use Playwright or Cypress for web applications
- Keep E2E test count minimal — focus on happy paths + critical edge cases

## Best Practices

1. **Arrange-Act-Assert** pattern for test structure
2. **Descriptive test names** that explain the expected behavior
3. **One assertion per test** when possible
4. **No test interdependencies** — each test should run independently
5. **Clean up after tests** — reset state, close connections
6. **Test error cases** — not just happy paths
7. **Avoid testing implementation details** — test behavior, not internals

## Coverage Requirements

| Category | Minimum |
|----------|---------|
| Critical business logic | 90% |
| API endpoints | 85% |
| Utility functions | 80% |
| UI components | 70% |

## When to Use

- After implementing new features
- When fixing bugs (write regression test first)
- During refactoring (ensure tests pass before and after)
- Before merging pull requests
