export const getVerificationEmailTemplate = (
  fullName,
  verificationCode,
  companyName = "Merofly"
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #007bff;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
            }
            .verification-code {
                background: linear-gradient(135deg, #007bff, #0056b3);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin: 30px 0;
                box-shadow: 0 4px 15px rgba(0,123,255,0.3);
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 10px 0;
                font-family: 'Courier New', monospace;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">${companyName}</div>
                <h1 style="color: #333; margin: 0;">Email Verification</h1>
            </div>
            
            <p>Hello <strong>${fullName}</strong>,</p>
            
            <p>Thank you for registering with ${companyName}! To complete your registration and secure your account, please verify your email address using the verification code below:</p>
            
            <div class="verification-code">
                <p style="margin: 0; font-size: 16px;">Your Verification Code</p>
                <div class="code">${verificationCode}</div>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Enter this code to verify your email</p>
            </div>
            
            <div class="warning">
                <strong>⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong> for security reasons.
            </div>
            
            <p>If you didn't create an account with ${companyName}, please ignore this email or contact our support team if you have concerns.</p>
            
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                <p style="font-size: 12px; margin-top: 20px;">
                    If you're having trouble with verification, please contact our support team.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getWelcomeEmailTemplate = (name, companyName = "Your App") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${companyName}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #28a745;
                margin-bottom: 10px;
            }
            .success-icon {
                font-size: 48px;
                color: #28a745;
                margin: 20px 0;
            }
            .cta-button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
                text-align: center;
            }
            .features {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .feature-item {
                margin: 10px 0;
                padding-left: 25px;
                position: relative;
            }
            .feature-item:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #28a745;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">${companyName}</div>
                <div class="success-icon">🎉</div>
                <h1 style="color: #333; margin: 0;">Welcome to ${companyName}!</h1>
            </div>
            
            <p>Hello <strong>${name}</strong>,</p>
            
            <p>Congratulations! Your email has been successfully verified and your account is now active. Welcome to the ${companyName} community!</p>
            
            <div class="features">
                <h3 style="margin-top: 0; color: #333;">What you can do now:</h3>
                <div class="feature-item">Access your personalized dashboard</div>
                <div class="feature-item">Update your profile and preferences</div>
                <div class="feature-item">Explore all available features</div>
                <div class="feature-item">Connect with our community</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${
                  process.env.FRONTEND_URL
                }/dashboard" class="cta-button">Get Started Now</a>
            </div>
            
            <p>If you have any questions or need assistance, our support team is here to help. Don't hesitate to reach out!</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px;">
                <p>Thank you for choosing ${companyName}!</p>
                <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
