export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forgot Password</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        color: #333; 
        line-height: 1.6; 
        margin: 0; 
        padding: 0; 
        background-color: #f4f4f4; 
      }
      .container { 
        max-width: 600px; 
        margin: 20px auto; 
        padding: 20px; 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        background-color: #fff; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
      }
      h1 { 
        text-align: center; 
        color: #007bff; 
        margin-bottom: 20px; 
      }
      p { 
        margin: 10px 0; 
      }
      .highlight { 
        font-weight: bold; 
        color: #007bff; 
      }
      .button { 
        display: inline-block; 
        margin: 20px 0; 
        padding: 10px 20px; 
        font-size: 16px; 
        color: #fff; 
        background-color: #007bff; 
        text-decoration: none; 
        border-radius: 5px; 
        text-align: center; 
      }
      .footer { 
        margin-top: 20px; 
        font-size: 0.9em; 
        color: #666; 
      }
      .footer p { 
        margin: 5px 0; 
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Reset Your Password</h1>
      <p>Dear <span class="highlight">{{email}}</span>,</p>
      <p>
        We received a request to reset your password. Click the button below to reset it:
      </p>
      <p>
        <a href="{{link}}" target="_blank" class="button">Reset Password</a>
      </p>
      <p>
        If you didn’t request this, please ignore this email or contact our support team if you have any concerns.
      </p>
      <div class="footer">
        <p>Star Ticket - Your trusted platform for event ticketing.</p>
        <p>
          Need help? Contact our support team at 
          <a href="mailto:support@starticket.com">support@starticket.com</a>.
        </p>
        <p>
          Thank you for choosing <span class="highlight">Star Ticket</span>!
        </p>
      </div>
    </div>
  </body>
</html>
`;
