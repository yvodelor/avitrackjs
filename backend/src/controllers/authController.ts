import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {pool} from "../config/db";


import dotenv from "dotenv";
dotenv.config();


const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET manquant");
}



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      })
      return
    }

    // 1. Chercher user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email incorrect"
      });
       
    }

    // 2. Vérifier password
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Mot de passe incorrect"
      })
      return
    }

    // 3. JWT
    const token = jwt.sign(
      {
        sub: user.id, email
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "90d" }
    );

    // 4. Response
    res.json({
      success: true,
      token,
      user: {
        sub: user.id,
        role: user.role,
        niveau: user.niveau
        
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    })
  }
};



export const register = async (req: Request, res: Response) => {
  const {name, email, password, password2, role } = req.body;
 
  try{
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
   
    if (existingUser.rows.length > 0) {
      return res.status(401).json({ 
        success: false,
        message: "Cet utilisateur existe déjà"
       
      }); 
    }
    
    if(password != password2){
      return res.status(400).json({
        success: false, 
        message: "Les mots de passe ne se correspondent pas" 
      });
      
    }

   

    const hashedPassword = await bcrypt.hash(password, 10);  console.log('mdp', hashedPassword)
    const newUser = await pool.query(" INSERT INTO users (name, email, password, role ) VALUES($1, $2, $3, $4) RETURNING id",
       [name, email, hashedPassword, role]
    );

    const token = jwt.sign({
       id: newUser.rows[0].id}, secret, {
      expiresIn: "24h",
    });
     
    // ✅ SUCCESS ICI
    return res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token
    });


    res.json({ token });
  } catch(err){
    res.status(500).json({
      success: false, 
      message: "Server error Ouf"
    });
  }
};