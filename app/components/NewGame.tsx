import { redirect } from 'next/navigation'
import GameForm from './GameForm'
import { getCurrentUser } from '@/lib/dal'

const NewGame = async()=>{
    const user = await getCurrentUser()

    if(!user){
        redirect('/signin')
    }

    return <GameForm userId={user.id} />
}

export default NewGame