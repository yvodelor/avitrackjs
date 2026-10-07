import {pool}  from '../config/db'

import { createBaseService } from './baseService'

type Ville = {
    id: number,
    pays_id: string,
    nom: string,
} 


export const villeService = {
    ...createBaseService<Ville>(
        pool, 
        'ville', 
        ['id', 'nom', 'pays_id'], 
       
    ),
    
}