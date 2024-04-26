// JS uninstall.html

const uninstallForm = document.getElementById('uninstall-form')
const uninstallResponse = document.getElementById('uninstall-response')
const inputCount = document.getElementById('input-count')
const submitBtn = document.getElementById('submit-btn')

uninstallResponse.addEventListener('input', function (e) {
    inputCount.textContent = this.value.length
})

uninstallForm.addEventListener('submit', formSubmit)

function formSubmit(event) {
    console.debug('formSubmit:', event, this)
    event.preventDefault()
    const notUsed = this[0].checked
    const notExpected = this[1].checked
    const notWorking = this[2].checked
    const feedbackText = this[3].value
    const url = this[4].value
    if (!(notUsed || notExpected || notWorking || feedbackText)) {
        return console.warn('No Data to Send.')
    }
    submitBtn.classList.add('disabled')
    const lines = [
        'Uninstall Feedback.',
        `Not Used: **${notUsed}**`,
        `Not as Expected: **${notExpected}**`,
        `Not Working: **${notWorking}**`,
        '```\n' + `${feedbackText || 'No Reason Provided.'}` + '\n```',
    ]
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-type', 'application/json')
    const params = {
        username: 'PlayDrift Extension',
        avatar_url: 'https://playdrift-extension.cssnr.com/images/logo.png',
        content: lines.join('\n'),
    }
    xhr.onload = () => {
        console.debug('xhr.status: ', xhr.status)
        submitBtn.classList.remove('disabled')
        if (xhr.status >= 200 && xhr.status <= 299) {
            console.debug('SUCCESS')
            window.location = '/'
        } else {
            console.log(`ERROR: ${xhr.status}`)
            const errorEl = document.getElementById('error')
            errorEl.textContent = `Submission Error: ${xhr.status}`
            errorEl.style.display = 'block'
        }
    }
    xhr.send(JSON.stringify(params))
}
