import swaggerJsdoc from "swagger-jsdoc";

const uuidParam = (name, description) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: {
    type: "string",
    format: "uuid",
  },
});

const queryParam = (name, schema, description) => ({
  name,
  in: "query",
  required: false,
  description,
  schema,
});

const jsonBody = (schema) => ({
  required: true,
  content: {
    "application/json": {
      schema,
    },
  },
});

const apiResponse = (description, dataSchema) => ({
  description,
  content: {
    "application/json": {
      schema: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponse" },
          {
            type: "object",
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    },
  },
});

const errorResponse = (description) => ({
  description,
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ApiError",
      },
    },
  },
});

const paginatedSchema = (itemsProperty, itemRef, totalProperty) => ({
  type: "object",
  properties: {
    [itemsProperty]: {
      type: "array",
      items: {
        $ref: itemRef,
      },
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 10 },
        [totalProperty]: { type: "integer", example: 25 },
        totalPages: { type: "integer", example: 3 },
        hasNextPage: { type: "boolean", example: true },
        hasPreviousPage: { type: "boolean", example: false },
      },
    },
  },
});

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Smart Parking Management System API",
      version: "1.0.0",
      description:
        "REST API documentation for the Smart Parking Management System backend.",
      contact: {
        name: "Soumyadeep Paul",
        email: "soumya.paul0712@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Authentication APIs" },
      { name: "Vehicles", description: "Vehicle management APIs" },
      { name: "Parking Lots", description: "Parking lot APIs" },
      { name: "Parking Slots", description: "Parking slot APIs" },
      { name: "Bookings", description: "Booking APIs" },
      { name: "Payments", description: "Payment APIs" },
      { name: "Dashboard", description: "Dashboard analytics APIs" },
      { name: "Test", description: "Health and test APIs" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 200 },
            data: { nullable: true },
            message: {
              type: "string",
              example: "Operation completed successfully.",
            },
            success: { type: "boolean", example: true },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            statusCode: { type: "integer", example: 400 },
            data: { type: "null", example: null },
            message: { type: "string", example: "Validation failed." },
            success: { type: "boolean", example: false },
            errors: {
              type: "array",
              items: { type: "string" },
              example: [],
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "06c3b57f-088b-443d-b7d6-ae89285218be",
            },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            phone: { type: "string", example: "9876543210" },
            role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
            isEmailVerified: { type: "boolean", example: false },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-06T09:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-08-06T09:30:00.000Z",
            },
          },
        },
        Vehicle: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "4fd1b63e-37e4-4b60-bd7d-0eeb43ef4b82",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "06c3b57f-088b-443d-b7d6-ae89285218be",
            },
            vehicleNumber: { type: "string", example: "WB06AB1234" },
            vehicleType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV"],
              example: "CAR",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        ParkingLot: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "dc9c8b4b-c22e-4b13-a4f5-8b92e53b6d52",
            },
            name: { type: "string", example: "City Centre Parking" },
            description: {
              type: "string",
              nullable: true,
              example: "Covered multi-level parking facility",
            },
            address: { type: "string", example: "Sector V, Salt Lake" },
            city: { type: "string", example: "Kolkata" },
            state: { type: "string", example: "West Bengal" },
            latitude: { type: "number", format: "double", example: 22.572646 },
            longitude: { type: "number", format: "double", example: 88.363895 },
            pricePerHour: { type: "number", format: "double", example: 50 },
            gracePeriodMinutes: { type: "integer", example: 15 },
            overstayRate: { type: "number", format: "double", example: 100 },
            totalSlots: { type: "integer", example: 100 },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        ParkingSlot: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "5c35cb84-31b8-4f60-bd4b-44c30fd6aef5",
            },
            lotId: {
              type: "string",
              format: "uuid",
              example: "dc9c8b4b-c22e-4b13-a4f5-8b92e53b6d52",
            },
            floorNumber: { type: "integer", example: 1 },
            slotNumber: { type: "string", example: "A-101" },
            slotType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV", "DISABLED"],
              example: "CAR",
            },
            status: {
              type: "string",
              enum: [
                "AVAILABLE",
                "TEMP_RESERVED",
                "RESERVED",
                "OCCUPIED",
                "MAINTENANCE",
              ],
              example: "AVAILABLE",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            deletedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "0d7f9d58-8e44-4fd4-b0bb-0b84e30fd5b1",
            },
            userId: { type: "string", format: "uuid" },
            vehicleId: { type: "string", format: "uuid" },
            lotId: { type: "string", format: "uuid" },
            slotId: { type: "string", format: "uuid" },
            bookingReference: { type: "string", example: "BK-1775479540000" },
            durationHours: { type: "integer", example: 4 },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
            totalAmount: { type: "number", format: "double", example: 200 },
            overstayMinutes: { type: "integer", example: 0 },
            overstayAmount: { type: "number", format: "double", example: 0 },
            bookingStatus: {
              type: "string",
              enum: [
                "PENDING_PAYMENT",
                "CONFIRMED",
                "ACTIVE",
                "OVERSTAY_PAYMENT_PENDING",
                "COMPLETED",
                "CANCELLED",
                "EXPIRED",
              ],
              example: "CONFIRMED",
            },
            expiresAt: { type: "string", format: "date-time", nullable: true },
            qrToken: { type: "string", nullable: true },
            qrExpiresAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            entryTime: { type: "string", format: "date-time", nullable: true },
            exitTime: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "8f57c8e2-68a8-4b1b-9d6c-8f4cdd2eac51",
            },
            bookingId: { type: "string", format: "uuid" },
            razorpayOrderId: {
              type: "string",
              nullable: true,
              example: "order_Q8A1B2C3D4E5",
            },
            razorpayPaymentId: {
              type: "string",
              nullable: true,
              example: "pay_Q8A1B2C3D4E5",
            },
            razorpaySignature: { type: "string", nullable: true },
            amount: { type: "number", format: "double", example: 250 },
            description: {
              type: "string",
              nullable: true,
              example: "Parking booking payment",
            },
            currency: { type: "string", example: "INR" },
            paymentMethod: {
              type: "string",
              nullable: true,
              enum: ["CARD", "UPI", "NET_BANKING", "WALLET"],
              example: "UPI",
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
              example: "SUCCESS",
            },
            paymentType: {
              type: "string",
              enum: ["BOOKING", "OVERSTAY", "REFUND"],
              example: "BOOKING",
            },
            paidAt: { type: "string", format: "date-time", nullable: true },
            failureReason: { type: "string", nullable: true },
            refundedAt: { type: "string", format: "date-time", nullable: true },
            refundAmount: {
              type: "number",
              format: "double",
              nullable: true,
              example: 0,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaymentOrder: {
          type: "object",
          properties: {
            paymentId: { type: "string", format: "uuid" },
            bookingId: { type: "string", format: "uuid" },
            orderId: { type: "string", example: "order_Q8A1B2C3D4E5" },
            amount: { type: "number", example: 200 },
            currency: { type: "string", example: "INR" },
            bookingReference: { type: "string", example: "BK-1775479540000" },
            paymentType: {
              type: "string",
              enum: ["BOOKING", "OVERSTAY"],
              example: "BOOKING",
            },
            razorpayKey: { type: "string", example: "rzp_test_xxxxx" },
          },
        },
        DashboardSummary: {
          type: "object",
          additionalProperties: true,
          example: {
            totalUsers: 120,
            totalParkingLots: 8,
            totalBookings: 340,
            totalRevenue: 24500,
          },
        },
      },
      requestBodies: {
        RegisterRequest: jsonBody({
          type: "object",
          required: ["name", "email", "password", "phone"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "John@123",
            },
            phone: { type: "string", example: "9876543210" },
          },
        }),
        LoginRequest: jsonBody({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "John@123",
            },
          },
        }),
        VerifyEmailRequest: jsonBody({
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              example: "3cbd698f6e1a4b89b85d7c3f2a9d6e21",
            },
          },
        }),
        EmailRequest: jsonBody({
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
          },
        }),
        ResetPasswordRequest: jsonBody({
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
              example: "3cbd698f6e1a4b89b85d7c3f2a9d6e21",
            },
            newPassword: {
              type: "string",
              format: "password",
              example: "John@456",
            },
          },
        }),
        CreateVehicleRequest: jsonBody({
          type: "object",
          required: ["vehicleNumber", "vehicleType"],
          properties: {
            vehicleNumber: { type: "string", example: "WB06AB1234" },
            vehicleType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV"],
              example: "CAR",
            },
          },
        }),
        UpdateVehicleRequest: jsonBody({
          type: "object",
          properties: {
            vehicleNumber: { type: "string", example: "WB06AB1234" },
            vehicleType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV"],
              example: "EV",
            },
          },
        }),
        CreateParkingLotRequest: jsonBody({
          type: "object",
          required: [
            "name",
            "address",
            "city",
            "state",
            "latitude",
            "longitude",
            "pricePerHour",
            "gracePeriodMinutes",
            "overstayRate",
            "totalSlots",
          ],
          properties: {
            name: { type: "string", example: "City Centre Parking" },
            description: {
              type: "string",
              example: "Covered parking facility",
            },
            address: { type: "string", example: "Sector V, Salt Lake" },
            city: { type: "string", example: "Kolkata" },
            state: { type: "string", example: "West Bengal" },
            latitude: { type: "number", example: 22.572646 },
            longitude: { type: "number", example: 88.363895 },
            pricePerHour: { type: "number", example: 50 },
            gracePeriodMinutes: { type: "integer", example: 15 },
            overstayRate: { type: "number", example: 100 },
            totalSlots: { type: "integer", example: 100 },
          },
        }),
        UpdateParkingLotRequest: jsonBody({
          type: "object",
          properties: {
            name: { type: "string", example: "City Centre Parking" },
            description: {
              type: "string",
              example: "Covered parking facility",
            },
            address: { type: "string", example: "Sector V, Salt Lake" },
            city: { type: "string", example: "Kolkata" },
            state: { type: "string", example: "West Bengal" },
            latitude: { type: "number", example: 22.572646 },
            longitude: { type: "number", example: 88.363895 },
            pricePerHour: { type: "number", example: 60 },
            gracePeriodMinutes: { type: "integer", example: 10 },
            overstayRate: { type: "number", example: 120 },
            totalSlots: { type: "integer", example: 120 },
            isActive: { type: "boolean", example: true },
          },
        }),
        CreateParkingSlotRequest: jsonBody({
          type: "object",
          required: ["lotId", "slotNumber", "slotType"],
          properties: {
            lotId: {
              type: "string",
              format: "uuid",
              example: "dc9c8b4b-c22e-4b13-a4f5-8b92e53b6d52",
            },
            floorNumber: { type: "integer", example: 1 },
            slotNumber: { type: "string", example: "A-101" },
            slotType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV", "DISABLED"],
              example: "CAR",
            },
          },
        }),
        UpdateParkingSlotRequest: jsonBody({
          type: "object",
          properties: {
            floorNumber: { type: "integer", example: 2 },
            slotNumber: { type: "string", example: "B-201" },
            slotType: {
              type: "string",
              enum: ["CAR", "BIKE", "EV", "DISABLED"],
              example: "EV",
            },
          },
        }),
        UpdateParkingSlotStatusRequest: jsonBody({
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: [
                "AVAILABLE",
                "TEMP_RESERVED",
                "RESERVED",
                "OCCUPIED",
                "MAINTENANCE",
              ],
              example: "MAINTENANCE",
            },
          },
        }),
        CreateBookingRequest: jsonBody({
          type: "object",
          required: ["slotId", "vehicleId", "durationHours"],
          properties: {
            slotId: { type: "string", format: "uuid" },
            vehicleId: { type: "string", format: "uuid" },
            durationHours: { type: "integer", minimum: 1, example: 4 },
          },
        }),
        CheckInRequest: jsonBody({
          type: "object",
          required: ["qrToken"],
          properties: {
            qrToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        }),
        VerifyPaymentRequest: jsonBody({
          type: "object",
          required: [
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
          ],
          properties: {
            razorpay_order_id: {
              type: "string",
              example: "order_Q8A1B2C3D4E5",
            },
            razorpay_payment_id: {
              type: "string",
              example: "pay_Q8A1B2C3D4E5",
            },
            razorpay_signature: {
              type: "string",
              example: "e91d9d8f0e7d4c2b...",
            },
          },
        }),
      },
      responses: {
        BadRequest: errorResponse("Bad request."),
        Unauthorized: errorResponse(
          "Authentication required or invalid token.",
        ),
        Forbidden: errorResponse(
          "You are not authorized to access this resource.",
        ),
        NotFound: errorResponse("Requested resource was not found."),
        Conflict: errorResponse("Resource conflicts with the current state."),
        InternalServerError: errorResponse("Internal server error."),
      },
    },
    paths: {
      "/test": {
        get: {
          tags: ["Test"],
          summary: "Test API availability",
          responses: {
            200: apiResponse("Test route responded successfully.", {
              type: "object",
              additionalProperties: true,
            }),
          },
        },
      },
      "/test/db": {
        get: {
          tags: ["Test"],
          summary: "Test database connection",
          responses: {
            200: apiResponse("Database connection is available.", {
              type: "object",
              additionalProperties: true,
            }),
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Authentication"],

          summary: "Register a new user",

          description:
            "Registers a new user account and sends an email verification link. The account must be verified before login.",

          operationId: "registerUser",

          requestBody: {
            $ref: "#/components/requestBodies/RegisterRequest",
          },

          responses: {
            201: {
              description: "User registered successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",

                            properties: {
                              user: {
                                $ref: "#/components/schemas/User",
                              },

                              emailSent: {
                                type: "boolean",
                                example: true,
                              },

                              canResendVerification: {
                                type: "boolean",
                                example: false,
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            409: {
              $ref: "#/components/responses/Conflict",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Authentication"],

          summary: "Login user",

          description:
            "Authenticates a verified user and returns the user's details. A JWT access token is also issued as an HTTP-only cookie.",

          parameters: [
            {
              in: "cookie",
              name: "accessToken",
              required: false,
              schema: {
                type: "string",
              },
              description:
                "JWT Access Token issued as an HTTP-only cookie after successful login.",
            },
          ],

          operationId: "loginUser",

          requestBody: {
            $ref: "#/components/requestBodies/LoginRequest",
          },

          responses: {
            200: {
              description: "Login successful.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/User",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/verify-email": {
        post: {
          tags: ["Authentication"],

          summary: "Verify user email",

          description:
            "Verifies a user's email address using the verification token sent during registration.",

          operationId: "verifyEmail",

          requestBody: {
            $ref: "#/components/requestBodies/VerifyEmailRequest",
          },

          responses: {
            200: {
              description: "Email verified successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              userId: {
                                type: "string",
                                format: "uuid",
                                example: "06c3b57f-088b-443d-b7d6-ae89285218be",
                              },
                              email: {
                                type: "string",
                                format: "email",
                                example: "john@example.com",
                              },
                              message: {
                                type: "string",
                                example: "Email verified successfully.",
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/resend-verification-email": {
        post: {
          tags: ["Authentication"],

          summary: "Resend verification email",

          description:
            "Generates a new email verification token and sends a fresh verification email to an unverified user.",

          operationId: "resendVerificationEmail",

          requestBody: {
            $ref: "#/components/requestBodies/ResendVerificationRequest",
          },

          responses: {
            200: {
              description: "Verification email sent successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              email: {
                                type: "string",
                                format: "email",
                                example: "john@example.com",
                              },
                              message: {
                                type: "string",
                                example:
                                  "Verification email sent successfully.",
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Authentication"],

          summary: "Forgot password",

          description:
            "Sends a password reset email if an account with the provided email exists. For security reasons, the same success response is returned even if the email is not registered.",

          operationId: "forgotPassword",

          requestBody: {
            $ref: "#/components/requestBodies/ForgotPasswordRequest",
          },

          responses: {
            200: {
              description: "Password reset email processed.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/reset-password": {
        post: {
          tags: ["Authentication"],

          summary: "Reset password",

          description:
            "Resets the user's password using a valid password reset token.",

          operationId: "resetPassword",

          requestBody: {
            $ref: "#/components/requestBodies/ResetPasswordRequest",
          },

          responses: {
            200: {
              description: "Password reset successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Authentication"],

          summary: "Logout user",

          description:
            "Logs out the currently authenticated user by clearing the access token cookie.",

          operationId: "logoutUser",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Logout successful.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Authentication"],

          summary: "Get current user",

          description:
            "Returns the profile of the currently authenticated user.",

          operationId: "getCurrentUser",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Current user fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/User",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/vehicles": {
        post: {
          tags: ["Vehicles"],

          summary: "Register a vehicle",

          description: "Registers a new vehicle for the authenticated user.",

          operationId: "createVehicle",

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            $ref: "#/components/requestBodies/CreateVehicleRequest",
          },

          responses: {
            201: {
              description: "Vehicle registered successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Vehicle",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            409: {
              $ref: "#/components/responses/Conflict",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        get: {
          tags: ["Vehicles"],

          summary: "Get my registered vehicles",

          description:
            "Returns all vehicles registered by the authenticated user.",

          operationId: "getMyVehicles",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Vehicles fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/Vehicle",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/vehicles/{vehicleId}": {
        get: {
          tags: ["Vehicles"],

          summary: "Get vehicle by ID",

          description:
            "Returns details of a specific vehicle belonging to the authenticated user.",

          operationId: "getVehicleById",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: "vehicleId",
              in: "path",
              required: true,
              description: "Vehicle ID",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Vehicle fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Vehicle",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        patch: {
          tags: ["Vehicles"],

          summary: "Update vehicle",

          description:
            "Updates the details of a registered vehicle belonging to the authenticated user.",

          operationId: "updateVehicle",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: "vehicleId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          requestBody: {
            $ref: "#/components/requestBodies/UpdateVehicleRequest",
          },

          responses: {
            200: {
              description: "Vehicle updated successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Vehicle",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        delete: {
          tags: ["Vehicles"],

          summary: "Delete vehicle",

          description:
            "Deletes a vehicle registered by the authenticated user.",

          operationId: "deleteVehicle",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: "vehicleId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Vehicle deleted successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Vehicle",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/parking-lots": {
        post: {
          tags: ["Parking Lots"],

          summary: "Create Parking Lot",

          description:
            "Creates a new parking lot. Only users with the ADMIN role are authorized to perform this operation.",

          operationId: "createParkingLot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ParkingLot",
                },
              },
            },
          },

          responses: {
            201: {
              description: "Parking lot created successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingLot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        get: {
          tags: ["Parking Lots"],

          summary: "Get all parking lots",

          description: "Returns all active parking lots. Public endpoint.",

          operationId: "getAllParkingLots",

          responses: {
            200: {
              description: "Parking lots fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/ParkingLot",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/parking-lots/{id}": {
        get: {
          tags: ["Parking Lots"],

          summary: "Get parking lot by ID",

          description: "Returns details of a specific parking lot.",

          operationId: "getParkingLotById",

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Parking Lot ID",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Parking lot fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingLot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        patch: {
          tags: ["Parking Lots"],

          summary: "Update parking lot",

          description:
            "Updates an existing parking lot. Only ADMIN users are authorized.",

          operationId: "updateParkingLot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ParkingLot",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Parking lot updated successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingLot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        delete: {
          tags: ["Parking Lots"],

          summary: "Delete parking lot",

          description:
            "Deletes a parking lot. Only ADMIN users are authorized.",

          operationId: "deleteParkingLot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Parking lot deleted successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                    ],
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/parking-slots": {
        post: {
          tags: ["Parking Slots"],

          summary: "Create Parking Slot",

          description:
            "Creates a new parking slot within a parking lot. Only ADMIN users are authorized.",

          operationId: "createParkingSlot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ParkingSlot",
                },
              },
            },
          },

          responses: {
            201: {
              description: "Parking slot created successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingSlot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        get: {
          tags: ["Parking Slots"],

          summary: "Get Parking Slots",

          description:
            "Returns parking slots. Supports filtering using query parameters such as lotId, slotType, status and floorNumber.",

          operationId: "getParkingSlots",

          parameters: [
            {
              in: "query",
              name: "lotId",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
            {
              in: "query",
              name: "slotType",
              schema: {
                type: "string",
                enum: ["CAR", "BIKE", "EV", "DISABLED"],
              },
            },
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: [
                  "AVAILABLE",
                  "TEMP_RESERVED",
                  "RESERVED",
                  "OCCUPIED",
                  "MAINTENANCE",
                ],
              },
            },
            {
              in: "query",
              name: "floorNumber",
              schema: {
                type: "integer",
              },
            },
          ],

          responses: {
            200: {
              description: "Parking slots fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/ParkingSlot",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/parking-slots/{id}": {
        get: {
          tags: ["Parking Slots"],

          summary: "Get Parking Slot by ID",

          operationId: "getParkingSlotById",

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Parking slot fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingSlot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        patch: {
          tags: ["Parking Slots"],

          summary: "Update Parking Slot",

          description:
            "Updates slot details such as floor number, slot number or slot type. ADMIN only.",

          operationId: "updateParkingSlot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ParkingSlot",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Parking slot updated successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingSlot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        delete: {
          tags: ["Parking Slots"],

          summary: "Delete Parking Slot",

          description:
            "Deletes a parking slot. Only ADMIN users are authorized.",

          operationId: "deleteParkingSlot",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Parking slot deleted successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/parking-slots/{id}/status": {
        patch: {
          tags: ["Parking Slots"],

          summary: "Update Parking Slot Status",

          description:
            "Updates only the status of a parking slot (AVAILABLE, RESERVED, OCCUPIED, etc.). Only ADMIN users are authorized.",

          operationId: "updateParkingSlotStatus",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: [
                        "AVAILABLE",
                        "TEMP_RESERVED",
                        "RESERVED",
                        "OCCUPIED",
                        "MAINTENANCE",
                      ],
                      example: "AVAILABLE",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Parking slot status updated successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/ParkingSlot",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings": {
        post: {
          tags: ["Bookings"],
          summary: "Create Booking",
          description:
            "Creates a parking booking for the authenticated user and reserves the selected parking slot.",

          operationId: "createBooking",

          security: [{ bearerAuth: [] }],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["slotId", "vehicleId", "durationHours"],
                  properties: {
                    slotId: {
                      type: "string",
                      format: "uuid",
                    },
                    vehicleId: {
                      type: "string",
                      format: "uuid",
                    },
                    durationHours: {
                      type: "integer",
                      example: 2,
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Booking created successfully.",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Booking",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },

        get: {
          tags: ["Bookings"],

          summary: "Get My Bookings",

          description:
            "Returns all bookings belonging to the authenticated user.",

          operationId: "getBookings",

          security: [{ bearerAuth: [] }],

          responses: {
            200: {
              description: "Bookings fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/Booking",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings/check-in": {
        post: {
          tags: ["Bookings"],

          summary: "Check In Vehicle",

          description:
            "Checks in a vehicle using the QR token generated after successful booking.",

          operationId: "checkIn",

          security: [{ bearerAuth: [] }],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["qrToken"],
                  properties: {
                    qrToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Vehicle checked in successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings/{bookingId}": {
        get: {
          tags: ["Bookings"],

          summary: "Get Booking Details",

          operationId: "getBookingById",

          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "bookingId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Booking details fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Booking",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings/{bookingId}/cancel": {
        patch: {
          tags: ["Bookings"],

          summary: "Cancel Booking",

          operationId: "cancelBooking",

          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "bookingId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Booking cancelled successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Booking",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings/{bookingId}/checkout": {
        patch: {
          tags: ["Bookings"],

          summary: "Checkout Vehicle",

          operationId: "checkOut",

          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "bookingId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Checkout processed successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/bookings/{bookingId}/gate-status": {
        get: {
          tags: ["Bookings"],

          summary: "Get Gate Status",

          description:
            "Returns the current gate access status for the booking.",

          operationId: "getGateStatus",

          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "bookingId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            200: {
              description: "Gate status fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/payments": {
        get: {
          tags: ["Payments"],
          summary: "Get logged-in user's payment history",
          security: [{ bearerAuth: [] }],
          parameters: [
            queryParam(
              "page",
              { type: "integer", minimum: 1, example: 1 },
              "Page number",
            ),
            queryParam(
              "limit",
              { type: "integer", minimum: 1, maximum: 100, example: 10 },
              "Page size",
            ),
            queryParam("search", { type: "string" }, "Search text"),
            queryParam(
              "paymentMethod",
              {
                type: "string",
                enum: ["CARD", "UPI", "NET_BANKING", "WALLET"],
              },
              "Filter by payment method",
            ),
            queryParam(
              "paymentType",
              {
                type: "string",
                enum: ["BOOKING", "OVERSTAY", "REFUND"],
              },
              "Filter by payment type",
            ),
            queryParam(
              "paymentStatus",
              {
                type: "string",
                enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
              },
              "Filter by payment status",
            ),
            queryParam(
              "from",
              { type: "string", format: "date-time" },
              "Start date filter",
            ),
            queryParam(
              "to",
              { type: "string", format: "date-time" },
              "End date filter",
            ),
            queryParam(
              "sort",
              { type: "string", enum: ["asc", "desc"], example: "desc" },
              "Sort by created date",
            ),
          ],
          responses: {
            200: apiResponse(
              "Payment history fetched successfully.",
              paginatedSchema(
                "filteredPaymentRecords",
                "#/components/schemas/Payment",
                "totalPayments",
              ),
            ),
            401: { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/payments/{bookingId}/order": {
        post: {
          tags: ["Payments"],

          summary: "Create Payment Order",

          description:
            "Creates a Razorpay payment order for the specified booking. Authentication required.",

          operationId: "createPaymentOrder",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "bookingId",
              required: true,
              description: "Booking ID",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          responses: {
            201: {
              description: "Payment order created successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/PaymentOrder",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/payments/{bookingId}/verify": {
        post: {
          tags: ["Payments"],

          summary: "Verify Payment",

          description:
            "Verifies a completed Razorpay payment and updates the booking/payment status.",

          operationId: "verifyPayment",

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              in: "path",
              name: "bookingId",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",

                  required: [
                    "razorpay_order_id",
                    "razorpay_payment_id",
                    "razorpay_signature",
                  ],

                  properties: {
                    razorpay_order_id: {
                      type: "string",
                      example: "order_Q8A1B2C3D4E5",
                    },

                    razorpay_payment_id: {
                      type: "string",
                      example: "pay_Q8A1B2C3D4E5",
                    },

                    razorpay_signature: {
                      type: "string",
                      example: "9d7cfd5d9ef75ef6b...",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Payment verified successfully.",

              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/ApiResponse",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/Booking",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },

            400: {
              $ref: "#/components/responses/BadRequest",
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            404: {
              $ref: "#/components/responses/NotFound",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/dashboard/summary": {
        get: {
          tags: ["Dashboard"],

          summary: "Dashboard Summary",

          description:
            "Returns an overview of users, vehicles, parking lots, parking slots, booking statistics and revenue. Accessible only to ADMIN users.",

          operationId: "getDashboardSummary",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Dashboard summary fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/dashboard/bookings": {
        get: {
          tags: ["Dashboard"],

          summary: "Booking Statistics",

          description:
            "Returns booking statistics including total, daily, weekly, monthly bookings and booking status distribution. Accessible only to ADMIN users.",

          operationId: "getBookingStatistics",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Booking statistics fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
      "/dashboard/revenue": {
        get: {
          tags: ["Dashboard"],

          summary: "Revenue Statistics",

          description:
            "Returns revenue analytics including total, daily, weekly, monthly, booking revenue, overstay revenue, refund amount and payment status distribution. Accessible only to ADMIN users.",

          operationId: "getRevenueStatistics",

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            200: {
              description: "Revenue statistics fetched successfully.",

              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ApiResponse",
                  },
                },
              },
            },

            401: {
              $ref: "#/components/responses/Unauthorized",
            },

            403: {
              $ref: "#/components/responses/Forbidden",
            },

            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
