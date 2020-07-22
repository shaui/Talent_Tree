import MyTree from './components/MyTree.js' ;
import PostsPage from './components/Forum.js' ;
import PostingPage from './components/PostingPage.js' ;
import Firebase from './Utils/FirebaseMg.js'
import CoursePage from './components/CoursePage'
import SignInPage from './components/SignInPage.js'
import HomePage from './components/HomePage.js';
import TreeMenu from './components/TreeMenu.js'

const routes= [
	{
		path: '/',
		component: MyTree,
		exact: true,
		breadcrumbName: '首頁'
	},
	{
		path: '/forum',
		component: PostsPage,
		exact: true,
		breadcrumbName: '論壇',
	},
	{
	    path: '/forum/post',
	    component: PostingPage,
	    breadcrumbName: '發文頁面'
	},
	{
		path: '/firebase',
		component: Firebase,
		breadcrumbName: '資料庫'
	},
	{
		path: '/signIn',
		component: SignInPage,
		breadcrumbName: '登入'
	},
	{
		path: '/coursePage',
		component: CoursePage,
		breadcrumbName: '課程'
	},
	{
		path: '/home',
		component: HomePage,
		breadcrumbName: '近期活動'
	},
	{
		path: '/treeMenu',
		component: TreeMenu,
		breadcrumbName: '技能樹總覽'
	}
];

export default routes;
