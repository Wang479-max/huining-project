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

// 5. 图片交互：鼠标悬停显示文字（替换原点击交互）
const interactiveImgs = document.querySelectorAll('.interactive-img');
interactiveImgs.forEach(imgContainer => {
  // 鼠标移入显示文字
  imgContainer.addEventListener('mouseenter', () => {
    imgContainer.classList.add('active');
  });
  // 鼠标移出隐藏文字
  imgContainer.addEventListener('mouseleave', () => {
    imgContainer.classList.remove('active');
  });
});

// 6. 战地家书：翻页音效+展开/收起
const pageTurnSound = document.getElementById('pageTurnSound');
const openLetterBtns = document.querySelectorAll('.open-letter');
const closeLetterBtns = document.querySelectorAll('.close-letter');

// 音效播放函数（避免重复播放）
function playPageSound() {
  pageTurnSound.currentTime = 0; // 重置播放位置
  pageTurnSound.volume = 0.3; // 音量控制（0-1）
  pageTurnSound.play().catch(err => {
    console.log('音效播放失败（浏览器限制）：', err);
  });
}

// 家书展开（带音效）
openLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.add('open');
    playPageSound(); // 播放翻页音效
  });
});

// 家书收起（可选音效，默认关闭）
closeLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.remove('open');
    // 如需关闭音效，取消下方注释并添加对应音频文件
    // playPageSound();
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
  if (!content) {
    alert('请输入留言内容～');
    return;
  }
  if (content.length > 200) {
    alert('留言长度不能超过200字哦～');
    return;
  }
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

// 初始化留言板
window.addEventListener('DOMContentLoaded', initMessages);