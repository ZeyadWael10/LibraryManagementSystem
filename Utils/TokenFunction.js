import jwt from "jsonwebtoken"
export const tokenDecode = ({payload= "" ,signature=process.env.TOKENGENERATION})=>{
    if(payload === ""){
        return false
    }
    const decoded = jwt.verify(payload,signature)
    return decoded
}
export const tokenGeneration = ({payload= {} ,signature=process.env.TOKENGENERATION,expiresIn="1d"})=>{
    if(!Object.keys(payload).length){
        return false
    }
    const token = jwt.sign(payload,signature,{expiresIn})
    return token
}