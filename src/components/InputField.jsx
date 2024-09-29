import React, { useState } from "react";
const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  errorMessage,
  children,
  placeholder,
  isPassword = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className="mb-4">
      <div className="label-div mb-1">
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      </div>
      {children ||
        (!isPassword ? (
          <input
            type={type}
            className={`form-control ${errorMessage ? "is-invalid" : ""}`}
            placeholder={placeholder}
            id={id}
            autoComplete={autoComplete}
            onChange={onChange}
            value={value}
            {...rest}
          />
        ) : (
          <div className="password-group d-flex">
            <div className="w-100">
              <input
                type={isPasswordVisible ? "text" : "password"}
                className={`form-control ${errorMessage ? "is-invalid" : ""}`}
                placeholder={label}
                id={id}
                autoComplete={autoComplete}
                onChange={onChange}
                value={value}
                style={{ background: "none" }}
              />
              {errorMessage && (
                <div className="invalid-feedback">{errorMessage}</div>
              )}
            </div>
            <span
              className="material-symbols-outlined"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{ cursor: "pointer" }}
            >
              {isPasswordVisible ? "visibility_off" : "visibility"}
            </span>
          </div>
        ))}
      {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
};
export default InputField;
