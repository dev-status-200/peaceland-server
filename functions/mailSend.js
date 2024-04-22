const brevo = require('@getbrevo/brevo');
let defaultClient = brevo.ApiClient.instance;

function mainSend(reciever, sub, content) {
    console.log("here")
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';
    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "My {{params.subject}}";
    sendSmtpEmail.htmlContent = "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
    sendSmtpEmail.sender = { "name": "John", "email": "example@brevo.com" };
    sendSmtpEmail.to = [
      { "email": "sabdullah369@gmail.com", "name": "sample-name" }
    ];
    sendSmtpEmail.replyTo = { "email": "info@peacelandtravel.com", "name": "sample-name" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
    

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });

}

module.exports = mainSend