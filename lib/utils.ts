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

// Utility function for combining Tailwind classes
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {formatDistanceToNow} from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string){
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(parsedDate, {addSuffix: true})
}