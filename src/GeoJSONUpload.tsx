import React, { useState } from "react"; // Import React and useState hook
import { FeatureCollection } from "geojson"; // Import FeatureCollection type from geojson
import TableDisplay from "./TableDisplay"; // Import TableDisplay component
import GeoJSONChart from "./GeoJSONChart"; // Import GeoJSONChart component
import ChartForm from "./ChartForm";

interface GeoJSONUploadProps {} // Define an empty interface for component props

const GeoJSONUpload: React.FC<GeoJSONUploadProps> = () => {
  // Define state to hold the GeoJSON data, initialized to null
  const [geoJSONData, setGeoJSONData] = useState<FeatureCollection | null>(
    null
  );
  // Define state to hold any error messages, initialized to null
  const [error, setError] = useState<string | null>(null);
  const [xAttr, setXAttr] = useState<string | null>(null);
  const [yAttr, setYAttr] = useState<string | null>(null);

  // Event handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the selected file from the input
    const file = event.target.files?.[0];

    // Check if the file is a GeoJSON file
    if (file && (file.type === "application/geo+json" || file.type === "application/json" || file.name.endsWith(".geojson"))) {
    if (file && file.name.endsWith(".geojson")) {
      const reader = new FileReader(); // Create a new FileReader instance

      // Define the onload event handler for the FileReader
      reader.onload = () => {
        try {
          // Parse the file content as GeoJSON
          const parsedData: FeatureCollection = JSON.parse(
            reader.result as string
          );
          setGeoJSONData(parsedData); // Update the state with the parsed data
          setError(null); // Clear any previous error
        } catch (e) {
          setError("Invalid GeoJSON format."); // Set error if parsing fails
        }
      };

      // Define the onerror event handler for the FileReader
      reader.onerror = () => {
        setError("Error reading the file."); // Set error if reading fails
      };

      reader.readAsText(file); // Read the file content as text
    } else {
      setError("Please select a valid GeoJSON file."); // Set error for invalid file type
    }
  };

  return (
    <div>
      {/* File input element to upload GeoJSON files */}
      <input type="file" accept=".geojson" onChange={handleFileChange} />
      {/* Display error message if any */}
      {error && <p>{error}</p>}
      {geoJSONData && (
        <>
          <ChartForm data={geoJSONData} onSelect={(x, y) => {
            setXAttr(x);
            setYAttr(y);
          }} />
          {xAttr && yAttr && <GeoJSONChart data={geoJSONData} xAttr={xAttr} yAttr={yAttr} />}
          </> 
      )}
    </div>
  );
};

export default GeoJSONUpload; // Export the component as default
