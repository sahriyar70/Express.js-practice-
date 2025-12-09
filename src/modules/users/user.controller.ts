import { Request, Response } from "express";

import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    

    try {
        const result = await userService. createUser(req.body)

        console.log(result)

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

};

const getUser = async(req : Request, res : Response ) =>{
        try {
    
            const result = await userService.getUser()
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
    };

    const getUserId = async ( req : Request, res : Response)=>{
            try {
                const result = await userService.getUserId(req.params.id as string)
        
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
        };

    const putUserId = async ( req : Request, res : Response)=>{
    
        const {name , email,age} = req.body
        try {
            const result = await userService.putUserId(name,email,age, req.params.id as string)
    
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
    };

    const deleteUserId = async ( req : Request, res : Response)=>{
    try {
        const result =  await userService.deleteUserId(req.params.id as string)

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
};


export const userController = {
    createUser, getUser, getUserId, putUserId ,deleteUserId     
}