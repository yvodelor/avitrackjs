import multer from "multer";
import path from "path";


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "products"));
  },


  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    const name = 
      Date.now() + "-" + Math.round(Math.random() * 100000);

    cb(null, name + ext);
  }

});


export const upload = multer({
  storage,

  limits:{
    fileSize: 1024 * 1024 * 2 // 2 MB
  },

  fileFilter:(req,file,cb)=>{

    if(file.mimetype.startsWith("image/")){
      cb(null,true);
    }else{
      cb(new Error("Le fichier doit être une image"));
    }

  }

});