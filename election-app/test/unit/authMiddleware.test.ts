// Unit tests for the voter-side middleware: protect and checkRole_voter.
// AuthServices (JWT + database) is replaced through jest.mock; req, res and next are hand-made test doubles.
import type { NextFunction, Request, Response } from 'express';

jest.mock('../../src/services/AuthServices', () => ({
  getUserFromToken: jest.fn(),
}));

import { checkRole_voter, protect } from '../../src/middleware/AuthMiddleware';
import * as authService from '../../src/services/AuthServices';

const getUserFromToken = jest.mocked(authService.getUserFromToken);

type RoleName = 'ROLE_VOTER' | 'ROLE_ECT' | 'ROLE_ADMIN';

function aUserWithRoles(...roles: RoleName[]) {
  return { id: 42, nationalId: '1509900000017', role: roles.map((roleName) => ({ roleName })) };
}

function aRequest({ authorization, body = {} }: { authorization?: string; body?: Record<string, unknown> } = {}) {
  return { headers: authorization ? { authorization } : {}, body } as unknown as Request;
}

// Stub ของ Response: status() และ json() คืนตัวเองให้เรียกต่อกันได้เหมือน express และจดไว้ว่าถูกเรียกด้วยอะไร
function aResponse() {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res as unknown as Response & { status: jest.Mock; json: jest.Mock };
}

describe('checkRole_voter', () => {
  it('TC-M01 lets a voter through', async () => {
    const req = aRequest({ body: { user: aUserWithRoles('ROLE_VOTER') } });
    const res = aResponse();
    const next = jest.fn(); // Spy: จดว่า middleware ส่งต่อให้ handler ถัดไปหรือไม่

    await checkRole_voter(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('TC-M02 answers 403 to a user who is not a voter, without calling next', async () => {
    const req = aRequest({ body: { user: aUserWithRoles('ROLE_ECT') } });
    const res = aResponse();
    const next = jest.fn(); // Mock: คาดหวังว่าต้องไม่ถูกเรียก

    await checkRole_voter(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'กรุณาสลับสิทธิผู้ใช้งานเป็น ผู้มีสิทธิเลือกตั้ง' });
    expect(next).not.toHaveBeenCalled();
  });

  it('TC-M03 lets a user through when ROLE_VOTER is one of several roles', async () => {
    const req = aRequest({ body: { user: aUserWithRoles('ROLE_ECT', 'ROLE_VOTER') } });
    const res = aResponse();
    const next = jest.fn();

    await checkRole_voter(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('TC-M04 answers 401 when no user is attached to the request', async () => {
    const req = aRequest({ body: {} });
    const res = aResponse();
    const next = jest.fn();

    await checkRole_voter(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('protect', () => {
  it('TC-M05 answers 401 when there is no Authorization header', async () => {
    const req = aRequest();
    const res = aResponse();
    const next = jest.fn();

    await protect(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(getUserFromToken).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('TC-M06 attaches the user and current role, then calls next, for a valid token', async () => {
    // Stub: แทนการถอด JWT และค้น database ด้วยผลลัพธ์ที่กำหนดไว้
    const voter = aUserWithRoles('ROLE_VOTER');
    getUserFromToken.mockResolvedValue({ user: voter, currentRole: 'ROLE_VOTER' } as never);
    const req = aRequest({ authorization: 'Bearer valid-token' });
    const res = aResponse();
    const next = jest.fn();

    await protect(req, res, next as NextFunction);

    expect(getUserFromToken).toHaveBeenCalledWith('valid-token');
    expect(req.body).toMatchObject({ user: voter, currentRole: 'ROLE_VOTER' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('TC-M07 answers 401 for an invalid or expired token instead of leaving the request hanging', async () => {
    // Stub ที่ throw แบบเดียวกับ jsonwebtoken เมื่อ token ผิดหรือหมดอายุ
    const invalid = Object.assign(new Error('invalid signature'), { name: 'JsonWebTokenError' });
    getUserFromToken.mockRejectedValue(invalid);
    const req = aRequest({ authorization: 'Bearer forged-token' });
    const res = aResponse();
    const next = jest.fn();

    await protect(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
