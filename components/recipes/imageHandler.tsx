"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useState } from "react";

interface ImageHandlerProps {
  name: string;
  image?: string;
  setImage?: (a : string) => void;
}

export default function RecipeImageHandler({ name, image: imageProp, setImage: setImageProp, className }: ImageHandlerProps & React.HTMLAttributes<HTMLDivElement>) {
  const [localImage, localSetImage] = useState<string | undefined>();
  const [dragover, setDragover] = useState<boolean>(false);

  // Sets whether image, setImage is handled internally or externally
  const image = imageProp ?? localImage;
  const setImage = setImageProp ?? localSetImage;

  /**
   * Handles the drag over event to prevent default behavior.
   * @param e - The drag event.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /**
   * Handles the drop capture event to set the file input with the dropped file.
   * @param e - The drag event.
   */
  const handleDropCapture = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.getElementById(
        name
      ) as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  /**
   * Handles the drag enter event to set the dragover state.
   * @param e - The drag event.
   */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.items && e.dataTransfer.items[0]?.kind === "file") {
      setDragover(true);
    }
  };

  /**
   * Handles the drag leave event to unset the dragover state.
   * @param e - The drag event.
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragover(false);
    }
  };

  /**
   * Handles the file change event to read and set the image.
   * @param e - The change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={clsx([
        "relative flex flex-col justify-center w-full m-auto h-10",
        className,
      ])}
      onDragOver={handleDragOver}
      onDropCapture={handleDropCapture}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <label
        htmlFor={name}
        className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        {imageProp ?? localImage ? (
          <div className="relative m-auto h-full w-fit py-2">
            <Image
              src={image ?? ""}
              height="150"
              width="150"
              alt="user uploaded image"
              style={{
                objectFit: "contain",
                borderRadius: "0.375rem",
                width: "auto",
                height: "100%",
                backgroundColor: "white",
              }}
            />
            <button className="absolute -top-1 -left-3 rounded-full bg-red-500 border-2 text-white" onClick={(e) => {
              e.preventDefault();
              const input = document.getElementById(name) as HTMLInputElement;
              if (input.files) {
                input.value = "";
                setImage("");
              }
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 5MB)
            </p>
          </div>
        )}
        <input
          name={name}
          id={name}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
      </label>
      {dragover && <DragOverlay />}
    </div>
  );
}

function DragOverlay() {
  return (
    <div className="absolute flex flex-col gap-5 justify-center items-center inset-0 bg-black/50 rounded-lg font-bold border-2 border-green-400 ring ring-green-200 text-gray-300">
      <p>Drop file here</p>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="size-12 animate-bounce"
      >
        <path
          d="M9 13L12 16M12 16L15 13M12 16V8M7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.07989 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
