"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onRemove
}) => {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <button type="button" onClick={() => onRemove(url)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition">
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset="renova_preset"
                options={{
                    sources: ['local', 'url'],
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
                            console.warn("Falta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. El widget no funcionará.");
                            alert("Error de configuración: Falta Cloud Name");
                            return;
                        }
                        open();
                    }

                    return (
                        <button
                            type="button"
                            onClick={onClick}
                            className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-200 transition"
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Subir Imagen
                        </button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
