import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Eye, Download, Trash2, Image as ImageIcon, File, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  supabaseUrl?: string
  localPath?: string
  altText?: string
  caption?: string
}

interface MediaUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void
  acceptedFileTypes?: string[]
  maxFiles?: number
  folder?: string
  className?: string
}

export function MediaUpload({ 
  onFilesUploaded,
  acceptedFileTypes = ["image/*", "video/*"],
  maxFiles = 10,
  folder = "general",
  className 
}: MediaUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadMode, setUploadMode] = useState<"supabase" | "local">("supabase")
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsUploading(true)

    // Upload files
    for (const uploadFile of newFiles) {
      try {
        if (uploadMode === "supabase") {
          await uploadToSupabase(uploadFile)
        } else {
          await uploadToLocal(uploadFile)
        }
      } catch (error) {
        console.error("Upload error:", error)
        updateFileStatus(uploadFile.id, 'error')
        toast.error(`Failed to upload ${uploadFile.file.name}`)
      }
    }

    setIsUploading(false)
    onFilesUploaded?.(uploadedFiles.filter(f => f.status === 'completed'))
  }, [uploadMode, onFilesUploaded, uploadedFiles])

  const uploadToSupabase = async (uploadFile: UploadedFile) => {
    const { file } = uploadFile
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 90) }
          : f
      ))
    }, 500)

    try {
      const { data, error } = await supabase.storage
        .from('media-library')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath)

      // Save to media table
      const { error: dbError } = await supabase
        .from('media')
        .insert({
          filename: fileName,
          original_filename: file.name,
          file_url: publicUrl,
          file_type: file.type.split('/')[0],
          mime_type: file.type,
          file_size: file.size,
          folder: folder
        })

      if (dbError) throw dbError

      updateFileStatus(uploadFile.id, 'completed', publicUrl)
      toast.success(`${file.name} uploaded successfully`)

    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  const uploadToLocal = async (uploadFile: UploadedFile) => {
    // Simulate local upload (for demo purposes)
    // In a real app, this would upload to your local server
    
    const progressInterval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: Math.min(f.progress + Math.random() * 25, 90) }
          : f
      ))
    }, 300)

    // Simulate upload time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    clearInterval(progressInterval)
    
    const localPath = `/uploads/${folder}/${uploadFile.file.name}`
    updateFileStatus(uploadFile.id, 'completed', undefined, localPath)
    toast.success(`${uploadFile.file.name} uploaded to local storage`)
  }

  const updateFileStatus = (
    id: string, 
    status: UploadedFile['status'], 
    supabaseUrl?: string, 
    localPath?: string
  ) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === id 
        ? { 
            ...file, 
            status, 
            progress: status === 'completed' ? 100 : file.progress,
            supabaseUrl,
            localPath
          }
        : file
    ))
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const updateFileMetadata = (id: string, field: 'altText' | 'caption', value: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    disabled: isUploading
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Mode Selection */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="upload-mode">Upload to:</Label>
        <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "supabase" | "local")}>
          <TabsList>
            <TabsTrigger value="supabase">Supabase Storage</TabsTrigger>
            <TabsTrigger value="local">Local Folder</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center space-y-4 py-8 px-4 cursor-pointer transition-colors rounded-lg",
              isDragActive ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-2">
              {isUploading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
              <div className="text-center">
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse • Max {maxFiles} files • Images & Videos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Will upload to: {uploadMode === "supabase" ? "Supabase Storage" : "Local Folder"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files ({uploadedFiles.length})</h3>
          <div className="grid gap-4">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-start space-x-4">
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate max-w-xs">{file.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.file.size)} • {file.file.type}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            file.status === 'completed' ? 'default' : 
                            file.status === 'error' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {file.status === 'uploading' ? 'Uploading...' : 
                           file.status === 'completed' ? 'Completed' : 'Error'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="w-full" />
                    )}

                    {/* File URLs */}
                    {file.status === 'completed' && (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          {uploadMode === "supabase" && file.supabaseUrl && (
                            <p>Supabase URL: <code className="bg-muted px-1 rounded">{file.supabaseUrl}</code></p>
                          )}
                          {uploadMode === "local" && file.localPath && (
                            <p>Local Path: <code className="bg-muted px-1 rounded">{file.localPath}</code></p>
                          )}
                        </div>
                        
                        {/* Metadata inputs for images */}
                        {file.file.type.startsWith('image/') && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`alt-${file.id}`} className="text-xs">Alt Text</Label>
                              <Input
                                id={`alt-${file.id}`}
                                placeholder="Describe the image..."
                                value={file.altText || ''}
                                onChange={(e) => updateFileMetadata(file.id, 'altText', e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`caption-${file.id}`} className="text-xs">Caption</Label>
                              <Input
                                id={`caption-${file.id}`}
                                placeholder="Image caption..."
                                value={file.caption || ''}
                                onChange={(e) => updateFileMetadata(file.id, 'caption', e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}