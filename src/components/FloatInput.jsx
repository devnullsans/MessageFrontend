import React from "react";

function FloatInput() {
  return (
    <div>
      {" "}
      <style>
        {`fieldset {
position: relative;
border: 1px solid #ccc;
padding: 10px;
border-radius: 4px;
margin-bottom: 20px;
background-color: #fff;
}





fieldset label {
position: absolute;
top: 50%;
left: 10px;
font-size: 16px;
color: #999;
background-color: #fff;
padding: 0 5px;
pointer-events: none;
transform: translateY(-50%);
transition: all 0.2s ease;
}

fieldset input:focus ~ label,
fieldset input:not(:placeholder-shown) ~ label {
top: -10px;
font-size: 12px;
color: #007bff;
transform: translateY(0);
}`}
      </style>
      <fieldset>
        <input
          type="text"
          id="name"
          style={{ border: "none" }}
          placeholder=" "
          required
        />
        <label htmlFor="name">Name</label>
      </fieldset>
    </div>
  );
}

export default FloatInput;
