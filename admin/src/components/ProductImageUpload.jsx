import { useEffect, useState } from "react";
function ProductImageUpload({ index }) {
  const [preview, setPreview] = useState("");
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <label className="upload">
      {preview ? (
        <img src={preview} alt={`Selected product image ${index}`} />
      ) : (
        <span>
          ＋<small>Image {index}</small>
        </span>
      )}
      <input
        type="file"
        name={`image${index}`}
        accept="image/png,image/jpeg,image/webp"
        required={index === 1}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.size > 5 * 1024 * 1024) {
            e.target.setCustomValidity("Images must be no larger than 5 MB.");
            e.target.reportValidity();
            return;
          }
          e.target.setCustomValidity("");
          setPreview(file ? URL.createObjectURL(file) : "");
        }}
      />
    </label>
  );
}
export default ProductImageUpload;
