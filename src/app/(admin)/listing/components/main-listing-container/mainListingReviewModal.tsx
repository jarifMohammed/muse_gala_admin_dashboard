/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useEffect, useState, ChangeEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, X, ImageIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  open: boolean
  onClose: () => void
  dressId: string | null
}

interface ShippingDetails {
  isLocalPickup?: boolean
  isShippingAvailable?: boolean
}

interface MasterDressData {
  _id: string
  masterDressId: string
  dressName: string
  lenderIds?: string[]
  listingIds?: string[]
  brand?: string
  sizes?: string[]
  colors?: string[]
  occasions?: string[]
  basePrice?: number
  insuranceFee?: number
  rrpPrice?: number
  thumbnail?: string
  media?: string[]
  shippingDetails?: ShippingDetails
  isActive?: boolean
  slug?: string
  createdAt?: string
  updatedAt?: string
}

interface MediaItem {
  url: string
  isNew: boolean
  file?: File
}

export default function MainListingReviewModal({
  open,
  onClose,
  dressId,
}: Props) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<MasterDressData | null>(null)

  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [isThumbnailChanged, setIsThumbnailChanged] = useState(false)

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  // ---------------- FETCH DATA ----------------
  const {
    data: masterData,
    isLoading,
    isError,
  } = useQuery<MasterDressData>({
    queryKey: ['master-dress', dressId],
    enabled: !!dressId && open,
    queryFn: async (): Promise<MasterDressData> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dress/${dressId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch master dress data')
      const json = await res.json()
      return json.data as MasterDressData
    },
    retry: false,
  })

  useEffect(() => {
    if (masterData) {
      setFormData(masterData)
      setThumbnailPreview(masterData.thumbnail || '')
      setThumbnailFile(null)
      setIsThumbnailChanged(false)

      // Initialize media items
      const existingMedia: MediaItem[] = (masterData.media || []).map(
        (url) => ({
          url,
          isNew: false,
        })
      )
      setMediaItems(existingMedia)
    }
  }, [masterData])

  const updateMutation = useMutation({
    mutationFn: async (updatedData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master/${formData?.masterDressId}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: updatedData,
        }
      )
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update master dress')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-dress', dressId] })
      queryClient.invalidateQueries({ queryKey: ['main-listing'] })
      toast.success('Master Dress updated successfully')
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Update failed')
    },
  })

  const handleChange = (field: keyof MasterDressData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  // ---------------- THUMBNAIL ----------------
  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }

    const preview = URL.createObjectURL(file)
    setThumbnailPreview(preview)
    setThumbnailFile(file)
    setIsThumbnailChanged(true)
  }

  // ---------------- MEDIA ----------------
  // Component-এর বাইরে বা উপরে define করো না, function-এর ভিতরে রাখো
  let lastUploadTime = 0

  const handleMediaUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const now = Date.now()
    // 🧠 যদি 500ms এর মধ্যে আবার trigger হয়, তাহলে ignore করো
    if (now - lastUploadTime < 500) return
    lastUploadTime = now

    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return

    if (mediaItems.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      e.target.value = ''
      return
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`)
        e.target.value = ''
        return
      }
    }

    const newItems: MediaItem[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }))

    setMediaItems((prev) => [...prev, ...newItems])
    e.target.value = ''
  }

  const handleRemoveMedia = (index: number) => {
    const item = mediaItems[index]
    if (item.isNew && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url)
    }
    setMediaItems((prev) => prev.filter((_, i) => i !== index))
  }

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (!formData) return

    const fd = new FormData()

    // --- BASIC INFO ---
    fd.append('masterDressId', formData.masterDressId)
    fd.append('dressName', formData.dressName)

    if (formData.brand) fd.append('brand', formData.brand)
    if (formData.basePrice !== undefined)
      fd.append('basePrice', String(formData.basePrice))
    if (formData.insuranceFee !== undefined)
      fd.append('insuranceFee', String(formData.insuranceFee))
    if (formData.rrpPrice !== undefined)
      fd.append('rrpPrice', String(formData.rrpPrice))

    if (formData.shippingDetails) {
      fd.append(
        'shippingDetails[isLocalPickup]',
        String(formData.shippingDetails.isLocalPickup || false)
      )
      fd.append(
        'shippingDetails[isShippingAvailable]',
        String(formData.shippingDetails.isShippingAvailable || false)
      )
    }

    if (formData.isActive !== undefined)
      fd.append('isActive', String(formData.isActive))

    // --- THUMBNAIL ---
    if (isThumbnailChanged && thumbnailFile) {
      fd.append('thumbnail', thumbnailFile)
    }

    // --- MEDIA HANDLING (Fixed ✅) ---
    const existingMediaUrls = mediaItems
      .filter((item) => !item.isNew) // শুধু পুরনোগুলো
      .map((item) => item.url)

    const newMediaFiles = mediaItems
      .filter((item) => item.isNew && item.file) // শুধু নতুন ফাইল
      .map((item) => item.file as File)

    // ✅ শুধুমাত্র পুরনো মিডিয়া URL গুলো stringify করে পাঠানো হবে
    fd.append('media', JSON.stringify(existingMediaUrls))

    // ✅ নতুন আপলোড করা ফাইলগুলো mediaUpload নামে পাঠানো হবে
    newMediaFiles.forEach((file) => {
      fd.append('mediaUpload', file)
    })

    // --- SUBMIT ---
    updateMutation.mutate(fd)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] py-2 overflow-hidden font-sans font-light text-gray-700">
        <ScrollArea className="h-[90vh] px-6 py-6 space-y-6 pb-20">
          <DialogHeader>
            <div className="flex justify-center my-6">
              <Image src="/logo.png" alt="logo" width={60} height={60} />
            </div>
            <DialogTitle className="text-2xl font-light text-start mb-4 pb-5">
              Listings Review
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">Failed to load data.</p>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ['master-dress', dressId],
                  })
                }
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : formData ? (
            <div className="space-y-8">
              {/* Active Status */}
              <div className="flex items-center justify-between py-5 border-b">
                <span className="font-medium text-base">Active Status</span>
                <Switch
                  checked={!!formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange('isActive', Boolean(checked))
                  }
                />
              </div>

              {/* IDs Section */}
              <div className="grid grid-cols-1 gap-4 border-b pb-6">
                <div>
                  <label className="font-medium block mb-2">
                    Master Dress ID
                  </label>
                  <Input
                    value={formData.masterDressId}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Slug</label>
                  <Input
                    value={formData.slug || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Listing IDs</label>
                  <Input
                    value={formData.listingIds?.join(', ') || 'No listings'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Lender IDs</label>

                  <Select value={formData.lenderIds?.[0] ?? ''}>
                    <SelectTrigger className="w-full bg-gray-50">
                      <SelectValue placeholder="No lenders" />
                    </SelectTrigger>

                    <SelectContent>
                      {formData.lenderIds?.length ? (
                        formData.lenderIds.map((id) => (
                          <SelectItem key={id} value={id}>
                            {id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="">
                          No lenders
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Occasions */}
              <div>
                <label className="font-medium block mb-2">Occasions</label>
                <Input
                  value={formData.occasions?.join(', ') || 'Not specified'}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Sizes - READ ONLY */}
              <div>
                <label className="font-medium block mb-2">Sizes</label>
                <Input
                  value={formData.sizes?.join(', ') || 'Not specified'}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Colors - READ ONLY */}
              <div>
                <label className="font-medium block mb-2">Colors</label>
                <Input
                  value={formData.colors?.join(', ') || 'Not specified'}
                  disabled
                  className="bg-gray-50"
                />
                {formData.colors && formData.colors.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {formData.colors.map((clr, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: clr }}
                          title={clr}
                        />
                        <span className="text-xs text-gray-500">{clr}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Base Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.basePrice ?? ''}
                    onChange={(e) =>
                      handleChange('basePrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Insurance Fee ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.insuranceFee ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'insuranceFee',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    RRP Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.rrpPrice ?? ''}
                    onChange={(e) =>
                      handleChange('rrpPrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="border-t pt-6">
                <label className="font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Thumbnail
                </label>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {isThumbnailChanged
                        ? 'Change Thumbnail'
                        : 'Upload Thumbnail'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                  {thumbnailPreview && (
                    <div className="relative w-40 h-40 group">
                      <Image
                        src={thumbnailPreview}
                        alt="thumbnail"
                        fill
                        className="rounded-md border object-cover"
                      />
                      {isThumbnailChanged && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Media Gallery */}
              <div className="border-t pt-6">
                <label className="font-medium mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Media Gallery (
                  {mediaItems.length}/10)
                </label>
                <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Upload New Images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleMediaUpload}
                    disabled={mediaItems.length >= 10}
                  />
                </label>
                {mediaItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {mediaItems.map((item, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <Image
                          src={item.url}
                          alt={`media-${idx}`}
                          fill
                          className="rounded-md border object-cover"
                        />
                        <button
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {idx + 1}
                        </div>
                        {item.isNew && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Details */}
              <div className="flex flex-col gap-4 border-t pt-6">
                <label className="font-medium mb-2">Shipping Options</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!formData.shippingDetails?.isLocalPickup}
                    onChange={(e) =>
                      handleChange('shippingDetails', {
                        ...formData.shippingDetails,
                        isLocalPickup: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Local Pickup Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!formData.shippingDetails?.isShippingAvailable}
                    onChange={(e) =>
                      handleChange('shippingDetails', {
                        ...formData.shippingDetails,
                        isShippingAvailable: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Shipping Available</span>
                </label>
              </div>

              {/* Save Buttons */}
              <div className="flex justify-start gap-4 mt-8 mb-5 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={updateMutation.isPending}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="min-w-[100px]"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No data found.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
