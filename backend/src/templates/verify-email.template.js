const verifyEmailTemplate = ({ name, verificationCode }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;margin:40px auto;border-radius:10px;padding:40px;">

                    <tr>
                        <td align="center">

                            <h1 style="color:#2563eb;margin-bottom:10px;">
                                Smart Parking Management
                            </h1>

                            <h2 style="color:#111827;">
                                Verify Your Email
                            </h2>

                            <p style="font-size:16px;color:#4b5563;line-height:1.6;">
                                Hello <strong>${name}</strong>,
                            </p>

                            <p style="font-size:16px;color:#4b5563;line-height:1.6;">
                                Thank you for registering with Smart Parking Management System.
                                Please use the verification code below to verify your email address.
                            </p>

                            <div style="
                                margin:35px 0;
                                padding:20px;
                                background:#f3f4f6;
                                border-radius:10px;
                                display:inline-block;
                            ">

                                <p style="
                                    margin:0 0 10px 0;
                                    font-size:14px;
                                    color:#6b7280;
                                ">
                                    Your verification code
                                </p>

                                <div style="
                                    font-size:36px;
                                    font-weight:bold;
                                    letter-spacing:8px;
                                    color:#2563eb;
                                ">
                                    ${verificationCode}
                                </div>

                            </div>

                            <p style="font-size:14px;color:#6b7280;">
                                This verification code will expire in
                                <strong>5 minutes</strong>.
                            </p>

                            <p style="font-size:14px;color:#6b7280;">
                                If you did not create this account, you can safely ignore this email.
                            </p>

                            <hr style="
                                margin:35px 0;
                                border:none;
                                border-top:1px solid #e5e7eb;
                            ">

                            <p style="font-size:12px;color:#9ca3af;">
                                Â© ${new Date().getFullYear()} Smart Parking Management System
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;
};

export default verifyEmailTemplate;