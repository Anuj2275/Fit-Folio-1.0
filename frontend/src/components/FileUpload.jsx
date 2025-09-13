import React from "react";
import { useState } from "react";
import api from "../api/api";
import { UploadCloud, XCircle, Edit, FileText } from "lucide-react";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds the 5MB limit.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
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
      setError(
        err.response?.data?.message ||
          "Upload failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewContent = () => {
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        return (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <FileText size={48} className="text-gray-400" />
            <span className="mt-2 text-sm text-center text-gray-600 truncate w-full">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        );
      }
    }
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 p-6">
        <UploadCloud size={48} className="mb-4 text-blue-500" />
        <p className="text-base font-medium">Drag & drop your file here</p>
        <p className="text-sm mt-1">or</p>
        <p className="text-sm text-blue-600 font-semibold cursor-pointer underline hover:text-blue-500 transition-colors">
          Click to browse
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Upload Profile Picture
        </h3>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-4">
              <label
                htmlFor="file-upload-input"
                className={`
                  relative flex flex-col items-center justify-center w-full min-h-[200px] 
                  border-2 border-dashed rounded-xl transition-all duration-300
                  ${
                    previewUrl
                      ? "border-gray-300"
                      : "border-blue-300 hover:border-blue-500 bg-blue-50"
                  }
                  cursor-pointer
                `}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {renderPreviewContent()}
              </label>
              <p className="text-xs text-gray-500 text-center mt-2">
                Accepted formats: JPG, PNG, GIF, WEBP. Max size: 5MB.
              </p>
            </div>
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors duration-200
                  ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                  flex items-center justify-center gap-2
                `}
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
          </div>

          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              File Preview
            </h4>
            <div className="bg-gray-100 rounded-xl p-4 shadow-inner min-h-[250px] flex items-center justify-center relative">
              {selectedFile ? (
                <div className="w-full">
                  <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-lg mb-4">
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <FileText size={48} />
                        <span className="mt-2 text-sm">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium text-gray-700 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={() => document.getElementById("file-upload-input").click()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <Edit size={20} /> Edit
                      </button>
                      <button
                        onClick={handleClearFile}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-medium"
                      >
                        <XCircle size={20} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">No file selected.</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center font-medium bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm mt-4 text-center font-medium bg-green-100 p-3 rounded-lg">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;