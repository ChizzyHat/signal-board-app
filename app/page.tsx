import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './sign-out-button'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: config, error: configError } = await supabase
    .from('user_config')
    .select('*')
    .eq('user_id', user.id)
    .single()

  //console.log('Config query result:', { config, error: configError, userId: user.id })

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Signal Board</h1>
          <SignOutButton />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4 text-sm">
          <p className="text-gray-400">Signed in as</p>
          <p className="font-mono">{user.email}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4">
          <p className="text-sm text-gray-400 mb-2">Your config loaded:</p>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <p className="text-xs text-gray-500">
          Next: migrate your accounts from GitHub to Supabase.
        </p>
      </div>
    </div>
  )
}