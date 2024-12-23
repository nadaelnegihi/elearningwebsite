// components/DownloadCSVButton.tsx
import React, { useState } from "react";

type Props = {
  csvData: string; // CSV data as a string
  fileName: string; // File name for the download
};

const DownloadCSVButton: React.FC<Props> = ({ csvData, fileName }) => {
  const handleDownload = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
    >
      Download CSV
    </button>
  );
};

export default DownloadCSVButton;
