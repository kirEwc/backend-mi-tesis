import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { Response } from "express";
import { UserService } from "./user.service";

ApiTags('user')
Controller('user')
export class UserController{
    constructor(
        private userService : UserService
    )
    {}
    @Post()
    @ApiOperation({summary: "Crear un nuevo usuario "})
    async CreateUser(@Body() userDto : UserDto , @Res() res : Response){
        const user = this.userService.CreateUser(userDto);
        if(user){
            return res.status(200).json({
                message: "Usuario creado correctamente "
            })
        }
        return res.status(400).json({
            message: "Error al crear al usuario"
        })
    }
    @Post()
    @ApiOperation({summary: "Loguear a un usuario por su correo "})
    async login(@Body() email:string , @Res() res: Response){
        const user = this.userService.login(email);
        if(!user){
            return res.status(404).json(
                {
                    message: "El correo no es correcto"
                }
            )
        }
        return res.status(200).json({
            message: "usuario logueado exitosamente "
        })
    }
}