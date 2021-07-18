const countriesSelectOptionField = document.querySelector('#countries')
const populationInfoTextField = document.querySelector('#populationInfo')
const fetchDataBtn = document.querySelector('#fetchDataBtn')
const urlInputField = document.querySelector('#url')
const urlFormatErrorMessage = document.querySelector('#urlFormatErrorMessage')

var files = [
    "canada.txt", "mexico.txt", "russia.txt", "usa.txt"
]

var countriesData = {}

function FileHelper() {
    // Empty File Helper objet initiation
}

// [Deprecation Waring] Synchronous XMLHttpRequest on the main thread is deprecated because of its
// detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.
FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom, callback = null) {
    var request = new XMLHttpRequest();
    request.open("GET", pathOfFileToReadFrom, false);
    request.send(null);
    if (callback != null) {
        callback(request.responseText)
    }
    return request.responseText;
}

// Modern way to fetch data from server using ES6
FileHelper.readStringFromFileAtPathWFR = function(pathOfFileToReadFrom, callback = () => {}) {
    // As with JSON, use the Fetch API & ES6
    fetch(pathOfFileToReadFrom)
        .then(response => response.text())
        .then(data => {
            // Do something with your data
            let finalData = []
            data = data.replace(/\s\s+/g,':').trim().split('\n')

            finalData = data.map((row) => {
                let splitedRow = row.split(':')
                return [splitedRow[0], Number.parseFloat(splitedRow[1].replace(/\,/g,''))]
            })
            countriesData[pathOfFileToReadFrom] = finalData
            callback(finalData)
        })
}

// Function getData()
function getData(callback = () => {}) {
    FileHelper.readStringFromFileAtPathWFR("canada.txt")
    FileHelper.readStringFromFileAtPathWFR("mexico.txt")
    FileHelper.readStringFromFileAtPathWFR("russia.txt")
    FileHelper.readStringFromFileAtPathWFR("usa.txt")
    callback()
}

// Function to add allowed Countries Options
function addAllowedCountriesOptions() {
    files.map(country => {
        let countryName = country.split('.')[0]
        let option = `
            <option>${countryName}</option>
        `
        countriesSelectOptionField.innerHTML += option
        console.log(countryName)
    })
}

// Function to update population info
countriesSelectOptionField.addEventListener('change', event => {
    let dataRaw = ''
    for (let index in countriesData[event.target.value+".txt"]) {
        dataRaw += countriesData[event.target.value+".txt"][index][0] + ": " + Intl.NumberFormat().format(countriesData[event.target.value+".txt"][index][1]) + "\n"
    }
    populationInfoTextField.innerHTML = dataRaw
})

// URL input event listener
urlInputField.addEventListener('keyup', event => {
    if (!isValidURLValue(urlInputField.value)) {
        showErrors(urlInputField, urlFormatErrorMessage)
    } else {
        removeErrors(urlInputField, urlFormatErrorMessage)
    }
})

// Function to validad URL Format
function isValidURLValue(urlString) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+       // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+                      // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+                  // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+                         // query string
    '(\\#[-a-z\\d_]*)?$','i');                          // fragment locator
  return !!pattern.test(urlString);
}

// Fetch data btn click event handler
fetchDataBtn.addEventListener('click', event => {
    event.preventDefault()
    console.log(urlInputField.value)
    if (isValidURLValue(urlInputField.value)) {
        FileHelper.readStringFromFileAtPathWFR(urlInputField.value, (data) => {
            console.log('Result data: ', data)
        })
    }
})

// Get data on window load event
window.onload = function() {
    getData(() => {
        console.log("Extracted data: ", countriesData)
    })
    addAllowedCountriesOptions()
}

// Display errors on provided InputField, and the error message
function showErrors(InputField, SpanErrorField) {
    InputField.classList.replace('focus:ring-blue-600', 'focus:ring-red-600')
    InputField.classList.replace('border-blue-300', 'border-red-600')
    SpanErrorField.classList.remove('hidden')
}

// Remove errors on provided InputField, and the error message
function removeErrors(InputField, SpanErrorField) {
    InputField.classList.replace('focus:ring-red-600', 'focus:ring-blue-600')
    InputField.classList.replace('border-red-600', 'border-blue-300')
    SpanErrorField.classList.add('hidden')
}