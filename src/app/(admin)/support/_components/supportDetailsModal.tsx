'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Image from 'next/image'
import { Ticket } from './supportTable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// ---- PATCH API ----
async function updateSupportTicket(
  id: string,
  accessToken: string,
  payload: { response: string; status: string; priority: string }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) throw new Error('Failed to update ticket')
  return res.json()
}

export function SupportDetailsPopup({
  id,
  children,
  data,
}: {
  id: string
  children: React.ReactNode
  data: Ticket
}) {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''
  const queryClient = useQueryClient()

  const [status, setStatus] = useState(data.status)
  const [priority, setPriority] = useState(data.priority)
  const [response, setResponse] = useState('')

  // --- useMutation ---
  const mutation = useMutation({
    mutationFn: (payload: {
      response: string
      status: string
      priority: string
    }) => updateSupportTicket(id, accessToken, payload),
    onSuccess: () => {
      // cache refresh
      queryClient.invalidateQueries({
        queryKey: ['support-stats', accessToken],
      })
      queryClient.invalidateQueries({ queryKey: ['support-ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets', accessToken] })

      toast.success(' Ticket updated successfully!')
    },
    onError: () => {
      toast.error(' Failed to update ticket')
    },
  })

  const handleSave = () => {
    mutation.mutate({ response, status, priority })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto p-3 py-8 space-y-4 font-sans">
        {/* Header */}
        <DialogHeader>
          <div className="flex justify-center mb-7 mt-6">
            <Image
              src="/logo.png"
              alt="Support Ticket"
              width={100}
              height={100}
              priority
              className="object-contain"
              quality={100}
            />
          </div>
          <div className="flex justify-start">
            <span className="text-lg font-light tracking-wider">
              <strong className="font-medium">Transaction Details:</strong> {id}
            </span>
          </div>
        </DialogHeader>

        {/* Ticket Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light tracking-wider">
              Ticket Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 font-light tracking-wider">
            <p>
              <strong className="font-medium">Ticket ID:</strong> {id}
            </p>
            <p>
              <strong className="font-medium">User ID:</strong>{' '}
              {data?.user?._id || 'Guest'}
            </p>
            <p>
              <strong className="font-medium">Issue Type:</strong>{' '}
              {data?.issueType || 'N/A'}
            </p>
            <p>
              <strong className="font-medium">Status:</strong> {status}
            </p>
            <p>
              <strong className="font-medium">Priority:</strong> {priority}
            </p>
            <p>
              <strong className="font-medium">Created Date:</strong>{' '}
              {new Date(data?.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p>
              <strong className="font-medium">Description:</strong>{' '}
              {data?.message || 'N/A'}
            </p>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write response text..."
              rows={10}
            />
          </CardContent>
        </Card>

        {/* Update Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as 'pending' | 'in-progress' | 'resolved')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Update Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as 'low' | 'medium' | 'high')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="secondary">Download Report</Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
