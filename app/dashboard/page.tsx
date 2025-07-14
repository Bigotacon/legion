import { getCurrentUser, getGames } from '@/lib/dal'
import Link from 'next/link'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { Status, PrimaryObjective, SecondaryObjective, Advantage } from '@/lib/types'
import { Game, GAME_STATUS, PRIMARY_OBJECTIVE, SECONDARY_OBJECTIVE, ADVANTAGE} from '@/db/schema'

export default async function DashboardPage() {
  await getCurrentUser()
  const games = await getGames()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Games</h1>
        <Link href="/games/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New game
            </span>
          </Button>
        </Link>
      </div>

      {games.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Objective</div>
            <div className="col-span-2">Secondary</div>
            <div className="col-span-1">Created</div>
          </div>

          {/* game rows */}
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {games.map((game: Game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-3 font-medium truncate">
                    {game.title}
                  </div>
                  <div className="col-span-2">
                    <Badge status={game.status as Status}>
                      {GAME_STATUS[game.status as keyof typeof GAME_STATUS].label}
                    </Badge>
                  </div>
                  <div className="col-span-2 font-medium truncate">
                    {game.primaryObjective as PrimaryObjective}
                  </div>
                  <div className="col-span-2 font-medium truncate">
                    {game.secondaryObjective as SecondaryObjective}
                  </div>
                  <div className="col-span-1 text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(game.createdAt))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          <h3 className="text-lg font-medium mb-2">No games found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first game.
          </p>
          <Link href="/games/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Create game
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}