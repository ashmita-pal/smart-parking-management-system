import {
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  PAYMENT_METHOD,
} from "../constants/payment.constants.js";

const paymentFilters=({
    userId,
    search,
    paymentType,
    paymentStatus,
    paymentMethod,
    from,
    to,
    razorpayId,
})=>{
    const where= {
        booking:{
            userId,
        },
    };

    if (search?.trim()) {
    where.OR = [
      {
        booking: {
          bookingReference: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      },
      {
        razorpayPaymentId: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if(paymentStatus && Object.values(PAYMENT_STATUS).includes(paymentStatus)){
    where.paymentStatus= paymentStatus;
  }

  if(paymentMethod && Object.values(PAYMENT_METHOD).includes(paymentMethod)){
    where.paymentMethod= paymentMethod;
  }

  if(paymentType && Object.values(PAYMENT_TYPE).includes(paymentType)){
    where.paymentType= paymentType;
  }

  if(from || to){
    const createdAt={};

    if(from){
        where.createdAt.gte=new Date(from);
    }

    if(to){
        where.createdAt.lte=new Date(to);
    }
  }

};

export {paymentFilters};

