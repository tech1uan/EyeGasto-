import { API_BASE } from "../../config.js";
import { authFetch } from "../../main.js";

export async function initFeedbackModal() {
  const sendFeedbackBtn = document.getElementById('send-feedback-btn');
  const feedbackContainer = document.querySelector('.send-feedback-container');
  if (!sendFeedbackBtn || !feedbackContainer) return; // not on this page

  const closeBtn = feedbackContainer.querySelector('.js-close-feedback');
  const starContainer = document.getElementById('feedback-star-rating');
  const stars = document.querySelectorAll('.feedback-star');
  const typeButtons = document.querySelectorAll('.feedback-type-btn');
  const typeInput = document.getElementById('feedback-type');
  const messageInput = document.getElementById('feedback-message');
  const errorEl = document.getElementById('error-feedback');
  const successEl = document.getElementById('success-feedback');
  const submitBtn = document.getElementById('js-submit-feedback');

  function openFeedbackModal() {
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.classList.add('flex');
  }

  function closeFeedbackModal() {
    feedbackContainer.classList.add('hidden');
    feedbackContainer.classList.remove('flex');
  }

  function resetFeedbackForm() {
    starContainer.dataset.value = 0;
    stars.forEach(s => {
      s.classList.add('fa-regular');
      s.classList.remove('fa-solid');
      s.style.color = '#5DCAA5';
    });
    typeButtons.forEach(b => {
      b.style.background = 'rgba(255,255,255,0.07)';
      b.style.borderColor = 'rgba(29,158,117,0.2)';
    });
    typeInput.value = '';
    messageInput.value = '';
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');
  }

  function showFeedbackError(msg) {
    successEl.classList.add('hidden');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  sendFeedbackBtn.addEventListener('click', openFeedbackModal);
  closeBtn?.addEventListener('click', closeFeedbackModal);

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.star);
      starContainer.dataset.value = value;
      stars.forEach(s => {
        const filled = parseInt(s.dataset.star) <= value;
        s.classList.toggle('fa-solid', filled);
        s.classList.toggle('fa-regular', !filled);
        s.style.color = filled ? '#22D3B6' : '#5DCAA5';
      });
    });
  });

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => {
        b.style.background = 'rgba(255,255,255,0.07)';
        b.style.borderColor = 'rgba(29,158,117,0.2)';
      });
      btn.style.background = 'rgba(29,158,117,0.25)';
      btn.style.borderColor = '#1d9e75';
      typeInput.value = btn.dataset.type;
    });
  });

  submitBtn?.addEventListener('click', async () => {
    const rating = parseInt(starContainer.dataset.value) || 0;
    const type = typeInput.value;
    const message = messageInput.value.trim();

    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    if (rating === 0) return showFeedbackError('Please select a rating.');
    if (!type) return showFeedbackError('Please choose a feedback type.');
    if (!message) return showFeedbackError('Please write a message.');

    submitBtn.disabled = true;

    try {
      const res = await authFetch(`${API_BASE}/feedback/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, type, message })
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) {  
        const message =
        data.errors?.map(err => err.msg).join(", ") ||
        data.message ||
        "Something went wrong";
        showFeedbackError(message|| 'Something went wrong. Please try again.');
        submitBtn.disabled = false;
        return;
      }

      successEl.textContent = 'Thanks for your feedback!';
      successEl.classList.remove('hidden');

      setTimeout(() => {
        closeFeedbackModal();
        resetFeedbackForm();
        submitBtn.disabled = false;
      }, 1200);
    } catch (error) {
      console.error(error);
      showFeedbackError('Something went wrong. Please try again.');
      submitBtn.disabled = false;
    }
  });
}