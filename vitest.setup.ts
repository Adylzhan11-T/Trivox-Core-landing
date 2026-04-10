// vitest.setup.ts
import '@testing-library/jest-dom'

// IntersectionObserver does not exist in jsdom — mock globally
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// window.scrollY does not exist in jsdom
Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0,
})
