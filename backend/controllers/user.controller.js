import {
  registerAccount,
  authenticateAccount,
  authenticateAdmin,
  getAccountProfile,
} from "../services/auth.service.js";
export const registerUser = async (req, res) =>
  res.status(201).json({ success: true, ...(await registerAccount(req.body)) });
export const loginUser = async (req, res) =>
  res.json({ success: true, ...(await authenticateAccount(req.body)) });
export const loginAdmin = (req, res) =>
  res.json({ success: true, ...authenticateAdmin(req.body) });
export const getProfile = async (req, res) =>
  res.json({ success: true, user: await getAccountProfile(req.identity.id) });
