import { InfoCard } from '@/components/cards/stat-card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const LenderHeader = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[20%]">Manage Lenders</h1>
        <Button>
          Download Report <Download />
        </Button>
      </div>

      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <InfoCard title="Total Lenders" value="500" />
        <InfoCard title="Active Lenders" value="450" />
        <InfoCard title="Pending Applications" value="50" />
        <InfoCard title="Approved Lenders" value="400" />
      </div>
    </div>
  )
}

export default LenderHeader
