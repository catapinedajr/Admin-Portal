import { useState, useRef } from "react";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface S3ImageUploadProps {
  value: string;
  onChange: (url: string, key?: string) => void;
  category: "advertisers" | "social-media" | "content" | "store" | "misc";
  label?: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function S3ImageUpload({
  value,
  onChange,
  category,
  label = "Image",
  placeholder = "Enter image URL or upload",
  accept = "image/*",
  maxSizeMB = 5,
}: S3ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const checkS3Status = async () => {
    try {
      const res = await apiRequest("GET", "/api/admin/media/s3-status");
      const data = await res.json();
      setS3Configured(data.configured);
      return data.configured;
    } catch {
      setS3Configured(false);
      return false;
    }
  };

  const handleUploadClick = async () => {
    const configured = await checkS3Status();
    if (!configured) {
      toast({
        title: "S3 Not Configured",
        description: "AWS S3 is not configured. Please add AWS credentials in secrets.",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const res = await apiRequest("POST", "/api/admin/media/presigned-upload", {
        filename: file.name,
        contentType: file.type,
        category,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to get upload URL");
      }

      const { uploadUrl, publicUrl, key } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      onChange(publicUrl, key);
      toast({
        title: "Upload Complete",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("", undefined);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-zinc-400">{label}</Label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-zinc-700/50 border-zinc-600 text-white flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="border-zinc-600 hover:bg-zinc-700"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="border-zinc-600 hover:bg-zinc-700 text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {value && (
        <div className="relative mt-2 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

export default S3ImageUpload;
