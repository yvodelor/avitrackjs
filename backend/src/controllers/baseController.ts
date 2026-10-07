import type { Request, Response, NextFunction} from 'express'
import { UserPayload } from '../middleware/authMiddleware'
import { QueryContext } from "../types/access"


type CrudService<T extends { id : number}> = {
    getAll: (context?: QueryContext) => Promise<T[]>
    getById: (id: number, context?: QueryContext) => Promise<T | null> 
    getByField: (field: any, value: any, context?: QueryContext) => Promise<T> | Promise<T[]> | null
    create: (data: any, context?: QueryContext) => Promise<T>
    update: (id: number, data: any, context?: QueryContext) => Promise<T>
    delete: (id: number, context?: QueryContext) => Promise<void>
}

type validationFn = (data: any) =>   string | null | Promise<string | null>;;



export const  createBaseController = <T extends { id: number}>(
    service: CrudService<T>,
    validators?: { create?: validationFn, update?: validationFn}

) => {

    const getContext = (req: Request, enableAccess = true): QueryContext => {
  
        return {
            user: req.user,
            userId: req.user?.sub,
            enableAccess
        };
    };
    
    return {
        getAll: async(req: Request, res: Response, next: NextFunction) =>{
            try{
                const data = await service.getAll(getContext(req))
                
                res.json({sucess: true, data, count: data.length})
            } catch(e){
                next(e)
            }
        }, 


        getById: async(req: Request, res: Response, next: NextFunction) =>{
            try{
                const id = Number(req.params.id)
                if(isNaN(id)) return res.status(400).json({ sucess: false, error: 'ID invalide'})
                const  item = await service.getById(id, getContext(req))
                if(!item) return res.status(404).json({ sucess: false, error: 'Not found'})
                res.json({sucess:true, data: item})
            } catch(e){
                next(e)
            }
        }, 

        getByField: async(req: Request, res: Response, next: NextFunction) =>{
            try{

                const {field, value} = req.query;
                const  data = await service.getByField(field, value, getContext(req, false))   
                res.json({sucess: true, data: data })

            } catch(e){
                next(e)
            }
        }, 

        create: async(req: Request, res: Response, next: NextFunction) =>{
            try{
              
                
                if(validators?.create){
                    const err = await validators.create(req.body)
                    if(err) return res.status(400).json({ success: false, error: err})
                }
                const item = await service.create(req.body, getContext(req))
                res.status(200).json({sucess: true, data: item})
            } catch(e){
                next(e)
            }
        }, 
        
    
        
        update: async(req: Request, res: Response, next: NextFunction) =>{
            try{
                
                const id = Number(req.params.id)
                if(isNaN(id)) return res.status(400).json({ sucess: false, error: 'ID invalide'})
                if(validators?.update){
                    const err = await validators.update(req.body)
                    if(err) return res.status(400).json({ success: false, error: err})
                }
                const item = await service.update(id, req.body, getContext(req))
                res.status(201).json({sucess: true, data: item})
            } catch(e){
                next(e)
            }
        },
        
        


        delete: async(req: Request, res: Response, next: NextFunction) =>{
            try{
                
                const id = Number(req.params.id)

                if(isNaN(id)) return res.status(400).json({ sucess: false, error: 'ID invalide'})
                await service.delete(id, getContext(req))
            
                res.status(204).send()
            } catch(e){
                next(e)
            }
        },  
    }

}
