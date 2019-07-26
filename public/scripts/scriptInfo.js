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
switchLanguage(navigator.language==="pl"||navigator.language==="pl-PL" ? "pl" : "en")