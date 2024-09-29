import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInputComponent from "../components/PhoneInputComponent";
import phoneData from "../utils/phoneInput.json";
import { GlobalContext } from "../GlobalContext";
import "../Register.css"; // Import the CSS file
import { registerCompany } from "../utils/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(GlobalContext);
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    phoneCode: "91",
    phone: "",
    password: "",
    Cname: "",
  });

  const [showPhoneError, setShowPhoneError] = useState(false);
  const [dialingCode, setDialingCode] = useState("91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryData, setSelectedCountryData] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value,
    });
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    const selectedCountryDataTemp = phoneData.find(
      (country) => country.code === value
    );

    if (selectedCountryDataTemp) {
      setSelectedCountryData(selectedCountryDataTemp);
      setDialingCode(selectedCountryDataTemp.dialingCode);
      setCompanyData({
        ...companyData,
        phoneCode: selectedCountryDataTemp.dialingCode,
      });
    }
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);

    setCompanyData({
      ...companyData,
      phone: event.target.value,
      phoneCode: dialingCode,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerCompany({
        name: companyData.name,
        companyName: companyData.Cname,
        email: companyData.email,
        phoneCode: companyData.phoneCode,
        phone: companyData.phone,
        password: companyData.password,
      });
      if (data.status === 201) {
        navigate("/verify-otp", { state: { email: companyData.email } });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div
      style={{
        height: 800,
      }}
      className=""
    >
      <form onSubmit={handleSubmit} className="register-form ">
        <h2 className="form-title">Register Your Company</h2>
        <input
          type="text"
          name="name"
          value={companyData.name}
          onChange={handleChange}
          placeholder="Name"
          className="form-input"
          onInvalid={(event) => {
            // event.preventDefault(); // Prevent default browser validation message
            toast.error(
              `${event.target.validationMessage && "Name is required"}`
            );
          }}
          required
        />
        <input
          type="text"
          name="Cname"
          value={companyData.Cname}
          onChange={handleChange}
          placeholder="Company Name"
          className="form-input"
          onInvalid={(event) => {
            // event.preventDefault(); // Prevent default browser validation message
            toast.error(
              `${event.target.validationMessage && "Company is required"}`
            );
          }}
          required
        />
        <input
          type="email"
          name="email"
          value={companyData.email}
          onChange={handleChange}
          placeholder="Company Email ID"
          className="form-input"
          onInvalid={(event) => {
            // event.preventDefault(); // Prevent default browser validation message
            toast.error(
              `${event.target.validationMessage && "Email is required"}`
            );
          }}
          required
        />
        <input
          type="password"
          name="password"
          value={companyData.password}
          onChange={handleChange}
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$"
          placeholder="Password"
          className="form-input"
          title="At least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          onInvalid={(event) => {
            // event.preventDefault(); // Prevent default browser validation message
            toast.error(
              !event.target.value
                ? `${event.target.validationMessage && "Password is required"}`
                : `${event.target.validationMessage}\n${event.target.title}`
            );
          }}
          required
        />

        <PhoneInputComponent
          selectedCountryData={selectedCountryData}
          preferredCountry={["in", "us", "ae"]}
          phoneNumber={phoneNumber}
          handleCountryChange={handleCountryChange}
          handlePhoneNumberChange={handlePhoneNumberChange}
          showError={showPhoneError}
        />

        <button type="submit" className="submit-button mt-5">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
