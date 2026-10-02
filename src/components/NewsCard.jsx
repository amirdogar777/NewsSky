import { ArrowUpRight, Bookmark, BookmarkCheck, CalendarDays, ImageOff } from 'lucide-react';

export default function NewsCard({ article, isFavorite, onFavorite, featured=false }) {
  return <article className={'article-card ' + (featured ? 'article-featured' : '')}>
    <div className="article-image-wrap">{article.image ? <img className="article-image" src={article.image} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'; e.currentTarget.parentElement.classList.add('image-missing')}}/> : null}<div className="image-placeholder"><ImageOff size={26}/><span>NEWSSKY</span></div><span className="image-category">{article.category || 'TOP STORY'}</span></div>
    <div className="article-body"><div className="article-date"><CalendarDays size={13}/>{article.date}</div><h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3><p>{article.description || 'Read the full story to find out more.'}</p><div className="article-footer"><a className="article-read" href={article.url} target="_blank" rel="noopener noreferrer">Read story <ArrowUpRight size={17}/></a><button className={'bookmark-btn ' + (isFavorite?'bookmarked':'')} onClick={()=>onFavorite(article)} aria-label={isFavorite ? 'Remove saved article' : 'Save article'} title={isFavorite ? 'Remove saved article' : 'Save article'}>{isFavorite?<BookmarkCheck size={19}/>:<Bookmark size={19}/>}</button></div></div>
  </article>;
}
