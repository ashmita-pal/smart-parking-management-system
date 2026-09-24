const passwordResetSuccessTemplate = ({ name }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Successful</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #070B14;
          font-family: Arial, sans-serif;
          color: #ffffff;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 40px auto;
            padding: 40px 30px;
            background-color: #0A0F1C;
            border: 1px solid #1f2937;
            border-radius: 16px;
          "
        >
          <h1
            style="
              margin: 0 0 24px;
              color: #22d3ee;
              font-size: 28px;
            "
          >
            ParkSphere
          </h1>

          <h2
            style="
              margin: 0 0 20px;
              color: #ffffff;
              font-size: 22px;
            "
          >
            Password Reset Successful
          </h2>

          <p
            style="
              margin: 0 0 16px;
              color: #d1d5db;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            Hi ${name},
          </p>

          <p
            style="
              margin: 0 0 16px;
              color: #d1d5db;
              font-size: 16px;
              line-height: 1.6;
            "
          >
            Password reset for your ParkSphere account is successful!
            You can now log in with your new password.
          </p>

          <p
            style="
              margin: 24px 0 0;
              color: #9ca3af;
              font-size: 14px;
              line-height: 1.6;
            "
          >
            If you did not make this change, please contact ParkSphere
            support immediately.
          </p>

          <p
            style="
              margin: 30px 0 0;
              color: #9ca3af;
              font-size: 14px;
            "
          >
            Regards,<br />
            ParkSphere Team
          </p>
        </div>
      </body>
    </html>
  `;
};

export default passwordResetSuccessTemplate ;