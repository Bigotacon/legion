'use server'
import { db } from '@/db'
import { games } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/dal'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'
// Define Zod schema for issue validation

const GameSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less thatn 100 characters'),

    status: z.enum(['new', 'in_progress', 'done'],'Please select a valid status' ),
    primaryObjective: z.enum(['bunker_assault', 'breakthrough', 'close_the_pocket', 'intercept_the_signals', 'recover_the_research', 'shifting_priorities'], 'Please select a valid primary objective'),
    secondaryObjective: z.enum(['bring_them_to_heel', 'surface_scan', 'marked_targets', 'recon_mission', 'sweep_and_clear'], 'Please select a valid secondary objective'),
    advantage: z.enum(['advanced_intel', 'cunning_deployment', 'fortified_position', 'garrison', 'ordnance', 'strafing_run'], 'Please select a valid advantage'),

    userId: z.string().min(1, 'User ID is required')

})

export type GameData = z.infer<typeof GameSchema>

export type ActionResponse = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
    error?: string
}

export async function createGame(data: GameData): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Validate with Zod
    const validationResult = GameSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create issue with validated data
    const validatedData = validationResult.data
    await db.insert(games).values({
      title: validatedData.title,
      primaryObjective: validatedData.primaryObjective,
      secondaryObjective: validatedData.secondaryObjective,
      advantage: validatedData.advantage,
      status: validatedData.status,
      userId: validatedData.userId,
    })

    revalidateTag('games')

    return { success: true, message: 'Issue created successfully' }
  } catch (error) {
    console.error('Error creating issue:', error)
    return {
      success: false,
      message: 'An error occurred while creating the issue',
      error: 'Failed to create issue',
    }
  }
}

export async function updateGame(
  id: number,
  data: Partial<GameData>
): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Allow partial validation for updates
    const UpdateGameSchema = GameSchema.partial()
    const validationResult = UpdateGameSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Type safe update object with validated data
    const validatedData = validationResult.data
    const updateData: Record<string, unknown> = {}

    if (validatedData.title !== undefined)
      updateData.title = validatedData.title
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status
    if (validatedData.primaryObjective !== undefined)
      updateData.primaryObjective = validatedData.primaryObjective
    if (validatedData.secondaryObjective !== undefined)
      updateData.secondaryObjective = validatedData.secondaryObjective
    if (validatedData.advantage !== undefined)
      updateData.advantage = validatedData.advantage

    // Update issue
    await db.update(games).set(updateData).where(eq(games.id, id))

    return { success: true, message: 'Issue updated successfully' }
  } catch (error) {
    console.error('Error updating issue:', error)
    return {
      success: false,
      message: 'An error occurred while updating the issue',
      error: 'Failed to update issue',
    }
  }
}

export async function deleteGame(id: number) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Delete issue
    await db.delete(games).where(eq(games.id, id))

    return { success: true, message: 'Issue deleted successfully' }
  } catch (error) {
    console.error('Error deleting issue:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the issue',
      error: 'Failed to delete issue',
    }
  }
}