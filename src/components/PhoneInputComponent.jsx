import React, { useState, useRef, useEffect } from "react";
import phoneData from "../utils/phoneInput.json";
import toast from "react-hot-toast";

const PhoneInputComponent = ({
  selectedCountryData,
  phoneNumber,
  preferredCountry,
  handleCountryChange,
  handlePhoneNumberChange,
  showError,
  hideMobileNumber = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const preferred = preferredCountry;
  const sortedCountries = phoneData.sort((a, b) => {
    if (preferred.includes(a.code) && !preferred.includes(b.code)) return -1;
    if (!preferred.includes(a.code) && preferred.includes(b.code)) return 1;
    return 0;
  });
  const filteredCountries = sortedCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  const handleCountrySelect = (countryCode) => {
    handleCountryChange({ target: { value: countryCode } });
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minWidth: "max-content",
        position: "relative",
        height: 48,
      }}
      className={`d-flex  border border-secondary rounded-lg w-100 ${
        isFocused ? "outline-primary border-2" : ""
      }`}
    >
      <div className="border-0 flag-div  " onClick={handleDropdownToggle}>
        <div
          style={{ borderRight: "1px solid grey" }}
          className="d-flex justify-content-start align-items-center h-100 pe-2"
        >
          <span className="material-symbols-outlined">arrow_drop_down</span>
          <button
            type="button"
            className="p-0 m-0 h-100  bg-transparent d-flex justify-content-center align-items-center cursor-pointer border-0 border-end border-secondary"
          >
            {selectedCountryData?.name ? (
              <span>
                {selectedCountryData.code && (
                  <div
                    className={`selected-country-flag flag ${selectedCountryData.code}`}
                  />
                )}
              </span>
            ) : (
              <div className={`selected-country-flag flag in`} />
            )}
          </button>
        </div>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              width: "max-content",
              zIndex: 99,
              position: "absolute",
            }}
            className="position-absolute top-100 start-0 end-0 bg-white border-secondary  max-h-250px overflow-y-auto shadow"
          >
            <div className="px-3">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by country name or code"
                className="w-100 py-3 border border-secondary rounded-lg  my-3  "
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul
              style={{
                height: "300px",
                overflow: "auto",
              }}
              className="p-0 "
            >
              {filteredCountries.map((country, index) => (
                <li
                  key={country.code}
                  onClick={() =>
                    handleCountrySelect(country.code, country.dialingCode)
                  }
                  style={{
                    borderBottom:
                      index !== preferred.length - 1 || searchTerm
                        ? "none"
                        : "1px solid #dee2e6",
                  }}
                  className="d-flex gap-2 px-2 py-1.5 cursor-pointer align-items-center hover-bg-light"
                >
                  {country.code && (
                    <div
                      title={`${country.name} flag `}
                      className={`country-flag flag ${
                        country.code ? country.code : "in"
                      }`}
                    />
                  )}
                  {country.name} (+{country.dialingCode})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!hideMobileNumber ? (
        <div className="d-flex">
          <input
            className="text ms-2"
            name="phoneCode"
            style={{
              width: 46,
              border: "none",
            }}
            value={"+" + `${selectedCountryData?.dialingCode || "91"}`}
            readOnly
          />
          <input
            id="phone"
            value={phoneNumber}
            pattern={`^\\d{${selectedCountryData ? selectedCountryData.phoneNumberFormat.replace(/[^#]/g, "").length : 10}}$`} // Use the computed pattern here
            style={{
              width: "200px",
            }}
            max={
              selectedCountryData
                ? Math.pow(
                    10,
                    selectedCountryData.phoneNumberFormat.replace(/[^#]/g, "")
                      .length
                  ) - 1
                : 9999999999
            }
            min={
              selectedCountryData
                ? Math.pow(
                    10,
                    selectedCountryData.phoneNumberFormat.replace(/[^#]/g, "")
                      .length - 1
                  )
                : 100000000
            }
            title={`${selectedCountryData ? `Mobile Number should have ${selectedCountryData.phoneNumberFormat.replace(/[^#]/g, "").length} digit number` : "Mobile Number should have 10 digit number"}`}
            type="number"
            onChange={handlePhoneNumberChange}
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            name="phone"
            className={`border-0 bg-transparent focus-outline-none `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onInvalid={(event) => {
              // event.preventDefault(); // Prevent default browser validation message
              toast.error(
                !event.target.value
                  ? `${event.target.validationMessage}`
                  : `${event.target.title}`
              );
            }}
            required
          />
        </div>
      ) : (
        <div className="d-flex">
          <input
            className="text"
            name="phoneCode"
            style={{
              width: 46,
              border: "none",
            }}
            value={selectedCountryData?.dialingCode || "91"}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default PhoneInputComponent;
