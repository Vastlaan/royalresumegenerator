//function trigers on input file change (when file is uploaded)
const addPhoto = () =>{
	const imageInput = document.querySelector("#file")
	const filePath = imageInput.value;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
        imageInput.value = '';
        checkPhotoInput()
        return false;
    }
	checkPhotoInput()
	
}
const checkPhotoInput = () =>{
	const image = document.querySelector("#file").files[0];
	const output = document.querySelector('#output')
	if(image instanceof File){
		output.src = URL.createObjectURL(image)
		output.style.display="block";
		return document.querySelector('#photo--info').innerHTML="You added photo!"
	}else{
		output.style.display="none";
		return document.querySelector('#photo--info').innerHTML="You haven't added photo yet!"
	}
}
checkPhotoInput()

//check value of range fields in languages section
const displayRange = () =>{
const range1= document.querySelector('#lang1__range')
const output1= document.querySelector('#lang1__output')
output1.innerHTML=range1.value
const range2= document.querySelector('#lang2__range')
const output2= document.querySelector('#lang2__output')
output2.innerHTML=range2.value
const range3= document.querySelector('#lang3__range')
const output3= document.querySelector('#lang3__output')
output3.innerHTML=range3.value
}
displayRange()

//responsible for displaing more language inputs
const moreLanguageField = () =>{
const lang2 = document.querySelector('#lang2')
const lang2Display = window.getComputedStyle(lang2).display
const lang3 = document.querySelector('#lang3')
const lang3Display = window.getComputedStyle(lang3).display
const btn = document.querySelector("#lang__btn")

if(lang2Display==="none"){
	return lang2.style.display = "flex"
}else if(lang3Display==="none"){
	lang3.style.display="flex"
	return btn.style.display="none"
}
}
//get languages values for data form
const getLanguagesValues = () =>{
const lang1 = document.querySelector("#lang1__lang").value
const lang1Level = document.querySelector("#lang1__range").value
const lang2 = document.querySelector("#lang2__lang").value
const lang2Level = document.querySelector("#lang2__range").value
const lang3 = document.querySelector("#lang3__lang").value
const lang3Level = document.querySelector("#lang3__range").value

let data = []

if(lang1!==""&&lang1!==null&&lang1!==undefined){
	const level = (lang1Level*10)
	data.push({
		language:lang1,
		level:level+"%"
	})
}
if(lang2!==""&&lang2!==null&&lang2!==undefined){
	const level = (lang2Level*10)
	data.push({
		language:lang2,
		level: level+"%"
	})
}
if(lang3 !== "" && lang3 !== null&&lang3 !== undefined){
	const level = (lang3Level*10)
	data.push({
		language:lang3,
		level: level+"%"
	})
}

return data
}
//get values from hobby inputs
//==================================== IMPORTANT hobbies are in fact Skills =================================================
const getHobbiesValues=()=>{
const hobbies = document.querySelectorAll('.hobby')

let data = []

hobbies.forEach(hobby=>{
	if(hobby.value!==""){
		data.push({
			hobby: hobby.value
		})
	}
})

return data
}

// get values from professional experiance section

const getJobsValues = () =>{
	let data = []

	const position1 = document.querySelector('#position-1').value
	const company1 = document.querySelector('#company-1').value
	const description1 = document.querySelector('#description-1').value
	const start1 = document.querySelector('#start-1').value
	const stop1 = document.querySelector('#stop-1').value
	data.push({
		position: position1,
		company: company1,
		description: description1,
		start: start1,
		stop: stop1
	})
	const position2 = document.querySelector('#position-2').value
	const company2 = document.querySelector('#company-2').value
	const description2 = document.querySelector('#description-2').value
	const start2 = document.querySelector('#start-2').value
	const stop2 = document.querySelector('#stop-2').value
	data.push({
		position: position2,
		company: company2,
		description: description2,
		start: start2,
		stop: stop2
	})

	return data

}
// get values from education section

