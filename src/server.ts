import express, { NextFunction, Request, Response } from "express"
import {Pool} from "pg"
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join(process.cwd(), '.env')})

const app = express()
const port = 3000

const pool = new Pool({
    connectionString : `${process.env.CONACTION_STRING}`
});

const initDB = async ()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

        
        `)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS todos(
          id SERIAL PRIMARY KEY ,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL ,
          description TEXT,
          completed BOOLEAN DEFAULT  false ,
          due_date DATE ,
          created_at  TIMESTAMP DEFAULT NOW (),
          uapdate_at  TIMESTAMP DEFAULT NOW () 

          )
          
            `)
}
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

app.use((req : Request, res : Response)=>{
    res.status(404).json({
        success:false,
        message : "Rout not foun",
        path : req.path 
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
