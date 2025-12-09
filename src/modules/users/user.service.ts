import { pool } from "../../config/db";

const createUser = async(name:string,email:string)=>{
  const result=   await pool.query(
            `INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );

        return result
};

const getUser = async()=>{
   const result=  await pool.query(`
                SELECT * FROM users   
                `)
    return result;
};

const getUserId = async(id:string)=>{
  const result=  await pool.query(`
                   SELECT * FROM users WHERE id = $1 
                    `, [id]);

        return result; 
};

const putUserId = async (name:string ,email:string,age:number,id : string)=>{
    const result = await pool.query(`
               UPDATE users SET  name = $1, email  = $2, age =$3 WHERE id = $4  RETURNING *
                `, [name,email,age, id])
                return result ;
};

const deleteUserId = async (id:string)=>{
 const result = await pool.query(`
           DELETE FROM users WHERE id = $1 
            `, [id]);

            return result ; 
}

 
export const userService ={
            createUser, getUser, getUserId, putUserId,deleteUserId
        }