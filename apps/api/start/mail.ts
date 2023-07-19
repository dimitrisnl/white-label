import Mail from '@ioc:Adonis/Addons/Mail';

Mail.monitorQueue((error) => {
  if (error) {
    console.log('Unable to send email');
    console.log(error.mail);
    return;
  }
});
