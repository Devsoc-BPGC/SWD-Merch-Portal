// Reusable Button component
// TODO: Implement variants: primary, secondary, danger, ghost
export default function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
