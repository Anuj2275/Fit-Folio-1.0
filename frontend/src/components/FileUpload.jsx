import React from "react";
import { useState } from "react";
import api from "../api/api";
import { UploadCloud, XCircle } from "lucide-react";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // storing temporary
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // success message for the server

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setSuccessMessage(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccessMessage(null);

    const fileInput = document.getElementById("file-upload-input");
    if (fileInput) fileInput.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("picture", selectedFile);

    try {
      const response = await api.files.uploadProfilePicture(formData);
      setSuccessMessage(response.data.message || "File Uploaded Successfully");
      if (onUploadSuccess) {
        onUploadSuccess(response.data.filepath);
      }
      handleClearFile();
    } catch (err) {
      console.error("Upload failed", err.response || err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Upload Profile Picture
      </h3>
      <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer relative">
        <input
          id="file-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {previewUrl ? (
          <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={handleClearFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Clear file"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadCloud size={36} className="mb-2" />
            <p className="text-sm">Drag & drop an image or click to browse</p>
            <p className="text-xs mt-1">(JPG, PNG, GIF, WEBP - Max 5MB)</p>
          </div>
        )}
      </div>
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </button>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mt-3 text-center">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
