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
                        <div className="z-10 absolute top-2 right-2">
                            <button type="button" onClick={() => onRemove(url)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-sm">
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
