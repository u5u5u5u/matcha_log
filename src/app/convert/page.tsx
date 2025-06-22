"use client";
import React, { useState } from "react";
import Image from "next/image";
import {  heicTo } from "heic-to";

const FilePreviewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);

    if (
      selectedFile?.type === "image/heic" ||
      selectedFile?.type === "image/heif"
    ) {
      convertHeicToJpg(selectedFile);
    }

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const convertHeicToJpg = async (heicFile: File) => {
    // const jpeg = await heicTo({
    //   blob: heicFile,
    //   type: "image/jpeg",
    //   quality: 0.5,
    // });

    const png = await heicTo({
      blob: heicFile,
      type: "image/png",
      quality: 0.5,
    });

    console.log("Converted HEIC to PNG:", png);
    const url = URL.createObjectURL(png);
    console.log("Preview URL:", url);
    setPreviewUrl(url);
    return;
  };

  return (
    <div>
      <label>
        ファイルを選択してプレビューする
        <input type="file" onChange={handleFileChange} />
      </label>
      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <strong>プレビュー:</strong>
          {file?.type.startsWith("image/") ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={400}
              height={400}
              style={{ maxWidth: 400, maxHeight: 400 }}
            />
          ) : (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              {file?.name}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FilePreviewer;
