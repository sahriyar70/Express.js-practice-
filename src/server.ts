import express, { NextFunction, Request, Response } from "express"

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./medillewar/logger";
import { userRouts } from "./modules/users/user.routes";
import { authRoute } from "./modules/auth/auth.routes";




const app = express()
const port = config.port


initDB()

app.use(express.json())
app.get('/', logger, (req : Request, res : Response) => {
  res.send('Hello World!')
})
// user CRUD 
app.use('/users',userRouts);

app.use('/auth',authRoute)




// app.get("/users/:id", );

// app.put("/users/:id",)

// app.delete("/users/:id", );

// todos CRUD

app.post("/todos", async ( req : Request, res : Response)=>{
    const { user_id , title} = req.body;

    try {
        const result = await pool.query(`
          INSERT INTO todos ( user_id, title)  VALUES($1,$2) RETURNING * 
            `, [user_id,title]);

        res.status(200).json({
            success : true,
            message : "creaed todo",
            data : result.rows[0]
        })
    } catch ( err : any) {
        res.status(500).json({
            success : false,
            message : " no todos"
        })
    }
});

app.get('/todos', async(req : Request, res : Response ) =>{
    try {

        const result = await pool.query(`
            SELECT * FROM todos   
            `)
            res.status(200).json({
                succes : true,
                message : ' todo show successfully',
                data : result.rows
            })
        
    } catch (error : any) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
});

app.put('/todos/:id', async (req : Request, res : Response)=>{
    const {title,user_id} = req.body;

    try {
        const result = await pool.query(`
          UPDATE todos SET title = $1, user_id =$2  WHERE id = $3 RETURNING *  
            `,[title,user_id, req.params.id])

            res.status(200).json({
                    success : true,
                    message : "data found",
                    data : result.rows[0] }) }
        
     catch (error : any) {
        res.status(500).json({
            success : false,
            message : " not update todo"
        })
    }
})





//erro route
app.use((req : Request, res : Response)=>{
    res.status(404).json({
        success:false,
        message : "Rout not foun",
        path : req.path 
    })
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
