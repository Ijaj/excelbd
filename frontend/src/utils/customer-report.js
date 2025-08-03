/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Must be imported AFTER jsPDF

function cleanData(dataArray) {
  return dataArray.map((item) => {
    const { __v, _id, trackingNumber, timeline, lastUpdatedBy, lastStatusNote, dates, packageDetails, sender, recipient, ...rest } = item;

    return {
      ...rest,
      dates: { created: dates.created }, // keep only created date
      packageDetails: {
        weight: packageDetails.weight,
        value: packageDetails.value
      },
      sender: {
        name: sender.name,
        email: sender.email,
        phone: sender.phone
      },
      recipient: {
        name: recipient.name,
        email: recipient.email,
        phone: recipient.phone
      }
    };
  });
}

export function generateCustomerReport(data) {
  const cleaned = cleanData(data);

  const doc = new jsPDF('p', 'pt'); // ✅ Use 'pt' (points) for compatibility
  doc.setFontSize(14);
  doc.text('Parcel Report', 40, 40);

  const tableData = cleaned.map(item => [
    item.id,
    // item.trackingNumber,
    item.status,
    item.priority,
    item.cost,
    item.sender.name,
    item.recipient.name,
    item.packageDetails.weight,
    item.packageDetails.value,
    item.dates.created
  ]);

  autoTable(doc, {
    // 'Tracking Number' is removed from the header
    head: [['ID', 'Status', 'Priority', 'Cost', 'Sender', 'Recipient', 'Weight', 'Value', 'Created']],
    body: tableData,
    startY: 60,
    styles: { fontSize: 10 }
  });

  doc.save('report.pdf');
}
