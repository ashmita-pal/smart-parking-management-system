import { getDashboardSummary, getBookingStatistics,
  getRevenueStatistics } from "../services/dashboard.services.js";

import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const getDashboardSummaryController = asyncHandler(async (req, res) => {
  const data = await getDashboardSummary();

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Dashboard summary fetched successfully",
    ),
  );
});

const getBookingStatisticsController = asyncHandler(async (req, res) => {
  const data = await getBookingStatistics();

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Booking statistics fetched successfully",
    ),
  );
});

const getRevenueStatisticsController = asyncHandler(async (req, res) => {
  const data = await getRevenueStatistics();

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Revenue statistics fetched successfully"
    )
  );
});


export {
  getDashboardSummaryController,
  getBookingStatisticsController,
  getRevenueStatisticsController
};