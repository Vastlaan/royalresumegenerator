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
	console.log(image.width, image.height)
	if(image.height> image.width){
		return alert('Please upload file, which height is not bigger than its width!')
	}
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
window.displayRange =  () =>{
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
	return lang2.style.display = "block"
}else if(lang3Display==="none"){
	lang3.style.display="block"
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
	.then(res=>res.blob())
	.then(blob=>{
		const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "myCv.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again  
	})      
}