'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Game, GAME_STATUS, PRIMARY_OBJECTIVE, SECONDARY_OBJECTIVE, ADVANTAGE} from '@/db/schema'
import Button from './ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormError,
} from './ui/Form'
import { createGame, updateGame, ActionResponse } from '@/app/actions/games'

interface GameFormProps {
  game?: Game
  userId: string
  isEditing?: boolean
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export default function GameForm({
  game,
  userId,
  isEditing = false,
}: GameFormProps) {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    // Extract data from form
const data = {
  title: formData.get('title') as string,
  status: formData.get('status') as 'new' | 'in_progress' | 'done',
  primaryObjective: formData.get('primaryObjective') as
    | 'bunker_assault'
    | 'breakthrough'
    | 'close_the_pocket'
    | 'intercept_the_signals'
    | 'recover_the_research'
    | 'shifting_priorities',
  secondaryObjective: formData.get('secondaryObjective') as
    | 'bring_them_to_heel'
    | 'surface_scan'
    | 'marked_targets'
    | 'recon_mission'
    | 'sweep_and_clear',
  advantage: formData.get('advantage') as
    | 'advanced_intel'
    | 'cunning_deployment'
    | 'fortified_position'
    | 'garrison'
    | 'ordnance'
    | 'strafing_run',
  userId,
}

    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing
        ? await updateGame(Number(game!.id), data)
        : await createGame(data)

      // Handle successful submission
      if (result.success) {
        router.refresh()
        if (!isEditing) {
          router.push('/dashboard')
        }
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  const statusOptions = Object.values(GAME_STATUS).map(({ label, value }) => ({
    label,
    value,
  }))

  const primaryObjectiveOptions = Object.values(PRIMARY_OBJECTIVE).map(
    ({ label, value }) => ({
      label,
      value,
    })) 

    const secondaryObjectiveOptions = Object.values(SECONDARY_OBJECTIVE).map(
      ({ label, value }) => ({
        label,
        value,
      }))

      const advantageOptions = Object.values(ADVANTAGE).map(
        ({ label, value }) => ({
          label,
          value,
        })) 

  return (
    <Form action={formAction}>
      {state?.message && (
        <FormError
          className={`mb-4 ${
            state.success ? 'bg-green-100 text-green-800 border-green-300' : ''
          }`}
        >
          {state.message}
        </FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="title">Title</FormLabel>
        <FormInput
          id="title"
          name="title"
          placeholder="Game Title"
          defaultValue={game?.title || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            defaultValue={game?.status || 'new'}
            options={statusOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
            </p>
          )}
        </FormGroup>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="primaryObjective">Primary Objective</FormLabel>
          <FormSelect
            id="primaryObjective"
            name="primaryObjective"
            defaultValue={game?.primaryObjective || 'Bunker Assault'}
            options={primaryObjectiveOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
            </p>
          )}
        </FormGroup>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="secondaryObjective">Secondary Objective</FormLabel>
          <FormSelect
            id="secondaryObjective"
            name="secondaryObjective"
            defaultValue={game?.secondaryObjective|| 'Bring them to heel'}
            options={secondaryObjectiveOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
            </p>
          )}
        </FormGroup>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel htmlFor="advantage">Advantage</FormLabel>
          <FormSelect
            id="advantage"
            name="advantage"
            defaultValue={game?.advantage || 'Advanced Intel'}
            options={advantageOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
            </p>
          )}
        </FormGroup>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Game' : 'Create Game'}
        </Button>
      </div>
    </Form>
  )
}