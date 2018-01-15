const fs = require('fs');

fs.copyFile('./src/Calendar.scss', 'dist/Calendar.scss', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('Calendar.scss copied successfully.');
});

fs.copyFile('./src/Calendar.css', 'dist/Calendar.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('Calendar.css copied successfully.');
});
