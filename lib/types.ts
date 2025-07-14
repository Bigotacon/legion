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

import { Game } from '@/db/schema'

export type Status = 'new' | 'in_progress' | 'done'
export type PrimaryObjective = 'bunker_assault' | 'breakthrough' | 'close_the_pocket' | 'intercept_the_signals' | 'recover_the_research' | 'shifting_priorities'
export type SecondaryObjective = 'bring_them_to_heel' | 'surface_scan' | 'marked_targets' | 'recon_mission' | 'sweep_and_clear'
export type Advantage = 'advanced_intel' | 'cunning_deployment' | 'fortified_position' | 'garrison' | 'ordnance' | 'strafing_run'

export type GameWithUser = Game & {
    user: {
        id: string
        email: string
    }
}