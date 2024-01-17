import mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';
import JobInterestModel from '../model/jobInterest';
import UserRegistrationModel from '../model/userRegistration';
import jobs from '../model/jobs';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'karankumarmaurya2002@gmail.com',
    pass: 'uggvrotavfegisir',
  },
});

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const mailOptions = {
    from: 'karankumarmaurya2002@gmail.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

async function emailNotification(collection:any): Promise<void> {
    console.log('coldectio',collection);
    try {
      const jobInterest = await JobInterestModel.findOne({ name: collection.jobInterest });
      console.log(jobInterest);
    
      if (jobInterest) {
        const interestedUsers = await UserRegistrationModel.find({ _id: { $in: jobInterest.interestedUser } });
        console.log("2");
  
        const data = mongoose.model(
          collection,
          new mongoose.Schema({ name: String })
        );
        console.log("3");
  
        data.watch().on('change', async (change: any) => {
          if (change.operationType === 'insert') {
            const newJob = change.fullDocument;
            console.log("4");
  
            const usersWithEmails = await UserRegistrationModel.find({
              _id: { $in: jobInterest.interestedUser },
            });
            console.log("5");
  
            const emails = usersWithEmails.map((user) => user.email);
            if (emails.length === 0) {
              console.log('No valid email addresses found.');
              return;
            }
            console.log("6");
  
            const subject = 'New Job Added';
            const text = `A new job with the title "${newJob.title}" has been added. Check it out!`;
            console.log("7");
  
            try {
              for (const email of emails) {
                await sendEmail(email || '', subject, text);
              }
              console.log('Emails sent successfully.');
            } catch (error) {
              console.error('Error sending emails:', error);
            }
          }
        });
  
        console.log('Listening for changes...');
      }
    } catch (error) {
      console.log('Error while sending the email', error);
    }
  }
  
export default emailNotification;
