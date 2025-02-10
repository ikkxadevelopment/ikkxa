import { useState, useEffect } from "react";

const FILE_ALLOWED_TYPES = ["doc", "pdf", "docx", "xls", "vcd", "rar","png","jpeg"];
const FILE_LIMIT = 52428800; // Limit of 10 MB

const TIME_OUT = 5000;

const useFileUploads = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timeOut = setTimeout(() => setError(""), TIME_OUT);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [error]);

  useEffect(() => {
    if (error && selectedFiles?.length !== 0) {
      setError("");
    }
  }, [selectedFiles,error]);

  const handleImageChange = (e) => {
    let file = e.target.files[0];
    console.log("file", file);
    let fileType = file.type.split("/").pop().toLowerCase();
    let fileSize = file.size;
    console.log(fileSize, "fileSize");
    let fileName = file.name;
    if (!FILE_ALLOWED_TYPES.includes(fileType)) {
      setError(
        `${fileName} This file type is not allowed. Please upload 'pdf,doc,docx,xls,vcd,rar`
      );
      // setTimeout(() => setError(""), TIME_OUT);
    } else if (fileSize >= FILE_SIZE_LIMIT) {
      setError(`${fileName} is larger than 10 MB, Please upload smaller file`);
      // setTimeout(() => setError(""), TIME_OUT);
    } else if (e.target.files) {
      // const filesArray = Array.from(e.target.files).map((file) => {
      //   return {
      //     picturePreview: URL.createObjectURL(file),
      //     pictureAsFile: {
      //       lastModified:file.lastModified,
      //       lastModifiedDate:file.lastModifiedDate,
      //       name: file.name,
      //       size: file.size,
      //       type: file.type,
      //       webkitRelativePath: file.webkitRelativePath
      //     },
      //     filename: file.name,
      //   };
      // });

      setSelectedFiles([e.target.files[0]]);
    }
    e.target.value = "";
  };

  const handleDelete = (filename) => {
    const temp = [...selectedFiles];
    const deleted = temp.filter((item) => {
      return item.filename !== filename;
    });

    setSelectedFiles(deleted);
  };
  return {
    handleImageChange,
    handleDelete,
    selectedFiles,
    setError,
    error,
    setSelectedFiles
  };
};

export default useFileUploads;
