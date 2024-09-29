import phoneData from "../utils/phoneInput.json";

const MobileValidation = (mobileCode, mobileNumber) => {
  // Find the country data based on the provided mobile code
  const country = phoneData.find((item) => item.dialingCode === mobileCode);

  // If the country is not found, return invalid
  if (!country) {
    return { isValid: false, message: "Invalid mobile code." };
  }

  // If only mobileCode is provided, check for its existence and return valid
  if (!mobileNumber) {
    return { isValid: true, message: "Valid mobile code." };
  }

  // Extract phone number format for the country
  const phoneNumberFormat = country.phoneNumberFormat.replace(
    /[^#]/g,
    ""
  ).length;

  // Check if the mobile number matches the required length
  if (mobileNumber.length === phoneNumberFormat) {
    return { isValid: true, message: "Valid mobile number." };
  }

  // Return false if the mobile number doesn't match the format
  return {
    isValid: false,
    message: `Invalid mobile number. Expected ${phoneNumberFormat} digits for country code +${mobileCode}.`,
  };
};

export default MobileValidation;
