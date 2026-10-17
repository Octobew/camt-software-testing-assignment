import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import * as authRepo from '../repository/AuthRepository';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';


export async function registerUser(registerRequest: RegisterRequest) {
    const { nationalId, firstname, lastname, address, province, district, subdistrict, consituencyId, password } = registerRequest;
    return await authRepo.registerUser(
        nationalId, 
        firstname, 
        lastname, 
        address, 
        province, 
        district,
        subdistrict,
        consituencyId,
        bcrypt.hashSync(password, 10)
    );
}


export async function updateProfile(id: number, data: {
    nationalId?: string,
    firstname?: string,
    lastname?: string,
    imageurl?: string,
    address?: string,
    subdistrict?: string,
    district?: string,
    province?: string,
    consituencyID?: number,
}) {
    return await authRepo.updateProfile(id, data);
}



export async function getAllUsers() {
    return authRepo.getAllUsers();
}

export async function existingNationalId(registerRequest: RegisterRequest) {
    return authRepo.findUserByNationalId(registerRequest.nationalId);
}

export async function generatetoken(nationalId: string, currentRole: string, consituencyId: number | null) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }  
     return jwt.sign({ nationalId, currentRole, consituencyId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export async function getUserFromToken(token: string) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    const user = await authRepo.findUserByNationalId(decoded.nationalId);
    return {user,currentRole: decoded.currentRole as string};
}   

export async function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);

}

export async function findUserByNationalId(LoginRequest: LoginRequest) {
    return authRepo.findUserByNationalId(LoginRequest.nationalId);
}


export async function addUserRole(userId:number, roleName:string) {
    return authRepo.addUserRole(userId, roleName as any);
}

export async function deleteUserRole(userId:number, roleName:string) {
    return authRepo.deleteUserRole(userId, roleName as any);
}



// export async function getAllProvinces () {
//     const provinces = await  authRepo.getAllProvinces();
//     return provinces.map(item => item.province);
// }  

// export async function getDistrictsByProvince(province: string) {
//     const districts = await authRepo.getDistrictsByProvince(province);
//     return districts.map(item => item.district);
// }  

// export async function getSubdistrictsByDistrict(province: string, district: string) {
//     const subdistricts = await authRepo.getSubdistrictsByDistrict(province, district);
//     return subdistricts.map(item => item.subdistrict);
// }  

// export async function getConstituencyNumberByDistrict(province: string, district: string, subdistrict: string) {
//     return await authRepo.getConstituencyNumberByDistrict(province, district, subdistrict);
// }  

