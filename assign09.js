const countriesSelectOptionField = document.querySelector('#countries')
const populationInfoTextField = document.querySelector('#populationInfo')
const studentsInfoTextField = document.querySelector('#studentsInfo')
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
FileHelper.readStringFromFileAtPathWFR = function(pathOfFileToReadFrom, generateFinalData = false, callback = () => {}) {
    // As with JSON, use the Fetch API & ES6
    fetch(pathOfFileToReadFrom)
        .then(response => response.text())
        .then(data => {
            if (generateFinalData == true) {
                // Do something with your data
                let finalData = []
                data = data.trim().split('\n')

                finalData = data.map((row) => {
                    let splitedRow = row.replace(/[\r]+/g, '').replace(/\s\s+/g,':').split(':')
                    return [splitedRow[0], Number.parseFloat(splitedRow[1].replace(/\,/g,''))]
                })
                countriesData[pathOfFileToReadFrom] = finalData
                if (typeof callback == "function") callback(finalData)
            } else {
                if (typeof callback == "function") callback(data)
            }

        }).catch(error => {
            showErrors(urlInputField, urlFormatErrorMessage)
            studentsInfoTextField.innerHTML = ''
            console.log(error)
        })
}

// Function getData()
function getData(callback = () => {}) {
    FileHelper.readStringFromFileAtPathWFR("canada.txt", true)
    FileHelper.readStringFromFileAtPathWFR("mexico.txt", true)
    FileHelper.readStringFromFileAtPathWFR("russia.txt", true)
    FileHelper.readStringFromFileAtPathWFR("usa.txt", true)
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
        FileHelper.readStringFromFileAtPathWFR(urlInputField.value, false, (data) => {
            let formattedData = JSON.parse(data)
            console.log('Result data: ', formattedData)
            let dataRaw = ''
            for (let student of formattedData['students']) {
                dataRaw += 'Full Name: ' + student['first'] + ' ' + student['last'] + ', major: ' + student['major'] + ', GPA: ' + student['gpa'] + '\n' + 'Address: ' + student['address']['zip'] + ', ' + student['address']['state'] + ', ' + student['address']['city'] + '\n\n'
            }
            studentsInfoTextField.innerHTML = dataRaw
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