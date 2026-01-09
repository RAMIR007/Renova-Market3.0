"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash, RotateCw } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    onImageUpdate?: (oldUrl: string, newUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onRemove,
    onImageUpdate
}) => {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    const handleRotate = (url: string) => {
        let newUrl = url;
        if (url.includes('/a_90/')) {
            newUrl = url.replace('/a_90/', '/a_180/');
        } else if (url.includes('/a_180/')) {
            newUrl = url.replace('/a_180/', '/a_270/');
        } else if (url.includes('/a_270/')) {
            newUrl = url.replace('/a_270/', '/');
        } else {
            newUrl = url.replace('/upload/', '/upload/a_90/');
        }

        // Remove the old URL and add the new one
        // Note: This matches the parent's generic onChange which often just setUrl(newVal)
        // But the parent is using value array?
        // Let's check the props usage.
        // value is string[] in interface, but onChange takes (value: string).
        // createProduct form usage: 
        //   onChange={(url) => setImageUrl(url)}
        //   value={imageUrl ? [imageUrl] : []}
        // It seems typically meant for single image although array prop.
        // If it's single image logic in parent, calling onChange with new URL works.

        if (onImageUpdate) {
            onImageUpdate(url, newUrl);
        } else {
            // Fallback for single image mode or if prop not provided
            onChange(newUrl);
        }
    };

    // Debugging
    console.log("Cloudinary Config:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <p className="font-bold">Error de Configuración:</p>
                <p>No se encontró <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>.</p>
                <p className="mt-1 text-xs">Asegúrate de reiniciar el servidor tras editar el .env</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-200">
                        <div className="z-10 absolute top-2 right-2 flex gap-2">
                            <button type="button" onClick={() => handleRotate(url)} className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition shadow-sm" title="Rotar 90°">
                                <RotateCw className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => onRemove(url)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-sm" title="Eliminar">
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
                uploadPreset="renova_preset" // IMPORTANT: User must create this in Cloudinary Settings > Upload > Add Upload Preset (Unsigned)
                options={{
                    maxFiles: 1,
                    sources: ['local', 'camera', 'url'],
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <button
                            type="button"
                            onClick={onClick}
                            className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200 transition text-gray-700 font-medium"
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
