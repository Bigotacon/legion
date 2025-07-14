import { getGame } from '@/lib/dal'
import { formatRelativeTime } from '@/lib/utils'
import { Status } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react'
import DeleteGameButton from '../../components/DeleteGameButton'

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const game = await getGame(parseInt(id))

  if (!game) {
    notFound()
  }

  const { title, status, createdAt, updatedAt, user } =
    game

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New'
      case 'in_progress':
        return 'In Progress'
      case 'done':
        return 'Done'
      default:
        return status
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Games
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2">
            <Link href={`/games/${id}/edit`}>
              <Button variant="outline" size="sm">
                <span className="flex items-center">
                  <Edit2Icon size={16} className="mr-1" />
                  Edit
                </span>
              </Button>
            </Link>
            <DeleteGameButton id={parseInt(id)} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
          <div className="text-sm text-gray-500">
            Created {formatRelativeTime(new Date(createdAt))}
          </div>
          {updatedAt !== createdAt && (
            <div className="text-sm text-gray-500">
              Updated {formatRelativeTime(new Date(updatedAt))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-2">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Assigned to</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Primary Objective</p>
            <p>{game.primaryObjective}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Secondary Objective</p>
            <p>{game.secondaryObjective}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Advantage</p>
            <p>{game.advantage}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
            <p>{formatRelativeTime(new Date(createdAt))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}