const getSchoolsValues = () =>{
	let data = []

	const profile1 = document.querySelector('#profile-1').value
	const school1 = document.querySelector('#school-1').value
	const description1 = document.querySelector('#school-description-1').value
	const start1 = document.querySelector('#school-start-1').value
	const stop1 = document.querySelector('#school-stop-1').value
	data.push({
		profile: profile1,
		school: school1,
		description: description1,
		start: start1,
		stop: stop1
	})
	const profile2 = document.querySelector('#profile-2').value
	const school2 = document.querySelector('#school-2').value
	const description2 = document.querySelector('#school-description-2').value
	const start2 = document.querySelector('#school-start-2').value
	const stop2 = document.querySelector('#school-stop-2').value
	data.push({
		profile: profile2,
		school: school2,
		description: description2,
		start: start2,
		stop: stop2
	})

	return data

}
//get values from skills inputs
//==================================== IMPORTANT skills are in fact Additional Courses =================================================
const getSkillsValues=()=>{
const skills = document.querySelectorAll('.skill')

let data = []

skills.forEach(skill=>{
	if(skill.value!==""){
		data.push({
			skill: skill.value
		})
	}
})

return data
}
//submit form
const submitForm = async (event) =>{
event.preventDefault()

const image = document.querySelector("#file").files[0];

let photo = new FormData();
photo.append("uploadImage", image);

switchDisplayLoading() //trigger loading block

const response = await fetch('/uploadPhoto',{
	method:"POST",
	credentials:"include",
	body: photo
})
console.log(response.json())

const data = {
	name: event.target.name.value,
	email: event.target.email.value,
	phone: event.target.phone.value,
	address: event.target.address.value,
	about: event.target.about.value,
	lang: getLanguagesValues(),
	hobbies: getHobbiesValues(),
	jobs: getJobsValues(),
	schools: getSchoolsValues(),
	skills: getSkillsValues()
}

fetch('/createPdf', {
    method: 'POST',
    credentials:'include',
    headers:{
    	"Content-Type":"application/json"
    },
    body: JSON.stringify(data)
})
	.then(res=>{
		return res.blob()
	})
	.then(blob=>{
		const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        console.log(a)
        a.download = "myCv.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again  
        switchDisplayLoading() //remove loading block
	}).catch(error=>{
		console.error
		switchDisplayLoading() //remove loading block
	})     
}

// responsible for menu navigation to appropriate section
const scrollToSection = (event) =>{
	const name = event.target.getAttribute('name')
	return document.querySelector(`#${name}`).scrollIntoView({behavior:"smooth"})
}

const goHome = ()=>{
	return document.querySelector(".header").scrollIntoView({behavior:"smooth"})
}

//Highlight section when scrolled to its view

const highlight = () =>{
	const sections = document.querySelectorAll('.section')
	const navs = document.querySelectorAll('.nav__section--btn')
	const fromTop = window.scrollY+50;

	sections.forEach(section=>{
		if(fromTop<100){
			return navs.forEach(nav=>{nav.parentElement.classList.remove("active")})
		}
		if(section.offsetTop<fromTop && section.offsetTop+section.offsetHeight>=fromTop){
			section.id
			navs.forEach(nav=>{
				const name = nav.getAttribute('name')
				if(name===section.id){
					return nav.parentElement.classList.add("active")
				}else{
					return nav.parentElement.classList.remove("active")
				}
			})
		}

	})
}
window.onscroll=highlight

//Input validation

const validateInput = (event) =>{
	const notAllowedCodes = [35,47,60,62,92]
	let kCd = event.keyCode || event.which
	//fix for chrome on android
	if(kCd===0 || kCd===229){
		kCd= getKeyCode(event.target.value)
	}
	// end of fix
	if(notAllowedCodes.includes(kCd)){
		event.preventDefault()
		displayValidationWarning()
		return false
	}
}
// helper function for key code validation on Chrome mobile
const getKeyCode = (str) =>{
	return str.charCodeAt(str.length -1)
}

//Display or close Validation Warning

const displayValidationWarning = () =>{
	const warning = document.querySelector('.validationWarning')
	const style = window.getComputedStyle(warning)

	if(style.display==="block"){
		return warning.style.display = "none"
	}else{
		return warning.style.display = "block"
	}
}

//switch language

const switchLanguage = (lang) =>{
	const elements = document.querySelectorAll('[lang]')
	document.querySelector('html').setAttribute('lang',lang)

	elements.forEach(element=>{
		if(element.getAttribute('lang')===lang){
			 element.style.display = ""
		}else{
			element.style.display= "none"
		}
	})
}
switchLanguage("en")

//display loading block while creating a pdf file

const switchDisplayLoading = () =>{
	const loadingBlock = document.querySelector('.loading')
	const style = window.getComputedStyle(loadingBlock)
	console.log(style.display)
	if(style.display==="flex"){
		loadingBlock.style.display="none"
	}else{
		loadingBlock.style.display="flex"
	}
}