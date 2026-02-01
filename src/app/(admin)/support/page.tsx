import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import HeaderCards from './_components/HeaderCards'
import SupportTable from './_components/supportTable'

const Page = async () => {
  const cu = await auth()
  if (!cu?.user) redirect('/sign-in')

  const accessToken = cu.user.accessToken
  console.log(accessToken)

  return (
    <div className="space-y-10">
      <HeaderCards />
      <SupportTable />
    </div>
  )
}

export default Page
