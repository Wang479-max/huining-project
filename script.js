// 1. 导航菜单切换
const navToggle = document.querySelector('.nav-toggle');
const navContainer = document.querySelector('.nav-container');
navToggle.addEventListener('click', () => {
  navContainer.classList.toggle('open');
});

// 2. 导航链接激活状态
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    if (window.innerWidth <= 768) {
      navContainer.classList.remove('open');
    }
  });
});

// 3. 回到顶部按钮
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 4. 图片懒加载
const lazyLoadObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      lazyLoadObserver.unobserve(img);
    }
  });
}, { rootMargin: '0px 0px 200px 0px' });

document.querySelectorAll('.lazy-load').forEach(img => {
  lazyLoadObserver.observe(img);
});

// 5. 通用图片交互（时间轴+文物+人物）
const interactiveImgs = document.querySelectorAll('.interactive-img');
interactiveImgs.forEach(imgContainer => {
  imgContainer.addEventListener('click', () => {
    imgContainer.classList.toggle('active');
  });
});

// 6. 战地家书展开/收起
const openLetterBtns = document.querySelectorAll('.open-letter');
const closeLetterBtns = document.querySelectorAll('.close-letter');

openLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.add('open');
  });
});

closeLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.remove('open');
  });
});

// 7. 留言板本地存储
const submitBtn = document.getElementById('submit-message');
const messageText = document.getElementById('message-text');
const messagesList = document.getElementById('messages-list');

function initMessages() {
  const messages = JSON.parse(localStorage.getItem('redMessages')) || [];
  renderMessages(messages);
}

function renderMessages(messages) {
  messagesList.innerHTML = '';
  if (messages.length === 0) {
    messagesList.innerHTML = '<div class="message-item">暂无留言，写下你的感悟吧～</div>';
    return;
  }
  messages.reverse().forEach(msg => {
    const item = document.createElement('div');
    item.className = 'message-item';
    item.innerHTML = `
      <p>${msg.content}</p>
      <div class="message-time">${msg.time}</div>
    `;
    messagesList.appendChild(item);
  });
}

submitBtn.addEventListener('click', () => {
  const content = messageText.value.trim();
  if (!content) return;
  const time = new Date().toLocaleString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const messages = JSON.parse(localStorage.getItem('redMessages')) || [];
  messages.push({ content, time });
  localStorage.setItem('redMessages', JSON.stringify(messages));
  renderMessages(messages);
  messageText.value = '';
});

window.addEventListener('DOMContentLoaded', initMessages);