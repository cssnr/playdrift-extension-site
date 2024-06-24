// JS uninstall.html

const searchParams = new URLSearchParams(window.location.search)
const version = searchParams.get('version') || 'unknown'

const noAlertVersion = '0.4.10'
const discordUsername = 'PlayDrift Extension'
const uninstallMessage = `${discordUsername} Uninstall, Version: **${version}**`
const discordAvatar = 'https://playdrift-extension.cssnr.com/media/logo.png'

const uninstallForm = document.getElementById('uninstall-form')
const uninstallResponse = document.getElementById('uninstall-response')
const inputCount = document.getElementById('input-count')
const submitBtn = document.getElementById('submit-btn')
const errorAlert = document.getElementById('error-alert')
const notWorkingExtra = document.getElementById('not-working-extra')

uninstallForm.addEventListener('change', formChange)
uninstallForm.addEventListener('submit', formSubmit)

uninstallResponse.addEventListener('input', function () {
    inputCount.textContent = this.value.length
})

document.addEventListener('DOMContentLoaded', function (event) {
    const ver = searchParams.get('version')
    if (ver) {
        const res = ver.localeCompare(noAlertVersion, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
        if (res === -1) {
            console.debug(`Show Warning for Version: ${version}`)
            document.getElementById('alerts')?.classList.remove('d-none')
        }
    }
})

function formChange(event) {
    console.debug('formChange:', event)
    if (event.target.id === 'not-working') {
        if (event.target.checked) {
            notWorkingExtra.classList.remove('d-none')
        } else {
            notWorkingExtra.classList.add('d-none')
        }
    }
}

async function formSubmit(event) {
    console.debug('formSubmit:', event)
    event.preventDefault()
    errorAlert.style.display = 'none'
    const url = event.target.elements['discord-webhook'].value
    const notUsed = event.target.elements['not-used'].checked
    const notExpected = event.target.elements['not-expected'].checked
    const notWorking = event.target.elements['not-working'].checked
    const feedbackText = event.target.elements['uninstall-response'].value
    if (!(notUsed || notExpected || notWorking || feedbackText)) {
        uninstallResponse.focus()
        return console.warn('No Data to Send.')
    }
    submitBtn.classList.add('disabled')

    const parser = new UAParser()
    const res = parser.getResult()
    const lines = [
        uninstallMessage,
        `**Browser**: ${res.browser.name} ${res.browser.version} (${res.engine.name})`,
        `**System**: ${res.os.name} ${res.os.version} (${res.cpu.architecture})`,
        `${getBoolIcon(notUsed)} Not Used`,
        `${getBoolIcon(notExpected)} Not as Expected`,
        `${getBoolIcon(notWorking)} Not Working`,
    ]
    if (feedbackText) {
        lines.push(`\`\`\`\n${feedbackText}\n\`\`\``)
    }
    // console.debug('lines:', lines)

    const response = await sendDiscord(url, lines.join('\n'))
    console.debug('response:', response)
    submitBtn.classList.remove('disabled')
    if (response.status >= 200 && response.status <= 299) {
        console.debug('Success')
        window.location = '/docs/'
    } else {
        console.warn(`Error ${response.status}`, response)
        errorAlert.textContent = `Error ${response.status}: ${response.statusText}`
        errorAlert.style.display = 'block'
    }
}

async function sendDiscord(url, content) {
    // console.debug('sendDiscord', url, content)
    // console.debug('content.length', content.length)
    const body = {
        username: discordUsername,
        avatar_url: discordAvatar,
        content: content,
    }
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return await fetch(url, opts)
}

function getBoolIcon(value) {
    if (value) {
        return '✅'
    } else {
        return '🔳'
    }
}
