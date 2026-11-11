const list = document.querySelector('#blog-posts');
const status = document.querySelector('#blog-status');

function renderPost(post) {
  const article = document.createElement('article');
  article.className = 'news-entry';
  const date = document.createElement('time');
  date.dateTime = post.date;
  date.textContent = post.date.replaceAll('-', '.');
  const details = document.createElement('details');
  const title = document.createElement('summary');
  title.textContent = post.title;
  const body = document.createElement('p');
  body.textContent = post.body;
  details.append(title, body);
  article.append(date, details);
  return article;
}

async function loadPosts() {
  try {
    const response = await fetch(new URL('posts.json', document.baseURI));
    if (!response.ok) throw new Error('Could not load posts');
    const posts = await response.json();
    if (!Array.isArray(posts) || posts.some((post) => !post ||
      typeof post.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(post.date) ||
      typeof post.title !== 'string' || typeof post.body !== 'string')) {
      throw new Error('Invalid post data');
    }
    posts.sort((a, b) => b.date.localeCompare(a.date));
    list.replaceChildren(...posts.map(renderPost));
    if (!posts.length) {
      status.textContent = '掲載中のお知らせはありません。';
      status.hidden = false;
    }
  } catch {
    status.textContent = '新着記事を読み込めませんでした。';
    status.hidden = false;
  }
}

if (location.protocol !== 'file:') loadPosts();
