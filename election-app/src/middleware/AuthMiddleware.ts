import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/AuthServices';


export async function protect(req: Request, res: Response, next: NextFunction) {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } 

    if (!token) {
        return res.status(401).json({message: "You are not logged in! Please log in to get access" });
    }

    try {
        const userInfo = await authService.getUserFromToken(token);
        if (!userInfo) {
            return res.status(401).json({message: "Invalid credentials" });
        }
        if (!req.body) {
            req.body = {};
        }

        req.body.user = userInfo.user;
        req.body.currentRole = userInfo.currentRole;
        next();
    }catch (error:unknown) {
        if (error instanceof Error && error.name === "JWT_SECRET is not definded") {
            return res.status(500).json({message: "Internal server error" });
        }
    }
}

export async function checkRole_admin_ect(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    const userRoles = user.role.map((r: any) => r.roleName);

    if (user && (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_ECT'))) {  
        next();
    } else {
        return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
}

export async function checkRole_admin(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    const userRoles = user.role.map((r: any) => r.roleName);

    if (user && userRoles.includes('ROLE_ADMIN')) {  
        next();
    } else {
        return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
}

export async function checkRole_ect(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    const userRoles = user.role.map((r: any) => r.roleName);

    if (user && userRoles.includes('ROLE_ECT')) {  
        next();
    } else {
        return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
}

export async function checkRole_voter(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user;
    const userRoles = user.role.map((r: any) => r.roleName);

    if (user && userRoles.includes('ROLE_VOTER')) {  
        next();
    } else {
        return res.status(403).json({ message: "กรุณาสลับสิทธิผู้ใช้งานเป็น ผู้มีสิทธิเลือกตั้ง" });
    }
}