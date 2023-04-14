import bcrypt from "bcryptjs"
export const hashingFunction = ({payload="",saltRounds= +process.env.SALTROUNDS})=>{
    if(payload == ""){
        return false
    }
    const hashedPassword =bcrypt.hashSync(payload,saltRounds)
    return hashedPassword
} 
export const comparingFunction = ({payload="",comparingPassword= ""})=>{
    if(payload == "" && comparingPassword == ""){
        return false
    }
    const matchedPasswords =bcrypt.compareSync(payload,comparingPassword)
    return matchedPasswords
}