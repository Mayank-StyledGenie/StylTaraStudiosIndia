import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

interface CorporateStyleRequest {
  companyName: string;
  contactPersonName: string;
  designation: string;
  contactInfo: string;
  numberOfParticipants: string;
  exactNumberOfParticipants?: string;
  serviceType: string;
  industryType: string;
  otherIndustryType?: string;
  companyLocation: string;
  preferredDates: string;
  serviceMode: string;
  dressCodeGuidelines?: string;
  sessionObjectives: string;
  additionalNotes?: string;
  createdAt: Date;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const corporateData: CorporateStyleRequest = {
      companyName: '',
      contactPersonName: '',
      designation: '',
      contactInfo: '',
      numberOfParticipants: '',
      serviceType: '',
      industryType: '',
      companyLocation: '',
      preferredDates: '',
      serviceMode: '',
      sessionObjectives: '',
      createdAt: new Date(),
      status: 'pending'
    };

    for (const [key, value] of formData.entries()) {
      if (key !== 'createdAt' && key !== 'status' && key in corporateData) {
        let processedValue: string | Date;
        
        if (value instanceof File) {
          processedValue = value.name;
        } else if (typeof value === 'object' && value !== null) {
          processedValue = JSON.stringify(value);
        } else {
          processedValue = String(value);
        }
        
        if (key === 'preferredDates') {
          (corporateData as unknown as Record<string, string | Date>)[key] = new Date(processedValue);
        } else {
          (corporateData as unknown as Record<string, string | Date>)[key] = processedValue;
        }
      }
    }

    corporateData.createdAt = new Date();
    corporateData.status = 'pending';

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('corporate_styling_requests');

    const result = await collection.insertOne(corporateData);

    await client.close();

    await sendConfirmationEmails(corporateData);

    return NextResponse.json({
      success: true,
      message: 'Corporate styling request submitted successfully',
      id: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Error in corporate styling request submission:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit corporate styling request',
    }, { status: 500 });
  }
}

async function sendConfirmationEmails(corporateData: CorporateStyleRequest) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const clientMailOptions = {
    from: process.env.MAIL_USER,
    to: corporateData.contactInfo,
    subject: 'Your Corporate Styling Session is Booked!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2d3748; text-align: center;">StylTara Studios</h1>
        <h2 style="color: #2d3748; text-align: center;">Your Corporate Styling Session is Booked!</h2>
        <p>Dear ${corporateData.contactPersonName},</p>
        <p>We're delighted to confirm your <b>Corporate Styling</b> booking with <b>Styltara Studios Pvt Ltd!</b> 
        Our expert team will help you and/or your organization craft a professional image.</p>
        <div style="background-color: #f7fafc; border-left: 4px solid #401735; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-weight: 500;">You will soon receive the payment link and session logistics.</p>
        </div>
        <hr style="margin: 30px 0; border: none; height: 1px; background-color: #e2e8f0;">
        <p>Thank you for trusting us with your brand and image!</p>
        <p>Best Regards,<br><b>Team StylTara Studios</b></p>
        <a href="https://www.styltarastudios.com" style="color: #003274;">www.styltarastudios.com</a>
        <div style="margin-top: 30px; background-color: #1a202c; color: #e2e8f0; padding: 20px; text-align: center;">
          <p>© 2025 StylTara Studios Pvt Ltd. All rights reserved.</p>
          <p style="font-size: 12px; color: #a0aec0;">Jaipur, Rajasthan</p>
        </div>
      </div>
    `
  };

  const adminMailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER, 
    subject: 'New Corporate Styling Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2C383D; border-bottom: 2px solid #401735; padding-bottom: 10px;">New Corporate Styling Request</h2>
        <p>A new corporate styling request has been submitted.</p>
        <h3>Client Details:</h3>
        <ul>
          <li><strong>Company:</strong> ${corporateData.companyName}</li>
          <li><strong>Contact:</strong> ${corporateData.contactPersonName}</li>
          <li><strong>Designation:</strong> ${corporateData.designation}</li>
          <li><strong>Email/Phone:</strong> ${corporateData.contactInfo}</li>
          <li><strong>Participants:</strong> ${corporateData.numberOfParticipants}${
            corporateData.numberOfParticipants === '10+' ? ' (' + corporateData.exactNumberOfParticipants + ')' : ''
          }</li>
          <li><strong>Service:</strong> ${corporateData.serviceType}</li>
          <li><strong>Industry:</strong> ${
            corporateData.industryType === 'Other' ? 'Other (' + corporateData.otherIndustryType + ')' : corporateData.industryType
          }</li>
          <li><strong>Location:</strong> ${corporateData.companyLocation}</li>
          <li><strong>Date:</strong> ${new Date(corporateData.preferredDates).toLocaleDateString()}</li>
          <li><strong>Mode:</strong> ${corporateData.serviceMode}</li>
          <li><strong>Objectives:</strong> ${corporateData.sessionObjectives}</li>
        </ul>
        <p>Please review and respond promptly.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(clientMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('Corporate styling confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending corporate styling confirmation emails:', error);
  }
}
