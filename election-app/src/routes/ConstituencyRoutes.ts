import express from 'express';
import * as constituencyService from '../services/ConstituencyService';
import { ConstituencyRequest } from '../models/ConstituencyRequest';

const router = express.Router();

// Routes for constituency management, including creating, retrieving, updating, and deleting constituencies

router.get('/', async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            const result = await constituencyService.searchConstituencies(req.query)
            return res.status(200).json(result)
        }
        const constituencies = await constituencyService.getAllConstituencies()
        res.status(200).json(constituencies)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: 'ระบบไม่สามารให้บริการได้ในขณะนี้ ขออภัยในความไม่สะดวก' })
    }
})

// router.get('/', async (req, res) => {
//     try {
//         const constituencies = await constituencyService.getAllConstituencies()
//         res.status(200).json(constituencies)
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ message: 'ระบบไม่สามารถให้บริการได้ในขณะนี้ ต้องขออภัยในความไม่สะดวก' })
//     }
// })




router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'รหัสเขตเลือกตั้งไม่ถูกต้อง กรุณาใส่ตัวเลข' })
        }
        const constituency = await constituencyService.getConstituencyById(id)
        if (!constituency) {
            return res.status(404).json({ message: `ไม่พบเขตเลือกตั้ง ${id} ที่ท่านเลือก` })
        }
        res.status(200).json(constituency)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'ระบบไม่สามารถให้บริการได้ในขณะนี้' })
    }
})

router.post('/', async (req, res) => {
    const request: ConstituencyRequest = req.body;
    try {
        const newconstituency = await constituencyService.createConstituency(request);
        res.status(201).json(newconstituency);

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2002') {
            res.status(400).json({ message: 'เขตเลือกตั้งนี้มีอยู่ในระบบแล้ว หรือมีตำบลที่ถูกผูกกับเขตอื่นแล้ว' });
        } else if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'ระบบไม่สามารถให้บริการได้ในขณะนี้' });
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const constituencies = await constituencyService.getAllConstituencies();
        res.status(200).json({
            status: 'success',
            data: constituencies
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// router.get('/:id', async (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     try {
//         const constituency = await constituencyService.findConstituencyById(id);
//         res.status(200).json({
//             status: 'success',
//             data: constituency
//         });
//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// });

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deletedconstituency = await constituencyService.deleteConstituency(id);
        res.status(200).json({
            status: 'success',
            message: 'ลบเขตเลือกตั้งสำเร็จ',
            data: deletedconstituency
        });
    }
    catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'มีผู้มีสิทธิ์เลือกตั้งในเขตเลือกตั้งนี้ อยู่ในระบบ ไม่สามารถลบได้' });
    }
});

router.put('/open/all', async (req, res) => {
    try {
        await constituencyService.openConstituencyElectionAll();
        res.status(200).json({
            status: 'success',
            message: 'เปิดการเลือกตั้งในทุกเขตเลือกตั้งสำเร็จ',
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

router.put('/close/all', async (req, res) => {
    try {
        await constituencyService.closeConstituencyElectionAll();
        res.status(200).json({
            status: 'success',
            message: 'ปิดการเลือกตั้งในทุกเขตเลือกตั้งสำเร็จ',
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

router.put('/open/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const openedconstituency = await constituencyService.openConstituencyElection(id);
        res.status(200).json({
            status: 'success',
            message: `เปิดการเลือกตั้งเขตที่ ${openedconstituency.consituencynumber} สำเร็จ`,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

router.put('/close/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const closedconstituency = await constituencyService.closeConstituencyElection(id);
        res.status(200).json({
            status: 'success',
            message: `ปิดการเลือกตั้งเขตที่ ${closedconstituency.consituencynumber} สำเร็จ`,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

export default router;