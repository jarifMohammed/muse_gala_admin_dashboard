/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  data: any
}

const DocumentsTab = ({ data }: Props) => {
  const getStatusBadge = () => {
    if (data.kycVerified && data.kycStatus === 'approved') {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-light font-sans">Documents</CardTitle>
          {getStatusBadge()}
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-medium mb-1">Driver&apos;s License</p>
              <p className="text-gray-500 text-xs">
                {data.kycVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>

            <div className="border-b pb-3">
              <p className="font-medium mb-1">ABN</p>
              <p className="text-gray-600">
                {data.abnNumber || 'Not provided'}
              </p>
            </div>

            <div className="border-b pb-3">
              <p className="font-medium mb-1">Bank Account</p>
              <p className="text-gray-600">
                {data.stripeAccountId ? 'Connected' : 'Not connected'}
              </p>
            </div>

            <div className="pb-3">
              <p className="font-medium mb-1">Pickup Address</p>
              <p className="text-gray-600">
                {data.address || data.businessAddress || 'Not provided'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentsTab
