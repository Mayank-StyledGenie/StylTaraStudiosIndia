import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

// Define interfaces for type safety
interface InspirationImage {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: Buffer;
}

interface ConsultationData {
  fullName: string;
  contactEmail: string;
  contactPhone: string;
  weddingLocation: string;
  weddingDate: string;
  package: string;
  events: string[];
  hasVendors: string;
  consultationMode: string;
  budgetRange: string;
  additionalNotes?: string;
  inspirationImages?: InspirationImage[];
  createdAt: Date;
  status: string;
  [key: string]: unknown;
}

interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface AdminMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments: MailAttachment[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const consultationData: ConsultationData = {
      fullName: '',
      contactEmail: '',
      contactPhone: '',
      weddingLocation: '',
      weddingDate: '',
      package: '',
      events: [],
      hasVendors: '',
      consultationMode: '',
      budgetRange: '',
      createdAt: new Date(),
      status: 'pending'
    };

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('inspiration')) {
        continue;
      } else if (key === 'events') {
        consultationData[key] = JSON.parse(value as string);
      } else {
        consultationData[key] = value as string;
      }
    }

    const inspirationImages: InspirationImage[] = [];
    for (let i = 1; i <= 5; i++) {
      const image = formData.get(`inspiration${i}`) as File | null;
      if (image) {
        const imageBuffer = await image.arrayBuffer();
        inspirationImages.push({
          name: image.name,
          type: image.type,
          size: image.size,
          lastModified: image.lastModified,
          data: Buffer.from(imageBuffer)
        });
      }
    }

    if (inspirationImages.length > 0) {
      consultationData.inspirationImages = inspirationImages;
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('user_wedding_styling_consultations');

    const result = await collection.insertOne(consultationData);

    await client.close();

    await sendConfirmationEmails(consultationData);

    return NextResponse.json({
      success: true,
      message: 'Wedding styling consultation request submitted successfully',
      id: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error in wedding styling consultation submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit wedding styling consultation request',
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

  const clientMailOptions = {
    from: process.env.MAIL_USER,
    to: consultationData.contactEmail,
    subject: 'Your Wedding Styling & Photoshoot Booking is Confirmed!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StylTara Studios Wedding Styling Consultation Confirmation</title>
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
            <h1 class="welcome-title">Your Wedding Styling & Photoshoot Booking is Confirmed!</h1>

            <p class="message">Dear ${consultationData.fullName},</p>
            
            <p class="message">Congratulations on your upcoming celebration! Your booking for <b>Wedding Styling & Photoshoot</b> with <b>Styltara Studios Pvt Ltd!</b> has been successfully received. We're honored to be part of your special journey and committed to making every moment stylish and memorable</p>
            
            <div class="highlight-box">
              <p class="highlight-text">Our team will reach out soon with payment instructions and next steps to plan your dream look and shoot.</p>
            </div>
            
            <p class="message">Looking forward to creating timeless elegance with you!</p>
            <p class="message">Best regards,</p>
            <p class="message"><b>Team StylTara Studios</b></p>
            <a href="https://www.styltarastudios.com" style="text-decoration: none; color:rgb(0, 63, 171); font-weight: 600;">www.styltarastudios.com</a>
          </div>
          
          <div class="email-footer">
            <div class="footer-links">
              
            <p>© 2025 StylTara Studios. All rights reserved.</p>
            <p class="address">Jaipur, Rajasthan</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  const adminMailOptions: AdminMailOptions = {
    from: process.env.MAIL_USER as string,
    to: process.env.MAIL_USER as string, 
    subject: 'New Wedding Styling Consultation Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #401735; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Wedding Styling Consultation Request</h2>
        <p>A new wedding styling consultation has been requested on your platform.</p>
        
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
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Wedding Location:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.weddingLocation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Wedding Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.weddingDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Package:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.package}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Events to be Styled:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.events.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Has Vendors:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.hasVendors}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Consultation Mode:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.consultationMode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Budget Range:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${parseInt(consultationData.budgetRange).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Additional Notes:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.additionalNotes ?? 'None provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Request Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.createdAt.toLocaleString()}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-radius: 5px;">
          <h4 style="margin-top: 0; color: #4a5568;">Inspiration Images:</h4>
          ${consultationData.inspirationImages && consultationData.inspirationImages.length > 0
            ? `<p>${consultationData.inspirationImages.length} image(s) have been attached to this email.</p>` 
            : `<p>No inspiration images were uploaded.</p>`}
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">This is an automated message from your StylTara Studios website.</p>
      </div>
    `,
    attachments: []
  };

  if (consultationData.inspirationImages && consultationData.inspirationImages.length > 0) {
    consultationData.inspirationImages.forEach((image: InspirationImage) => {
      adminMailOptions.attachments.push({
        filename: image.name,
        content: image.data,
        contentType: image.type
      });
    });
  }

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Wedding consultation confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending wedding consultation confirmation emails:', error);
  }
}