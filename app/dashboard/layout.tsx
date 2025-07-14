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

import React, { Suspense } from 'react'

import Navigation from '../components/Navigation'

export default async function DashboardLayout({
   children,}:{
    children: React.ReactNode
   }){
    return (
        <div className='min-h-screen'>
            <Navigation/>
            <main className='pl-16 md:pl-64 pt-0 min-h-screen'>
                <div className='max-w-6xl mx-auto p-4 md:p-8'>
                    {children}
                </div>
            </main>
        </div>
    )
} 