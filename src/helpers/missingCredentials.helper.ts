export const findMissingObjectValues = async(obj: any)=>{
    try {
        let message;
        for (let key in obj) {
            
            if (obj[key] == null || obj[key] == '' || obj[key] == undefined) {
                message = `${key} value is missing.`;
                console.log(message)
                return message;
            }
        }
        return message;
    } catch (error) {
      throw error
    }
}