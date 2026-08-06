const verifyEmailTemplate = ({ name, verificationUrl }) => {
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
                                Please verify your email address by clicking the button below.
                            </p>

                            <div style="margin:35px 0;">
                                <a href="${verificationUrl}"
                                    style="
                                        background:#2563eb;
                                        color:#ffffff;
                                        text-decoration:none;
                                        padding:15px 30px;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-size:16px;
                                        font-weight:bold;
                                    ">
                                    Verify Email
                                </a>
                            </div>

                            <p style="font-size:14px;color:#6b7280;">
                                This verification link will expire in
                                <strong>24 hours</strong>.
                            </p>

                            <p style="font-size:14px;color:#6b7280;">
                                If you did not create this account, you can safely ignore this email.
                            </p>

                            <hr style="margin:35px 0;border:none;border-top:1px solid #e5e7eb;">

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