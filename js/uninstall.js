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
    // this[0] switch   - not needed or used
    // this[1] switch   - not working as expected
    // this[2] textarea - feedback description
    // this[3] input    - discord webhook url
    // this[4] button   - submit
    const url = this[3].value
    if (!(this[0].checked || this[1].checked || this[2].value)) {
        console.warn('No Data to Send.')
    } else {
        submitBtn.classList.add('disabled')
        const lines = [
            'Uninstall Feedback.',
            `Not Used: **${this[0].checked}**`,
            `Not Working: **${this[1].checked}**`,
            '```\n' + `${this[2].value || 'No Reason Provided.'}` + '\n```',
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
}
