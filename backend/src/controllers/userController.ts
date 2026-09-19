import { Request, Response } from "express"

// Fake user (temporaire)
let user = {
  id: "1",
  name: "John Doe",
  email: "john@mail.com",
  avatar: "",
  password: "hashed_password"
}

//
// 1. GET PROFILE
//
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}

//
// 2. UPDATE PROFILE
//
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, avatar } = req.body

    user = {
      ...user,
      name: name || user.name,
      avatar: avatar || user.avatar
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}

//
// 3. DELETE ACCOUNT
//
export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    user = null as any

    res.json({
      success: true,
      message: "Compte supprimé"
    })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}

//
// 4. GET USER STATS
//
export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({
      success: true,
      stats: {
        messagesSent: 50,
        conversations: 5,
        plan: "starter"
      }
    })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}

//
// 5. CHANGE PASSWORD
//
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body

    // simulation simple
    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Champs manquants"
      })
      return
    }

    user.password = "new_hashed_password"

    res.json({
      success: true,
      message: "Mot de passe changé"
    })
  } catch (error) {
    res.status(500).json({ success: false })
  }
}