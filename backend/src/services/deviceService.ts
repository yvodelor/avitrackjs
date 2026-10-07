import {pool} from '../config/db'

import { createBaseService } from './baseService'

type Device = {
    id: number,
    building_id: string,
    code: string,
    
} 

export const deviceService = {
    ...createBaseService<Device>(
        pool, 
        'device', 
        ['id', 'building_id', 'code']     
    ),
    
}