const utils = {
  isInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && rect.bottom >= 0;
  },
  formatTime: () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },
  storage: {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  window.addEventListener('scroll', () => {
    navbar.style.height = window.scrollY > 50 ? '60px' : '75px';
  });
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') html.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon-o');
    icon.classList.toggle('fa-sun-o');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });

  const animateElements = document.querySelectorAll('.hidden-on-load');
  const checkAnimate = () => {
    animateElements.forEach(el => {
      if (utils.isInViewport(el) && !el.classList.contains('show')) {
        el.classList.add('show');
      }
    });
  };
  checkAnimate();
  window.addEventListener('scroll', checkAnimate);

  const lazyImages = document.querySelectorAll('.lazy-load');
  const loadLazyImage = (el) => {
    if (utils.isInViewport(el) && !el.classList.contains('loaded')) {
      el.src = el.src;
      el.classList.add('loaded');
    }
  };
  lazyImages.forEach(loadLazyImage);
  window.addEventListener('scroll', () => lazyImages.forEach(loadLazyImage));

  const letterBook = document.querySelector('.letter-book');
  const openBookBtn = document.querySelector('.open-book');
  const closeBookBtn = document.querySelector('.close-book');
  openBookBtn.addEventListener('click', () => letterBook.classList.add('open'));
  closeBookBtn.addEventListener('click', () => letterBook.classList.remove('open'));

  const messageText = document.getElementById('message-text');
  const submitBtn = document.getElementById('submit-message');
  const messagesList = document.getElementById('messages-list');
  const MESSAGE_KEY = 'redHeritageMessages';
  const renderMessages = () => {
    const messages = utils.storage.get(MESSAGE_KEY);
    messagesList.innerHTML = '';
    messages.reverse().forEach(msg => {
      const messageItem = document.createElement('div');
      messageItem.className = 'message-item';
      messageItem.innerHTML = `
        <p>${msg.content}</p>
        <span class="message-time">${msg.time}</span>
        <button class="delete-message" data-index="${msg.id}">
          <<<i class="fa fa-trash-o" aria-hidden="true"></</</</i>
        </button>
      `;
      messagesList.appendChild(messageItem);
      messageItem.querySelector('.delete-message').addEventListener('click', (e) => {
        const id = e.target.closest('.delete-message').dataset.index;
        const filteredMessages = messages.filter(m => m.id !== id);
        utils.storage.set(MESSAGE_KEY, filteredMessages);
        renderMessages();
      });
    });
  };
  submitBtn.addEventListener('click', () => {
    const content = messageText.value.trim();
    if (content) {
      const messages = utils.storage.get(MESSAGE_KEY);
      messages.push({
        id: Date.now().toString(),
        content,
        time: utils.formatTime()
      });
      utils.storage.set(MESSAGE_KEY, messages);
      messageText.value = '';
      renderMessages();
    }
  });
  renderMessages();

  document.querySelectorAll('.scroll-btn, .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 500);
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});