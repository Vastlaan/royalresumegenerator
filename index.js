const express = require('express')
const puppeteer = require('puppeteer')
const hbs = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')

const app = express()

app.use(express.static('public'))

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, "me.jpg")
//   }
// })
 
// const upload = multer({ storage: storage }).single("uploadImage")


// app.use(bodyParser.json())

// app.get('/templates/style.css', (req,res)=>{
// 	res.sendFile(path.join(__dirname,'templates','style.css'))
// })
// app.get('/tmp/my-uploads/me.jpg', (req,res)=>{
// 	res.sendFile(path.join(__dirname,'tmp/my-uploads','me.jpg'))
// })

// app.post('/uploadPhoto',(req,res)=>{
// 	upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       console.log(err)
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       console.log(err,"2")
//     }
 
//     // Everything went fine.
//     console.log("done")
//     res.status(200).json("Ok")
//   })
// })
// app.post('/createPdf', (req,res)=>{
	
// 	const data=req.body

// 	if(process.env.NODE_ENV==='production'){
// 		data.root = 'https://royalcvmaker.herokuapp.com'
// 	}else{
// 		data.root = 'http://localhost:5000'
// 	}

// 	console.log(data) //remove it

// 	const compile = async (templateName)=>{
// 		const filePath =  path.join(process.cwd(),'templates',`${templateName}.html`)
// 		const html = await fs.readFile(filePath, 'utf-8')
// 		return hbs.compile(html)(data)

// 	}
// 	(async ()=>{

// 		try{
// 			const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
// 			const page = await browser.newPage()
// 			const content = await compile('index')
// 			//await page.setContent(content)

// 			await page.goto(`data:text/html;charset=UTF-8,${content}`, {
// 				waitUntil: 'networkidle0'
// 			})
// 			await page.emulateMedia('screen')
// 			await page.pdf({
// 				path:'mypdf.pdf',
// 				format:"A4",
// 				printBackground: true
// 			})

// 			console.log('done')
// 			browser.close()
// 			res.sendFile(path.join(__dirname,'mypdf.pdf'))
// 		}
// 		catch(e){
// 			console.log(e)
// 			res.status(400).json(e)
// 		}
		
// 	})()
// })
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
	console.log(`App is listening on port ${PORT}`)
})

