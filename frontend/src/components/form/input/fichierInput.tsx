import { useState, useRef } from "react";


type FileInputProps = {
    label?: string;
    accept?: string;
    maxSizeMB?: number;
    multiple?: boolean;
    onFileSelect: (files: File[]) => void;
    error?: string;
}



export default function FichierInput({
    label = "Téléverser un ficher",
    accept = "image/*",
    maxSizeMB = 5,
    multiple = false,
    onFileSelect,
    error
}: FileInputProps){
    const [previews, setPreviews] = useState<string[]>([])
    const [fileNames, setFileNames] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const inputRef =  useRef<HTMLInputElement>(null)


    const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setPreviews([]);
    setFileNames([]);

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const names: string[] = [];

    fileArray.forEach((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert("Fichier trop lourd");
            return;
        }

        validFiles.push(file);
        names.push(file.name);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setPreviews((prev) => [
                    ...prev,
                    e.target?.result as string,
                ]);
            };

            reader.readAsDataURL(file);
        } else {
            setPreviews((prev) => [...prev, ""]);
        }
    });

    setFileNames(names);
    onFileSelect(validFiles);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    return(
       <div className="w-full" >
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}

            <div
                onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                    ${isDragging? "border-blue-500 bg-blue-50": "border-gray-300 bg-gray-50"}
                    ${error? "border-blue-500 bg-blue-50" : ""}
                    `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                {previews.length > 0?(
                    <div className="flex gap-2 flex-wrap justify-center">
                        {previews.map((src, i) =>
                        src? <img key={i} src={src} className="w-20 h-20 object-cover rounded-lg" />:
                        <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs">{fileNames[i]} </div>
                        )}
                    </div>
                ):(
                    <>
                        <p className="text-gray-500">Glisser déposer ou <span className="text-blue-500">cliquer</span></p>
                        <p className="text-xs text-gray-400 mt-1">Max {String(maxSizeMB)}MB</p>
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
       </div>
    );


}