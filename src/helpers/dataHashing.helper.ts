import bcryptjs from 'bcryptjs';

export const hashData = async (data: any, saltRound = 10) => {
  try {
    const hashedData = await bcryptjs.hash(data, saltRound);
    return hashedData;
  } catch (error) {
    throw error;
  }
}


export const verifyHashedData = async(unhashedContent: any , hashed: any)=>{
    try {
      const match = await bcryptjs.compare(unhashedContent,hashed)
      return match
    } catch (error) {
      throw error
    }
}