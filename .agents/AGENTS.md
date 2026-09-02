# Repository Coding Guidelines & Standards

These rules enforce high readability, strict type safety, explicit naming, and maintainable software design across the codebase.

## 1. Variable Mutability & Type Safety
- **No `let`**: Always use `const` declarations. Immutable data flow enhances predictability.
- **No `any` or `never`**: Avoid `any` or `never`. Use explicit TypeScript types or interfaces.
- **No Non-Null Assertions (`!`) or Unsafe Type Casts (`as ...`)**: Validate values using explicit null/undefined checks rather than forcing non-null assertions.
- **No Unhandled `undefined` Type Casts**: Safely handle empty states with explicit defaults or guard checks.

## 2. Human-Readable Self-Documenting Naming
- Prioritize extreme readability and code reusability.
- Variable, function, parameter, and class names must be fully descriptive so that even a non-technical stakeholder can understand the business intent (e.g. `isAccountAlreadyRegistered`, `customerTotalAnnualRevenue`, `hasPrimaryContactAssigned`).
- Avoid short abbreviations like `req`, `res`, `acc`, `dt`, `cnt`. Use `request`, `response`, `account`, `dateTime`, `count`.

## 3. Explicit Descriptive Boolean Extraction
- Never place multi-condition logical expressions directly inside `if` statements.
- Extract complex conditions into descriptive boolean constants first:

```typescript
// ❌ Avoid inline complex conditions
if (account.status !== 'Active' && (account.balance < 0 || account.isFrozen)) { ... }

// ✅ Do this instead:
const isAccountInactive = account.status !== 'Active';
const hasNegativeBalance = account.balance < 0;
const isAccountOverdueOrFrozen = isAccountInactive && (hasNegativeBalance || account.isFrozen);

if (isAccountOverdueOrFrozen) {
  // Handle overdue or frozen account logic
}
```

## 4. Standardized Error Exception Handling
- Wrap domain business logic with descriptive error checks and throw standardized `AppError` exceptions with clear, user-friendly error messages.
