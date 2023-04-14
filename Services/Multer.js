import multer from "multer"

export const validObject ={
    image:["image/jpg",'image/png','image/jpeg']
}
export const myMulter = ({validation=validObject.image}={})=>{
    const storage =multer.diskStorage({})
    const Filter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
        return cb(null,true)   
        }
        cb(new Error("Invalid Extension",{cause:400}),false)
    }
    const Upload = multer({Filter,storage})
    return Upload
}
