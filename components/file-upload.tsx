"use client"

import React, { useCallback } from "react"
import { useDropzone, FileRejection, DropzoneOptions } from "react-dropzone"
import { Upload, File as FileIcon, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  file: File | null
  title: string
  description: string
  accept?: DropzoneOptions["accept"]
  maxSize?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  file,
  title,
  description,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        // Handle rejected files (e.g., show an error message)
        console.error("File rejected:", fileRejections[0].errors)
        onFileChange(null)
      } else if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
    maxSize,
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <h3 className="text-black text-[17px] font-semibold leading-[20.4px]">{title}</h3>
      <div
        {...getRootProps()}
        className={`h-[180px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-[#4490CC] bg-blue-50 scale-[1.02]"
            : file
              ? "border-green-500 bg-green-50"
              : "border-[#D1D5DB] bg-gray-50 hover:border-[#4490CC] hover:bg-blue-25"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          {file ? (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-700 text-[14px] font-semibold">File Ready</p>
              <p className="text-green-600 text-[12px] mt-1">{file.name}</p>
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-700 text-[14px] font-semibold mb-1">
                {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
              </p>
              <p className="text-gray-500 text-[12px]">{description}</p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-[#4490CC] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#3a7bb8] transition-colors"
              >
                Choose File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
