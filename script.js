// 导航菜单切换
const navToggle = document.querySelector('.nav-toggle');
const navContainer = document.querySelector('.nav-container');

navToggle?.addEventListener('click', () => {
  navContainer.classList.toggle('open');
});

// 导航链接激活状态（滚动自动激活+点击激活）
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// 点击激活
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    if (window.innerWidth <= 768) {
      navContainer.classList.remove('open');
    }
  });
});

// 滚动自动激活
let scrollTimer = null;
window.addEventListener('scroll', () => {
  if (scrollTimer) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href')?.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }, 50);
});

// 回到顶部按钮
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 图片懒加载 - 使用IntersectionObserver优化
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

// 图片交互：鼠标悬停显示文字
const interactiveImgs = document.querySelectorAll('.interactive-img');
interactiveImgs.forEach(imgContainer => {
  imgContainer.addEventListener('mouseenter', () => {
    imgContainer.classList.add('active');
  });
  imgContainer.addEventListener('mouseleave', () => {
    imgContainer.classList.remove('active');
  });
});

// 折叠面板（文物故事）
const collapseBtns = document.querySelectorAll('.collapse-btn');
collapseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('.collapse-container');
    const content = container.querySelector('.collapse-content');
    
    container.classList.toggle('active');
    
    if (container.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = '0';
    }
  });
});

