# Quickstart

## Local Setup

No specific new backend definitions or external database configuration is required for this feature layout.
1. Run the local development server:
   ```bash
   npm run dev
   ```
2. Navigate to a course lesson to invoke the Learning Theatre page in the student dashboard.

## Testing
Run the vitest (or jest) runner exclusively for this feature:
```bash
npm run test -- src/features/student/tests
```
