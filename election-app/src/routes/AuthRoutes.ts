import express from 'express';
import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import { SwitchRoleRequest } from '../models/SwitchRoleRequest';
import { AddRoleUserRequest } from '../models/AddRoleUser';
import * as authService from '../services/AuthServices';
import { RoleName } from '../generated/prisma/enums';
import * as authMiddleware from '../middleware/AuthMiddleware';
import { consituencyByID } from '../repository/voteRepository';



const router = express.Router();

router.post('/register', async (req, res) => {
    const registerRequest: RegisterRequest = req.body;

    try {
        const existingUser = await authService.existingNationalId(registerRequest);

        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'เลขบัตรประชาชนนี้ถูกใช้งานแล้วจ้า' });
        }
        const response = await authService.registerUser(registerRequest);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            userId: response.id
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


// update profile route for users to update their own profile information, protected by authentication middleware

router.put('/update/profile', authMiddleware.protect, async (req, res) => {
    const user = req.body.user;
    const { nationalId, firstname, lastname, imageurl, address, subdistrict, district, province, consituencyID } = req.body;
    const updateData = {
        nationalId,
        firstname,
        lastname,
        imageurl,
        address,
        subdistrict,
        district,
        province,
        consituencyID: consituencyID ? Number(consituencyID) : undefined
    };

    try {
        const updatedUser = await authService.updateProfile(user.id, updateData);

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



router.get('/users', async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// router.get('/provinces', async (req, res) => {
//     try {
//         const provinces = await authService.getAllProvinces();
//         res.status(200).json({
//             status: 'success',
//             data: provinces
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });


// router.get('/districts/:province', async (req, res) => {
//     const province = req.params.province;
//     try {
//         const districts = await authService.getDistrictsByProvince(province);
//         res.status(200).json({
//             status: 'success',
//             data: districts
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });

// router.get('/subdistricts/:district', async (req, res) => {
//     const district = req.params.district;
//     const province = req.query.province as string;
//     try {
//         const subdistricts = await authService.getSubdistrictsByDistrict(province, district);
//         res.status(200).json({
//             status: 'success',
//             data: subdistricts
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });

// router.get('/constituencynumbers/:subdistrict', async (req, res) => {
//     const subdistrict = req.params.subdistrict;
//     const district = req.query.district as string;
//     const province = req.query.province as string;
//     try {
//         const subdistricts = await authService.getConstituencyNumberByDistrict(province, district, subdistrict);
//         res.status(200).json({
//             status: 'success',
//             data: subdistricts
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });


router.post('/login', async (req, res) => {
    const loginRequest: LoginRequest = req.body;
    const user = await authService.findUserByNationalId(loginRequest);

    if (loginRequest.nationalId === undefined || loginRequest.nationalId === "" || loginRequest.nationalId === null) {
        return res.status(400).json({ status: 'error', message: 'กรุณากรอกบัตรประชาชน' });
    }
    if (!user) {
        return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้งานนี้ในระบบ' });
    }

    if (loginRequest.password === undefined || loginRequest.password === "" || user.password === undefined || user.password === null) {
        return res.status(400).json({ status: 'error', message: 'กรุณากรอกรหัสผ่าน' });
    }

    const isPasswordCorrect = await authService.comparePassword(loginRequest.password, user.password); {
        if (!isPasswordCorrect) {
            return res.status(401).json({ status: 'error', message: 'รหัสผ่านไม่ถูกต้อง' });
        }
    }
    const allRoles = user.role.map(r => r.roleName);
    let currentRole = allRoles.includes('ROLE_VOTER') ? 'ROLE_VOTER' : allRoles[0];
    const token = await authService.generatetoken(user.nationalId, currentRole, user.consituencyID);

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            nationalId: user.nationalId,
            firstname: user.firstname,
            lastname: user.lastname,
            provinceCode: user.consituency.provinceCode,
            consituencynumber: user.consituency.consituencynumber,
            consituencyId: user.consituency.id,
            rolename: user.role.map(r => r.roleName) as RoleName[],
            currentRole: currentRole
        }
    });
});


router.get('/profile', authMiddleware.protect, async (req, res) => {
    const user = req.body.user;
    const currentRole = req.body.currentRole;
    res.status(200).json({
        status: 'success',
        user: {
            id: user.id,
            nationalId: user.nationalId,
            firstname: user.firstname,
            lastname: user.lastname,
            imageurl: user.imageurl,
            consituencypercent: user.consituency.province,
            consituencynumber: user.consituency.consituencynumber,
            rolename: user.role.map((r: { roleName: string; }) => r.roleName) as RoleName[],
            currentRole: currentRole

        }
    })
})


router.post('/switch-role', authMiddleware.protect, authMiddleware.checkRole_admin_ect, async (req, res) => {
    const user = req.body.user;
    const switchRoleRequest: SwitchRoleRequest = req.body;
    const newToken = await authService.generatetoken(user.nationalId, switchRoleRequest.newRole, user.consituencyID);

    try {
        res.status(200).json({
            status: 'success',
            message: `สลับบทบาทเป็น ${switchRoleRequest.newRole} สำเร็จ`,
            token: newToken
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



router.post('/add-role', authMiddleware.protect, authMiddleware.checkRole_admin, async (req, res) => {

    const addRoleUserRequest: AddRoleUserRequest = req.body;

    try {
        const newRole = await authService.addUserRole(addRoleUserRequest.userid, addRoleUserRequest.roleName as any);
        res.status(201).json({
            status: 'success',
            message: 'เพิ่มบทบาทผู้ใช้สำเร็จ',
            data: newRole
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

router.delete('/delete-role', authMiddleware.protect, authMiddleware.checkRole_admin, async (req, res) => {

    const addRoleUserRequest: AddRoleUserRequest = req.body;

    try {
        const deletedRole = await authService.deleteUserRole(addRoleUserRequest.userid, addRoleUserRequest.roleName as any);
        res.status(200).json({
            status: 'success',
            message: 'ลบบทบาทผู้ใช้สำเร็จ',
            data: deletedRole
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

export default router;