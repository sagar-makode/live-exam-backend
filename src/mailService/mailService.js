require('dotenv').config({ path: './environment.env' });
const sgMail = require('@sendgrid/mail');
dotenv.config({
  path: './.env'
})

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

sgMail.setApiKey(SENDGRID_API_KEY);

const mailService = {};


mailService.newUserCreation =async (role,name,email) => {
    //Html content for mail 
    const subject="New user has been created"
    const htmlContent = `
    <div>
    <p>Welcome,</p>
    <p>New user has been registered successfully.</p>
    <p>
      Name: ${name}<br>
      Role: ${role}<br>
      Email: ${email}
    </p>
    <br><br>
    <p>Thanks,</p>
    <p>Online Exam Portal</p>
    <br>
    <p style="color: red;">
      This is the system generated mail. No need to give response.
    </p>
  </div>  
`;

    const msg = {
        to: email,
        from: "raazmaurya098@gmail.com", 
        subject: subject,
        html: htmlContent,
    };

   await sgMail
        .send(msg)
        .then(() => {
            // console.log('Email sent');
            return "Email sent";
        })
        .catch((error) => {
            console.error(error)
            return "Something error occured"
        })
}

mailService.newExamCreation=async(data)=>{
       //Html content for mail 
       const subject="New Exam Has Been Created"
       const htmlContent = `
       <div>
       <p>Hello Admin,</p>
       <p>New Exam has been published by the ${data.teacherName}</p>
       <p>
        ${data}
       </p>
       <br><br>
       <p>Thanks,</p>
       <p>Online Exam Portal</p>
       <br>
       <p style="color: red;">
         This is the system generated mail. No need to give response.
       </p>
     </div>  
   `;
   
       const msg = {
           to: "balrajmaurya99@gmail.com",
           from:"raazmaurya098@gmail.com", 
           subject: subject,
           html: htmlContent,
           cc:"makode6436@gmail.com"
       };
   
      await sgMail
           .send(msg)
           .then(() => {
              //  console.log('Email sent');
               return "Email sent";
           })
           .catch((error) => {
               console.error(error)
               return "Something error occured"
           })
}

mailService.conformation = async ( token,email,type) => {
  //Html content for mail 
  
  const htmlContent = `
    <p>Dear Sir/ Madam</p>
    <p>Your One Time Password(OTP) is:</p>
    <p >${token}</p><br>
    <p>Your OTP will expire in 1 min.</p><br>
    <p>Warm Regards</p>
    <p>Online Exam Portal</p><br>
    <p style="color: red;">This is the system generated response. Do not reply or forward this mail.</p>
`;

  const msg = {
    to: email,
    from: "raazmaurya098@gmail.com",
    subject: "New User OTP",
    html: htmlContent
  };

  await sgMail
    .send(msg)
    .then(() => {
      // console.log('OTP Sent To ',email," and token is ",token," and ",type);
      return "OTP sent";
    })
    .catch((error) => {
      console.error(error)
      return "Something error occured"
    })
};
module.exports = mailService;