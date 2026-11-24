# Dashboard UI

- Use React and official shadcn/ui components as the default for supported UI elements. Check src/components/ui first and reuse the existing component.
- When a component is missing, add the matching New York shadcn/ui registry component and only the dependencies the feature needs.
- Compose Field, Input Group, Dialog, Card, and other primitives before creating equivalents with HTML and Tailwind utilities.
- Keep registry styles as the baseline. Apply project-specific layout, RTL, and Tokyo Night styling through composition, shared tokens, and targeted styles.
- Use semantic HTML for page landmarks and CSS for decorative artwork. Add components only when the feature calls for them.
