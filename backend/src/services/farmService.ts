import {pool} from '../config/db'

import { createBaseService } from './baseService'

type Farm = {
    id: number,
    pays_id: string,
    ville_id: string,
    nom: string
} 

export const farmService = {
    ...createBaseService<Farm>(
        pool, 'farms', ['id', 'name', 'pays_id'],
        { field: "user_id"}
    ),
    
}