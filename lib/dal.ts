// Copyright 2025 Josh
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { db } from '@/db'
import { getSession } from "./auth"
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { users, games } from '@/db/schema'
//import { cacheTag } from 'next/cache'

export const getCurrentUser = cache(async()=>{
    const session = await getSession()
    if(!session) return null

    if (
        typeof window === 'undefined' &&
        process.env.NEXT_PHASE  === 'phase-production-build'
    ){
        return null
    }
    try{
        const result = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))

        return result[0] || null

    } catch(error){
        console.error('Error getting user by ID:', error)
    }
    })

    export const getUserByEmail = cache(async (email: string) => {
        try{
            const result = await db.select().from(users).where(eq(users.email, email))
            return result[0] || null
        } catch(error){
            console.error("Error getting user by email:", error)
            return null
        }
    })

// // Fetcher functions for React Query
export async function getGame(id: number) {
  try {
    const result = await db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        user: true,
      },
    })
    return result
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error)
    throw new Error('Failed to fetch issue')
  }
}

export async function getGames() {
  //'use cache'
//cacheTag('games')
  try {
    const result = await db.query.games.findMany({
      with: {
        user: true,
      },
      orderBy: (games, { desc }) => [desc(games.createdAt)],
    })
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}