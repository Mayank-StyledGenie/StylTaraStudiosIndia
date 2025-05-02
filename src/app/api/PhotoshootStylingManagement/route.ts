import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// Define interfaces
interface ReferenceImage {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: Buffer;
}

interface ConsultationData {
  fullName: string;
  email: string;
  phone: string;
  photoshootType: string;
  location: string;
  preferredDate: string;
  hasPhotographer: string;
  stylingRequirements: string;
  needsHairMakeup: string;
  theme?: string;
  budgetRange: number;
  additionalNotes?: string;
  references?: ReferenceImage[];
  createdAt: Date;
  status: string;
  [key: string]: unknown;
}

interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments: MailAttachment[];
}

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const consultationData: ConsultationData = {
      fullName: '',
      email: '',
      phone: '',
      photoshootType: '',
      location: '',
      preferredDate: '',
      hasPhotographer: '',
      stylingRequirements: '',
      needsHairMakeup: '',
      budgetRange: 0,
      createdAt: new Date(),
      status: 'pending'
    };

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('reference')) {
        continue;
      } else if (key === 'budgetRange') {
        consultationData[key] = parseInt(value as string, 10);
      } else {
        consultationData[key] = value;
      }
    }

    const references: ReferenceImage[] = [];
    for (let i = 1; i <= 5; i++) {
      const reference = formData.get(`reference${i}`) as File | null;
      if (reference) {
        const refBuffer = await reference.arrayBuffer();
        references.push({
          name: reference.name,
          type: reference.type,
          size: reference.size,
          lastModified: reference.lastModified,
          data: Buffer.from(refBuffer)
        });
      }
    }

    if (references.length > 0) {
      consultationData.references = references;
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('User_photshootstylingmanagementconsultations');

    const result = await collection.insertOne(consultationData);

    await client.close();

    await sendConfirmationEmails(consultationData);

    return NextResponse.json({
      success: true,
      message: 'Photoshoot styling request submitted successfully',
      id: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error in Photoshoot styling request submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit photoshoot styling request',
    }, { status: 500 });
  }
}

async function sendConfirmationEmails(consultationData: ConsultationData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.MAIL_PASS as string
    }
  });

  // Email to client
  const clientMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: consultationData.email,
    subject: 'Your Photoshoot Styling & Management is Confirmed!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StylTara Studios Photoshoot Styling Request Confirmation</title>
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
            <h1 class="welcome-title">Your Photoshoot Styling & Management is Confirmed!</h1>

            <p class="message">Dear ${consultationData.fullName},</p>
            
            <p class="message">We’re thrilled to have you on board for our <b>Photoshoot Styling & Management</b> service at <b>Styltara Studios Pvt Ltd!</b> Our team is eager to create stunning, well-coordinated looks and manage every detail of your shoot to perfection.</p>
            
            <div class="highlight-box">
              <p class="highlight-text">You will receive the payment link and session details shortly.</p>
            </div>
            
            
            <p class="message">Thank you for trusting us with your vision. Let’s create magic together!</p>
            <p class="message">Best regards,</p>
            <p class="message"><b>Team StylTara Studios</b></p>
            <a href="https://styltarastudios.com" style="display: inline-block; color: rgb(0, 20, 195);  font-weight: 500;">www.styltarastudios.com </a>

          </div>
          
          <div class="email-footer">
            
            <p>© 2025 StylTara Studios. All rights reserved.</p>
            <p class="address">Jaipur, Rajasthan</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: []
  };

  // Email to admin
  const adminMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: process.env.MAIL_USER as string,
    subject: 'New Photoshoot Styling Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #401735; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Photoshoot Styling Request</h2>
        <p>A new photoshoot styling request has been submitted on your platform.</p>
        
        <h3 style="color: #4a5568;">Client Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Photoshoot Type:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.photoshootType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Location:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.location}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date(consultationData.preferredDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Has Photographer:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.hasPhotographer}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Styling Requirements:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.stylingRequirements}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Hair & Makeup:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.needsHairMakeup}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Theme/Vision:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.theme ?? 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Budget Range:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹${consultationData.budgetRange}</td>
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
          <h4 style="margin-top: 0; color: #4a5568;">Reference Images:</h4>
          ${consultationData.references && consultationData.references.length > 0
            ? `<p>${consultationData.references.length} reference image(s) have been attached to this email.</p>` 
            : `<p>No reference images were uploaded.</p>`}
        </div>
    
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">This is an automated message from your StylTara Studios website.</p>
      </div>
    `,
    attachments: []
  };

  // Attach reference images to admin email if any
  if (consultationData.references && consultationData.references.length > 0) {
    consultationData.references.forEach((reference: ReferenceImage) => {
      const imageData = reference.data;

      adminMailOptions.attachments.push({
        filename: reference.name,
        content: imageData,
        contentType: reference.type
      });
    });
  }

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Photoshoot styling confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending photoshoot styling confirmation emails:', error);
    // We don't want to fail the entire request if just the emails fail
  }
}