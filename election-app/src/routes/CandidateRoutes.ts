
import express from 'express';
import * as candidateService from "../services/CandidateService"
import { CandidateRequest } from "../models/CandidateRequest"

const router = express.Router()

router.post("/", async (req, res) => {

    const request: CandidateRequest = req.body

    if (
        !request.candidatenumber ||
        !request.firstname ||
        !request.lastname ||
        !request.consituencyId ||
        !request.partyId
    ) {
        return res.status(400).json({
            message: "ข้อมูลผู้สมัครไม่ครบถ้วน"
        })
    }
    try {
        const candidate = await candidateService.createCandidate(request)
        res.status(201).json(candidate)

    } catch (error: any) {

        console.error(error)

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "พรรคนี้มีผู้สมัครในเขตเลือกตั้งนี้แล้ว หรือหมายเลขผู้สมัครซ้ำ"
            })
        }

        res.status(500).json({
            message: "ระบบไม่สามารถให้บริการได้ในขณะนี้ ขออภัย"
        })
    }
})

router.get("/", async (req, res) => {

    try {

        const candidates = await candidateService.getAllCandidates(req.query)

        res.status(200).json(candidates)

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: "ระบบไม่สามารถให้บริการได้ในขณะนี้"
        })
    }
})

router.get("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "รหัสผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
            })
        }

        const candidate = await candidateService.getCandidateById(id)

        if (!candidate) {
            return res.status(404).json({
                message: `ไม่พบผู้สมัครหมายเลข ${id}`
            })
        }

        res.status(200).json(candidate)

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: "ระบบไม่สามารถให้บริการได้ในขณะนี้"
        })
    }
})

router.put("/:id", async (req, res) => {
    try {

        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "เบอร์ผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
            })
        }

        const existing = await candidateService.getCandidateById(id)
        if (!existing) {
            return res.status(404).json({
                message: "ไม่พบผู้สมัครที่ต้องการแก้ไข"
            })
        }

        const request: CandidateRequest = req.body
        const candidate = await candidateService.updateCandidate(id, request)

        res.status(200).json(candidate)

    } catch (error: any) {
        console.error(error)

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "พรรคนี้มีผู้สมัครในเขตเลือกตั้งนี้แล้ว หรือหมายเลขผู้สมัครซ้ำ"
            })
        }
        res.status(500).json({
            message: "ไม่สามารถแก้ไขข้อมูลของผู้สมัครได้"
        })
    }
})

router.delete("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "รหัสผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
            })
        }

        const existing = await candidateService.getCandidateById(id)

        if (!existing) {
            return res.status(404).json({
                message: "ไม่พบผู้สมัครที่ต้องการลบ"
            })
        }

        const candidate = await candidateService.deleteCandidate(id)

        res.status(200).json({
            message: "ลบผู้สมัครสำเร็จ",
            data: candidate
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: "ไม่สามารถลบข้อมูลผู้สมัครได้"
        })
    }

})


export default router