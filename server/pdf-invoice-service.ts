import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  campaignName?: string;
  amountUsd: string;
  dueDate?: Date;
  paidAt?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'hodlearn-assets';

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const primaryColor = '#F97316';
    const darkColor = '#18181B';
    const grayColor = '#71717A';

    doc.fontSize(24).fillColor(primaryColor).text('HODLearn', 50, 50);
    doc.fontSize(10).fillColor(grayColor).text('Bitcoin Education Platform', 50, 80);

    doc.moveTo(50, 110).lineTo(545, 110).strokeColor('#E4E4E7').stroke();

    doc.fontSize(28).fillColor(darkColor).text('INVOICE', 400, 50, { align: 'right' });
    doc.fontSize(12).fillColor(grayColor).text(`#${data.invoiceNumber}`, 400, 85, { align: 'right' });

    const statusColors: Record<string, string> = {
      paid: '#22C55E',
      sent: '#3B82F6',
      draft: '#71717A',
      overdue: '#EF4444',
      cancelled: '#6B7280',
    };
    const statusColor = statusColors[data.status] || grayColor;
    doc.fontSize(11).fillColor(statusColor).text(data.status.toUpperCase(), 400, 100, { align: 'right' });

    doc.fontSize(11).fillColor(grayColor);
    doc.text('Bill To:', 50, 140);
    doc.fontSize(12).fillColor(darkColor).text(data.clientName, 50, 158);
    doc.fontSize(10).fillColor(grayColor).text(data.clientEmail, 50, 175);
    if (data.clientAddress) {
      doc.text(data.clientAddress, 50, 190);
    }

    doc.fontSize(11).fillColor(grayColor);
    doc.text('Invoice Date:', 350, 140);
    doc.fontSize(12).fillColor(darkColor).text(data.createdAt.toLocaleDateString(), 350, 158);
    
    if (data.dueDate) {
      doc.fontSize(11).fillColor(grayColor).text('Due Date:', 350, 185);
      doc.fontSize(12).fillColor(darkColor).text(data.dueDate.toLocaleDateString(), 350, 203);
    }

    const tableTop = 250;
    doc.rect(50, tableTop, 495, 25).fillColor('#F4F4F5').fill();
    
    doc.fontSize(10).fillColor(darkColor);
    doc.text('Description', 60, tableTop + 8);
    doc.text('Amount', 450, tableTop + 8, { align: 'right' });

    doc.rect(50, tableTop + 25, 495, 40).strokeColor('#E4E4E7').stroke();
    
    const description = data.campaignName 
      ? `Advertising Campaign: ${data.campaignName}`
      : 'HODLearn Advertising Services';
    
    doc.fontSize(11).fillColor(darkColor);
    doc.text(description, 60, tableTop + 35);
    doc.fontSize(11).fillColor(darkColor).text(`$${parseFloat(data.amountUsd).toFixed(2)}`, 450, tableTop + 35, { align: 'right' });

    const totalY = tableTop + 85;
    doc.rect(350, totalY, 195, 30).fillColor(primaryColor).fill();
    doc.fontSize(12).fillColor('#FFFFFF');
    doc.text('Total Due:', 360, totalY + 10);
    doc.text(`$${parseFloat(data.amountUsd).toFixed(2)} USD`, 450, totalY + 10, { align: 'right' });

    if (data.paidAt) {
      doc.rect(350, totalY + 40, 195, 25).fillColor('#22C55E').fill();
      doc.fontSize(10).fillColor('#FFFFFF');
      doc.text(`PAID on ${data.paidAt.toLocaleDateString()}`, 360, totalY + 50, { width: 185, align: 'center' });
    }

    if (data.notes) {
      doc.fontSize(11).fillColor(grayColor).text('Notes:', 50, 450);
      doc.fontSize(10).fillColor(darkColor).text(data.notes, 50, 468, { width: 495 });
    }

    doc.fontSize(10).fillColor(grayColor);
    doc.text('Thank you for your business with HODLearn!', 50, 700, { align: 'center', width: 495 });
    doc.text('Bitcoin Education for the Next Generation', 50, 715, { align: 'center', width: 495 });
    
    doc.moveTo(50, 750).lineTo(545, 750).strokeColor('#E4E4E7').stroke();
    doc.fontSize(8).fillColor(grayColor);
    doc.text('HODLearn Inc. | support@hodlearn.com | www.hodlearn.com', 50, 760, { align: 'center', width: 495 });

    doc.end();
  });
}

export async function uploadInvoicePDF(pdfBuffer: Buffer, invoiceNumber: string): Promise<{ url: string; key: string }> {
  const key = `invoices/${invoiceNumber}.pdf`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    ContentDisposition: `attachment; filename="invoice-${invoiceNumber}.pdf"`,
  });

  await s3Client.send(command);

  const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  const url = cloudFrontDomain 
    ? `https://${cloudFrontDomain}/${key}`
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

  return { url, key };
}

export async function deleteInvoicePDF(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export function isS3Configured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET);
}
