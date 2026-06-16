- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.
- When completed, respond ONLY with "DONE". No summaries, explanations, or other text.
- No emojis unless explicitly requested.

## PR Comments

<pr-comment-rule>
When I say to add a comment to a PR with a TODO on it, use Github 'checkbox' markdown format to add the TODO. For instance:

<example>
- [ ] A description of the todo goes here
</example>
</pr-comment-rule>
- When tagging Claude in Github issues, use '@claude'

## Github

- Your primary method for interacting with Github should be the Github CLI.

## Git

- When creating branches, prefix them with feature/ to indicate they are a feature.

## Plans

At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

## Backend vs Frontend Changes

**CRITICAL:** When frontend code doesn't match backend function signatures, ALWAYS modify the backend to match the frontend needs. NEVER remove frontend code to adapt it to the backend. The backend should serve the frontend, not the other way around. You can freely add optional parameters, extend return types, and modify queries/mutations in the backend to support the client-side requirements.

## Error Handling (Native App)

Use this pattern for all async operations with UI error feedback:

```typescript
import { useErrorToast } from '~/components/toasts/toast-context';
import { tryCatch } from '~/lib/utils';

const { showErrorToast, showSuccessToast } = useErrorToast();

const handleAction = useCallback(async () => {
  const result = await tryCatch(mutation(...));

  if (result.error) {
    showErrorToast(result.error, 'Fallback error message');
  } else {
    showSuccessToast('Success message');
    // Use result.data
  }
}, [mutation, showErrorToast, showSuccessToast]);
```

Key points:
- Always use `tryCatch` wrapper for mutations/queries
- Use `useErrorToast` for automatic ConvexError message extraction
- Pass fallback message to `showErrorToast` for generic errors
- Show success toast for positive feedback
- ConvexError.data.message extracted automatically from ERROR_CATALOG