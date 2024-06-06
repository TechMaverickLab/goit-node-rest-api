const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = { ...data, from: 'techmavericklab@gmail.com' };
    if (process.env.NODE_ENV === 'test') {
        console.log('Фіктивна відправка електронної пошти:', email);
        return;
    }
    try {
        await sgMail.send(email);
        console.log('Email sent:', email);
    } catch (error) {
        console.error('Error sending email:', error.response.body.errors);
        throw error;
    }
};

module.exports = sendEmail;
