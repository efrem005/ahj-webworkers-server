const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const path = require('path');

const app = new Koa();
const router = new Router();

// Middleware для CORS
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});

// Middleware для эмуляции медленного соединения
const slowMiddleware = async (ctx, next) => {
  if (ctx.path.includes('/api/news')) {
    // Задержка 3 секунды для эмуляции загрузки
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 30% шанс ошибки сети для тестирования
    if (Math.random() < 0.3) {
      ctx.status = 500;
      ctx.body = { error: 'Network error' };
      return;
    }
  }
  await next();
};

// Middleware для API
router.get('/api/news', slowMiddleware, async (ctx) => {
  ctx.body = {
    news: [
      { id: 1, title: 'Новый фильм Marvel анонсирован', date: '2026-02-18' },
      { id: 2, title: 'Победители Оскара 2026', date: '2026-02-17' },
      { id: 3, title: 'Трейлер нового блокбастера', date: '2026-02-16' }
    ]
  };
});

app.use(static(path.join(__dirname, 'public')));
app.use(router.routes());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});