const express = require('express')
const puppeteer = require('puppeteer')
const hbs = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const {ENGLISH_HEADERS, POLISH_HEADERS} = require('./headers.js')

const app = express()

app.use(express.static('public'))

//create storage for uploaded image used as foto in CV
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, "me.jpg")
  }
})
 
const upload = multer({ storage: storage }).single("uploadImage")


app.use(bodyParser.json())
//serve styles and images in template as they cannot be retrieve from relative path
app.get('/templates/style.css', (req,res)=>{
	res.sendFile(path.join(__dirname,'templates','style.css'))
})
app.get('/templates/stylepl.css', (req,res)=>{
	res.sendFile(path.join(__dirname,'templates','stylepl.css'))
})
app.get('/tmp/my-uploads/me.jpg', (req,res)=>{
	res.sendFile(path.join(__dirname,'tmp/my-uploads','me.jpg'))
})
//upload foto using multer storage assign to const upload
app.post('/uploadPhoto',(req,res)=>{
	upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err)
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err,"2")
    }
 
    // Everything went fine.
    console.log("done")
    res.status(200).json("Ok")
  })
})
//create a pdf file
app.post('/createPdf', (req,res)=>{
	
	let data=req.body
	//check the environment to attach apriopriate path, sing the path to root key in data
	if(process.env.NODE_ENV==='production'){
		data.root = 'https://royalcvmaker.herokuapp.com'
	}else{
		data.root = 'http://localhost:5000'
	}

	//adjust language which will be used in template
	if(data.templateLanguage==="pl"){
		Object.assign(data, POLISH_HEADERS)
	}else{
		Object.assign(data,ENGLISH_HEADERS)
	}
	//compile handlebars template
	const compile = async (templateName)=>{
		const filePath =  path.join(process.cwd(),'templates',`${templateName}.html`)
		const html = await fs.readFile(filePath, 'utf-8')
		return hbs.compile(html)(data)

	}
	(async ()=>{

		try{
			//use arguments to let it work on Heroku with Buildpacks. Don't forget Buildpacks!
			const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
			const page = await browser.newPage()
			const content = await compile('index')

			await page.goto(`data:text/html;charset=UTF-8,${content}`, {
				waitUntil: 'networkidle0'
			})
			await page.emulateMedia('screen')
			await page.pdf({
				path:'mypdf.pdf',
				format:"A4",
				printBackground: true
			})

			console.log('done')
			browser.close()
			res.sendFile(path.join(__dirname,'mypdf.pdf'))
		}
		catch(e){
			console.log(e)
			res.status(400).json(e)
		}
		
	})()
})
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
	console.log(`App is listening on port ${PORT}`)
})

