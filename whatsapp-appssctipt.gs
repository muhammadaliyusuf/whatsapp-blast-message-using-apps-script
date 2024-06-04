// Integration with WhatsApp Gateway Using Fonnte.com

function sendReminder() {

  const headers = {
    'Authorization': 'kwSCBkoasgCjjei3s38Q',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Documentation: https://developers.google.com/apps-script/reference/spreadsheet/
  var spreadSheet = SpreadsheetApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getUrl());
  // [1] for select which sheet to choose, start with index 0 it means sheet 1 
  var sheet = spreadSheet.getSheets()[1];
  // getRange(start with row 2, start with column 1, end with last row - 1(because 1 row for title), end with last column)
  var rangeValues = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();

  for (var i in rangeValues) {
    var participants = sheet.getRange(2 + Number(i), 1).getValue()
    var phoneNumber = sheet.getRange(2 + Number(i), 3).getValue()

    var todayDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMMM yyyy"); // 21 April 2023
    
    var trainingDate = new Date(sheet.getRange(2 + Number(i), 5).getValue());
    var formattedTrainingDate = Utilities.formatDate(trainingDate, Session.getScriptTimeZone(), "dd MMMM yyyy"); // 23 April 2023
    
    var reminderDate = new Date(trainingDate - (1 * 24 * 60 * 60 * 1000)); // Change day reminder
    var formattedReminderDate = Utilities.formatDate(reminderDate, Session.getScriptTimeZone(), "dd MMMM yyyy"); // 21 April 2023

    const requestBody = {
      // required key adjust with provider (https://docs.fonnte.com/send-whatsapp-message-with-php-api/)
      'target': String(phoneNumber), // data must be string
      'message':
        '*_Peringatan Penting: Segera Redeem Token Aktivasi._*\r\n\r\n' +
        'Dear ' + participants + ',\r\n' +
        'Ini adalah pesan pengingat untuk segera reedem token aktivasi langganan 2 bulan gratis akses Platform Google Cloud SKills Boost yang telah dikirim melalui email. \r\n\r\n' +
        'Jika mengalami kendala seperti token tidak terkirim atau hal yang berkaitan lainnya silakan reply pesan ini.\r\n\r\n' +
        'Salam,\r\n' +
        'Google Cloud Arcade Facilitator.'
    };

    var bodyMessage = JSON.stringify(requestBody);
    var result = sheet.getRange(2 + Number(i), 6);
    var remark = sheet.getRange(2 + Number(i), 7);

    try {
      if (compareDates(new Date(todayDate), new Date(formattedReminderDate)) == 0 && (result.isBlank() || result.getValue() === 'FAILED')) {
        var response = UrlFetchApp.fetch('https://api.fonnte.com/send',
          {
            method: 'POST',
            payload: bodyMessage,
            headers: headers,
            contentType: "application/json"
          });
        result.setValue('SUCCESSFUL').setBackground('#b7e1cd');
        remark.setValue('Sent on ' + new Date());

        Logger.log(response); // debug response variable
      }
    } catch (err) {
      result.setValue('FAILED').setBackground('#ea4335');
      remark.setValue(String(err).replace('\n', ''));
    }
  }
}


// Helper Function
function compareDates(date1, date2) {
  if (date1.getTime() === date2.getTime()) {
    return 0; // dates are equal
  } else if (date1.getTime() < date2.getTime()) {
    return -1; // date1 is before date2
  } else {
    return 1; // date1 is after date2
  }
}
