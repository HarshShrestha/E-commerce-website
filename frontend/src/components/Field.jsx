function Field({ label, name, type = "text", ...props }) {
  return (
    <label className="field">
      {label}
      <input name={name} type={type} required {...props} />
    </label>
  );
}
export default Field;
