

export function showLoading (button) {

    button.disabled = true;

    button.dataset.originalText = button.innerHTML;
    
    const buttonType = button.dataset.type === 'add' ? 'spinner-expense' : 'spinner';

    button.innerHTML = `
    <span class = "${buttonType}">
    </span>
    `
}
 
export function hideLoading(button) {
    
    button.disabled = false;
    button.innerHTML = button.dataset.originalText
}