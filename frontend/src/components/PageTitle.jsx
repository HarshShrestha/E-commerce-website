function PageTitle({ eyebrow, title, text }) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
  );
}
export default PageTitle;
