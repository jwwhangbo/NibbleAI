"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Upload } from "@/lib/R2Handler";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDraft } from "@/src/providers/draft-context-provider";
import { addEmptyDraftFromUserId } from "@/src/controllers/DraftController";
import { useSession } from "next-auth/react";
import { generateUniqueTag } from "@/lib/utils";

interface ImageHandlerProps {
  name: string;
  image?: string;
  setImage?: (a: string) => void;
}

/**
 * Component for handling image uploads via drag-and-drop or file input.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.name - The name attribute for the file input element.
 * @param {string} [props.image] - The initial image URL or base64 string.
 * @param {Function} [props.setImage] - The function to set the image URL or base64 string.
 * @param {string} [props.className] - Additional class names for the container div.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Additional HTML attributes for the container div.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <RecipeImageHandler
 *   name="recipeImage"
 *   image={image}
 *   setImage={setImage}
 *   className="custom-class"
 * />
 */
export default function RecipeImageHandler({
  name,
  image: imageProp,
  setImage: setImageProp,
  className,
}: ImageHandlerProps & React.HTMLAttributes<HTMLDivElement>) {
  const [localImage, localSetImage] = useState<string | undefined>(imageProp);
  const [dragover, setDragover] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sessionData = useSession().data;
  const hasMounted = useRef(false);

  const { draftIdState, setDraftIdState } = useDraft();
  const params = useSearchParams();
  const recipeId = params.get("recipeId");
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  // Sets whether image, setImage is handled internally or externally
  // use this method to handle image change globally.
  const setImage = setImageProp || localSetImage;
  const image = setImage === setImageProp ? imageProp : localImage;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const input = document.getElementById(`${name}-text`) as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, "is working");
    }

    const inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
  }, [image, name]);

  useEffect(() => {
    setImage(imageProp ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageProp]);

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
      try {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          throw Error(
            `Unsupported file type: ${file.type}. Supported file types: .jpg, .jpeg, .png`
          );
        }
        if (file.size > 5242880) {
          throw Error("File exceeds file size limit. (MAX. 5MB)");
        }
        const input = document.getElementById(name) as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (error) {
        setError((error as Error).message);
      }
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
    e.stopPropagation();
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        startTransition(async () => {
          if (!draftIdState) {
            // Draft id not set, so create a new draft
            if (process.env.NODE_ENV === "development") {
              console.log(
                `[${new Date().toISOString()}] creating new recipe draft with userid ${
                  sessionData?.user.id
                }`
              );
            }
            const draftId = await addEmptyDraftFromUserId(sessionData?.user.id);
            setDraftIdState(draftId);
            if (!params.get("draftId")) {
              const newParams = new URLSearchParams(params);
              newParams.set("draftId", draftId.id);
              replace(`${pathname}?${newParams.toString()}`);
            }
          }
          // generate tag and upload image
          const tag = generateUniqueTag(file);
          const imageUrl = await Upload(
            file,
            `${recipeId ?? ""}${draftIdState}/${tag}`
          );
          if (process.env.NODE_ENV === "development") {
            console.log(
              `[${new Date().toISOString()}] uploaded image successfully to ${imageUrl}`
            );
          }
          setImage(imageUrl);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={clsx([
        "relative flex flex-col justify-center w-full m-auto",
        className,
      ])}
      onDragOver={handleDragOver}
      onDropCapture={handleDropCapture}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <label
        htmlFor={name}
        className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer 
          ${error ? "border-red-300" : "border-gray-300"}
          ${error ? "bg-red-100" : "bg-gray-50"}
          ${error ? "text-red-300" : "text-black"}
          ${error ? "hover:bg-red-200" : "hover:bg-gray-100"}`}
      >
        {isPending ? (
          <p> Uploading image...</p>
        ) : image ? (
          <div className="flex flex-col h-full py-3 gap-2 items-center">
            <div className="relative grow-1 h-full">
              <Image
                src={image ?? ""}
                height={100}
                width={100}
                alt="user uploaded image"
                style={{
                  objectFit: "contain",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  height: "100%",
                  width: "auto",
                }}
              />
              <button
                className="absolute top-0 left-0 rounded-full bg-red-500 border-2 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  const input = document.getElementById(
                    name
                  ) as HTMLInputElement;
                  if (input.files) {
                    input.value = "";
                  }
                  setImage("");
                }}
              >
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-2 sm:px-0">
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
            {!!error && (
              <p className="mt-1 text-xs text-red-400 whitespace-pre-line">
                {error}
              </p>
            )}
          </div>
        )}
        {/* hidden input for keeping track of image upload url */}
        <input
          id={name}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        <input
          id={`${name}-text`}
          name={name}
          type="text"
          className="hidden"
          value={image ?? ""}
          onChange={(e) => {
            e.preventDefault();
          }}
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
