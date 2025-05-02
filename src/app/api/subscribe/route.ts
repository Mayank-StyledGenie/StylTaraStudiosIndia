import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface SubscribeRequestBody {
  email: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json() as SubscribeRequestBody;
    const { email } = body;
    
    if (!email?.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }
    
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error('Missing email configuration: MAIL_USER or MAIL_PASS environment variables are not set');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS 
      }
    });

    const subscriberMailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'StylTara Studios: Newsletter Subscription Confirmation',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>StylTara Studios Newsletter Confirmation</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Poppins', Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            
            .email-header {
              background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
              padding: 30px 0;
              text-align: center;
            }
            
            .logo {
              margin: 0 auto;
              display: block;
              width: 180px;
            }
            
            .email-body {
              padding: 40px 30px;
              color: #4a5568;
            }
            
            .welcome-title {
              color: #2d3748;
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
              text-align: center;
            }
            
            .message {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 25px;
            }
            
            .highlight-box {
              background-color: #f7fafc;
              border-left: 4px solid #5a67d8;
              padding: 20px;
              margin: 30px 0;
              border-radius: 0 5px 5px 0;
            }
            
            .highlight-text {
              font-weight: 500;
              font-size: 16px;
              color: #2d3748;
              margin: 0;
            }
            
            .cta-container {
              text-align: center;
              margin: 35px 0;
            }
            
            .cta-button {
              display: inline-block;
              background-color: #5a67d8;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 30px;
              font-weight: 600;
              font-size: 16px;
              transition: background-color 0.3s;
            }
            
            .cta-button:hover {
              background-color: #4c51bf;
            }
            
            .feature-section {
              display: table;
              width: 100%;
              margin: 30px 0;
              border-spacing: 10px;
            }
            
            .feature {
              display: table-cell;
              width: 33.33%;
              text-align: center;
              padding: 20px 15px;
              background-color: #f7fafc;
              border-radius: 8px;
              vertical-align: top;
            }
            
            .feature-icon {
              font-size: 24px;
              margin-bottom: 10px;
              color: #5a67d8;
            }
            
            .feature-title {
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 8px;
              color: #2d3748;
            }
            
            .feature-text {
              font-size: 14px;
              color: #718096;
            }
            
            .divider {
              height: 1px;
              background-color: #e2e8f0;
              margin: 30px 0;
            }
            
            .social-section {
              text-align: center;
              margin: 30px 0;
            }
            
            .social-title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 15px;
              color: #2d3748;
            }
            
            .social-icons {
              margin-bottom: 20px;
            }
            
            .social-icon {
              display: inline-block;
              margin: 0 10px;
              width: 40px;
              height: 40px;
              background-color: #5a67d8;
              border-radius: 50%;
              text-align: center;
              line-height: 40px;
            }
            
            .social-icon img {
              vertical-align: middle;
              width: 20px;
              height: 20px;
            }
            
            .email-footer {
              background-color: #1a202c;
              color: #e2e8f0;
              padding: 30px;
              text-align: center;
              font-size: 14px;
            }
            
            .footer-links {
              margin-bottom: 15px;
            }
            
            .footer-link {
              color: #e2e8f0;
              text-decoration: none;
              margin: 0 10px;
            }
            
            .footer-link:hover {
              text-decoration: underline;
            }
            
            .address {
              font-size: 12px;
              color: #a0aec0;
              margin-top: 15px;
            }
            
            @media only screen and (max-width: 600px) {
              .email-body {
                padding: 30px 20px;
              }
              
              .feature-section {
                display: block;
              }
              
              .feature {
                display: block;
                width: 100%;
                margin-bottom: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
               {<Link href="/" className="flex h-12">
                <span className=" flex">
                  <Image
                    src={Logo}
                    alt="StylTara Studios" 
                    width={70} 
                    height={35}
                    className="h-auto w-auto"
                  />
                </span>
            </Link>}
            </div>
            
            <div class="email-body">
              <h1 class="welcome-title">Welcome to StylTara Studios!</h1>
              
              <p class="message">Thank you for subscribing to our newsletter. We're thrilled to have you join our creative community!</p>
              
              <div class="highlight-box">
                <p class="highlight-text">You've successfully subscribed with: <strong>${email}</strong></p>
              </div>
              
              <p class="message">As a subscriber, you'll receive exclusive updates on:</p>
              
              <div class="feature-section">
                <div class="feature">
                  <div class="feature-icon">🎨</div>
                  <div class="feature-title">New Designs</div>
                  <div class="feature-text">Be the first to see our latest creative work</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🏷️</div>
                  <div class="feature-title">Special Offers</div>
                  <div class="feature-text">Exclusive discounts for our subscribers</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">✨</div>
                  <div class="feature-title">Events</div>
                  <div class="feature-text">Invitations to our upcoming showcases</div>
                </div>
              </div>
              
              <div class="cta-container">
                <a href="https://styltarastudios.com/collections" class="cta-button">Browse Our Collections</a>
              </div>
              
              <div class="divider"></div>
              
              <div class="social-section">
                <div class="social-title">Connect With Us</div>
                <div class="social-icons">
                  <a href="https://instagram.com/styltarastudios" class="social-icon">
                    <img src="https://i.ibb.co/1GStGfq/instagram.png" alt="Instagram">
                  </a>
                  <a href="https://facebook.com/styltarastudios" class="social-icon">
                    <img src="https://i.ibb.co/SrhkmmL/facebook.png" alt="Facebook">
                  </a>
                  <a href="https://pinterest.com/styltarastudios" class="social-icon">
                    <img src="https://i.ibb.co/ysHG02L/pinterest.png" alt="Pinterest">
                  </a>
                </div>
              </div>
            </div>
            
            <div class="email-footer">
              <div class="footer-links">
                <a href="https://styltarastudios.com/privacy" class="footer-link">Privacy Policy</a>
                <a href="https://styltarastudios.com/terms" class="footer-link">Terms of Service</a>
                <a href="https://styltarastudios.com/unsubscribe?email=${email}" class="footer-link">Unsubscribe</a>
              </div>
              <p>© 2025 StylTara Studios. All rights reserved.</p>
              <p class="address">123 Fashion Avenue, Design District, NY 10001</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const adminMailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, 
      subject: 'New Newsletter Subscriber',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Subscriber Alert</h2>
          <p>A new user has subscribed to your newsletter.</p>
          <p>Email: ${email}</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await transporter.sendMail(subscriberMailOptions);
    await transporter.sendMail(adminMailOptions);

    
    return new Response(JSON.stringify({ success: true, message: 'Subscription successful' }), {
      headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=5'
      }
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return Response.json({ error: 'Failed to subscribe, please try again later' }, { status: 500 });
  }
}