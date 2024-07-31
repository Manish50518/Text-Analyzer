import "./App.css";
import { useState } from "react";
import FileData from "./FileData";
import axios from "axios";
import SummerisedData from "./SummerisedData";

function Pdfuploader() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState("");
  const [loading, setLoading] = useState(false);
  const [summerisedData, setSummerisedData] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const onFileChange = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const data = await axios.post(
        "http://192.168.0.101:8000/upload",
        formData
      );

      setFileData(data.data.contents);
      const summerised = await axios.post("http://192.168.0.101:8000/predict", {
        text: data.data.contents,
      });

      setSummerisedData(summerised.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onFileChange} className="form">
        <input
          className="choose-file-btn"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {file && <div style={{ marginTop: "20px" }}></div>}
        <button disabled={loading} type="submit" className="submit-btn">
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>
      <div className="components">
        <FileData fileData={fileData} />
        <SummerisedData summerisedData={summerisedData} />
      </div>
    </div>
  );
}

export default Pdfuploader;
