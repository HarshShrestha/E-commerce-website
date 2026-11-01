export default function SectionTitle({ first, second }) {
  return (
    <h2 className="original-section-title">
      <span>
        {first} <strong>{second}</strong>
      </span>
      <i aria-hidden="true" />
    </h2>
  );
}
