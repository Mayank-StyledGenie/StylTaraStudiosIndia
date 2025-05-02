import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

// Define coaching data interface
interface CoachingData {
  fullName: string;
  contactEmail: string;
  contactPhone: string;
  occupation: string;
  coachingPurpose: string;
  coachingMode: string;
  preferredDateTime: string;
  hasPreviousCoaching: string;
  preferredLanguage: string;
  additionalExpectations?: string;
  createdAt: Date;
  status: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const coachingData: CoachingData = {
      fullName: '',
      contactEmail: '',
      contactPhone: '',
      occupation: '',
      coachingPurpose: '',
      coachingMode: '',
      preferredDateTime: '',
      hasPreviousCoaching: '',
      preferredLanguage: '',
      createdAt: new Date(),
      status: 'pending'
    };

    for (const [key, value] of formData.entries()) {
      coachingData[key] = value as string;
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('user_soft_skills_coaching_requests');

    const result = await collection.insertOne(coachingData);

    await client.close();

    await sendConfirmationEmails(coachingData);

    return NextResponse.json({
      success: true,
      message: 'Soft Skills and Etiquette Coaching request submitted successfully',
      id: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error in soft skills coaching submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit soft skills coaching request',
    }, { status: 500 });
  }
}

async function sendConfirmationEmails(coachingData: CoachingData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const clientMailOptions = {
    from: process.env.MAIL_USER,
    to: coachingData.contactEmail,
    subject: 'Your Soft Skills & Etiquette Coaching is Confirmed!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StylTara Studios Soft Skills & Etiquette Coaching Confirmation</title>
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
            color: white;
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
            border-left: 4px solid #401735;
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
          
          .appointment-details {
            background-color: #f7fafc;
            padding: 20px;
            border-radius: 5px;
            margin: 30px 0;
          }
          
          .appointment-item {
            margin-bottom: 10px;
          }
          
          .appointment-label {
            font-weight: 600;
            color: #4a5568;
          }
          
          .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 30px 0;
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
          
          .address {
            font-size: 12px;
            color: #a0aec0;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>StylTara Studios</h1>
          </div>
          
          <div class="email-body">
            <h1 class="welcome-title">Your Soft Skills & Etiquette Coaching is Confirmed!</h1>

            <p class="message">Dear ${coachingData.fullName},</p>
            
            <p class="message">Thank you for choosing Styltara Studios Pvt Ltd for your Soft Skills & Etiquette Coaching. We’re excited to support your personal and professional growth with customized, impactful sessions.</p>
            
            <div class="highlight-box">
              <p class="highlight-text">Payment and session information will be shared with you shortly.</p>
            </div>
            
            
            <p class="message">We look forward to working together to enhance your confidence and presence.</p>
            <p class="message">Best regards,</p>
            <p class="message">Team StylTara Studios </p>
            <a href="https://www.styltarastudios.com" style="display: inline-block; color: rgb(0, 17, 173); font-weight: 500;">www.styltarastudios.com</a>
          </div>
          
          <div class="email-footer">
            
            <p>© 2025 StylTara Studios. All rights reserved.</p>
            <p class="address">Jaipur, Rajasthan</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const adminMailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER, 
    subject: 'New Soft Skills & Etiquette Coaching Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #401735; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Soft Skills & Etiquette Coaching Request</h2>
        <p>A new soft skills and etiquette coaching session has been requested on your platform.</p>
        
        <h3 style="color: #4a5568;">Client Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.contactEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.contactPhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Occupation:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.occupation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Coaching Purpose:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.coachingPurpose}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Coaching Mode:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.coachingMode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Date/Time:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date(coachingData.preferredDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Previous Coaching Experience:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.hasPreviousCoaching}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Language:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.preferredLanguage}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Additional Expectations:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.additionalExpectations ?? 'None provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Request Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${coachingData.createdAt.toLocaleString()}</td>
          </tr>
        </table>
        
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">This is an automated message from your StylTara Studios website.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Soft skills coaching confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending soft skills coaching confirmation emails:', error);
  }
}