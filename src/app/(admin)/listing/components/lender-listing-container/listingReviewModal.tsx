'use client'

import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
  listingId: string | null
}

export default function ListingReviewModal({
  open,
  onClose,
  listingId,
}: Props) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  // Fetch listing data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lender-listing', listingId],
    enabled: !!listingId && open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${listingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch listing data')
      return res.json()
    },
  })

  const listing = data?.data

  // --- Approve/Reject Mutation ---
  const statusMutation = useMutation({
    mutationFn: async (newStatus: 'approved' | 'rejected') => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/${listing._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ approvalStatus: newStatus }),
        }
      )
      if (!res.ok) throw new Error(`Failed to update status to ${newStatus}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-listing'] })
      toast.success('Listing status updated successfully')
      onClose()
    },
  })

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[90vh] py-6 overflow-hidden font-sans text-gray-600">
        <ScrollArea className="h-[90vh] px-6 py-6">
          <DialogHeader>
            <div className="flex justify-center my-8">
              <Image
                src={'/logo.png'}
                alt="modal-Alert"
                width={70}
                height={70}
              />
            </div>
            <DialogTitle className="text-2xl font-light tracking-wide mb-6 pb-8 ">
              Review Submission:{' '}
              <span className="font-normal">
                {listing?.dressId?.slice(0, 20) ?? '#####'}
              </span>
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <p className="text-gray-600 text-base">Loading...</p>
          ) : isError ? (
            <p className="text-red-500 text-base">Failed to load data</p>
          ) : listing ? (
            <div className="space-y-8 text-base">
              {/* ID fields */}
              <div>
                <label className="font-medium">Submission ID</label>
                <input
                  value={listing._id}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              <div>
                <label className="font-medium">Lender Name</label>
                <input
                  value={listing.lenderId?.fullName ?? ''}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              <div>
                <label className="font-medium">Dress Name</label>
                <input
                  value={listing.dressName}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              <div>
                <label className="font-medium">Brand</label>
                <input
                  value={listing.brand}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="font-medium">Sizes</label>
                <input
                  value={
                    Array.isArray(listing.size)
                      ? listing.size.join(', ')
                      : listing.size ?? ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Color */}
              <div>
                <label className="font-medium">Color</label>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: listing.colour }}
                  />
                  <input
                    value={listing.colour}
                    readOnly
                    className="flex-1 border rounded px-3 py-2 bg-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-medium">Description</label>
                <textarea
                  value={listing.description}
                  readOnly
                  rows={4}
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Media */}
              <div>
                <label className="font-medium">Media</label>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {listing.media?.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="w-28 h-32 relative rounded overflow-hidden border"
                    >
                      <Image
                        src={img}
                        alt={`media-${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Price (4 Days)</label>
                  <input
                    value={`$${listing.rentalPrice?.fourDays ?? 0}`}
                    readOnly
                    className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-medium">Price (8 Days)</label>
                  <input
                    value={`$${listing.rentalPrice?.eightDays ?? 0}`}
                    readOnly
                    className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                  />
                </div>
              </div>

              {/* Pickup Option */}
              <div>
                <label className="font-medium">Pickup Options</label>
                <input
                  value={
                    Array.isArray(listing.pickupOption)
                      ? listing.pickupOption.join(', ')
                      : listing.pickupOption ?? ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Occasion */}
              <div>
                <label className="font-medium">Occasion</label>
                <input
                  value={
                    Array.isArray(listing.occasion)
                      ? listing.occasion.join(', ')
                      : listing.occasion ?? ''
                  }
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Insurance */}
              <div>
                <label className="font-medium">Insurance</label>
                <input
                  value={listing.insurance ? 'Yes' : 'No'}
                  readOnly
                  className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start gap-4 pt-6 pb-8">
                <Button
                  onClick={() => statusMutation.mutate('approved')}
                  disabled={statusMutation.isPending}
                  className="px-8 py-2 text-base"
                >
                  {statusMutation.isPending ? 'Processing...' : 'Approve'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => statusMutation.mutate('rejected')}
                  disabled={statusMutation.isPending}
                  className="px-8 py-2 text-base text-red-600 border-red-500 hover:bg-red-100 hover:text-gray-800 "
                >
                  {statusMutation.isPending ? 'Processing...' : 'Reject'}
                </Button>
              </div>
            </div>
          ) : (
            <p>No data found.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
