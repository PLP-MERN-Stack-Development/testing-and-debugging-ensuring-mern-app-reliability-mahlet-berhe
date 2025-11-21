export default function Button({ children, variant = 'primary', size = 'md', disabled, ...props }) {
  const className = \tn-\ btn-\ \ \\.trim();
  return (
    <button className={className} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
