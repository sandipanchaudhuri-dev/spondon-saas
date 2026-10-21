/**
 * IPGC Shyama Samman 2026 Gmail acknowledgement adapter.
 * Add to the EXISTING Sera Pujo registration Apps Script project.
 * Route action='ipgc_registration_ack_v1' from doPost AFTER existing shared-secret validation.
 * This function NEVER writes to the existing Sera Pujo sheet.
 * The sender is the Gmail identity executing this script:
 *   ifest.pujoonline@gmail.com
 */
function handleIpgcRegistrationAcknowledgement_(payload) {
  if (payload.action !== 'ipgc_registration_ack_v1' ||
      payload.event_code !== 'ipgc-shyama-samman-2026-kolkata' ||
      payload.copy_email !== 'contact@ipgc.in' ||
      !/^IPGC-SS-2026-[0-9]{5,}$/.test(payload.registration_ref || '') ||
      !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(payload.email || '') ||
      !(payload.committee_name || '').trim() ||
      !(payload.locality || '').trim()) throw new Error('ipgc_invalid_payload');
  if (Session.getEffectiveUser().getEmail().toLowerCase() !== 'ifest.pujoonline@gmail.com') {
    throw new Error('ipgc_sender_mismatch');
  }
  var id = 'ipgc:2026:ack:' + payload.registration_ref;
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var props = PropertiesService.getScriptProperties();
    var existing = props.getProperty(id);
    if (existing) return JSON.parse(existing); // 'sending' means manually reconcile; no blind resend.
    var subject = 'Registration Received | IPGC Shyama Samman 2026 | ' + payload.registration_ref;
    var lines = [
      'Dear Puja Committee,',
      '',
      'Greetings from IPGC Shyama Samman 2026!',
      'Thank you for registering your Puja for IPGC Shyama Samman 2026.',
      '',
      'Puja Committee: ' + payload.committee_name,
      'Location: ' + payload.locality + ', ' + payload.district,
      'Registration Reference: ' + payload.registration_ref,
      'Registration Year: 2026',
      '',
      'Please retain your reference for future communication.',
      'This acknowledgement confirms receipt only; it does not constitute selection, shortlisting or an award.',
      'Further details will follow through official channels.',
      '',
      'Warm regards,',
      'Team IPGC Shyama Samman 2026'
    ];
    var draft = GmailApp.createDraft(payload.email, subject, lines.join('\n'), {
      cc: 'contact@ipgc.in',
      name: 'IPGC Shyama Samman 2026'
    });
    props.setProperty(id, JSON.stringify({state:'sending',draft_id:draft.getId()}));
    var sent = draft.send();
    var result = {state:'sent',provider_id:sent.getId(),registration_ref:payload.registration_ref};
    props.setProperty(id, JSON.stringify(result));
    return result;
  } finally {
    lock.releaseLock();
  }
}
