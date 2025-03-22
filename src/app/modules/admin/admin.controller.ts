import { Express } from 'express';
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { AdminServices } from './admin.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { TCar } from '../car/car.interface';

const createACar = catchAsync(async (req, res, next) => {
  const files = req.files as Express.Multer.File[];

  const result = await AdminServices.createACarIntoDB(files, req.body);
  const message = 'Added the Car Successfully!';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

//request to the service/DB to find and update a car
const updateACar = catchAsync(async (req, res, next) => {
  const carId: string = req.params.carId;
  const updateData: Partial<TCar> = req.body;

  const result = await AdminServices.updateACarIntoDB(carId, updateData);
  const message = 'Updated the Car Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

//deleting a car from the db processing and send response to client
const deleteACar = catchAsync(async (req, res, next) => {
  const carId: string = req.params.carId;

  const result = await AdminServices.deleteACarFromDB(carId);

  const message = 'Deleted the Car Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result ? null : result);
});

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

const getAnOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await AdminServices.getAnOrderFromDB(orderId);

  const message = 'Retrieved the Order Successfully';
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

const deleteOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await AdminServices.deleteOrderFromDB(orderId);
  const message = 'Deleted the Order Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await AdminServices.updateOrderStatusIntoDB(orderId, req.body);
  const message = 'Order Status Updated Successfully';

  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const AdminControllers = {
  createACar,
  updateACar,
  deleteACar,
  deactivateUserByAdmin,
  getAllOrders,
  getAnOrder,
  calcRevenue,
  getAllUsers,
  deleteOrder,
  updateOrderStatus,
};
