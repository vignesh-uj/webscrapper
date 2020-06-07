const json = require('./result2.json');
const exceljs = require('exceljs');
const columnConfig = require('./columnconfig.json');


const workbook = new exceljs.Workbook();
workbook.xlsx.readFile('Mobiles.xlsx').then(wb => {

    const worksheet = wb.getWorksheet('Sheet1')
    let rowNumber = 2;
    for (const row of json.values()) {
        let columnNumber = 1;
        const excelRow = worksheet.getRow(rowNumber);
        for (const column of columnConfig.values()) {
            if (column === 'MediaLinks')
                excelRow.getCell(columnNumber).value = row[column].join(', ')
            else
                excelRow.getCell(columnNumber).value = row[column];
            columnNumber++;
        }
        excelRow.commit();
        rowNumber++;
    }
    wb.xlsx.writeFile('Mobiles.xlsx')

});
