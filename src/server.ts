import express, { NextFunction, Request, Response } from "express"

import config from "./config";
import initDB, { pool } from "./config/db";




const app = express()
const port = config.port


initDB()

app.use(express.json())

const logger = (req : Request, res : Response, next : NextFunction)=>{
    console.log( `[${new Date().toISOString()}] ${req.method} ${req.path}`)

    next()
}

app.get('/', logger, (req : Request, res : Response) => {
  res.send('Hello World!')
})
// user CRUD 
app.post("/users", async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );

        console.log(result);

        return res.status(201).json({
            success: true,
            message: "Data inserted",
            data: result.rows[0]
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

});

app.get('/users', async(req : Request, res : Response ) =>{
    try {

        const result = await pool.query(`
            SELECT * FROM users   
            `)
            res.status(200).json({
                succes : true,
                message : ' data show successfully',
                data : result.rows
            })
        
    } catch (error : any) {
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

app.get("/users/:id", async ( req : Request, res : Response)=>{
    try {
        const result = await pool.query(`
           SELECT * FROM users WHERE id = $1 
            `, [req.params.id])

            if (result.rows.length==0 ){
                res.status(404).json({
                    success : false,
                    message : "user not found "
                }) 
            } else{
                res.status(200).json({
                    success : true,
                    message : "data found",
                    data : result.rows[0]
                })
            }
        
    } catch (error:any) {
        res.status(500).json({
            success : true,
            message : error.message
        })
    }
});

app.put("/users/:id", async ( req : Request, res : Response)=>{

    const {name , email} = req.body
    try {
        const result = await pool.query(`
           UPDATE users SET  name = $1, email  = $2 WHERE id = $3 RETURNING *
            `, [name,email, req.params.id])

            if (result.rows.length==0 ){
                res.status(404).json({
                    success : false,
                    message : "user not found "
                }) 
            } else{
                res.status(200).json({
                    success : true,
                    message : "data found",
                    data : result.rows[0]
                })
            }
        
    } catch (error:any) {
        res.status(500).json({
            success : true,
            message : error.message
        })
    }
})

app.delete("/users/:id", async ( req : Request, res : Response)=>{
    try {
        const result = await pool.query(`
           DELETE FROM users WHERE id = $1 
            `, [req.params.id])

            if (result.rowCount==0 ){
                res.status(404).json({
                    success : false,
                    message : "user not found "
                }) 
            } else{
                res.status(500).json({
                    success : true,
                    message : "data delete succesfully  ",
                    data : null
                })
            }
        
    } catch (error:any) {
        res.status(500).json({
            success : true,
            message : error.message
        })
    }
});

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
