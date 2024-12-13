<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .body {
            padding: 20px;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #555555;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <div class="body">
            <p>Hi <strong>{{$name}}</strong>,</p>
            <p>We received a request to reset your password for your <strong>HN NEWS STAR</strong> account. Your new temporary password is:</p>
            <p style="font-size: 18px; font-weight: bold; text-align: center;">{{$password}}</p>
            <p>Use the button below to log in and change your password:</p>
            <a href="[Login and Reset Password Link]" class="btn">Reset Your Password</a>
            <p>If you didn't request this, please ignore this email or contact our support team immediately.</p>
        </div>
        <div class="footer">
            <p>&copy; <?php echo date('Y'); ?> HN NEWS STAR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>