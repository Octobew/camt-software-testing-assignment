import  Express  from "express";
import * as partyService from '../services/PartyService';
import { PartyRequest } from '../models/PartyRequest';
const router = Express.Router();

router.post('/', async (req, res) => {
    const request: PartyRequest = req.body;
    try {
        const newParty = await partyService.createParty(request);
        res.status(201).json(newParty);
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2002') {
            res.status(400).json({ message: 'พรรคการเมืองนี้มีอยู่ในระบบแล้ว' });
        } else if (error.message === 'ต้องระบุชื่อพรรคการเมือง') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างพรรคการเมือง' });
        } 
    }
});

router.get('/',  async (_req, res) => {
    try {
        const parties = await partyService.getAllParties();
        res.status(200).json(parties);}
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพรรคการเมือง' });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const party = await partyService.getPartyById(id); 

        if (!party) {
            return  res.status(404).json({ message: 'ไม่พบพรรคการเมืองที่ระบุ' });
        }
       
        res.json(party);
        }
            catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพรรคการเมือง' });

    }
});
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const request: PartyRequest = req.body;
    try {
        const updatedParty = await partyService.updateParty(id, request);
        res.json(updatedParty);
    } catch (error: any) {
        console.error(error);
        if (error.message === 'P2002') {
            res.status(400).json({ message: 'พรรคการเมืองนี้มีอยู่ในระบบแล้ว' });
        } else if (error.message === 'ต้องระบุชื่อพรรคการเมือง') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตพรรคการเมือง' });
        }
    }
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        await partyService.deleteParty(id);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);  

        if (error.message === 'ไม่สามารถลบพรรคการเมืองได้ เนื่องจากมีผู้สมัครรับเลือกตั้ง') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบพรรคการเมือง' });
        }   
    }
});
export default router; 