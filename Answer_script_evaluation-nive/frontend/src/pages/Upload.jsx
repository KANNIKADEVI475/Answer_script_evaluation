import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import UploadCard from "../components/UploadCard";

function Upload() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />

        <UploadCard />
      </div>
    </div>
  );
}

export default Upload;
