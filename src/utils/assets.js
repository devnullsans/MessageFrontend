import axios from "axios";

// API call to upload assets
export const uploadAsset = async (file, assetType) => {
  const formData = new FormData();
  formData.append("name", file.name);
  formData.append("size", file.size);
  formData.append("mime", file.type);
  formData.append("assetType", assetType);

  try {
    const response = await axios.post("/aws/asset", formData);
    const fd = new FormData();

    for (const [key, val] of Object.entries(response.data.data.fields)) fd.append(key, val);
    fd.append("file", file);
    const ress = await fetch(response.data.data.url, { method: "POST", body: fd });
    // const res = await axios.post(response.data.data.url, fd);
    return response.data;
  } catch (error) {
    console.error("Error uploading asset:", error.response?.data || error.message);
    throw error;
  }
};
