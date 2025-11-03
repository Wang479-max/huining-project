// 右侧导航折叠功能
const navToggle = document.querySelector('.nav-toggle');
const navContainer = document.querySelector('.nav-container');

navToggle.addEventListener('click', function() {
  navContainer.classList.toggle('open');
});

// 点击导航项后自动收起
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    navContainer.classList.add('open');
  });
});

// 导航激活状态切换
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// 滚动动画：元素进入视口时显示
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden-on-load').forEach(el => {
  observer.observe(el);
});

// 图片懒加载（示例，实际需结合IntersectionObserver）
document.querySelectorAll('.lazy-load').forEach(img => {
  img.classList.add('loaded');
});

// 回到顶部按钮
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// 留言板功能
const submitBtn = document.getElementById('submit-message');
const messageText = document.getElementById('message-text');
const messagesList = document.getElementById('messages-list');

submitBtn.addEventListener('click', function() {
  const message = messageText.value.trim();
  if (message) {
    const now = new Date();
    const timeStr = now.toLocaleString();
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
      <p>${message}</p>
      <div class="message-time">${timeStr}</div>
    `;
    messagesList.appendChild(messageItem);
    messageText.value = '';
  }
});

// 家书翻页功能
document.querySelectorAll('.open-book').forEach(btn => {
  btn.addEventListener('click', function() {
    this.closest('.letter-book').classList.add('open');
  });
});

document.querySelectorAll('.close-book').forEach(btn => {
  btn.addEventListener('click', function() {
    this.closest('.letter-book').classList.remove('open');
  });
});