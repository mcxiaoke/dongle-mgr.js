/**
 * 
 退信代码说明：
　　•421 HL:REP 该IP发送行为异常，存在接收者大量不存在情况，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件，并核对发送列表有效性；
　　•421 HL:ICC 该IP同时并发连接数过大，超过了网易的限制，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件，并降低IP并发连接数量；
　　•421 HL:IFC 该IP短期内发送了大量信件，超过了网易的限制，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件，并降低发送频率；
　　•421 HL:MEP 该IP发送行为异常，存在大量伪造发送域域名行为，被临时禁止连接。请检查是否有用户发送病毒或者垃圾邮件，并使用真实有效的域名发送；
　　•450 MI:CEL 发送方出现过多的错误指令。请检查发信程序；
　　•450 MI:DMC 当前连接发送的邮件数量超出限制。请减少每次连接中投递的邮件数量；
　　•450 MI:CCL 发送方发送超出正常的指令数量。请检查发信程序；
　　•450 RP:DRC 当前连接发送的收件人数量超出限制。请控制每次连接投递的邮件数量；
　　•450 RP:CCL 发送方发送超出正常的指令数量。请检查发信程序；
　　•450 DT:RBL 发信IP位于一个或多个RBL里。请参考http://www.rbls.org/关于RBL的相关信息；
　　•450 WM:BLI 该IP不在网易允许的发送地址列表里；
　　•450 WM:BLU 此用户不在网易允许的发信用户列表里；
　　•451 DT:SPM ,please try again 邮件正文带有垃圾邮件特征或发送环境缺乏规范性，被临时拒收。请保持邮件队列，两分钟后重投邮件。需调整邮件内容或优化发送环境；
　　•451 Requested mail action not taken: too much fail authentication 登录失败次数过多，被临时禁止登录。请检查密码与帐号验证设置；
　　•451 RP:CEL 发送方出现过多的错误指令。请检查发信程序；
　　•451 MI:DMC 当前连接发送的邮件数量超出限制。请控制每次连接中投递的邮件数量；
　　•451 MI:SFQ 发信人在15分钟内的发信数量超过限制，请控制发信频率；
　　•451 RP:QRC 发信方短期内累计的收件人数量超过限制，该发件人被临时禁止发信。请降低该用户发信频率；
　　•451 Requested action aborted: local error in processing 系统暂时出现故障，请稍后再次尝试发送；
　　•500 Error: bad syntaxU 发送的smtp命令语法有误；
　　•550 MI:NHD HELO命令不允许为空；
　　•550 MI:IMF 发信人电子邮件地址不合规范。请参考http://www.rfc-editor.org/关于电子邮件规范的定义；
　　•550 MI:SPF 发信IP未被发送域的SPF许可。请参考http://www.openspf.org/关于SPF规范的定义；
　　•550 MI:DMA 该邮件未被发信域的DMARC许可。请参考http://dmarc.org/关于DMARC规范的定义；
　　•550 MI:STC 发件人当天的连接数量超出了限定数量，当天不再接受该发件人的邮件。请控制连接次数；
　　•550 RP:FRL 网易邮箱不开放匿名转发（Open relay）；
　　•550 RP:RCL 群发收件人数量超过了限额，请减少每封邮件的收件人数量；
　　•550 RP:TRC 发件人当天内累计的收件人数量超过限制，当天不再接受该发件人的邮件。请降低该用户发信频率；
　　•550 DT:SPM 邮件正文带有很多垃圾邮件特征或发送环境缺乏规范性。需调整邮件内容或优化发送环境；
　　•550 Invalid User 请求的用户不存在；
　　•550 User in blacklist 该用户不被允许给网易用户发信；
　　•550 User suspended 请求的用户处于禁用或者冻结状态；
　　•550 Requested mail action not taken: too much recipient  群发数量超过了限额；
　　•552 Illegal Attachment 不允许发送该类型的附件，包括以.uu .pif .scr .mim .hqx .bhx .cmd .vbs .bat .com .vbe .vb .js .wsh等结尾的附件；
　　•552 Requested mail action aborted: exceeded mailsize limit 发送的信件大小超过了网易邮箱允许接收的最大限制；
　　•553 Requested action not taken: NULL sender is not allowed 不允许发件人为空，请使用真实发件人发送；
　　•553 Requested action not taken: Local user only  SMTP类型的机器只允许发信人是本站用户；
　　•553 Requested action not taken: no smtp MX only  MX类型的机器不允许发信人是本站用户；
　　•553 authentication is required  SMTP需要身份验证，请检查客户端设置；
　　•554 DT:SPM 发送的邮件内容包含了未被许可的信息，或被系统识别为垃圾邮件。请检查是否有用户发送病毒或者垃圾邮件；
　　•554 DT:SUM 信封发件人和信头发件人不匹配；
　　•554 IP is rejected, smtp auth error limit exceed 该IP验证失败次数过多，被临时禁止连接。请检查验证信息设置；
　　•554 HL:IHU 发信IP因发送垃圾邮件或存在异常的连接行为，被暂时挂起。请检测发信IP在历史上的发信情况和发信程序是否存在异常；
　　•554 HL:IPB 该IP不在网易允许的发送地址列表里；
　　•554 MI:STC 发件人当天内累计邮件数量超过限制，当天不再接受该发件人的投信。请降低发信频率；
　　•554 MI:SPB 此用户不在网易允许的发信用户列表里；
　　•554 IP in blacklist 该IP不在网易允许的发送地址列表里。
 * 
 */
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const { log, loge } = require("./helper");
const rate = require("./rate");
const config = require("dotenv").config();
const DEBUG = process.env.DEBUG;

