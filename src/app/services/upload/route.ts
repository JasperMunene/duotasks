import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = (
    fileUri: string,
    fileName: string
): Promise<{ success: boolean; result?: UploadApiResponse; error?: Error }> => {
    return new Promise((resolve) => {
        cloudinary.uploader
            .upload(fileUri, {
                invalidate: true,
                resource_type: "auto",
                filename_override: fileName,
                folder: "duotasks",
                use_filename: true,
            })
            .then((result) => resolve({ success: true, result }))
            .catch((error) => resolve({ success: false, error: error as Error }));
    });
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const mimeType = file.type;
        const encoding = "base64";
        const base64Data = Buffer.from(fileBuffer).toString("base64");

        // Construct the data URI
        const fileUri = `data:${mimeType};${encoding},${base64Data}`;

        const res = await uploadToCloudinary(fileUri, file.name);

        if (res.success && res.result) {
            console.log(res.result)
            return NextResponse.json({
                message: "success",
                imgUrl: res.result.secure_url,
            });
        } else {
            return NextResponse.json(
                { message: "failure", error: res.error },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred", error: error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json(
                { message: "Image URL is required" },
                { status: 400 }
            );
        }

        // Extract public ID from Cloudinary URL
        const publicId = extractPublicId(imageUrl);

        if (!publicId) {
            return NextResponse.json(
                { message: "Invalid Cloudinary URL" },
                { status: 400 }
            );
        }

        // Delete the asset from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'image'
        });

        if (result.result === 'ok') {
            return NextResponse.json({
                message: "Image deleted successfully",
            });
        } else {
            return NextResponse.json(
                { message: "Failed to delete image", error: result.result },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { message: "An error occurred while deleting the image" },
            { status: 500 }
        );
    }
}

// Helper function to extract public ID from Cloudinary URL
function extractPublicId(url: string): string | null {
    // Cloudinary URL pattern:
    // https://res.cloudinary.com/<cloud_name>/image/upload/<version>/<public_id>.<format>
    const matches = url.match(/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|gif|webp)/i);

    if (matches && matches[1]) {
        return matches[1];
    }
    return null;
}

export const runtime = 'nodejs';