// 标签页切换（时间轴+红色人物）
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabParent = btn.closest('.tabs');
    const tabId = btn.getAttribute('data-tab');
    
    // 切换按钮激活状态
    tabParent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 切换内容显示
    tabParent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const targetContent = tabParent.querySelector(`#${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  });
});

// 战地家书：翻页音效+展开/收起+音频朗读模拟
const pageTurnSound = document.getElementById('pageTurnSound');
const openLetterBtns = document.querySelectorAll('.open-letter');
const closeLetterBtns = document.querySelectorAll('.close-letter');
const playAudioBtns = document.querySelectorAll('.play-audio');

// 音效播放函数
function playPageSound() {
  if (pageTurnSound) {
    pageTurnSound.currentTime = 0;
    pageTurnSound.volume = 0.3;
    pageTurnSound.play().catch(() => {});
  }
}

// 家书展开
openLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.add('open');
    playPageSound();
  });
});

// 家书收起
closeLetterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const letterBook = btn.closest('.letter-book');
    letterBook.classList.remove('open');
    
    // 收起时停止音频播放
    const audioBtn = letterBook.querySelector('.play-audio');
    if (audioBtn) {
      audioBtn.innerHTML = '<i class="fa fa-play"></i> 朗读家书';
      audioBtn.classList.remove('playing');
    }
  });
});

// 家书音频朗读实现
playAudioBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('playing')) {
      // 暂停状态
      btn.innerHTML = '<i class="fa fa-play"></i> 朗读家书';
      btn.classList.remove('playing');
      // 停止语音合成
      window.speechSynthesis.cancel();
    } else {
      // 播放状态
      btn.innerHTML = '<i class="fa fa-pause"></i> 暂停朗读';
      btn.classList.add('playing');
      
      // 获取家书内容
      const letterContent = btn.closest('.letter-inner').querySelector('.letter-content').textContent;
      
      // 停止任何正在播放的语音
      window.speechSynthesis.cancel();
      
      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(letterContent);
      utterance.lang = 'zh-CN'; // 设置为中文
      utterance.rate = 0.9; // 语速
      utterance.pitch = 1.0; // 音调
      utterance.volume = 0.9; // 音量
      
      // 语音结束后的处理
      utterance.onend = () => {
        btn.innerHTML = '<i class="fa fa-play"></i> 朗读家书';
        btn.classList.remove('playing');
      };
      
      // 开始朗读
      window.speechSynthesis.speak(utterance);
    }
  });
});

// 留言板本地存储
const submitBtn = document.getElementById('submit-message');
const messageText = document.getElementById('message-text');
const messagesList = document.getElementById('messages-list');

// 初始化留言
function initMessages() {
  const messages = JSON.parse(localStorage.getItem('redMessages')) || [];
  renderMessages(messages);
}

// 渲染留言
function renderMessages(messages) {
  if (!messagesList) return;
  
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

// 提交留言
submitBtn?.addEventListener('click', () => {
  const content = messageText?.value.trim();
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
  
  if (messageText) messageText.value = '';
});

// 红色知识问答
const submitQuizBtn = document.getElementById('submit-quiz');
const quizResult = document.getElementById('quiz-result');

// 正确答案
const correctAnswers = {
  q1: 'b',
  q2: 'a',
  q3: 'b'
};

// 提交问答答案
submitQuizBtn?.addEventListener('click', () => {
  if (!quizResult) return;
  
  let score = 0;
  const total = Object.keys(correctAnswers).length;
  
  // 验证每道题答案
  Object.keys(correctAnswers).forEach(question => {
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    if (selectedOption && selectedOption.value === correctAnswers[question]) {
      score++;
    }
  });
  
  // 显示结果
  if (score === total) {
    quizResult.textContent = `恭喜！全部答对（${score}/${total}），你对会宁会师历史了如指掌～`;
    quizResult.className = 'quiz-result correct';
  } else {
    quizResult.textContent = `再接再厉！答对${score}题（共${total}题），可以再回顾一下历史知识点哦～`;
    quizResult.className = 'quiz-result incorrect';
  }
});

// 音频播放增强功能
const audioElements = document.querySelectorAll('.audio-item audio');

// 为每个音频添加播放/暂停事件监听
audioElements.forEach(audio => {
  // 播放时暂停其他音频
  audio.addEventListener('play', () => {
    audioElements.forEach(otherAudio => {
      if (otherAudio !== audio && !otherAudio.paused) {
        otherAudio.pause();
      }
    });
  });
  
  // 音频结束时重置播放位置
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
  });
});

// 添加音频控制按钮增强样式
audioElements.forEach(audio => {
  // 当音频可以播放时添加视觉提示
  audio.addEventListener('canplay', () => {
    const audioItem = audio.closest('.audio-item');
    if (audioItem) {
      audioItem.classList.add('ready');
    }
  });
});

// 数字档案馆链接点击追踪（可选功能）- 确保在DOM加载后再执行
document.addEventListener('DOMContentLoaded', function() {
  const visitArchiveLinks = document.querySelectorAll('.archive-btn');
  visitArchiveLinks.forEach(link => {
    link.addEventListener('click', () => {
      // 这里可以添加点击统计或分析代码
      console.log('数字档案馆链接被点击');
    });
  });
});

// 视频预加载优化（滚动到可视区域再加载）
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      video.load(); // 触发视频加载（仅加载元数据+必要内容）
      videoObserver.unobserve(video); // 加载后停止监听
    }
  });
}, { rootMargin: '0px 0px 500px 0px' });

videos.forEach(video => videoObserver.observe(video));

// 文物分类切换功能 - 确保在DOM加载后再执行
document.addEventListener('DOMContentLoaded', function() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const relicCategories = document.querySelectorAll('.relics-category');
  
  console.log('文物分类按钮数量:', categoryBtns.length);
  console.log('文物分类内容数量:', relicCategories.length);

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('分类按钮被点击:', btn.getAttribute('data-category'));
      const categoryId = btn.getAttribute('data-category');
      
      // 更新按钮状态
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 更新内容显示
      relicCategories.forEach(category => {
        category.classList.remove('active');
        if (category.id === categoryId) {
          category.classList.add('active');
          
          // 加载当前分类的图片
          const lazyImgs = category.querySelectorAll('.lazy-load');
          lazyImgs.forEach(img => {
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            }
          });
        }
      });
    });
  });
});

// 页面加载完成初始化
window.addEventListener('DOMContentLoaded', () => {
  initMessages();
  
  // 初始化标签页（默认激活第一个）
  document.querySelectorAll('.tabs').forEach(tab => {
    const firstBtn = tab.querySelector('.tab-btn');
    if (firstBtn && !firstBtn.classList.contains('active')) {
      firstBtn.click();
    }
  });
  
  // 初始化文物分类（默认激活第一个分类）
  const firstCategoryBtn = document.querySelector('.category-btn');
  if (firstCategoryBtn && !firstCategoryBtn.classList.contains('active')) {
    firstCategoryBtn.click();
  }
});