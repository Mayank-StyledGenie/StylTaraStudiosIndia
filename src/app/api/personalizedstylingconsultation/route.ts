import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// Define interfaces
interface ConsultationImage {
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
  consultationMode: string;
  ageGroup: string;
  gender: string;
  occupation?: string;
  location: string;
  preferredDateTime: string;
  stylingGoals: string[];
  bodyConcerns?: string;
  additionalNotes?: string;
  images?: ConsultationImage[];
  createdAt: Date;
  status: string;
  [key: string]: unknown;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
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
      consultationMode: '',
      ageGroup: '',
      gender: '',
      location: '',
      preferredDateTime: '',
      stylingGoals: [],
      createdAt: new Date(),
      status: 'pending'
    };

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image')) {
        continue;
      } else if (key === 'stylingGoals') {
        consultationData[key] = JSON.parse(value as string);
      } else {
        consultationData[key] = value as string;
      }
    }

    const images: ConsultationImage[] = [];
    for (let i = 1; i <= 3; i++) {
      const image = formData.get(`image${i}`) as File | null;
      if (image) {
        const imageBuffer = await image.arrayBuffer();
        images.push({
          name: image.name,
          type: image.type,
          size: image.size,
          lastModified: image.lastModified,
          data: Buffer.from(imageBuffer)
        });
      }
    }

    if (images.length > 0) {
      consultationData.images = images;
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('User_stylingconsultations');

    const result = await collection.insertOne(consultationData);

    await client.close();

    await sendConfirmationEmails(consultationData);

    return NextResponse.json({
      success: true,
      message: 'Styling consultation request submitted successfully',
      id: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error in styling consultation submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit styling consultation request',
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

  // Email to client
  const clientMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: consultationData.email,
    subject: 'Your Personalized Styling Consultation is Booked!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StylTara Studios Personalized Styling Consultation Confirmation</title>
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
            <h1 class="welcome-title"> Your Personalized Styling Consultation is Booked!</h1>

            <p class="message">Dear ${consultationData.fullName},</p>
            
            <p class="message">Thank you for booking a <b>Personalized Styling Consultation</b> with <b>Styltara Studios Pvt Ltd!</b> We're excited to work with you on your unique style journey and help you express your authentic self with confidence.</p>
            
            <div class="highlight-box">
              <p class="highlight-text">Our team will connect with you shortly to share the payment details, schedule confirmation, and everything you need to know before the session.</p>
            </div>
            
            <p class="message">If you have any immediate questions, feel free to reply to this email.</p>

            <p class="message">Warm Regards,</p>
            <p class="message"><b>Team StylTara Studios</b></p>
            <a href="https://styltarastudios.com" style="text-decoration: none; color:rgb(0, 19, 192); font-weight: 500;">www.styltarastudios.com</a>
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

  // Email to admin
  const adminMailOptions: MailOptions = {
    from: process.env.MAIL_USER as string,
    to: process.env.MAIL_USER as string,
    subject: 'New Personalized Styling Consultation Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #401735; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Styling Consultation Request</h2>
        <p>A new styling consultation has been requested on your platform.</p>
        
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
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Consultation Mode:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.consultationMode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Age Group:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.ageGroup}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Gender:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.gender}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Occupation:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.occupation ?? 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Location:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.location}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Date/Time:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${new Date(consultationData.preferredDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Styling Goals:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.stylingGoals.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Body Concerns:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${consultationData.bodyConcerns ?? 'None provided'}</td>
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
          <h4 style="margin-top: 0; color: #4a5568;">Uploaded Images:</h4>
          ${consultationData.images && consultationData.images.length > 0
            ? `<p>${consultationData.images.length} image(s) have been attached to this email.</p>` 
            : `<p>No images were uploaded.</p>`}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p>Please review this consultation request in the admin dashboard.</p>
          <p><a href="https://styltarastudios.com/admin/consultations" style="display: inline-block; background-color: #5a67d8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 500;">View in Dashboard</a></p>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">This is an automated message from your StylTara Studios website.</p>
      </div>
    `,
    attachments: []
  };

  if (consultationData.images && consultationData.images.length > 0) {
    consultationData.images.forEach((image: ConsultationImage) => {
      let imageData = image.data;

      if (!Buffer.isBuffer(imageData)) {
        // Convert to Buffer if not already a buffer
        imageData = Buffer.from(imageData);
      }

      adminMailOptions.attachments?.push({
        filename: image.name,
        content: imageData,
        contentType: image.type
      });
    });
  }

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Consultation confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending consultation confirmation emails:', error);
  }
}