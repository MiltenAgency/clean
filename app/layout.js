import './globals.css';
import './about-showcase.css';
import './process-showcase.css';
import './benefits-stack.css';
import './site-footer.css';
import AgentationToolbar from './agentation-toolbar';
export const metadata={title:'Clear & Gleam — Less mess. More time. For you.',description:'A cleaning service concept for home, deep, office, and moving cleans. Explore services, plan a clean around your priorities, and preview a tailored quote request.',robots:{index:false,follow:false},icons:{icon:{url:'/assets/cleaning/clear-and-gleam-favicon.png',type:'image/png',sizes:'64x64'},apple:'/assets/cleaning/clear-and-gleam-logo.png'}};
export default function Layout({children}){return <html lang="en"><body><noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>{children}{process.env.NODE_ENV === 'development' && <AgentationToolbar />}</body></html>}
