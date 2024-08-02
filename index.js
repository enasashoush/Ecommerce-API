import express from 'express'
import bootstrap from './src/bootstrab.js'
import { config } from 'dotenv'
// import createInvoice from './src/utlis/pdfInvoice.js'
const app = express()
config()
bootstrap(app, express)

// const invoice = {
//   shipping: {
//     name: "John Doe",
//     address: "1234 Main Street",
//     city: "San Francisco",
//     state: "CA",
//     country: "US",
//     postal_code: 94111
//   },
//   items: [
//     {
//       item: "TC 100",
//       description: "Toner Cartridge",
//       quantity: 2,
//       amount: 6000
//     },
//     {
//       item: "USB_EXT",
//       description: "USB Cable Extender",
//       quantity: 1,
//       amount: 2000
//     }
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234
// };

// createInvoice(invoice, "invoice.pdf");

const port = +process.env.PORT
app.listen(port, () => console.log(`Example app listening on port ${port}!`))