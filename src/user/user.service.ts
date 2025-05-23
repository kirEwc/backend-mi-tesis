import { Injectable } from "@nestjs/common";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService{
    constructor(
        private userRepository : Repository<User>
    ){}
    async CreateUser(user: UserDto): Promise<User | null>{
        const ifExist = await this.userRepository.findOne({where: {Email: user.email}})
        if(ifExist){
            return null;
        }
        const newUser = this.userRepository.create({
            Email: user.email,
            Name : user.name,
        })
        this.userRepository.save(newUser);
        return newUser;
    }
    async login(email: string): Promise< User | null>{
        const user = await this.userRepository.findOne({where : {Email: email}});
        if(user){
            return user ;
        }
        return null;
    }
}