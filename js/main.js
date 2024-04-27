// JS Main

document.addEventListener('DOMContentLoaded', domContentLoaded)

const chromeID = 'anlkpnbhiiojmedlkchcdmigkdccnmcn'

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    let profile
    if (typeof chrome !== 'undefined') {
        try {
            profile = await chrome.runtime?.sendMessage(chromeID, {})
            console.debug('profile', profile)
        } catch (e) {}
    }
    enableProfile(profile)
}

/**
 * Enable User Profile with Data
 * @function enableProfile
 * @param {Object} data
 */
function enableProfile(data) {
    console.debug('enableProfile', data)
    if (data && Object.keys(data).length) {
        updateElements(data)
        document
            .querySelectorAll('.profile')
            .forEach((el) => el.classList.remove('d-none'))
    }
}

/**
 * Update Elements from Data
 * @function updateElements
 * @param {Object} data
 */
function updateElements(data) {
    // console.debug('updateElements:', data)
    for (let [key, value] of Object.entries(data)) {
        if (!value) {
            // console.debug(`No value for key: ${key}`)
            continue
        }
        const elements = document.querySelectorAll(`.${key}`)
        // console.debug('elements:', elements)
        if (!elements.length) {
            // console.debug(`Element not found for key: ${key}`)
            continue
        }
        for (const el of elements) {
            if (el.tagName === 'SPAN') {
                // console.debug('span.textContent:', value)
                el.textContent = value.toString()
            }
            // } else if (el.tagName === 'IMG') {
            //     console.debug('img.src:', value)
            //     el.src = `https://h5server-avatars.b-cdn.net/${value}`
            // }
        }
    }
}
