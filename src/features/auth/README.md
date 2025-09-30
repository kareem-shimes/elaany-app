# Auth Feature Documentation

This feature provides a complete authentication system using NextAuth.js with Google OAuth and Zustand for state management.

## Architecture

```
src/features/auth/
├── components/          # Reusable auth components
│   ├── google-signin-button.tsx
│   ├── login-dialog.tsx
│   └── user-display.tsx
├── hooks/              # Custom auth hooks
│   └── use-auth.ts
├── services/           # Auth business logic
│   └── auth-service.ts
├── store/              # Zustand state management
│   └── auth-store.ts
├── utils/              # Helper utilities
│   └── auth-utils.ts
├── types.ts            # TypeScript definitions
└── index.ts            # Feature exports
```

## Features

- ✅ Google OAuth authentication
- ✅ Zustand state management
- ✅ Arabic UI support
- ✅ Loading states
- ✅ Error handling
- ✅ Type safety
- ✅ Reusable components
- ✅ Server-side session sync

## Usage

### Basic Authentication

```tsx
import { useAuth, LoginDialog, UserDisplay } from "@/features/auth";

function MyComponent() {
  const { isAuthenticated, user, signIn, signOut } = useAuth();

  if (isAuthenticated) {
    return <UserDisplay />;
  }

  return <LoginDialog trigger={<button>Login</button>} />;
}
```

### Using the Store Directly

```tsx
import { useAuthStore } from "@/features/auth";

function MyComponent() {
  const { user, isLoading, error } = useAuthStore();

  // Component logic...
}
```

### Using Auth Utils

```tsx
import { AuthUtils } from "@/features/auth";

function UserAvatar({ user }) {
  const avatarUrl = AuthUtils.getAvatarUrl(user);
  const initials = AuthUtils.getUserInitials(user);

  return <img src={avatarUrl} alt={initials} />;
}
```

## Components

### LoginDialog

A complete login dialog with Google sign-in button.

```tsx
<LoginDialog
  trigger={<Button>تسجيل الدخول</Button>}
  onSuccess={() => console.log("Login successful")}
/>
```

### GoogleSignInButton

A standalone Google sign-in button.

```tsx
<GoogleSignInButton
  onSuccess={() => console.log("Success")}
  onError={(error) => console.error(error)}
  disabled={false}
/>
```

### UserDisplay

Shows authenticated user info with sign-out button.

```tsx
<UserDisplay showFullName={true} className="custom-class" />
```

## Hooks

### useAuth

Main authentication hook that syncs NextAuth session with Zustand store.

```tsx
const {
  user, // Current user object
  isAuthenticated, // Boolean auth status
  isLoading, // Loading state
  error, // Error message
  signIn, // Sign in function
  signOut, // Sign out function
  clearError, // Clear error function
} = useAuth();
```

## State Management

The auth feature uses Zustand for state management with the following benefits:

- **Persistent state**: User data persists across components
- **Optimistic updates**: UI updates immediately
- **Error handling**: Centralized error management
- **DevTools**: Zustand DevTools integration
- **TypeScript**: Full type safety

## Services

### AuthService

Provides utility functions for authentication operations:

- `signInWithGoogle()`: Handle Google OAuth
- `signOut()`: Handle sign out
- `getCurrentSession()`: Get current session
- `isValidEmail()`: Email validation
- `formatUserName()`: Format names for Arabic context

## Error Handling

Errors are handled at multiple levels:

1. **Service level**: Try/catch in auth operations
2. **Store level**: Error state management
3. **Component level**: Error display and user feedback
4. **Hook level**: Error propagation and clearing

## Customization

### Adding New Providers

1. Add provider to NextAuth config (`src/lib/auth.ts`)
2. Create new sign-in button component
3. Update auth service with new provider logic
4. Add provider-specific error handling

### Extending User Data

1. Update `User` type in `src/features/auth/types.ts`
2. Modify auth callbacks in `src/lib/auth.ts`
3. Update store and hook to handle new fields

### Custom Authentication Logic

1. Extend `AuthService` class
2. Add new actions to auth store
3. Create custom hooks for specific use cases

## Best Practices

1. **Always use the `useAuth` hook** for auth state
2. **Handle loading states** in UI components
3. **Display errors** to users appropriately
4. **Use TypeScript** for type safety
5. **Test authentication flows** thoroughly
6. **Keep auth logic** in the auth feature

## Integration with NextAuth

This feature works seamlessly with NextAuth.js:

- NextAuth handles OAuth flow
- Zustand manages client state
- Custom hook syncs both systems
- Server-side utilities available for SSR

## Security Considerations

- Environment variables are properly secured
- CSRF protection via NextAuth
- Secure session management
- No sensitive data in client state
- Proper OAuth callback validation
