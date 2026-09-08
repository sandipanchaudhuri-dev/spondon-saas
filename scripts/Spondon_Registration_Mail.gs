const SPONDON_ADMIN_EMAIL = 'spondon2020official@gmail.com';
const SPONDON_REPLY_TO = 'spondon2020official@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('SPONDON_MAIL_SECRET');
    if (!expectedSecret || data.secret !== expectedSecret) return json_({ success: false, error: 'Unauthorised' });

    validateEmail_(data.email);
    if (MailApp.getRemainingDailyQuota() < 2) throw new Error('Google Mail daily recipient quota is too low for participant and admin notifications');

    sendParticipant_(data);
    sendAdmin_(data);
    return json_({ success: true, email_sent: true });
  } catch (error) {
    return json_({ success: false, email_sent: false, error: String(error) });
  }
}

function sendParticipant_(data) {
  const reference = String(data.registration_ref || '').trim();
  const pujo = String(data.pujo_name || 'Pujo').trim();
  const person = String(data.contact_person_name || 'Participant').trim();
  const subject = 'Spondon Sharod Somman 2026 registration received — ' + reference;
  const textBody = [
    'Dear ' + person + ',', '',
    'Thank you. We have received the registration for ' + pujo + ' for Spondon Sharod Somman 2026.',
    'Registration reference: ' + reference, '',
    'Please keep this reference for future communication.', '',
    'Regards,', 'Spondon Sharod Somman 2026'
  ].join('\n');
  const htmlBody =
    '<div style="margin:0;background:#f5f1ea;padding:24px;font-family:Arial,sans-serif;color:#241d18">' +
      '<div style="max-width:660px;margin:auto;background:#fff;border:1px solid #e4d8c9;border-radius:14px;overflow:hidden">' +
        '<div style="background:#111;color:#fff;padding:24px"><div style="font-size:13px;letter-spacing:1px;text-transform:uppercase">Spondon</div><h1 style="margin:8px 0 0;font-size:27px">Sharod Somman 2026</h1></div>' +
        '<div style="padding:26px"><p>Dear <strong>' + html_(person) + '</strong>,</p><p>Thank you. We have received the registration for <strong>' + html_(pujo) + '</strong>.</p>' +
          '<div style="background:#f7f3ec;border-left:4px solid #111;padding:16px;margin:20px 0"><div style="font-size:12px;text-transform:uppercase;color:#555">Registration reference</div><div style="font-size:22px;font-weight:bold;margin-top:4px">' + html_(reference) + '</div></div>' +
          '<p>Please keep this reference for future communication.</p></div>' +
        '<div style="background:#191919;color:#eee;padding:18px 26px;font-size:13px">Spondon Sharod Somman 2026</div>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({to:String(data.email).trim(),subject:subject,body:textBody,htmlBody:htmlBody,name:'Spondon Sharod Somman 2026',replyTo:SPONDON_REPLY_TO});
}

function sendAdmin_(data) {
  const reference = String(data.registration_ref || '').trim();
  const pujo = String(data.pujo_name || 'Pujo').trim();
  const subject = 'New Pujo Registration — ' + pujo + ' — ' + reference;
  const details = [
    ['Reference', reference],['Pujo name', data.pujo_name],['Applicant', data.contact_person_name],['Email', data.email],['Phone', data.phone],['WhatsApp', data.whatsapp_number],['Address', data.address],['Theme', data.theme],['Artist', data.artist_name],['Submitted at', data.submitted_at]
  ];
  const textBody = ['New Spondon Sharod Somman 2026 registration',''].concat(details.map(function(row){return row[0]+': '+valueOrDash_(row[1]);})).join('\n');
  const htmlRows = details.map(function(row){return '<tr><td style="padding:7px 12px 7px 0;color:#666;vertical-align:top"><strong>'+html_(row[0])+'</strong></td><td style="padding:7px 0">'+html_(valueOrDash_(row[1]))+'</td></tr>';}).join('');
  const htmlBody = '<div style="font-family:Arial,sans-serif;max-width:720px;color:#222"><h2>New Spondon Pujo Registration</h2><table style="border-collapse:collapse;width:100%">'+htmlRows+'</table><p style="margin-top:20px">Review the complete record from the Spondon admin dashboard.</p></div>';
  MailApp.sendEmail({to:String(data.admin_email||SPONDON_ADMIN_EMAIL).trim(),subject:subject,body:textBody,htmlBody:htmlBody,name:'Spondon Registration Notification',replyTo:String(data.email||SPONDON_REPLY_TO).trim()});
}

function validateEmail_(value){const email=String(value||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('A valid participant email address is required');}
function valueOrDash_(value){const text=String(value==null?'':value).trim();return text||'—';}
function html_(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function json_(result){return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);}
