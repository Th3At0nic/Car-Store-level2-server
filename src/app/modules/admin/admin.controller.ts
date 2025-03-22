/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { AdminServices } from './admin.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const deactivateUserByAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const result = await AdminServices.toggleUserStatusByAdminIntoDB(userId);
  const message = result?.deactivated
    ? 'Deactivated the User Successfully'
    : 'Activated the User Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAllOrdersFromDB();
  const message = 'Retrieved All Orders Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

// processing req of calculation of total revenue
const calcRevenue = catchAsync(async (req, res, next) => {
  const result = await AdminServices.calcRevenueFromOrders();
  const message = 'Revenue Calculated Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAllUsersFromDB();
  const message = 'Retrieved All Users Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const AdminControllers = {
  deactivateUserByAdmin,
  getAllOrders,
  calcRevenue,
  getAllUsers,
};
