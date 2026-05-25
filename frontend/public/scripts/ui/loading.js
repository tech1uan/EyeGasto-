

export function showLoading (button) {

    button.disabled = true;

    button.dataset.originalText = button.innerHTML;

    button.innerHTML = `
    <span class = "spinner">
    </span>
    `
}

export function hideLoading(button) {

    button.disabled = false;

    button.innerHTML = button.dataset.originalText
}