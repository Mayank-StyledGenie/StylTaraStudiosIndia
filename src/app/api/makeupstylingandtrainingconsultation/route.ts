import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// Define interfaces for the consultation data
interface ConsultationData {
  fullName: string;
  contactEmail: string;
  contactPhone: string;
  consultationMode: string;
  trainingLocation?: string;
  areaOfInterest: string;
  hasBackground: string;
  backgroundDetails?: string;
  trainingReason?: string;
  preferredLanguage: string;
  preferredDateTime: string;
  additionalQuestions?: string;
  createdAt: Date;
  status: string;
  [key: string]: unknown; // For any other fields that might be in the form
}

// Define mail options interface
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const consultationData: ConsultationData = {
      fullName: '',
      contactEmail: '',
      contactPhone: '',
      consultationMode: '',
      areaOfInterest: '',
      hasBackground: '',
      preferredLanguage: '',
      preferredDateTime: '',
      createdAt: new Date(),
      status: 'pending'
    };
    
    for (const [key, value] of formData.entries()) {
      consultationData[key] = value as string;
    }
    
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection('user_makeup_styling_training_consultations');
    
    const result = await collection.insertOne(consultationData);
    
    await client.close();
    
    await sendConfirmationEmails(consultationData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Makeup and styling training consultation request submitted successfully',
      id: result.insertedId 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error in makeup and styling training consultation submission:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit makeup and styling training consultation request', 
    }, { status: 500 });
  }
}

async function sendConfirmationEmails(consultationData: ConsultationData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const clientMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: consultationData.contactEmail,
    subject: 'Your Training at Styltara Studios is Booked!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StylTara Studios Makeup & Styling Training Consultation Confirmation</title>
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
            margin-top: 20px;
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
            .footer-link{
            color:rgb(0, 50, 116);
            margin-bottom: 19px;
            }
          .footer-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>StylTara Studios</h1>
          </div>
          
          <div class="email-body">
            <h1 class="welcome-title">Your Training at Styltara Studios is Booked!</h1>

            <p class="message">Dear ${consultationData.fullName},</p>
            
            <p class="message">Thank you for enrolling in our <b>Makeup & Styling Training</b> program at <b>Styltara Studios Pvt Ltd!</b> You’re one step closer to mastering the skills and creativity needed in the world of beauty and fashion.</p>
            
            <div class="highlight-box">
              <p class="highlight-text">We will shortly share the course schedule, payment details, and preparation guidelines.</p>
            </div>
            
            
            <div class=''>
                <p class='message'>Excited to see you grow with us! <br/>
                  Best,<br/>
                  <strong>Team StylTara Studios</strong><br/> 
                  <a href="https://www.styltarastudios.com" class="footer-link"  > www.styltarastudios.com</a>
                </p>
            </div>
            
            <p class="message">If you need to reschedule or have any questions, please contact us at <a href="mailto:support@styltarastudios.com">support@styltarastudios.com</a></p>
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

  const adminMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: process.env.MAIL_USER as string, 
    subject: 'New Makeup & Styling Training Consultation Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #401735; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Makeup & Styling Training Consultation Request</h2>
        <p>A new makeup and styling training consultation has been requested on your platform.</p>
        
        <h3 style="color: #4a5568;">Client Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.contactEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.contactPhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Consultation Mode:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.consultationMode}</td>
          </tr>
          ${consultationData.consultationMode === 'Offline' ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Training Location:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.trainingLocation}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Area of Interest:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.areaOfInterest}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Background in Styling/Makeup:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.hasBackground}</td>
          </tr>
          ${consultationData.hasBackground === 'Yes' ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Background Details:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.backgroundDetails}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Training Reason:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.trainingReason ?? 'None provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Language:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.preferredLanguage}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Date/Time:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date(consultationData.preferredDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Additional Questions:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.additionalQuestions ?? 'None provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Request Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.createdAt.toLocaleString()}</td>
          </tr>
        </table>
        
        
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">This is an automated message from your StylTara Studios website.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Makeup and styling training consultation confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending makeup and styling training consultation confirmation emails:', error);
  }
}