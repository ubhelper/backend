const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'mail model' });
const nodemailer = require("nodemailer");
const Query = require('../database/Mybatis');


// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD
//   },
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'badarch.ogino@gmail.com',
    pass: 'afvdcajhpbmowhrc'
  }
});



const sendPassword = async (sendTo, password) => {

  if (!sendTo || !password) {
    return false;
  }

  try {

    return new Promise((resolve, reject) => {
      const options = {
        from: '\'itwizard.mn\' ' + process.env.MAIL_USER,
        to: sendTo,
        subject: "Нууц үг сэргээх хүсэлт",
        html: `<table style="width: 100%;" cellspacing="0" cellpadding="0">
        <tr><td colspan="3" style="height: 50px; background-color: #f6f6f6;"></td></tr>
        <tr>
        <td width="25%" style="background-color: #f6f6f6;"></td>
        <td width="50%" style="background-color: #ffffff; border-radius: 30px;">
          <div align="center" style="margin-bottom: 20px; font-weight: 700; margin-top: 50px;">
            Нууц үг сэргээх
          </div>
        
          <div style="margin-bottom: 10px; padding-left: 50px;">
            Сайн байна уу?
          </div>
        
          <div style="margin-bottom: 50px; padding-left: 50px;">
            Таны шинэчлэгдсэн нууц үг: <b>${password}</b>
          </div>
        
        </td>
        <td width="25%" style="background-color: #f6f6f6;"></td>
        </tr>
        <tr><td colspan="3" style="height: 50px; background-color: #f6f6f6;">
        
        
        <div align="center" style="margin-top: 10px; margin-bottom: 50px;">© <a href="javascript:;"><strong>itwizard</strong></a> - All rights reserved.</div>
        
        </td></tr>
        </table>`,
      };
  
      resp = false;
  
      transporter.sendMail(options,  function(err, info) {
        if(err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    // console.log('==send', process.env.MAIL_USER);

    // let result = await transporter.sendMail(options);
    // return result.messageId;

  } catch (e) {
      Logger.error(e);
      throw e;
  }
}


module.exports = {
  sendPassword
}