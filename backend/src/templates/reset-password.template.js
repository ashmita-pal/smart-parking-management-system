const resetPasswordTemplate = ({ name, resetUrl }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

<tr>
<td align="center" style="background:#2563eb;padding:25px;color:#ffffff;font-size:26px;font-weight:bold;">
Smart Parking Management System
</td>
</tr>

<tr>
<td style="padding:40px;color:#333333;">

<h2>Hello ${name},</h2>

<p style="font-size:16px;line-height:26px;">
We received a request to reset your password.
</p>

<p style="font-size:16px;line-height:26px;">
Click the button below to create a new password.
</p>

<div style="text-align:center;margin:35px 0;">
<a
href="${resetUrl}"
style="
background:#2563eb;
color:#ffffff;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
display:inline-block;
font-size:16px;
font-weight:bold;
">
Reset Password
</a>
</div>

<p style="font-size:15px;color:#555;">
This password reset link will expire in <strong>15 minutes</strong>.
</p>

<p style="font-size:15px;color:#555;">
If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
</p>

<hr style="margin:35px 0;border:none;border-top:1px solid #eeeeee;">

<p style="font-size:14px;color:#777;">
If the button doesn't work, copy and paste the following URL into your browser:
</p>

<p style="word-break:break-all;font-size:13px;color:#2563eb;">
${resetUrl}
</p>

</td>
</tr>

<tr>
<td align="center" style="background:#f9fafb;padding:18px;font-size:13px;color:#888;">
© ${new Date().getFullYear()} Smart Parking Management System
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

export default resetPasswordTemplate;