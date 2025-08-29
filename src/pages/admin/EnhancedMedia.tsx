import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MediaUpload } from "@/components/MediaUpload"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Upload, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Copy,
  Trash2,
  Edit,
  Image as ImageIcon,
  Video,
  FileText,
  Archive
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function EnhancedMedia() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [selectedFileType, setSelectedFileType] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['media-files', searchTerm, selectedFolder, selectedFileType],
    queryFn: async () => {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(`filename.ilike.%${searchTerm}%,original_filename.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%`)
      }

      if (selectedFolder !== 'all') {
        query = query.eq('folder', selectedFolder)
      }

      if (selectedFileType !== 'all') {
        query = query.eq('file_type', selectedFileType)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] })
      toast.success("File deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete file")
    }
  })

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = (id: string, filename: string) => {
    if (confirm(`Are you sure you want to delete "${filename}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const folders = [...new Set(mediaFiles?.map(f => f.folder) || [])].filter(Boolean)
  const fileTypes = [...new Set(mediaFiles?.map(f => f.file_type) || [])].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Enhanced media management with dual upload system and advanced organization
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Media Files</DialogTitle>
              <DialogDescription>
                Upload files to Supabase Storage or Local folder with metadata and optimization
              </DialogDescription>
            </DialogHeader>
            <MediaUpload
              onFilesUploaded={(files) => {
                queryClient.invalidateQueries({ queryKey: ['media-files'] })
                setIsUploadDialogOpen(false)
                toast.success(`${files.length} files uploaded successfully`)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Folder Filter */}
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Folders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* File Type Filter */}
              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center space-x-2">
                        {getFileIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{mediaFiles?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {mediaFiles?.filter(f => f.file_type === 'image').length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {mediaFiles?.filter(f => f.file_type === 'video').length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{folders.length}</p>
                <p className="text-xs text-muted-foreground">Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Files */}
      <Card>
        <CardHeader>
          <CardTitle>Media Files</CardTitle>
          <CardDescription>
            {searchTerm && `Showing results for "${searchTerm}" • `}
            {mediaFiles?.length || 0} files
            {selectedFolder !== 'all' && ` in "${selectedFolder}"`}
            {selectedFileType !== 'all' && ` • ${selectedFileType} files only`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading media files...</div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaFiles?.map((file) => (
                <Card key={file.id} className="group hover:shadow-md transition-shadow">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {file.file_type === 'image' ? (
                      <img
                        src={file.file_url}
                        alt={file.alt_text || file.original_filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        {getFileIcon(file.file_type)}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {file.file_type.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(file.file_url, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Size
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyUrl(file.file_url)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadFile(file.file_url, file.original_filename)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file.id, file.original_filename)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" title={file.original_filename}>
                        {file.original_filename}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.folder}
                        </Badge>
                      </div>
                      {file.alt_text && (
                        <p className="text-xs text-muted-foreground truncate" title={file.alt_text}>
                          {file.alt_text}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mediaFiles?.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {file.file_type === 'image' ? (
                      <img
                        src={file.file_url}
                        alt={file.alt_text || file.original_filename}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(file.file_type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{file.original_filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.file_size || 0)}</span>
                      <span>{file.mime_type}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.folder}
                      </Badge>
                    </div>
                    {file.alt_text && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {file.alt_text}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => copyUrl(file.file_url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => window.open(file.file_url, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadFile(file.file_url, file.original_filename)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id, file.original_filename)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!mediaFiles || mediaFiles.length === 0) && (
            <div className="text-center py-12">
              <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No media files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? `No files found matching "${searchTerm}"` : "Upload your first media files to get started"}
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}