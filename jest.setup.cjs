require('@testing-library/jest-dom');
const React = require('react');

// Mock next-auth
jest.mock('next-auth/react', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
  };
  return {
    __esModule: true,
    useSession: jest.fn(() => ({
      data: mockSession,
      status: 'authenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
    SessionProvider: ({ children }) => children,
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    button: ({ children, ...props }) => React.createElement('button', props, children),
    section: ({ children, ...props }) => React.createElement('section', props, children),
  },
  AnimatePresence: ({ children }) => children,
}));
