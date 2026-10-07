import { Pool} from 'pg';

import {AccessConfig, QueryContext} from "../types/access"

type BaseEntity = {id : number}

//const ALLOWED_FIELDS = ['id', 'nom']   //Pour Eviter les injection

export const createBaseService = <T extends BaseEntity>(
    pool: Pool,
    tableName: string,
    allowedFields: string[] = ['id'],
    access?: AccessConfig,
    mode?: 'admin' | 'auth'
    
) => {

    const buildAccessQuery = (
        context?: QueryContext,
        startIndex = 1
    ) => {

         console.log('context', context?.user?.role)

        if (!context?.enableAccess) {
            return {
                joins: "",
                where: "",
                values: []
            };
        }
       
        
        if(mode == 'admin' || mode == 'auth'){
            if (!context.userId) {
                throw new Error(
                    "Utilisateur non authentifié"
                );
            }
        }
        

        return {
            joins: access?.joins?.join("\n") ?? "",

            where: access?.field
                ? `${access.field} = $${startIndex}`
                : "",

            values: access?.field
                ? [context?.userId]
                : []
        };
    };

    const checkAccess = async (
        id: number,
        context?: QueryContext
    ) => {

        const accessQuery =
            buildAccessQuery(context, 2);

        const values = [
            id,
            ...accessQuery.values
        ];

        const query = `
            SELECT 1
            FROM ${tableName}

            ${accessQuery.joins}

            WHERE ${tableName}.id = $1

            ${
                accessQuery.where
                    ? `AND ${accessQuery.where}`
                    : ""
            }
        `;

        const res = await pool.query(
            query,
            values
        );

        return res.rowCount! > 0;
    };    

                
    return{
        // GetAll
        getAll: async (context?: QueryContext): Promise<T[]> => {

            const accessQuery = buildAccessQuery(context);

            const query = `
                SELECT ${tableName}.* 
                FROM ${tableName} 
                ${accessQuery.joins}
                ${
                    accessQuery.where
                        ? `WHERE ${accessQuery.where}`
                        : ""
                }
                ORDER BY ${tableName}.id DESC
            `;

            console.log(query)
            const res = accessQuery.values.length > 0
                ? await pool.query(query, accessQuery.values)
                : await pool.query(query);


            return res.rows;
        },

        getById: async ( id: number, context?: QueryContext ): Promise<T | null> => {
            const accessQuery = buildAccessQuery( context, 2 );

            const values = [
                id,
                ...accessQuery.values
            ];

            const query = 
                ` SELECT ${tableName}.* FROM ${tableName} ${accessQuery.joins}
                  WHERE ${tableName}.id = $1
                ${
                    accessQuery.where
                    ? `AND ${accessQuery.where}`
                    : ""
                }
                `;

            const res = await pool.query( query,  values  );

            return res.rows[0] || null;
        },

        getByField: async (
            field:string,
            value:string,
            context?:QueryContext
        ):Promise<T[]>=>{


            if(!allowedFields.includes(field)){
                throw new Error(
                    `Champ '${field}' non autorisé`
                );
            }


            const accessQuery =
                buildAccessQuery(
                    context,
                    2
                );


            const values=[
                value,
                ...accessQuery.values
            ];


            const query=` SELECT ${tableName}.* FROM ${tableName} ${accessQuery.joins} WHERE ${tableName}.${field} = $1
                ${ accessQuery.where ? `AND ${accessQuery.where}` :""  }
            `;

            console.log(query, values)
            const res = await pool.query( query,  values );
            
            return res.rows;
        },

        create: async (data: Omit<T, 'id'>, context?: QueryContext): Promise<T> => {
            console.log('yes')
            const payload = access?.field === "user_id"
            ?{
                ...data,
                user_id: context?.userId
            }
            : data
        
            const keys = Object.keys(payload);
            const values = Object.values(payload);

            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
            const query = ` insert into ${tableName} ( ${keys. join(', ')}) VALUES (${placeholders}) RETURNING * `
            console.log([query, values])
            const res = await pool.query(query, values )
            
            return res.rows[0]
        },

        update: async (id: number, data: Omit<T, 'id'>, context?: QueryContext): Promise<T> => {
            if (!(await checkAccess(id, context))) {
                throw new Error("Accès refusé");
            }

            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key]) => key !== 'id')
            )

            const fields = Object.keys(filteredData).map((k, i) =>`${k} = $${i + 1}` )
            const values = Object.values(filteredData)
            values.push(id)

            const query = ` UPDATE ${tableName} SET ${fields.join(', ')}  WHERE id = $${values.length}  RETURNING *  `;

            console.log(query, values)

            const res = await pool.query(query, values )
            
            if(!res.rows[0]) throw new Error (`${tableName} not found`)
            return res.rows[0]
        },  


        delete: async (id: number, context?: QueryContext): Promise<void> =>{
            if(access && context?.enableAccess){
                if (!(await checkAccess(id, context))) {
                    throw new Error("Accès refusé");
                }
            }
            const res = await pool.query(`delete from ${tableName} where id = $1`, [id])
            if(res.rowCount === 0) throw new Error(`${tableName} not found`)
        }

    }
}

    /*

    const productService = createBaseService(
        pool,
        "products",
        {
            field:"user_id"
        }
    );



const faqService = createBaseService(
    pool,
    "faq",
    ["id"],
    {
        joins:[
            `
            JOIN business 
            ON faq.business_id = business.id
            `,
            `
            JOIN bot
            ON business.bot_id = bot.id
            `
        ],
        field:"bot.user_id"
    }
);
*/