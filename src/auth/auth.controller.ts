import {Controller, Post, Req } from "@nestjs/common";
import {AuthService} from "./auth.service";
import { Request } from "express";
import {User, Bookmark} from "@prisma/client";

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) {}
    @Post('signup')
    signup(@Req() req: Request) {
        console.log(req.body);
        return "signed up"
    }

    @Post('signin')
    signin() {
        return "signed in"
    }
}