rate.config("sendSMSMail", 5, 10, 15);

const smtpOptions = {
  host: process.env.APP_SMTP_HOST,
  port: 465,
  // true for 465, false for other ports
  secure: true,
  auth: {
    user: process.env.APP_SMTP_USERNAME,
    pass: process.env.APP_SMTP_PASSWORD,
  },
};

async function sendMail(mail = {}, options = smtpOptions) {
  let transporter = nodemailer.createTransport(options);
  const mailOptions = Object.assign(
    {
      from: `"Little Cat" <${process.env.APP_SMTP_USERNAME}>`,
      bcc: process.env.APP_SMTP_BCC,
    },
    mail
  );
  //   console.log("smtpSend req:", mailOptions);
  let response = await transporter.sendMail(mailOptions);

  //   console.log("smtpSend res:", response);

  return response;
}

async function sendSMSMail(phoneNo, text) {
  log("sendSMSMail req:", phoneNo, text.substring(0, 24));
  if (rate.isValueSet("sendSMSMail:" + phoneNo + text)) {
    loge("sendSMSMail ignore duplicate sms");
    return;
  }
  if (rate.isLimitExceeded("sendSMSMail")) {
    loge("sendSMSMail failed:", "rate limit exceeded");
    return 1;
  }
  const mailOptions = {
    from: `"SMS Cat" <${process.env.APP_SMTP_USERNAME}>`,
    to: process.env.APP_SMTP_SMS_TO,
    subject: `来自 ${phoneNo} 的新短信`,
    text: `${text} (${phoneNo})`,
    html: `<p>****************************************</p>
    <p><b>短信内容：</b></p>
    <p>${text}</p>
    <p></p>
    <p><b>短信来自：${phoneNo}</b></p>
    <p>****************************************</p>`,
  };
  try {
    const res = await sendMail(mailOptions);
    log("sendSMSMail res:", res.messageId);
    return res.messageId;
  } catch (error) {
    loge("sendSMSMail err:", String(error));
  }
}

async function test() {
  // https://nodemailer.com/smtp/
  // https://nodemailer.com/smtp/envelope/
  // send mail with defined transport object
  //  let info = await transporter.sendMail({
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: "bar@example.com, baz@example.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>", // html body
  //   });
  const mail = {
    to: "xxxxxx@live.com",
    cc: "xxxxxx@gmail.com, xxxxxx@qq.com",
    bcc: "xxxxxx@icloud.com",
    subject: "收到来自 +18812345678 的新短信",
    text: `收到来自 +18812345678 的新短信
    短信内容：【哈哈】你好，哈哈物流，你地球超市的包裹放在你们小区的XX超市了，请有时间去取一下，快递员电话12345678900 (2021-08-15 19:04:21)
    短信时间：2021-07-24 19:04:23
    短信来自：+18812345678`,
    html: `<p>****************************************</p>
    <p><b>短信内容：</b></p>
    <p>【哈哈】你好，哈哈物流，你地球超市的包裹放在你们小区的XX超市了，请有时间去取一下，快递员电话12345678900 (2021-08-24 19:04:15)</p>
    <p></p>
    <p><b>短信时间：2021-07-24 19:04:23</b></p>
    <p><b>短信来自：+18512345678</b></p>
    <p>****************************************</p>`,
  };
  await sendMail(mail);
}

// test();
module.exports = {
  sendSMSMail,
  sendMail,
};
